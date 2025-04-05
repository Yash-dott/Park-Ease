const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());

// ⚠️ Webhook route MUST come before express.json()
app.use('/api/webhooks', require('./routes/webhooks'));

// Regular middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/bookings', require('./routes/bookings'));

// Test route
app.get('/', (req, res) => res.send('Park-Ease API'));

module.exports = app;