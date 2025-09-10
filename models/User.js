const mongoose = require('mongoose');
const { hashPassword } = require('../utils/passwordUtils');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
        trim: true, 
        maxlength: 50
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 50 },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        validate: {
            validator: v => /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(v),
            message: 'Please enter a valid email address'
        }
    },
    username: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        minlength: 3, 
        maxlength: 20,
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    phone: {
            type: String,
            validate: {
                validator: v => !v || /^\+?[\d\s-()]{8,15}$/.test(v),
                message: 'Please enter a valid phone number'
            }
        },
    gender: { 
        type: String, 
        enum: ['male','female','other'], 
        default: null 
    },
    country: { 
        type: String, 
        default: null
    },
    birthdate: { 
        type: String
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 },
    role: { type: String, 
        enum: ['guest', 'host', 'admin'], 
        default: '' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    },
    lastLogin: { 
        type: Date, 
        default: null 
    },
    loginAttempts: { 
        type: Number, 
        default: 0 
    },
    lockUntil: { 
        type: Date, 
        default: null 
    },
    refreshTokens: [{
        token: String,
        createdAt: { 
            type: Date, 
            default: Date.now
         }
    }],
    profile: {
        avatar: { 
            type: String, 
            default: null 
        },
        country: String,
        preferredLanguage: String
    }
}, { timestamps: true });

// Virtuals
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (err) { next(err); }
});

// Remove sensitive data
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshTokens;
    delete obj.loginAttempts;
    delete obj.lockUntil;
    return obj;
};

// Account lock helpers
userSchema.methods.incLoginAttempts = function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
    }
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hr
    }
    return this.updateOne(updates);
};
userSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({ $unset: { loginAttempts: 1, lockUntil: 1 } });
};

module.exports = mongoose.model('User', userSchema);
