const mongoose = require('mongoose');

const cancellationPolicySchema = new mongoose.Schema({
  name: { type: String, required: true },      
  description: { type: String },               
  refundPercentage: { type: Number, default: 100 }, 
  cutoffHours: { type: Number, default: 24 }  
}, { timestamps: true });

module.exports = mongoose.model('CancellationPolicy', cancellationPolicySchema);