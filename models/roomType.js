const mongoose = require('mongoose');


const roomTypeSchema = new mongoose.Schema({
property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
},
title: { 
    type: String,
    required: true
},
description: String,
maxGuests: { 
    type: Number,
    default: 2
},
beds: { 
    type: Number, 
    default: 1 
},
basePrice: { 
    type: Number,
    required: true 
},
cleaningFee: { 
    type: Number,
    default: 0
},
quantity: {
    type: Number,
    default: 1
},
images: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media' }],
amenities: [{ type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity' }],
meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });


roomTypeSchema.index({ property: 1 });


module.exports = mongoose.model('RoomType', roomTypeSchema);