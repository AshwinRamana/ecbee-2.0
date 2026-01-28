const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// SUPER ADMIN: Tenant Management
router.get('/tenants', adminController.getAllTenants);
router.post('/tenants', adminController.createTenant);
router.post('/tenants/upsert', adminController.upsertTenant);
router.put('/tenants/:tid', adminController.updateTenant);

// CLIENT ADMIN: Store Stats & Orders
router.get('/stats', adminController.getDashboardStats);
router.get('/orders', adminController.getOrders);

module.exports = router;
