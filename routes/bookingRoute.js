const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

// สร้าง Booking (ต้อง login)
router.post('/', authenticate, bookingController.createBooking);

// ดึง Booking ของ user
router.get('/', authenticate, bookingController.getUserBookings);

module.exports = router;
