const mongoose = require('mongoose');

// --- CONFIGURATION ---
// Same URI as server.js
const MONGO_URI = 'mongodb+srv://ashwinramana7_db_user:TDZ3q8NMXCJzMnLX@cluster1.iqgn3ei.mongodb.net/?appName=Cluster1';

const tenantSchema = new mongoose.Schema({
    domain: String,
    theme: String,
    homeLayout: String,
    features: {
        login: Boolean,
        cart: Boolean,
        offers: Boolean
    },
    cdnBaseUrl: String,
    name: String
}, { collection: 'tenants' });

const Tenant = mongoose.model('Tenant', tenantSchema);

const mocks = [
    {
        domain: 'client1.ecbee.net',
        theme: 'fashion',
        homeLayout: 'hero-grid',
        cartLayout: 'drawer',
        features: { login: true, cart: true, offers: true },
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        name: 'Fashion Demo'
    },
    {
        domain: 'client2.ecbee.net',
        theme: 'electronics',
        homeLayout: 'category-nav',
        cartLayout: 'modal',
        features: { login: true, cart: true, offers: true },
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        name: 'Electronics Store'
    },
    {
        domain: 'client3.ecbee.net',
        theme: 'grocery',
        homeLayout: 'minimal',
        cartLayout: 'drawer',
        features: { login: true, cart: true, offers: false },
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        name: 'Fresh Grocery'
    },
    {
        domain: 'client4.ecbee.net',
        theme: 'restaurant',
        homeLayout: 'menu',
        cartLayout: 'modal',
        features: { login: false, cart: true, offers: false },
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        name: 'Tasty Bites'
    },
    {
        domain: 'client5.ecbee.net',
        theme: 'corporate',
        homeLayout: 'catalog',
        cartLayout: 'page',
        features: { login: false, cart: false, offers: false },
        cdnBaseUrl: 'https://d18xkwaipu1whh.cloudfront.net/test_2.0',
        name: 'Corporate Catalog'
    }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        console.log('🧹 Clearing old tenants...');
        await Tenant.deleteMany({});

        console.log('🌱 Seeding new config data...');
        await Tenant.insertMany(mocks);

        console.log('✨ Success! Database populated.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ Error:', err);
        mongoose.connection.close();
    });
