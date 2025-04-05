const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parking: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in hours
    vehicle: {
        plate: String,
        type: String
    },
    status: { type: String, default: 'confirmed' } // cancelled/completed
});

module.exports = mongoose.model('Booking', BookingSchema);