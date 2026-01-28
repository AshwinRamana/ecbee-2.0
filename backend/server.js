const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
let connectionError = null;
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        connectionError = null;
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        connectionError = err.message;
    });

const PORT = process.env.PORT || 3001;

// --- AWS API GATEWAY NORMALIZATION ---
app.use((req, res, next) => {
    const prefixes = ['/default', '/EcbeeApi', '/prod', '/stage'];
    let normalized = req.url;
    let changed = true;
    while (changed) {
        changed = false;
        for (const p of prefixes) {
            if (normalized.startsWith(p)) {
                normalized = normalized.substring(p.length);
                changed = true;
            }
        }
    }
    if (normalized === '' || !normalized.startsWith('/')) normalized = '/' + normalized;
    req.url = normalized;
    next();
});

// --- SERVE STATIC FRONTEND (Optional) ---
app.use(express.static(path.join(__dirname, '../dist/clients-demo')));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/tenantRoutes'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'universal',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbState: mongoose.connection.readyState,
        hasUri: !!process.env.MONGO_URI,
        uriSnippet: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) + '...' : 'none',
        error: connectionError
    });
});

app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Universal Modular API is running!', env: process.env.NODE_ENV });
});

// Catch-all to serve index.html for Angular routing (Ubuntu target)
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist/clients-demo/index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ error: 'Not Found', message: 'Static files not found.' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Universal Server running on port ${PORT}`);
    });
}

module.exports = app;
