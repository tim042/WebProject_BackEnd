const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
},
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  provider: { type: String,
    enum: ['stripe','paypal','qr','manual'], 
    required: true 
},
  providerPaymentId: { 
    type: String, 
    sparse: true 
}, 
  amount: { 
    type: Number, 
    required: true 
},
  currency: { 
    type: String, 
    default: 'LAK' 
},
  status: { 
    type: String, 
    enum: ['initiated','paid','failed','refunded','void'],
    default: 'initiated' },
  paidAt: Date,
  refundedAt: Date,
  rawResponse: mongoose.Schema.Types.Mixed,
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

paymentSchema.index({ providerPaymentId: 1 });

module.exports = mongoose.model('PaymentTransaction', paymentSchema);