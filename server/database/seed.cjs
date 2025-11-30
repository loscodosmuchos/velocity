const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Seeding database...');

    const hashedPassword = await bcrypt.hash('velocity2025', 10);
    
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, status)
       VALUES 
         ('admin@velocity.io', $1, 'Admin', 'User', 'admin', 'active'),
         ('manager@velocity.io', $1, 'Manager', 'User', 'manager', 'active'),
         ('viewer@velocity.io', $1, 'Viewer', 'User', 'viewer', 'active')
       RETURNING id`,
      [hashedPassword]
    );
    console.log(`✅ Created ${userResult.rowCount} users`);

    const adminId = userResult.rows[0].id;

    const contractorResult = await client.query(
      `INSERT INTO contractors (
        contractor_id, first_name, last_name, email, phone, company_name,
        address, service_type, annual_volume, payment_terms, certification,
        lead_time_days, status, contract_expiry, account_manager, notes,
        location, pay_rate, start_date, po_funds_remaining
      ) VALUES 
        ('CONT-0001', 'John', 'Martinez', 'john.martinez@techparts.com', '(248) 555-0147', 
         'TechParts Manufacturing Inc.', '2400 Industrial Blvd, Dearborn, MI 48124',
         '["Electronics"]', 25200000, 'Net 30', '["IATF 16949", "ISO 9001", "RoHS"]',
         8, 'Active', '2025-06-30', 'Sarah Chen', 'Preferred vendor - best performer',
         'Dearborn, MI', 85.00, '2023-01-15', 5000000),
        ('CONT-0002', 'Lisa', 'Thompson', 'lisa.thompson@precisioncast.com', '(248) 555-0234',
         'Precision Casting Solutions', '1800 Manufacturing Way, Warren, MI 48092',
         '["Stamped Parts", "Casting"]', 15800000, 'Net 60', '["ISO 9001"]',
         12, 'Active', '2026-01-15', 'David Chen', 'High-volume supplier for engine components',
         'Warren, MI', 78.00, '2023-03-01', 3200000),
        ('CONT-0003', 'Robert', 'Kim', 'robert.kim@fastlogistics.com', '(313) 555-0876',
         'FastLogistics Express', '5500 Commerce Park Dr, Detroit, MI 48211',
         '["Logistics"]', 8500000, 'Net 30', '["ISO 9001"]',
         5, 'Active', '2025-12-31', 'Mike Johnson', 'Reliable logistics partner',
         'Detroit, MI', 65.00, '2023-06-15', 1500000)
       RETURNING id`
    );
    console.log(`✅ Created ${contractorResult.rowCount} contractors`);

    const contractor1Id = contractorResult.rows[0].id;
    const contractor2Id = contractorResult.rows[1].id;
    const contractor3Id = contractorResult.rows[2].id;

    const poResult = await client.query(
      `INSERT INTO purchase_orders (
        po_number, contractor_id, description, total_amount, amount_spent,
        status, start_date, end_date, department, project_name, created_by
      ) VALUES 
        ('PO-2025-0001', $1, 'Electronics Assembly Services - Q1 2025', 500000.00, 245000.00,
         'Active', '2025-01-01', '2025-03-31', 'Manufacturing', 'Q1 Electronics Production', $4),
        ('PO-2025-0002', $2, 'Engine Component Casting - 2025', 750000.00, 325000.00,
         'Active', '2025-01-15', '2025-12-31', 'Manufacturing', 'Engine Parts Program', $4),
        ('PO-2025-0003', $3, 'Logistics Services - Monthly', 250000.00, 48000.00,
         'Active', '2025-02-01', '2025-12-31', 'Operations', 'Monthly Logistics', $4)
       RETURNING id`,
      [contractor1Id, contractor2Id, contractor3Id, adminId]
    );
    console.log(`✅ Created ${poResult.rowCount} purchase orders`);

    const po1Id = poResult.rows[0].id;
    const po2Id = poResult.rows[1].id;
    const po3Id = poResult.rows[2].id;

    const timecardResult = await client.query(
      `INSERT INTO timecards (
        timecard_number, contractor_id, purchase_order_id, week_ending,
        regular_hours, overtime_hours, hourly_rate, status, submitted_date
      ) VALUES 
        ('TC-2025-0001', $1, $4, '2025-01-31', 40, 5, 85.00, 'Approved', '2025-02-01'),
        ('TC-2025-0002', $1, $4, '2025-02-07', 40, 0, 85.00, 'Approved', '2025-02-08'),
        ('TC-2025-0003', $2, $5, '2025-01-31', 40, 10, 78.00, 'Approved', '2025-02-01'),
        ('TC-2025-0004', $2, $5, '2025-02-07', 40, 0, 78.00, 'Pending', '2025-02-08'),
        ('TC-2025-0005', $3, $6, '2025-02-07', 35, 0, 65.00, 'Pending', '2025-02-08')
       RETURNING id`,
      [contractor1Id, contractor2Id, contractor3Id, po1Id, po2Id, po3Id]
    );
    console.log(`✅ Created ${timecardResult.rowCount} timecards`);

    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        invoice_number, contractor_id, purchase_order_id, invoice_date,
        due_date, amount, tax_amount, status
      ) VALUES 
        ('INV-2025-0001', $1, $2, '2025-02-01', '2025-03-03', 4037.50, 323.00, 'Paid'),
        ('INV-2025-0002', $1, $2, '2025-02-08', '2025-03-10', 3400.00, 272.00, 'Pending'),
        ('INV-2025-0003', $3, $4, '2025-02-01', '2025-04-02', 4290.00, 343.20, 'Approved')
       RETURNING id`,
      [contractor1Id, po1Id, contractor2Id, po2Id]
    );
    console.log(`✅ Created ${invoiceResult.rowCount} invoices`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: admin@velocity.io');
    console.log('   Email: manager@velocity.io');
    console.log('   Email: viewer@velocity.io');
    console.log('   Password: velocity2025');
    console.log('\n📊 Sample Data:');
    console.log(`   ${contractorResult.rowCount} contractors`);
    console.log(`   ${poResult.rowCount} purchase orders`);
    console.log(`   ${timecardResult.rowCount} timecards`);
    console.log(`   ${invoiceResult.rowCount} invoices`);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch(console.error);
