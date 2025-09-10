const Property = require('../models/property');


// post new property
const createProperty = async (req, res) => {
    try {
        const property = new Property({
            ...req.body,
            owner: req.user.userId   
        });

        const savedProperty = await property.save();

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: savedProperty
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating property',
            error: error.message
        });
    }
};

// Get all properties (with filters + pagination)


const getProperties = async (req, res) => {
    try {
        const { search, city, country, propertyType, status, limit = 20, page = 1 } = req.query;

        let query = {};

        // 🔍 Search by name or description
        if (search) {
            query.$text = { $search: search };
        }

        // 🌍 Filter by city/country
        if (city) query['address.city'] = city;
        if (country) query['address.country'] = country;

        // 🏨 Filter by type
        if (propertyType) query.propertyType = propertyType;

        // 📌 Filter by status
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const properties = await Property.find(query)
            .populate('owner', 'firstName lastName email')
            .populate('amenities', 'name icon description')
            .populate('images', 'url type')
            .populate('reviews', 'rating comment user')
            .populate('cancellationPolicy', 'policyName rules')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Property.countDocuments(query);

        res.json({
            success: true,
            data: properties,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalResults: total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
};

// Get property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'firstName lastName email')
            .populate('amenities', 'name icon description')
            .populate('images', 'url type')
            .populate('reviews', 'rating comment user')
            .populate('cancellationPolicy', 'policyName rules')


        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.json({ success: true, data: property });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// put property
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found or not authorized' });
        }

        res.json({ success: true, message: 'Property updated successfully', data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

//Path property
const updatePropertyPath = async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id }, 
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found or not authorized' });
        }
        res.json({ success: true, message: 'Property updated successfully', data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete property
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id 
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found or not authorized' });
        }

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    updatePropertyPath
};