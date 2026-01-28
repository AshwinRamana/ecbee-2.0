const Product = require('../models/Product');

// Get all products (filtered by tenant + advanced search)
exports.getProducts = async (req, res) => {
    try {
        const { tenantId, search, category, minPrice, maxPrice, rating, sort } = req.query;
        if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });

        let query = { tenantId };

        // 1. FUZZY / TEXT SEARCH
        if (search) {
            // We use a combination of $text for keyword matching and $regex for fuzzy/partial matching
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. CATEGORY FILTER
        if (category) {
            query.category = category;
        }

        // 3. PRICE RANGE FILTER
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 4. RATING FILTER
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // 5. SORTING
        let sortOptions = {};
        if (sort) {
            switch (sort) {
                case 'priceAsc': sortOptions = { price: 1 }; break;
                case 'priceDesc': sortOptions = { price: -1 }; break;
                case 'ratingDesc': sortOptions = { rating: -1 }; break;
                case 'newest': sortOptions = { createdAt: -1 }; break;
                default: sortOptions = { createdAt: -1 };
            }
        } else {
            sortOptions = { createdAt: -1 }; // Default sort
        }

        const products = await Product.find(query).sort(sortOptions);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
