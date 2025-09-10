const mongoose = require('mongoose');

const priceBreakdownSchema = new mongoose.Schema({
  subTotal: Number,
  taxes: Number,
  fees: Number,
  discounts: Number,
  grandTotal: Number
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true },
  rooms: { type: Number, default: 1 },
  guests: { type: Number, default: 1 },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights: Number,
  baseCurrency: { type: String, default: 'LAK' },
  baseTotal: { type: Number, required: true },
  displayCurrency: { type: String, default: 'LAK' },
  total: { type: Number, required: true },
  breakdown: priceBreakdownSchema,
  status: { 
    type: String, 
    enum: ['pending','confirmed','checked_in','checked_out','cancelled','refunded'], 
    default: 'pending' 
  },
  cancellationPolicy: { type: mongoose.Schema.Types.ObjectId, ref: 'CancellationPolicy' },
  createdByHost: { type: Boolean, default: false },
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// index
bookingSchema.index({ user: 1 });
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });

// calculate nights
bookingSchema.pre('validate', function(next) {
  if (this.checkIn >= this.checkOut) return next(new Error('checkOut must be after checkIn'));
  const ms = Math.abs(this.checkOut - this.checkIn);
  this.nights = Math.ceil(ms / (24*60*60*1000));
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
