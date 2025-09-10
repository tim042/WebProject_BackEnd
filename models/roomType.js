const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
},
  name: { 
    type: String, 
    required: true 
},
  totalRooms: { 
    type: Number, 
    required: true 
},
  availableRooms: { 
    type: Number, 
    required: true 
},
  price: { 
    type: Number, 
    required: true 
}
}, { timestamps: true });

module.exports = mongoose.model('RoomType', roomTypeSchema);