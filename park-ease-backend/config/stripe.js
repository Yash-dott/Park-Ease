const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent (for your Booking/Payment screen)
 * @param {number} amount - Total amount in smallest currency unit (e.g., cents)
 * @param {string} customerId - Optional Stripe customer ID
 * @returns {Promise<Object>} - Payment intent client secret
 */
exports.createPaymentIntent = async(amount, customerId = null) => {
    try {
        const params = {
            amount,
            currency: 'usd', // Change to your currency (e.g., 'inr' for ₹)
            metadata: {
                integration_check: 'accept_a_payment',
                service: 'park-ease'
            }
        };

        if (customerId) {
            params.customer = customerId;
        }

        const paymentIntent = await stripe.paymentIntents.create(params);
        return {
            success: true,
            clientSecret: paymentIntent.client_secret
        };
    } catch (err) {
        console.error('Stripe error:', err.message);
        return {
            success: false,
            error: 'Payment processing failed. Please try again.'
        };
    }
};

/**
 * Create a Stripe customer (for user payment profiles)
 * @param {string} email - User email from your Signup/Login
 * @param {string} name - User full name
 * @returns {Promise<Object>} - Stripe customer ID
 */
exports.createCustomer = async(email, name) => {
    try {
        const customer = await stripe.customers.create({
            email,
            name,
            description: `Park-Ease user: ${email}`
        });
        return {
            success: true,
            customerId: customer.id
        };
    } catch (err) {
        console.error('Stripe customer creation failed:', err.message);
        return {
            success: false,
            error: 'Failed to save payment profile'
        };
    }
};