const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { userId, tenantId } = req.query;
        const orders = await Order.find({ userId, tenantId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
