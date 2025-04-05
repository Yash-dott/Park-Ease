const express = require('express');
const { register, login } = require('../controllers/auth');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user (for "Create Account" screen)
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user (for "Welcome back" screen)
router.post('/login', login);

module.exports = router;