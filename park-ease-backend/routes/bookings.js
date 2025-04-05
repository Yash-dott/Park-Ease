const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/bookings');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);

module.exports = router;