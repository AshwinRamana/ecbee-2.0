const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, tenantId: user.tenantId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

exports.register = async (req, res) => {
    try {
        const { email, password, tenantId } = req.body;

        // Check if user exists for this specific tenant
        const userExists = await User.findOne({ email, tenantId });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists for this tenant' });
        }

        const user = await User.create({ email, password, tenantId });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, tenantId: user.tenantId, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, tenantId } = req.body;

        // Find user by email AND tenantId (Multi-tenancy isolation)
        let user = await User.findOne({ email, tenantId });

        // Fallback: Check if this is a Super Admin (Global access)
        if (!user) {
            const globalUser = await User.findOne({ email });
            if (globalUser && globalUser.role === 'superadmin') {
                user = globalUser;
            }
        }

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user._id, email: user.email, tenantId: user.tenantId, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
