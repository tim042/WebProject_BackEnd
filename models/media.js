const mongoose = require('mongoose');


const mediaSchema = new mongoose.Schema({
url: { 
    type: String, 
    required: true },
type: { 
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image' 
},
provider: String,
meta: mongoose.Schema.Types.Mixed,
uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model('Media', mediaSchema);