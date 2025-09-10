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
        const { city, country, propertyType, status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (city) query['address.city'] = city;
        if (country) query['address.country'] = country;
        if (propertyType) query.propertyType = propertyType;
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const properties = await Property.find(query)
            .populate('owner', '_id firstName lastName email')
            .populate('amenities', 'name')
            .populate('images', 'url type')
            .populate('review', 'rating comment user')

            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Property.countDocuments(query);

        res.json({
            success: true,
            data: properties,
            pagination: {
                current: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'firstName lastName email')
            .populate('amenities', 'name')
            .populate('images', 'url type')
            .populate('review', 'rating comment user')
            .populate('cancellationPolicy');


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