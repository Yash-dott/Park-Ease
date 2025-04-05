const express = require('express');
const { handleStripeWebhook } = require('../controllers/webhooks');
const router = express.Router();

// Note: No bodyParser here! Raw body is required for verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;