const mongoose = require('mongoose');


const roomSchema = new mongoose.Schema({
property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
},
roomType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RoomType' 
},
identifier: { 
    type: String,
    required: true
}, 
status: { 
    type: String,
    enum: ['available','occupied','maintenance'], 
    default: 'available' },
meta: mongoose.Schema.Types.Mixed
});


roomSchema.index({ property: 1, identifier: 1 }, { unique: true });


module.exports = mongoose.model('Room', roomSchema);