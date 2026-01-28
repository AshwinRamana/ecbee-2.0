const Tenant = require('../models/Tenant');

exports.getConfig = async (req, res) => {
    try {
        const { hostname } = req.query;
        let tenant = await Tenant.findOne({ domain: hostname });

        // Fallback for local development
        if (!tenant && hostname === 'localhost') {
            tenant = await Tenant.findOne({ domain: 'client1.ecbee.net' });
        }

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json(tenant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ROUTES Definition built-in for brevity ---
const express = require('express');
const router = express.Router();
router.get('/config', exports.getConfig);
module.exports = router;
