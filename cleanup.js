const mongoose = require('mongoose');

const uri = "mongodb+srv://ashwinramana7_db_user:TDZ3q8NMXCJzMnLX@cluster1.iqgn3ei.mongodb.net/?appName=Cluster1";

async function clean() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // We use the raw collection to avoid model mismatch issues
        const db = mongoose.connection.db;
        const tenants = db.collection('tenants');
        const products = db.collection('products');
        const orders = db.collection('orders');

        const domainToClear = 'client4.ecbee.net';
        const idToClear = 'client4';

        const resT = await tenants.deleteMany({
            $or: [
                { domain: domainToClear },
                { tenantId: idToClear },
                { tenantId: 'T004' } // Old fallback ID
            ]
        });

        const resP = await products.deleteMany({
            $or: [
                { tenantId: idToClear },
                { tenantId: 'T004' }
            ]
        });

        const resO = await orders.deleteMany({
            $or: [
                { tenantId: idToClear },
                { tenantId: 'T004' }
            ]
        });

        console.log('🗑️ Aggressive Purge Complete:');
        console.log(` - Tenants removed: ${resT.deletedCount}`);
        console.log(` - Products removed: ${resP.deletedCount}`);
        console.log(` - Orders removed: ${resO.deletedCount}`);

        process.exit(0);
    } catch (e) {
        console.error('❌ Cleanup failed:', e);
        process.exit(1);
    }
}

clean();
