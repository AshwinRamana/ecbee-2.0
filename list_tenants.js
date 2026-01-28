const mongoose = require('mongoose');
const Tenant = require('./backend/models/Tenant');

const uri = "mongodb+srv://ashwinramana7_db_user:TDZ3q8NMXCJzMnLX@cluster1.iqgn3ei.mongodb.net/?appName=Cluster1";

async function list() {
    try {
        await mongoose.connect(uri);
        const tenants = await Tenant.find({}, { tenantId: 1, domain: 1 });
        console.log('--- Current Tenants ---');
        console.table(tenants.map(t => ({ id: t.tenantId, domain: t.domain })));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
list();
