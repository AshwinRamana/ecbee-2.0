const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const uri = process.env.MONGO_URI;

console.log('📡 Testing local connection to:', uri ? uri.substring(0, 30) + '...' : 'MISSING URI');

if (!uri) {
    console.error('❌ Error: MONGO_URI not found in backend/.env');
    process.exit(1);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ SUCCESS: Local machine connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE: Could not connect locally.');
        console.error('Reason:', err.message);
        if (err.message.includes('MongooseServerSelectionError')) {
            console.error('👉 Tip: This usually means your current IP is NOT whitelisted in MongoDB Atlas.');
        }
        process.exit(1);
    });
