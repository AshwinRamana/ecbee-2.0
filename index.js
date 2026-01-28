const serverless = require('serverless-http');

console.log('[Lambda] 🚀 Starting Handler initialization...');

let app;
try {
    app = require('./backend/server');
    console.log('[Lambda] ✅ modular backend/server.js loaded successfully');
} catch (err) {
    console.error('[Lambda] ❌ CRITICAL: Failed to load server.js:', err);
    // Create a dummy app to report the error if the main one fails to load
    const express = require('express');
    app = express();
    app.all('*', (req, res) => {
        res.status(500).json({
            error: 'Lambda Initialization Error',
            message: err.message,
            stack: err.stack
        });
    });
}

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    console.log('[Lambda] 📥 Event received:', event.path);
    try {
        return await handler(event, context);
    } catch (err) {
        console.error('[Lambda] 💥 Runtime Error:', err);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: 'Runtime Error', message: err.message })
        };
    }
};
