import sql from 'mssql';
import fs from 'fs';
import path from 'path';

// 1. Configure your SQL Server database connection profile
const config = {
    user: 'MedEqDB_Admin',          
    password: 'MedEqDB_Admin2105',
    server: 'localhost',               
    database: 'MEDEQ_Backend',         
    options: {
        encrypt: true,                 
        trustServerCertificate: true   
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function importAssetsToSQLServer() {
    try {
        // 2. Load the physical JSON data payload file from your hard drive
        const jsonPath = path.join(process.cwd(), 'device_manifest.json');
        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ Error: Could not find ${jsonPath}. Run create_jhh_assets.js first!`);
            return;
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const assets = JSON.parse(rawData);
        console.log(`📦 Loaded ${assets.length} assets from local disk JSON.`);

        // 3. Connect to your active SQL Server instance
        console.log(`🔌 Connecting to SQL Server [${config.server}]...`);
        const pool = await sql.connect(config);
        console.log(`✅ Database connection established successfully.`);

        // 4. Clear any old prototype asset entries to prevent Primary Key violations
        console.log(`🧹 Clearing transient assets from dbo.equipment...`);
        await pool.request().query('TRUNCATE TABLE dbo.equipment;');

        // 5. Execute programmatic batch execution loop
        console.log(`🚀 Bulk executing inserts into backend...`);
        let successCount = 0;

        for (const asset of assets) {
            // Using parameterized inputs to safeguard data characters and prevent SQL injection
            const request = pool.request();
            request.input('asset_id', sql.VarChar(30), asset.asset_id); 
            request.input('category', sql.NVarChar(100), asset.category);
            request.input('title', sql.NVarChar(150), asset.title);
            request.input('model', sql.NVarChar(150), asset.model);
            request.input('ref_number', sql.VarChar(50), asset.ref_number);
            request.input('manufacturer', sql.NVarChar(100), asset.manufacturer);
            request.input('supplier_vendor', sql.NVarChar(150), asset.supplier_vendor);
            request.input('service_agent', sql.NVarChar(150), asset.service_agent);
            request.input('delivery_date', sql.Date, asset.delivery_date);
            request.input('purchase_order_number', sql.VarChar(50), asset.purchase_order_number);
            request.input('location_id', sql.VarChar(30), asset.location_id);
            request.input('sub_location', sql.NVarChar(100), asset.sub_location);
            request.input('image_name', sql.NVarChar(500), asset.image_name);
            request.input('testing_interval', sql.Int, asset.testing_interval);
            request.input('notes', sql.NVarChar(sql.MAX), asset.notes);

            await request.query(`
                INSERT INTO dbo.equipment (
                    asset_id, category, title, model, ref_number, manufacturer, 
                    supplier_vendor, service_agent, delivery_date, purchase_order_number, 
                    location_id, sub_location, image_name, testing_interval, notes
                ) VALUES (
                    @asset_id, @category, @title, @model, @ref_number, @manufacturer, 
                    @supplier_vendor, @service_agent, @delivery_date, @purchase_order_number, 
                    @location_id, @sub_location, @image_name, @testing_interval, @notes
                );
            `);

            successCount++;
            if (successCount % 100 === 0) {
                console.log(`   Processed ${successCount}/${assets.length} database records...`);
            }
        }

        console.log(`\n================================================================`);
        console.log(`🎉 BACKEND INGESTION LAYER COMPLETE`);
        console.log(`================================================================`);
        console.log(`Successfully committed ${successCount} assets to SQL Server.`);
        
        // Close the connection pool cleanly
        await sql.close();

    } catch (error) {
        console.error(`❌ Ingestion engine failure loop:`, error.message);
        try { await sql.close(); } catch (e) {
            console.error(`❌ Failed to close SQL connection pool after error:`, e.message);
        }
    }
}

importAssetsToSQLServer();
