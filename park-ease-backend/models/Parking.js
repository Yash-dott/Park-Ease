const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
    // ... (your existing fields)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    // ... (other fields)
});

// Create geospatial index (critical for performance)
ParkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Parking', ParkingSchema);