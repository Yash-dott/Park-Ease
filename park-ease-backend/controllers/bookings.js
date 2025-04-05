const Booking = require('../models/Booking');
const Parking = require('../models/Parking');
const User = require('../models/User');
const { createPaymentIntent } = require('../config/stripe');

/**
 * @desc    Create a new booking with payment intent
 * @route   POST /api/bookings
 * @access  Private
 * @body    { parkingId, date, duration, vehicle }
 */
exports.createBooking = async(req, res) => {
    const { parkingId, date, duration, vehicle } = req.body;
    const userId = req.user.id;

    try {
        // 1. Validate parking spot exists and has availability
        const parking = await Parking.findById(parkingId);
        if (!parking) {
            return res.status(404).json({
                success: false,
                error: 'Parking spot not found'
            });
        }

        if (parking.slots.available <= 0) {
            return res.status(400).json({
                success: false,
                error: 'No available slots'
            });
        }

        // 2. Check for time conflicts
        const conflictingBooking = await Booking.findOne({
            parking: parkingId,
            date: {
                $lte: new Date(new Date(date).getTime() + duration * 60 * 60 * 1000),
                $gte: new Date(date)
            },
            status: { $ne: 'cancelled' }
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                error: 'Slot already booked for selected time'
            });
        }

        // 3. Calculate price (matches your frontend pricing logic)
        const totalPrice = parking.price * duration;

        // 4. Create booking record
        const booking = new Booking({
            user: userId,
            parking: parkingId,
            date,
            duration,
            vehicle,
            totalPrice,
            status: 'pending_payment' // Will change after successful payment
        });

        // 5. Create Stripe payment intent
        const payment = await createPaymentIntent(
            totalPrice * 100, // Convert to cents
            req.user.stripeCustomerId // Optional (if you saved Stripe customer IDs)
        );

        if (!payment.success) {
            return res.status(400).json({
                success: false,
                error: payment.error
            });
        }

        // 6. Save booking and reduce parking availability
        await booking.save();
        parking.slots.available -= 1;
        await parking.save();

        // 7. Response with booking + payment details
        res.status(201).json({
            success: true,
            booking: {
                id: booking._id,
                parking: parking.name,
                date: booking.date,
                duration: booking.duration,
                totalPrice: booking.totalPrice,
                status: booking.status
            },
            paymentSecret: payment.clientSecret // For Stripe confirmation
        });

    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({
            success: false,
            error: 'Booking failed. Please try again.'
        });
    }
};

/**
 * @desc    Get user bookings
 * @route   GET /api/bookings/user
 * @access  Private
 */
exports.getUserBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('parking', 'name address price slots')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            bookings: bookings.map(b => ({
                id: b._id,
                parking: b.parking,
                date: b.date,
                duration: b.duration,
                totalPrice: b.totalPrice,
                status: b.status,
                vehicle: b.vehicle
            }))
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bookings'
        });
    }
};

/**
 * @desc    Cancel a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
exports.cancelBooking = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('parking');

        // Validate booking exists and belongs to user
        if (!booking || booking.user.toString() !== req.user.id) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Check if cancellation is allowed (e.g., not within 1 hour of booking)
        const now = new Date();
        const bookingStart = new Date(booking.date);
        const hoursUntilBooking = (bookingStart - now) / (1000 * 60 * 60);

        if (hoursUntilBooking < 1) {
            return res.status(400).json({
                success: false,
                error: 'Cannot cancel within 1 hour of booking time'
            });
        }

        // Update booking and increase parking availability
        booking.status = 'cancelled';
        booking.parking.slots.available += 1;

        await booking.save();
        await booking.parking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled',
            refund: booking.status === 'completed' ?
                `$${booking.totalPrice} will be refunded` : null
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Cancellation failed'
        });
    }
};