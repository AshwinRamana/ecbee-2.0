const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Tenant = require('./models/Tenant');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        // Clear existing
        await Tenant.deleteMany({});
        await Product.deleteMany({});

        const tenants = [
            {
                tenantId: 'T001',
                domain: 'client1.ecbee.net',
                name: 'Fashion Demo',
                theme: 'fashion',
                cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
                uiSettings: { loginTemplate: 'glass', cartTemplate: 'drawer', homeLayout: 'hero-grid' },
                features: { login: true, cart: true, offers: true }
            },
            {
                tenantId: 'T002',
                domain: 'client2.ecbee.net',
                name: 'Electronics Store',
                theme: 'electronics',
                cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
                uiSettings: { loginTemplate: 'split', cartTemplate: 'overlay', homeLayout: 'category-nav' },
                features: { login: true, cart: true, offers: true }
            },
            {
                tenantId: 'T003',
                domain: 'client3.ecbee.net',
                name: 'Fresh Grocery',
                theme: 'grocery',
                cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
                uiSettings: { loginTemplate: 'minimal', cartTemplate: 'classic', homeLayout: 'minimal' },
                features: { login: true, cart: true, offers: false }
            },
            {
                tenantId: 'T004',
                domain: 'client4.ecbee.net',
                name: 'Tasty Bites',
                theme: 'restaurant',
                cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
                uiSettings: { loginTemplate: 'glass', cartTemplate: 'overlay', homeLayout: 'menu' },
                features: { login: true, cart: true, offers: true }
            },
            {
                tenantId: 'T005',
                domain: 'client5.ecbee.net',
                name: 'Corporate Solutions',
                theme: 'corporate',
                cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
                uiSettings: { loginTemplate: 'minimal', cartTemplate: 'classic', homeLayout: 'catalog' },
                features: { login: true, cart: true, offers: true }
            }
        ];

        await Tenant.insertMany(tenants);
        console.log('✅ 5 Tenants Seeded');

        const products = [];
        const baseCdn = 'https://d18xkwaipu1whh.cloudfront.net/test_2.0';

        // Fashion Products (T001)
        for (let i = 1; i <= 4; i++) {
            products.push({
                tenantId: 'T001',
                name: `Fashion Item ${i}`,
                description: `Modern and stylish fashion piece for your collection.`,
                longDescription: `This is a high-quality fashion item crafted with care and premium materials. Experience the perfect blend of comfort and style.`,
                price: 49.99 + (i * 25),
                category: 'Apparel',
                images: [`${baseCdn}/product_fashion_${i}.jpg`],
                stock: 20,
                rating: 4.5,
                variants: ['S', 'M', 'L', 'XL'],
                specifications: { 'Material': 'Cotton Blend', 'Wash': 'Machine Washable' }
            });
        }

        // Electronics Products (T002)
        for (let i = 1; i <= 4; i++) {
            products.push({
                tenantId: 'T002',
                name: `Tech Gadget ${i}`,
                description: `Innovative electronics designed for peak performance.`,
                longDescription: `Experience the latest in technology with this cutting-edge device. Built for reliability and high-speed operation.`,
                price: 199.99 + (i * 100),
                category: 'Gadgets',
                images: [`${baseCdn}/product_electronics_${i}.jpg`],
                stock: 15,
                rating: 4.8,
                variants: ['Black', 'Silver', 'Blue'],
                specifications: { 'Warranty': '1 Year', 'Connectivity': '5G/Wi-Fi 6' },
                reviews: [{ user: 'Alex', rating: 5, comment: 'Incredible performance!' }]
            });
        }

        // Grocery Products (T003)
        for (let i = 1; i <= 4; i++) {
            products.push({
                tenantId: 'T003',
                name: `Fresh Produce ${i}`,
                description: `Organic and locally sourced for your health.`,
                longDescription: `Farm-fresh ingredients delivered straight to your door. Sustainably grown and 100% natural.`,
                price: 2.99 + (i * 1.5),
                category: 'Organic',
                images: [`${baseCdn}/product_grocery_${i}.jpg`],
                stock: 100,
                rating: 4.9,
                variants: ['Single Pack', 'Value Bundle'],
                specifications: { 'Origin': 'Local Farms', 'Organic': 'Yes' }
            });
        }

        // Restaurant Products (T004)
        for (let i = 1; i <= 4; i++) {
            products.push({
                tenantId: 'T004',
                name: `Gourmet Dish ${i}`,
                description: `Exquisite culinary creation by our master chefs.`,
                longDescription: `A symphony of flavors prepared using the finest ingredients. Indulge in a truly premium dining experience.`,
                price: 15.50 + (i * 5),
                category: 'Main Course',
                images: [`${baseCdn}/product_restaurant_${i}.jpg`],
                stock: 99,
                rating: 5.0,
                variants: ['Standard', 'Extra Spice'],
                specifications: { 'Time': '15-20 min', 'Spice Level': 'Medium' }
            });
        }

        // Corporate Products (T005)
        for (let i = 1; i <= 4; i++) {
            products.push({
                tenantId: 'T005',
                name: `Enterprise Gear ${i}`,
                description: `Professional grade equipment for corporate needs.`,
                longDescription: `Heavy-duty industrial solutions designed for maximum efficiency in corporate environments.`,
                price: 500 + (i * 200),
                category: 'Solutions',
                images: [`${baseCdn}/product_corporate_${i}.jpg`],
                stock: 10,
                rating: 4.6,
                variants: ['Standard', 'Enterprise'],
                specifications: { 'Standard': 'ISO 9001', 'Support': '24/7' }
            });
        }

        await Product.insertMany(products);
        console.log(`✅ ${products.length} Products Seeded Across All Tenants`);

        // --- SUPER ADMIN USER ---
        const superAdmin = {
            email: 'admin@ecbee.net',
            password: 'adminpassword', // Will be hashed by pre-save hook
            tenantId: 'GLOBAL',
            role: 'superadmin'
        };
        await User.findOneAndDelete({ email: superAdmin.email });
        await new User(superAdmin).save();
        console.log('✅ Super Admin User Created: admin@ecbee.net / adminpassword');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
