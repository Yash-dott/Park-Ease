// @desc    Find parking spots near a location
// @route   GET /api/parking/nearby?lat=...&lng=...&radius=...
exports.getNearbyParking = async(req, res) => {
    const { lat, lng, radius = 5000 } = req.query; // Default 5km radius

    try {
        const spots = await Parking.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) // Meters
                }
            },
            'slots.available': { $gt: 0 } // Only show available spots
        }).limit(20);

        res.json({ success: true, spots });
    } catch (err) {
        res.status(500).json({ success: false, error: "Search failed" });
    }
};