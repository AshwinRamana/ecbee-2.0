const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    tenantId: { type: String, required: true }, // Scoped to a specific tenant
    name: { type: String, required: true },
    description: { type: String },
    longDescription: { type: String }, // Detailed description/Markdown
    price: { type: Number, required: true },
    category: { type: String },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    variants: [{ type: String }], // Sizes, Colors, etc.
    specifications: {
        type: Map,
        of: String
    }, // Key-value pairs for technical specs
    reviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
