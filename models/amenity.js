const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Amenity', amenitySchema);