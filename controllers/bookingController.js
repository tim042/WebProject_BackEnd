const Booking = require('../models/booking');
const RoomType = require('../models/roomType');


const createBooking = async (req, res) => {
  try {
    const { property, roomType, rooms, guests, checkIn, checkOut, baseTotal, total, breakdown } = req.body;

    const room = await RoomType.findById(roomType);
    if (!room) return res.status(404).json({ success: false, message: 'Room type not found' });
    if (room.availableRooms < rooms) return res.status(400).json({ success: false, message: 'Not enough available rooms' });

    const booking = new Booking({
      user: req.user.userId,
      property,
      roomType,
      rooms,
      guests,
      checkIn,
      checkOut,
      baseTotal,
      total,
      breakdown
    });

    const savedBooking = await booking.save();

    room.availableRooms -= rooms;
    await room.save();

    res.status(201).json({ success: true, message: 'Booking created successfully', data: savedBooking });

  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating booking', error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('property', 'name address')
      .populate('roomType', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings
};
