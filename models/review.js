// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: String,
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
