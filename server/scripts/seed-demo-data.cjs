const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDemoData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting comprehensive HAEA demo data seed...\n');

    // Get existing contractors and departments
    const contractors = (await client.query('SELECT id, first_name, last_name, department_id, pay_rate FROM contractors')).rows;
    const departments = (await client.query('SELECT id, name FROM departments')).rows;
    const users = (await client.query('SELECT id FROM users LIMIT 4')).rows;
    
    console.log(`📊 Found ${contractors.length} contractors, ${departments.length} departments, ${users.length} users`);

    // Department mapping for consistent naming
    const deptMap = {};
    departments.forEach(d => deptMap[d.id] = d.name);

    // ============================================================
    // SEED ADDITIONAL PURCHASE ORDERS - Varying budget utilization
    // ============================================================
    console.log('\n💰 Seeding Purchase Orders with realistic budget utilization...');
    
    const poData = [
      // Over-budget POs (Critical - Red indicators)
      { po_number: 'PO-2024-101', contractor_id: contractors[0]?.id, description: 'Cloud Migration Phase 2', total_amount: 150000, amount_spent: 162000, status: 'Active', department: 'Cloud Infrastructure', project_name: 'AWS Migration', is_maverick_spend: false },
      { po_number: 'PO-2024-102', contractor_id: contractors[1]?.id, description: 'Security Audit & Remediation', total_amount: 85000, amount_spent: 91200, status: 'Active', department: 'Security', project_name: 'SOC2 Compliance', is_maverick_spend: false },
      
      // Warning zone POs (75-90% utilized - Amber indicators)
      { po_number: 'PO-2024-103', contractor_id: contractors[2]?.id, description: 'Data Pipeline Development', total_amount: 200000, amount_spent: 172000, status: 'Active', department: 'Data Science', project_name: 'ETL Modernization', is_maverick_spend: false },
      { po_number: 'PO-2024-104', contractor_id: contractors[3]?.id, description: 'QA Automation Framework', total_amount: 95000, amount_spent: 81000, status: 'Active', department: 'Quality Assurance', project_name: 'Test Automation', is_maverick_spend: false },
      { po_number: 'PO-2024-105', contractor_id: contractors[4]?.id, description: 'IT Infrastructure Upgrade', total_amount: 180000, amount_spent: 153000, status: 'Active', department: 'IT Operations', project_name: 'Network Refresh', is_maverick_spend: false },
      
      // Healthy POs (under 75% - Cyan/Green indicators)
      { po_number: 'PO-2024-106', contractor_id: contractors[5]?.id, description: 'ML Model Development', total_amount: 250000, amount_spent: 125000, status: 'Active', department: 'Data Science', project_name: 'Predictive Analytics', is_maverick_spend: false },
      { po_number: 'PO-2024-107', contractor_id: contractors[6]?.id, description: 'DevOps Tooling', total_amount: 120000, amount_spent: 48000, status: 'Active', department: 'Engineering', project_name: 'CI/CD Pipeline', is_maverick_spend: false },
      { po_number: 'PO-2024-108', contractor_id: contractors[7]?.id, description: 'Security Monitoring Setup', total_amount: 75000, amount_spent: 22500, status: 'Active', department: 'Security', project_name: 'SIEM Implementation', is_maverick_spend: false },
      { po_number: 'PO-2024-109', contractor_id: contractors[8]?.id, description: 'Cloud Cost Optimization', total_amount: 65000, amount_spent: 19500, status: 'Active', department: 'Cloud Infrastructure', project_name: 'FinOps Initiative', is_maverick_spend: false },
      { po_number: 'PO-2024-110', contractor_id: contractors[9]?.id, description: 'Performance Testing Suite', total_amount: 55000, amount_spent: 11000, status: 'Active', department: 'Quality Assurance', project_name: 'Load Testing', is_maverick_spend: false },
      
      // Completed POs
      { po_number: 'PO-2024-050', contractor_id: contractors[10]?.id, description: 'Legacy System Analysis', total_amount: 45000, amount_spent: 45000, status: 'Completed', department: 'IT Operations', project_name: 'System Audit', is_maverick_spend: false },
      { po_number: 'PO-2024-051', contractor_id: contractors[11]?.id, description: 'Data Warehouse Setup', total_amount: 180000, amount_spent: 175000, status: 'Completed', department: 'Data Science', project_name: 'Snowflake Migration', is_maverick_spend: false },
      
      // Maverick spend flagged
      { po_number: 'PO-2024-099', contractor_id: contractors[12]?.id, description: 'Emergency Server Repair', total_amount: 25000, amount_spent: 28500, status: 'Active', department: 'IT Operations', project_name: 'Incident Response', is_maverick_spend: true },
    ];

    for (const po of poData) {
      if (!po.contractor_id) continue;
      const percentUsed = ((po.amount_spent / po.total_amount) * 100).toFixed(2);
      const amountRemaining = po.total_amount - po.amount_spent;
      
      await client.query(`
        INSERT INTO purchase_orders (po_number, contractor_id, description, total_amount, amount_spent, amount_remaining, percent_used, status, start_date, end_date, department, project_name, is_maverick_spend, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '180 days', $9, $10, $11, CURRENT_TIMESTAMP)
        ON CONFLICT (po_number) DO UPDATE SET amount_spent = $5, amount_remaining = $6, percent_used = $7
      `, [po.po_number, po.contractor_id, po.description, po.total_amount, po.amount_spent, amountRemaining, percentUsed, po.status, po.department, po.project_name, po.is_maverick_spend]);
    }
    console.log(`   ✅ Inserted/updated ${poData.length} purchase orders`);

    // ============================================================
    // SEED EXPENSES
    // ============================================================
    console.log('\n💸 Seeding Expenses...');
    
    const expenseCategories = ['Travel', 'Software', 'Hardware', 'Training', 'Consulting', 'Infrastructure', 'Licensing'];
    const expenseStatuses = ['Pending', 'Approved', 'Rejected', 'Reimbursed'];
    
    // Get PO IDs for expense linking
    const pos = (await client.query('SELECT id, contractor_id FROM purchase_orders WHERE status = $1 LIMIT 15', ['Active'])).rows;
    
    let expenseNum = 1000;
    for (const po of pos) {
      // 2-4 expenses per PO
      const expenseCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < expenseCount; i++) {
        const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        const amount = (Math.random() * 5000 + 500).toFixed(2);
        const status = expenseStatuses[Math.floor(Math.random() * expenseStatuses.length)];
        const daysAgo = Math.floor(Math.random() * 60);
        
        await client.query(`
          INSERT INTO expenses (expense_number, contractor_id, purchase_order_id, category, description, amount, expense_date, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE - INTERVAL '${daysAgo} days', $7, CURRENT_TIMESTAMP)
          ON CONFLICT (expense_number) DO NOTHING
        `, [`EXP-${expenseNum++}`, po.contractor_id, po.id, category, `${category} expense for project work`, amount, status]);
      }
    }
    console.log(`   ✅ Inserted ~${(pos.length * 3)} expenses`);

    // ============================================================
    // SEED STATEMENTS OF WORK
    // ============================================================
    console.log('\n📋 Seeding Statements of Work...');
    
    const sowData = [
      { sow_number: 'SOW-2024-001', title: 'Cloud Infrastructure Modernization', contractor_id: contractors[0]?.id, total_value: 450000, status: 'Active', department: 'Cloud Infrastructure' },
      { sow_number: 'SOW-2024-002', title: 'Enterprise Data Platform', contractor_id: contractors[1]?.id, total_value: 380000, status: 'Active', department: 'Data Science' },
      { sow_number: 'SOW-2024-003', title: 'Security Operations Center', contractor_id: contractors[2]?.id, total_value: 275000, status: 'Active', department: 'Security' },
      { sow_number: 'SOW-2024-004', title: 'QA Center of Excellence', contractor_id: contractors[3]?.id, total_value: 195000, status: 'Active', department: 'Quality Assurance' },
      { sow_number: 'SOW-2024-005', title: 'IT Service Management', contractor_id: contractors[4]?.id, total_value: 320000, status: 'Active', department: 'IT Operations' },
      { sow_number: 'SOW-2024-006', title: 'Machine Learning Platform', contractor_id: contractors[5]?.id, total_value: 520000, status: 'Draft', department: 'Data Science' },
      { sow_number: 'SOW-2024-007', title: 'Zero Trust Architecture', contractor_id: contractors[6]?.id, total_value: 185000, status: 'Pending Approval', department: 'Security' },
      { sow_number: 'SOW-2024-008', title: 'DevOps Transformation', contractor_id: contractors[7]?.id, total_value: 290000, status: 'Active', department: 'Engineering' },
      { sow_number: 'SOW-2023-015', title: 'Legacy System Migration', contractor_id: contractors[8]?.id, total_value: 165000, status: 'Completed', department: 'IT Operations' },
      { sow_number: 'SOW-2023-016', title: 'Compliance Remediation', contractor_id: contractors[9]?.id, total_value: 95000, status: 'Completed', department: 'Security' },
    ];

    for (const sow of sowData) {
      if (!sow.contractor_id) continue;
      await client.query(`
        INSERT INTO statements_of_work (sow_number, title, contractor_id, total_value, status, start_date, end_date, department, created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '300 days', $6, CURRENT_TIMESTAMP)
        ON CONFLICT (sow_number) DO UPDATE SET total_value = $4, status = $5
      `, [sow.sow_number, sow.title, sow.contractor_id, sow.total_value, sow.status, sow.department]);
    }
    console.log(`   ✅ Inserted/updated ${sowData.length} statements of work`);

    // ============================================================
    // SEED TIMECARDS
    // ============================================================
    console.log('\n⏰ Seeding Timecards...');
    
    const timecardStatuses = ['Pending', 'Approved', 'Rejected'];
    let tcNum = 5000;
    
    // Get active POs for timecard linking
    const activePOs = (await client.query('SELECT id, contractor_id FROM purchase_orders WHERE status = $1', ['Active'])).rows;
    
    for (const po of activePOs.slice(0, 12)) {
      // 3-5 timecards per PO across different weeks
      const tcCount = Math.floor(Math.random() * 3) + 3;
      for (let w = 0; w < tcCount; w++) {
        const weekOffset = w * 7;
        const regularHours = 35 + Math.floor(Math.random() * 10);
        const overtimeHours = Math.random() > 0.7 ? Math.floor(Math.random() * 12) : 0;
        const totalHours = regularHours + overtimeHours;
        const hourlyRate = 85 + Math.floor(Math.random() * 65);
        const totalAmount = (totalHours * hourlyRate).toFixed(2);
        const status = timecardStatuses[Math.floor(Math.random() * timecardStatuses.length)];
        
        await client.query(`
          INSERT INTO timecards (timecard_number, contractor_id, purchase_order_id, week_ending, regular_hours, overtime_hours, total_hours, hourly_rate, total_amount, status, submitted_date, created_at)
          VALUES ($1, $2, $3, CURRENT_DATE - INTERVAL '${weekOffset} days', $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP - INTERVAL '${weekOffset} days', CURRENT_TIMESTAMP)
          ON CONFLICT (timecard_number) DO NOTHING
        `, [`TC-${tcNum++}`, po.contractor_id, po.id, regularHours, overtimeHours, totalHours, hourlyRate, totalAmount, status]);
      }
    }
    console.log(`   ✅ Inserted ~${(activePOs.slice(0, 12).length * 4)} timecards`);

    // ============================================================
    // SEED CHANGE ORDERS
    // ============================================================
    console.log('\n🔄 Seeding Change Orders...');
    
    const sows = (await client.query('SELECT id FROM statements_of_work WHERE status = $1', ['Active'])).rows;
    
    const changeOrderData = [
      { change_order_number: 'CO-2024-001', sow_id: sows[0]?.id, description: 'Scope expansion for additional cloud regions', requested_change: 75000, status: 'Pending', change_type: 'Scope Increase' },
      { change_order_number: 'CO-2024-002', sow_id: sows[1]?.id, description: 'Timeline extension due to data complexity', requested_change: 0, status: 'Approved', change_type: 'Timeline Extension' },
      { change_order_number: 'CO-2024-003', sow_id: sows[2]?.id, description: 'Additional security tooling required', requested_change: 45000, status: 'Pending', change_type: 'Cost Increase' },
      { change_order_number: 'CO-2024-004', sow_id: sows[0]?.id, description: 'Resource substitution - senior engineer', requested_change: 15000, status: 'Approved', change_type: 'Resource Change' },
      { change_order_number: 'CO-2024-005', sow_id: sows[3]?.id, description: 'Add performance testing component', requested_change: 32000, status: 'Pending', change_type: 'Scope Increase' },
      { change_order_number: 'CO-2024-006', sow_id: sows[1]?.id, description: 'Reduce scope - defer phase 3', requested_change: -55000, status: 'Draft', change_type: 'Scope Reduction' },
    ];

    for (const co of changeOrderData) {
      if (!co.sow_id) continue;
      await client.query(`
        INSERT INTO change_orders (change_order_number, sow_id, description, requested_change, status, change_type, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (change_order_number) DO UPDATE SET status = $5
      `, [co.change_order_number, co.sow_id, co.description, co.requested_change, co.status, co.change_type]);
    }
    console.log(`   ✅ Inserted/updated ${changeOrderData.length} change orders`);

    // ============================================================
    // SEED ALERTS
    // ============================================================
    console.log('\n🚨 Seeding Alerts...');
    
    const alertData = [
      { title: 'Budget Exceeded - PO-2024-101', message: 'Cloud Migration Phase 2 has exceeded budget by 8%', severity: 'critical', resource_type: 'purchase_order', resource_id: 'PO-2024-101' },
      { title: 'Budget Warning - PO-2024-103', message: 'Data Pipeline Development at 86% budget utilization', severity: 'high', resource_type: 'purchase_order', resource_id: 'PO-2024-103' },
      { title: 'Timecard Overdue', message: '5 timecards pending approval for more than 5 days', severity: 'medium', resource_type: 'timecard', resource_id: 'batch' },
      { title: 'Contract Expiring', message: 'SOW-2024-003 expires in 30 days - renewal needed', severity: 'medium', resource_type: 'sow', resource_id: 'SOW-2024-003' },
      { title: 'Maverick Spend Detected', message: 'PO-2024-099 flagged as potential maverick spend', severity: 'high', resource_type: 'purchase_order', resource_id: 'PO-2024-099' },
      { title: 'Invoice Variance', message: 'Invoice amount differs from PO terms by >10%', severity: 'medium', resource_type: 'invoice', resource_id: 'INV-2024-055' },
      { title: 'Compliance Deadline', message: 'SOC2 audit documentation due in 14 days', severity: 'high', resource_type: 'compliance', resource_id: 'SOC2-2024' },
      { title: 'Resource Utilization Low', message: '3 contractors below 50% utilization this month', severity: 'low', resource_type: 'contractor', resource_id: 'batch' },
    ];

    for (const alert of alertData) {
      await client.query(`
        INSERT INTO alerts (title, message, severity, resource_type, resource_id, status, created_at)
        VALUES ($1, $2, $3, $4, $5, 'active', CURRENT_TIMESTAMP - INTERVAL '${Math.floor(Math.random() * 7)} days')
      `, [alert.title, alert.message, alert.severity, alert.resource_type, alert.resource_id]);
    }
    console.log(`   ✅ Inserted ${alertData.length} alerts`);

    // ============================================================
    // SEED INVOICES
    // ============================================================
    console.log('\n🧾 Seeding Additional Invoices...');
    
    const invoiceStatuses = ['Submitted', 'Pending', 'Approved', 'Paid', 'Disputed'];
    let invNum = 2050;
    
    for (const po of activePOs.slice(0, 10)) {
      const invCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < invCount; i++) {
        const amount = (Math.random() * 25000 + 5000).toFixed(2);
        const taxAmount = (parseFloat(amount) * 0.08).toFixed(2);
        const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
        const daysAgo = Math.floor(Math.random() * 45);
        
        await client.query(`
          INSERT INTO invoices (invoice_number, contractor_id, purchase_order_id, invoice_date, due_date, amount, tax_amount, total_amount, status, created_at)
          VALUES ($1, $2, $3, CURRENT_DATE - INTERVAL '${daysAgo} days', CURRENT_DATE + INTERVAL '${30 - daysAgo} days', $4, $5, $6, $7, CURRENT_TIMESTAMP)
          ON CONFLICT (invoice_number) DO NOTHING
        `, [`INV-${invNum++}`, po.contractor_id, po.id, amount, taxAmount, (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2), status]);
      }
    }
    console.log(`   ✅ Inserted ~${(activePOs.slice(0, 10).length * 1.5)} invoices`);

    // ============================================================
    // UPDATE CONTRACTOR METRICS
    // ============================================================
    console.log('\n📈 Updating Contractor Performance Metrics...');
    
    for (const contractor of contractors.slice(0, 20)) {
      const qualityScore = 70 + Math.floor(Math.random() * 30);
      const complianceRate = 85 + Math.floor(Math.random() * 15);
      const onTimeRate = 80 + Math.floor(Math.random() * 20);
      const defectRate = (Math.random() * 5).toFixed(2);
      
      await client.query(`
        UPDATE contractors 
        SET quality_score = $1, compliance_rate = $2, on_time_delivery_rate = $3, defect_rate = $4
        WHERE id = $5
      `, [qualityScore, complianceRate, onTimeRate, defectRate, contractor.id]);
    }
    console.log(`   ✅ Updated metrics for ${Math.min(contractors.length, 20)} contractors`);

    console.log('\n✨ Demo data seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Summary counts
    const summary = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM purchase_orders) as pos,
        (SELECT COUNT(*) FROM contractors) as contractors,
        (SELECT COUNT(*) FROM timecards) as timecards,
        (SELECT COUNT(*) FROM invoices) as invoices,
        (SELECT COUNT(*) FROM expenses) as expenses,
        (SELECT COUNT(*) FROM statements_of_work) as sows,
        (SELECT COUNT(*) FROM change_orders) as change_orders,
        (SELECT COUNT(*) FROM alerts WHERE status = 'active') as active_alerts
    `);
    
    const s = summary.rows[0];
    console.log(`📊 Final Counts:`);
    console.log(`   Purchase Orders: ${s.pos}`);
    console.log(`   Contractors: ${s.contractors}`);
    console.log(`   Timecards: ${s.timecards}`);
    console.log(`   Invoices: ${s.invoices}`);
    console.log(`   Expenses: ${s.expenses}`);
    console.log(`   SOWs: ${s.sows}`);
    console.log(`   Change Orders: ${s.change_orders}`);
    console.log(`   Active Alerts: ${s.active_alerts}`);

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemoData();
