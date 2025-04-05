const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// @desc    Handle Stripe webhook events
// @route   POST /api/webhooks/stripe
exports.handleStripeWebhook = async(req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // 1. Verify webhook signature
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error('Webhook verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Handle specific event types
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailure(event.data.object);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // 3. Acknowledge receipt
    res.json({ received: true });
};

// Helper: Update booking on successful payment
const handlePaymentSuccess = async(paymentIntent) => {
    try {
        const booking = await Booking.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { status: 'confirmed' }, { new: true }).populate('parking');

        if (booking) {
            console.log(`Booking ${booking._id} confirmed`);
            // Optional: Send confirmation email here
        }
    } catch (err) {
        console.error('Failed to update booking:', err);
    }
};

// Helper: Free up slot on payment failure
const handlePaymentFailure = async(paymentIntent) => {
    try {
        const booking = await Booking.findOneAndDelete({
            paymentIntentId: paymentIntent.id,
            status: 'pending_payment'
        }).populate('parking');

        if (booking) {
            // Revert parking slot availability
            booking.parking.slots.available += 1;
            await booking.parking.save();
            console.log(`Booking ${booking._id} cancelled due to failed payment`);
        }
    } catch (err) {
        console.error('Failed to handle payment failure:', err);
    }
};