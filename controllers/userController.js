const User = require('../models/User');
const { hashPassword } = require('../utils/passwordUtils');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const { role, isActive, limit = 50, page = 1 } = req.query;
        
        let query = {};
        
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        
        const skip = (page - 1) * limit;
        
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await User.countDocuments(query);
        
        res.json({
            success: true,
            data: users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: users.length,
                totalUsers: total
            }
        });
        
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

// Get single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: { user }
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

// Create user (Admin only - with role hierarchy)
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, country, gender, birthdate, phone, password, role = 'guest' } = req.body;
        const currentUserRole = req.user.role;
        
        // 🔒 Role-based creation permissions
        const roleHierarchy = {
            'admin': ['admin', 'host', 'guest'],
        };
        
        const allowedRoles = roleHierarchy[currentUserRole] || [];
        
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: `${currentUserRole}s cannot create users with ${role} role`
            });
        }
        
        // Check for existing users
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: existingUser.email === email ? 
                    'Email already registered' : 
                    'Username already taken'
            });
        }
        
        // Create user
        const hashedPassword = await hashPassword(password);
        const User = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            phone,
            gender,
            password,
            birthdate: req.body.birthdate,
            country: req.body.country || null,
            role: assignedRole || 'guest',
        });
        
        await newUser.save();
        
        // Remove sensitive data from response
        newUser.password = undefined;
        newUser.refreshTokens = undefined;
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user: newUser }
        });
        
    } catch (error) {
        console.error('User creation error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

// Update user (Admin)
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, role, gender , phone, birthdate, isActive, profile } = req.body;
        const userId = req.params.id;
        const currentUserRole = req.user.role;
        
        // Only admins can change roles to admin
        if (role === 'admin' && currentUserRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can create admin users'
            });
        }
        
        
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (phone) updateData.phone = phone;
        if (birthdate) updateData.birthdate = birthdate;
        if (gender) updateData.gender = gender;
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (profile) updateData.profile = { ...updateData.profile, ...profile };
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });
        
    } catch (error) {
        console.error('Update user error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(400).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

// Delete user (soft delete - Admin only)
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user.userId;
        
        // Cannot delete yourself
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
        
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

// Change user role (Admin only)
const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;
        const currentUserId = req.user.userId;
        
        // Cannot change your own role
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own role'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User role updated successfully',
            data: { user }
        });
        
    } catch (error) {
        console.error('Change role error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to change user role',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole
};