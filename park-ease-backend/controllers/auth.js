const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user (matches your "Create Account" screen)
// @route   POST /api/auth/register
// @body    { name, email, password }
exports.register = async(req, res) => {
    const { name, email, password } = req.body;

    // Validation (for your frontend fields)
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please fill all fields (Name, Email, Password)'
        });
    }

    try {
        // Check if user exists (email)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (matches your form fields)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token (JWT)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Response for frontend
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
};

// @desc    Login user (matches your "Welcome back" screen)
// @route   POST /api/auth/login
// @body    { email, password }
exports.login = async(req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please enter email and password'
        });
    }

    try {
        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Response for frontend
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
};