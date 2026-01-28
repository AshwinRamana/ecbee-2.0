const serverless = require('serverless-http');
const app = require('./server');

console.log('[Lambda] 🚀 Starting Modular Handler initialization...');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
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
