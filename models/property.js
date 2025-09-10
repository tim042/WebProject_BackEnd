const mongoose = require('mongoose');
const slugify = require('slugify');


const propertySchema = new mongoose.Schema({
owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
name: { 
    type: String, 
    required: true, 
    trim: true 
},
slug: { 
    type: String, 
    index: true 
},
description: String,
propertyType: { 
    type: String, 
    enum: ['hotel','apartment','villa','resort'], 
    default: 'hotel' },
address: {
city: String,
state: String,
country: String,
},
location: {
type: { 
    type: String, 
    enum: ['Point'], 
    default: 'Point' 
},
coordinates: { 
    type: [Number],
     required: true  
    } 
},
amenities: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Amenity' 
}],
images: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
}],
rating: { 
    avg: { 
        type: Number, 
        default: 0 
    }, count: { 
        type: Number, 
        default: 0 
    } },
timezone: String,
currency: { 
    type: String, 
    default: 'LAK' 
},
basePrice: { 
    type: Number, 
    required: true },
cancellationPolicy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CancellationPolicy' 
},
checkInTime: String,
checkOutTime: String,
minStay: { 
    type: Number, 
    default: 1 },
maxStay: { 
    type: Number },
status: { 
    type: String, 
    enum: ['draft','published','suspended'], 
    default: 'draft' },
meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });


propertySchema.index({ location: '2dsphere' });
propertySchema.index({ name: 'text', description: 'text' });


propertySchema.pre('save', function(next) {
if (!this.slug && this.name) this.slug = slugify(this.name, { lower: true, strict: true }).slice(0, 60);
return next();
});


module.exports = mongoose.model('Property', propertySchema);