const Tenant = require('../models/Tenant');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// --- SUPER ADMIN: TENANT MANAGEMENT ---

exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTenant = async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.upsertTenant = async (req, res) => {
    try {
        const { tenantId } = req.body;

        // Ensure tenantId exists
        if (!tenantId) {
            return res.status(400).json({ error: 'tenantId is required for upsert' });
        }

        const tenant = await Tenant.findOneAndUpdate(
            { tenantId },
            {
                ...req.body,
                name: req.body.name // Explicitly update name
            },
            { upsert: true, new: true, runValidators: true, context: 'query' }
        );
        res.json(tenant);
    } catch (err) {
        console.error('❌ Upsert Tenant Error:', err);
        res.status(500).json({
            error: 'Deployment Failure',
            message: err.message,
            details: err.errors ? Object.keys(err.errors).map(k => err.errors[k].message) : undefined
        });
    }
};

exports.updateTenant = async (req, res) => {
    try {
        const updated = await Tenant.findOneAndUpdate({ tenantId: req.params.tid }, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CLIENT ADMIN: DASHBOARD & REVENUE ---

exports.getDashboardStats = async (req, res) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

        const totalProducts = await Product.countDocuments({ tenantId });
        const totalOrders = await Order.countDocuments({ tenantId });

        // Revenue calculation
        const orders = await Order.find({ tenantId, paymentStatus: 'paid' });
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        res.json({
            totalProducts,
            totalOrders,
            revenue,
            recentOrders: await Order.find({ tenantId }).sort({ createdAt: -1 }).limit(5)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { tenantId } = req.query;
        const orders = await Order.find({ tenantId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
