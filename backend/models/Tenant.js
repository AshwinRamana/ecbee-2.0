const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    tenantId: { type: String, required: true, unique: true },
    domain: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    theme: { type: String, default: 'fashion' },
    cdnBaseUrl: { type: String, required: true },
    package: { type: String, enum: ['starter', 'pro', 'enterprise'], default: 'starter' },
    billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    branding: {
        primaryColor: { type: String, default: '#000000' },
        secondaryColor: { type: String, default: '#ffffff' },
        logo: { type: String },
        brandName: { type: String }
    },
    uiSettings: {
        homeTemplate: { type: String, default: 'hero-grid' },
        loginTemplate: { type: String, default: 'minimal' },
        cartTemplate: { type: String, default: 'drawer' },
        productTemplate: { type: String, default: 'standard' },
        checkoutTemplate: { type: String, default: 'standard' },
        bannerUrl: { type: String },
        variantLabel: { type: String, default: 'Size' }
    },
    features: {
        login: { type: Boolean, default: true },
        cart: { type: Boolean, default: true },
        offers: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
