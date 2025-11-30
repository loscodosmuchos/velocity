const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const MONTHS_OF_DATA = 6;
const PROJECT_COUNT = 50;

const departments = [
  { name: 'IT Operations', code: 'ITO', color: 'blue' },
  { name: 'Data Science', code: 'DS', color: 'purple' },
  { name: 'Cloud Infrastructure', code: 'CI', color: 'teal' },
  { name: 'Security', code: 'SEC', color: 'red' },
  { name: 'Quality Assurance', code: 'QA', color: 'amber' },
  { name: 'Engineering', code: 'ENG', color: 'green' }
];

const projectCategories = [
  'Cloud Migration', 'Security Audit', 'Data Platform', 'DevOps', 'AI/ML',
  'Infrastructure', 'Compliance', 'Integration', 'Modernization', 'Analytics'
];

const projectStatuses = ['Planning', 'In Progress', 'On Hold', 'Completed', 'At Risk'];
const poStatuses = ['Draft', 'Active', 'Completed', 'Cancelled'];
const invoiceStatuses = ['Draft', 'Submitted', 'Pending', 'Approved', 'Paid', 'Disputed'];
const timecardStatuses = ['Draft', 'Submitted', 'Pending', 'Approved', 'Rejected'];
const expenseCategories = ['Travel', 'Software', 'Hardware', 'Training', 'Consulting', 'Infrastructure', 'Licensing', 'Equipment'];
const sowStatuses = ['Draft', 'Pending Approval', 'Active', 'Completed', 'Expired'];
const alertSeverities = ['low', 'medium', 'high', 'critical'];

const vendors = [
  { name: 'Accenture Federal Services', city: 'Arlington', state: 'VA' },
  { name: 'Deloitte Consulting', city: 'New York', state: 'NY' },
  { name: 'IBM Global Services', city: 'Armonk', state: 'NY' },
  { name: 'Cognizant Technology', city: 'Teaneck', state: 'NJ' },
  { name: 'Infosys Limited', city: 'Plano', state: 'TX' },
  { name: 'TCS America', city: 'Edison', state: 'NJ' },
  { name: 'Wipro Technologies', city: 'East Brunswick', state: 'NJ' },
  { name: 'Capgemini America', city: 'New York', state: 'NY' },
  { name: 'KPMG Advisory', city: 'Chicago', state: 'IL' },
  { name: 'PwC Digital', city: 'New York', state: 'NY' },
  { name: 'McKinsey Digital', city: 'New York', state: 'NY' },
  { name: 'Booz Allen Hamilton', city: 'McLean', state: 'VA' },
  { name: 'CGI Federal', city: 'Fairfax', state: 'VA' },
  { name: 'SAIC', city: 'Reston', state: 'VA' },
  { name: 'Leidos Holdings', city: 'Reston', state: 'VA' }
];

const firstNames = ['James', 'Mary', 'Michael', 'Patricia', 'Robert', 'Jennifer', 'David', 'Linda', 'William', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica', 'Christopher', 'Sarah', 'Charles', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

const projectTemplates = [
  { title: 'Cloud Migration Phase', desc: 'Migrate legacy systems to cloud infrastructure', category: 'Cloud Migration' },
  { title: 'Zero Trust Security Implementation', desc: 'Implement zero trust architecture across the enterprise', category: 'Security Audit' },
  { title: 'Enterprise Data Lake', desc: 'Build centralized data lake for analytics', category: 'Data Platform' },
  { title: 'CI/CD Pipeline Modernization', desc: 'Modernize continuous integration and deployment', category: 'DevOps' },
  { title: 'Machine Learning Platform', desc: 'Deploy ML ops platform for model training', category: 'AI/ML' },
  { title: 'Network Infrastructure Refresh', desc: 'Upgrade core network infrastructure', category: 'Infrastructure' },
  { title: 'SOC 2 Compliance Program', desc: 'Achieve SOC 2 Type II certification', category: 'Compliance' },
  { title: 'API Gateway Implementation', desc: 'Centralize API management and security', category: 'Integration' },
  { title: 'Legacy Application Modernization', desc: 'Refactor monolithic apps to microservices', category: 'Modernization' },
  { title: 'Business Intelligence Dashboard', desc: 'Build executive analytics dashboards', category: 'Analytics' },
  { title: 'Kubernetes Cluster Deployment', desc: 'Deploy container orchestration platform', category: 'Cloud Migration' },
  { title: 'Penetration Testing Program', desc: 'Establish recurring security testing', category: 'Security Audit' },
  { title: 'Real-time Data Streaming', desc: 'Implement Kafka streaming architecture', category: 'Data Platform' },
  { title: 'GitOps Workflow Adoption', desc: 'Implement GitOps deployment patterns', category: 'DevOps' },
  { title: 'NLP Document Processing', desc: 'Automate document extraction with AI', category: 'AI/ML' }
];

function randomDate(monthsAgo, monthsAhead = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - monthsAgo);
  const end = new Date(now);
  end.setMonth(end.getMonth() + monthsAhead);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function randomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const client = await pool.connect();
  console.log('🚀 Starting Comprehensive 6-Month Data Seed...\n');
  console.log('═'.repeat(60));

  try {
    await client.query('BEGIN');

    // ═══════════════════════════════════════════════════════════════
    // 1. DEPARTMENTS - Ensure all exist with budgets
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📁 DEPARTMENTS');
    for (const dept of departments) {
      const existing = await client.query('SELECT id FROM departments WHERE name = $1', [dept.name]);
      if (existing.rows.length === 0) {
        await client.query(`
          INSERT INTO departments (name, code, manager_name, budget, headcount)
          VALUES ($1, $2, $3, $4, $5)
        `, [dept.name, dept.code, `${randomChoice(firstNames)} ${randomChoice(lastNames)}`, randomAmount(500000, 2000000), randomInt(10, 50)]);
      } else {
        await client.query(`
          UPDATE departments SET code = $1, budget = $2, headcount = $3 WHERE name = $4
        `, [dept.code, randomAmount(500000, 2000000), randomInt(10, 50), dept.name]);
      }
    }
    console.log(`   ✅ ${departments.length} departments configured`);

    // ═══════════════════════════════════════════════════════════════
    // 2. BUYERS - Create procurement buyers
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🛒 BUYERS');
    const existingBuyers = (await client.query('SELECT id FROM buyers')).rows;
    const buyerIds = existingBuyers.map(b => b.id);
    
    for (let i = buyerIds.length; i < 10; i++) {
      const dept = randomChoice(departments);
      const result = await client.query(`
        INSERT INTO buyers (name, email, department, total_spend, active_pos)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
        `buyer${Date.now()}_${i}@velocity.com`,
        dept.name,
        randomAmount(100000, 1000000),
        randomInt(3, 15)
      ]);
      if (result.rows[0]) buyerIds.push(result.rows[0].id);
    }
    console.log(`   ✅ ${buyerIds.length} buyers ready`);

    // ═══════════════════════════════════════════════════════════════
    // 3. CONTRACTORS - Create/update with vendor details
    // ═══════════════════════════════════════════════════════════════
    console.log('\n👷 CONTRACTORS');
    const existingContractors = (await client.query('SELECT id FROM contractors')).rows;
    let contractorIds = existingContractors.map(c => c.id);
    
    // Create more contractors if needed to reach 60
    const neededContractors = Math.max(0, 60 - contractorIds.length);
    for (let i = 0; i < neededContractors; i++) {
      const vendor = randomChoice(vendors);
      const dept = randomChoice(departments);
      const deptResult = await client.query('SELECT id FROM departments WHERE name = $1', [dept.name]);
      const deptId = deptResult.rows[0]?.id || 1;
      
      const result = await client.query(`
        INSERT INTO contractors (
          contractor_id, first_name, last_name, email, phone, company_name, address,
          service_type, annual_volume, payment_terms, status, contract_expiry,
          department_id, location, pay_rate, start_date, quality_score, compliance_rate, on_time_delivery_rate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id
      `, [
        `CTR-${String(contractorIds.length + i + 1).padStart(4, '0')}`,
        randomChoice(firstNames),
        randomChoice(lastNames),
        `contractor${contractorIds.length + i + 1}@${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
        `+1-${randomInt(200,999)}-${randomInt(200,999)}-${randomInt(1000,9999)}`,
        vendor.name,
        `${randomInt(100,9999)} ${randomChoice(['Main', 'Oak', 'Maple', 'Tech', 'Innovation'])} ${randomChoice(['St', 'Ave', 'Blvd', 'Dr'])}, ${vendor.city}, ${vendor.state}`,
        JSON.stringify([randomChoice(['Development', 'Consulting', 'Security', 'Data', 'Cloud', 'DevOps'])]),
        randomAmount(50000, 500000),
        randomChoice(['Net 30', 'Net 45', 'Net 60', '2/10 Net 30']),
        'Active',
        formatDate(randomDate(-1, 12)),
        deptId,
        `${vendor.city}, ${vendor.state}`,
        randomAmount(75, 250),
        formatDate(randomDate(MONTHS_OF_DATA, 0)),
        randomInt(70, 100),
        randomAmount(85, 100),
        randomAmount(80, 100)
      ]);
      if (result.rows[0]) contractorIds.push(result.rows[0].id);
    }

    // Update existing contractors with vendor info
    for (const cid of contractorIds.slice(0, 34)) {
      const vendor = randomChoice(vendors);
      await client.query(`
        UPDATE contractors SET 
          company_name = COALESCE(company_name, $1),
          address = COALESCE(address, $2),
          phone = COALESCE(phone, $3),
          quality_score = COALESCE(quality_score, $4),
          compliance_rate = COALESCE(compliance_rate, $5),
          on_time_delivery_rate = COALESCE(on_time_delivery_rate, $6)
        WHERE id = $7
      `, [
        vendor.name,
        `${randomInt(100,9999)} ${randomChoice(['Tech', 'Corporate', 'Business'])} ${randomChoice(['Park', 'Center', 'Plaza'])}, ${vendor.city}, ${vendor.state}`,
        `+1-${randomInt(200,999)}-${randomInt(200,999)}-${randomInt(1000,9999)}`,
        randomInt(70, 100),
        randomAmount(85, 100),
        randomAmount(80, 100),
        cid
      ]);
    }
    console.log(`   ✅ ${contractorIds.length} contractors ready`);

    // ═══════════════════════════════════════════════════════════════
    // 4. PROJECTS - Create 50 projects
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 PROJECTS');
    const existingProjects = (await client.query('SELECT id, project_number FROM projects')).rows;
    const projectIds = existingProjects.map(p => p.id);
    const existingProjNums = new Set(existingProjects.map(p => p.project_number));
    
    for (let i = 0; i < PROJECT_COUNT; i++) {
      const projNum = `PRJ-${String(i + 1).padStart(4, '0')}`;
      if (existingProjNums.has(projNum)) continue;
      
      const template = projectTemplates[i % projectTemplates.length];
      const dept = randomChoice(departments);
      const startDate = randomDate(MONTHS_OF_DATA, 0);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + randomInt(2, 8));
      const budget = parseFloat(randomAmount(50000, 500000));
      const spent = budget * (Math.random() * 0.9 + 0.1);
      const estimatedHours = randomInt(200, 2000);
      const actualHours = estimatedHours * (Math.random() * 0.3 + 0.85);
      
      const result = await client.query(`
        INSERT INTO projects (
          project_number, title, description, category, status, priority,
          estimated_hours, actual_hours, budget, spent, owner, department,
          start_date, target_end_date, risk_level, time_saved_hours, roi_percentage
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING id
      `, [
        projNum,
        `${template.title} ${randomInt(1, 5)}`,
        template.desc,
        template.category,
        randomChoice(projectStatuses),
        randomInt(1, 5),
        estimatedHours,
        actualHours.toFixed(2),
        budget.toFixed(2),
        spent.toFixed(2),
        `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
        dept.name,
        formatDate(startDate),
        formatDate(endDate),
        randomChoice(['Low', 'Medium', 'High']),
        randomInt(20, 200),
        randomAmount(5, 35)
      ]);
      projectIds.push(result.rows[0].id);
    }
    console.log(`   ✅ ${projectIds.length} projects ready`);

    // ═══════════════════════════════════════════════════════════════
    // 5. STATEMENTS OF WORK - One per project
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 STATEMENTS OF WORK');
    const existingSOWs = (await client.query('SELECT id, sow_number FROM statements_of_work')).rows;
    const sowIds = existingSOWs.map(s => s.id);
    const existingSowNums = new Set(existingSOWs.map(s => s.sow_number));
    
    for (let i = 0; i < projectIds.length; i++) {
      const sowNum = `SOW-${String(i + 1).padStart(4, '0')}`;
      if (existingSowNums.has(sowNum)) continue;
      
      const dept = randomChoice(departments);
      const contractorId = randomChoice(contractorIds);
      const startDate = randomDate(MONTHS_OF_DATA, 0);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + randomInt(3, 12));
      
      const result = await client.query(`
        INSERT INTO statements_of_work (
          sow_number, title, contractor_id, total_value, status, start_date, end_date, department
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        sowNum,
        `SOW for Project PRJ-${String(i + 1).padStart(4, '0')}`,
        contractorId,
        randomAmount(75000, 750000),
        randomChoice(sowStatuses),
        formatDate(startDate),
        formatDate(endDate),
        dept.name
      ]);
      sowIds.push(result.rows[0].id);
    }
    console.log(`   ✅ ${sowIds.length} SOWs ready`);

    // ═══════════════════════════════════════════════════════════════
    // 6. PURCHASE ORDERS - Multiple per project
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📄 PURCHASE ORDERS');
    const existingPOs = (await client.query('SELECT id, po_number, contractor_id FROM purchase_orders')).rows;
    const poIds = existingPOs.map(p => ({ id: p.id, contractorId: p.contractor_id }));
    const existingPoNums = new Set(existingPOs.map(p => p.po_number));
    let poCounter = existingPOs.length + 1;
    
    for (const projectId of projectIds) {
      const posPerProject = randomInt(1, 3);
      for (let p = 0; p < posPerProject; p++) {
        const poNum = `PO-2024-${String(poCounter).padStart(4, '0')}`;
        if (existingPoNums.has(poNum)) {
          poCounter++;
          continue;
        }
        
        const contractorId = randomChoice(contractorIds);
        const dept = randomChoice(departments);
        const totalAmount = parseFloat(randomAmount(25000, 200000));
        const percentUsed = Math.random() * 120; // Some over budget
        const amountSpent = (totalAmount * percentUsed / 100).toFixed(2);
        const startDate = randomDate(MONTHS_OF_DATA, 0);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + randomInt(2, 8));
        
        const result = await client.query(`
          INSERT INTO purchase_orders (
            po_number, contractor_id, description, total_amount, amount_spent, amount_remaining,
            percent_used, status, start_date, end_date, department, project_name, is_maverick_spend
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id
        `, [
          poNum,
          contractorId,
          `Purchase order for project ${projectId}`,
          totalAmount.toFixed(2),
          amountSpent,
          (totalAmount - parseFloat(amountSpent)).toFixed(2),
          percentUsed.toFixed(2),
          randomChoice(poStatuses),
          formatDate(startDate),
          formatDate(endDate),
          dept.name,
          `PRJ-${String(projectIds.indexOf(projectId) + 1).padStart(4, '0')}`,
          Math.random() > 0.9
        ]);
        poIds.push({ id: result.rows[0].id, contractorId });
        poCounter++;
      }
    }
    console.log(`   ✅ ${poIds.length} purchase orders ready`);

    // ═══════════════════════════════════════════════════════════════
    // 7. TIMECARDS - Weekly for 6 months
    // ═══════════════════════════════════════════════════════════════
    console.log('\n⏰ TIMECARDS');
    let tcCounter = 1;
    let tcCount = 0;
    for (const po of poIds.slice(0, 80)) {
      const weeksOfData = MONTHS_OF_DATA * 4;
      for (let w = 0; w < weeksOfData; w++) {
        if (Math.random() > 0.7) continue; // Not every week
        const weekEnding = new Date();
        weekEnding.setDate(weekEnding.getDate() - (w * 7));
        const regularHours = randomInt(32, 40);
        const overtimeHours = Math.random() > 0.7 ? randomInt(2, 15) : 0;
        const hourlyRate = parseFloat(randomAmount(75, 200));
        const totalAmount = ((regularHours + overtimeHours * 1.5) * hourlyRate).toFixed(2);
        
        await client.query(`
          INSERT INTO timecards (
            timecard_number, contractor_id, purchase_order_id, week_ending,
            regular_hours, overtime_hours, total_hours, hourly_rate, total_amount, status, submitted_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (timecard_number) DO NOTHING
        `, [
          `TC-${String(tcCounter++).padStart(5, '0')}`,
          po.contractorId,
          po.id,
          formatDate(weekEnding),
          regularHours,
          overtimeHours,
          regularHours + overtimeHours,
          hourlyRate,
          totalAmount,
          randomChoice(timecardStatuses),
          formatDate(weekEnding)
        ]);
        tcCount++;
      }
    }
    console.log(`   ✅ ${tcCount} timecards created`);

    // ═══════════════════════════════════════════════════════════════
    // 8. INVOICES - Monthly billing
    // ═══════════════════════════════════════════════════════════════
    console.log('\n💰 INVOICES');
    let invCounter = 1;
    let invCount = 0;
    for (const po of poIds.slice(0, 60)) {
      const invoicesPerPO = randomInt(2, 5);
      for (let i = 0; i < invoicesPerPO; i++) {
        const invoiceDate = randomDate(MONTHS_OF_DATA, 0);
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30);
        const amount = parseFloat(randomAmount(5000, 50000));
        const taxAmount = (amount * 0.08).toFixed(2);
        
        await client.query(`
          INSERT INTO invoices (
            invoice_number, contractor_id, purchase_order_id, invoice_date, due_date,
            amount, tax_amount, total_amount, status, payment_method
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (invoice_number) DO NOTHING
        `, [
          `INV-${String(invCounter++).padStart(5, '0')}`,
          po.contractorId,
          po.id,
          formatDate(invoiceDate),
          formatDate(dueDate),
          amount.toFixed(2),
          taxAmount,
          (amount + parseFloat(taxAmount)).toFixed(2),
          randomChoice(invoiceStatuses),
          randomChoice(['ACH', 'Wire', 'Check', 'Credit Card'])
        ]);
        invCount++;
      }
    }
    console.log(`   ✅ ${invCount} invoices created`);

    // ═══════════════════════════════════════════════════════════════
    // 9. EXPENSES - Various categories
    // ═══════════════════════════════════════════════════════════════
    console.log('\n💸 EXPENSES');
    let expCounter = 1;
    let expCount = 0;
    for (const po of poIds.slice(0, 50)) {
      const expensesPerPO = randomInt(3, 8);
      for (let e = 0; e < expensesPerPO; e++) {
        const expenseDate = randomDate(MONTHS_OF_DATA, 0);
        
        await client.query(`
          INSERT INTO expenses (
            expense_number, contractor_id, purchase_order_id, category, description,
            amount, expense_date, status, receipt_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (expense_number) DO NOTHING
        `, [
          `EXP-${String(expCounter++).padStart(5, '0')}`,
          po.contractorId,
          po.id,
          randomChoice(expenseCategories),
          `${randomChoice(expenseCategories)} expense for project deliverables`,
          randomAmount(100, 5000),
          formatDate(expenseDate),
          randomChoice(['Pending', 'Approved', 'Rejected', 'Reimbursed']),
          `https://storage.velocity.com/receipts/receipt-${expCounter}.pdf`
        ]);
        expCount++;
      }
    }
    console.log(`   ✅ ${expCount} expenses created`);

    // ═══════════════════════════════════════════════════════════════
    // 10. CHANGE ORDERS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🔄 CHANGE ORDERS');
    let coCounter = 1;
    for (const poData of poIds.slice(0, 30)) {
      if (Math.random() > 0.5) continue;
      await client.query(`
        INSERT INTO change_orders (
          co_number, purchase_order_id, description, amount, status, requested_date
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (co_number) DO NOTHING
      `, [
        `CO-${String(coCounter++).padStart(4, '0')}`,
        poData.id,
        randomChoice(['Scope expansion', 'Timeline extension', 'Resource change', 'Budget increase', 'Deliverable modification']),
        randomAmount(-20000, 50000),
        randomChoice(['Draft', 'Pending', 'Approved', 'Rejected']),
        formatDate(randomDate(MONTHS_OF_DATA, 0))
      ]);
    }
    console.log(`   ✅ ${coCounter - 1} change orders created`);

    // ═══════════════════════════════════════════════════════════════
    // 11. ALERTS - Active warnings and notifications
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🚨 ALERTS');
    const alertTypes = [
      { type: 'budget_warning', title: 'Budget Threshold Exceeded', desc: 'Purchase order approaching budget limit' },
      { type: 'compliance', title: 'Compliance Review Required', desc: 'SOW requires compliance review before renewal' },
      { type: 'expiring_contract', title: 'Contract Expiring Soon', desc: 'Contract scheduled to expire within 30 days' },
      { type: 'invoice_variance', title: 'Invoice Variance Detected', desc: 'Invoice amount differs from PO terms' },
      { type: 'timecard_overdue', title: 'Timecard Approval Overdue', desc: 'Timecards pending approval past SLA' },
      { type: 'maverick_spend', title: 'Maverick Spend Detected', desc: 'Purchase made outside approved channels' }
    ];
    
    for (let a = 0; a < 25; a++) {
      const alertDef = randomChoice(alertTypes);
      await client.query(`
        INSERT INTO alerts (
          alert_type, severity, entity_type, entity_id, title, description, 
          recommendation, status, urgency_score, degradation_cost_per_day
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        alertDef.type,
        randomChoice(alertSeverities),
        randomChoice(['purchase_order', 'contractor', 'sow', 'invoice', 'timecard']),
        randomInt(1, 50),
        alertDef.title,
        alertDef.desc,
        'Review and take appropriate action',
        randomChoice(['active', 'acknowledged', 'resolved']),
        randomInt(1, 100),
        randomAmount(100, 5000)
      ]);
    }
    console.log(`   ✅ 25 alerts created`);

    // ═══════════════════════════════════════════════════════════════
    // 12. CONTRACTOR DEFECTS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n⚠️ CONTRACTOR DEFECTS');
    const defectTypes = ['Quality Issue', 'Late Delivery', 'Incomplete Work', 'Specification Mismatch', 'Documentation Gap'];
    for (let d = 0; d < 40; d++) {
      const poData = randomChoice(poIds);
      await client.query(`
        INSERT INTO contractor_defects (
          contractor_id, purchase_order_id, defect_date, defect_type, defect_description,
          defect_cost, resolved, resolution_date, resolution_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        poData.contractorId,
        poData.id,
        formatDate(randomDate(MONTHS_OF_DATA, 0)),
        randomChoice(defectTypes),
        `${randomChoice(defectTypes)} requiring remediation`,
        randomAmount(500, 10000),
        Math.random() > 0.3,
        Math.random() > 0.3 ? formatDate(randomDate(3, 0)) : null,
        Math.random() > 0.3 ? 'Issue resolved through remediation process' : null
      ]);
    }
    console.log(`   ✅ 40 contractor defects logged`);

    // ═══════════════════════════════════════════════════════════════
    // 13. CLIENT REQUIREMENTS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📝 CLIENT REQUIREMENTS');
    for (let cr = 0; cr < 20; cr++) {
      await client.query(`
        INSERT INTO client_requirements (
          id, client_name, contract_title, contract_id, categories, due_date,
          requested_by, priority, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        require('crypto').randomUUID(),
        randomChoice(vendors).name,
        `Contract for ${randomChoice(projectCategories)}`,
        `CTR-${String(cr + 1).padStart(4, '0')}`,
        JSON.stringify([randomChoice(['Technical', 'Compliance', 'Financial', 'Legal'])]),
        formatDate(randomDate(0, 3)),
        `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
        randomChoice(['High', 'Medium', 'Low']),
        randomChoice(['pending', 'in_progress', 'completed', 'blocked'])
      ]);
    }
    console.log(`   ✅ 20 client requirements created`);

    // ═══════════════════════════════════════════════════════════════
    // 14. PROJECT DOCUMENTS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📎 PROJECT DOCUMENTS');
    const docTypes = ['Contract', 'SOW', 'Invoice', 'Timesheet', 'Proposal', 'Report', 'Specification', 'Agreement'];
    for (let pd = 0; pd < 100; pd++) {
      const projectId = randomChoice(projectIds);
      const docType = randomChoice(docTypes);
      await client.query(`
        INSERT INTO project_documents (
          project_id, client_name, bucket, original_filename, stored_filename,
          mime_type, file_size_bytes, status, document_type, classification_confidence, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        projectId,
        randomChoice(vendors).name,
        'project-documents',
        `${docType.toLowerCase()}_${pd + 1}.pdf`,
        `${require('crypto').randomUUID()}.pdf`,
        'application/pdf',
        randomInt(50000, 5000000),
        randomChoice(['uploaded', 'analyzed', 'processed']),
        docType,
        randomAmount(0.7, 0.99),
        `{${docType.toLowerCase()},project}`
      ]);
    }
    console.log(`   ✅ 100 project documents created`);

    // ═══════════════════════════════════════════════════════════════
    // 15. KNOWLEDGE INSIGHTS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n💡 KNOWLEDGE INSIGHTS');
    const insightTypes = ['best_practice', 'lesson_learned', 'process_improvement', 'risk_mitigation', 'cost_saving'];
    for (let ki = 0; ki < 30; ki++) {
      await client.query(`
        INSERT INTO knowledge_insights (
          source_type, title, insight_type, content, topic_area, confidence, verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        randomChoice(['project', 'contractor', 'process']),
        `${randomChoice(['Improved', 'Optimized', 'Streamlined', 'Enhanced'])} ${randomChoice(['Workflow', 'Process', 'Delivery', 'Quality'])}`,
        randomChoice(insightTypes),
        `Insight content regarding ${randomChoice(projectCategories)} improvements and optimizations.`,
        randomChoice(projectCategories),
        randomChoice(['high', 'medium', 'low']),
        Math.random() > 0.3
      ]);
    }
    console.log(`   ✅ 30 knowledge insights created`);

    await client.query('COMMIT');

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(60));
    console.log('✨ COMPREHENSIVE SEED COMPLETE!\n');
    
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM projects) as projects,
        (SELECT COUNT(*) FROM statements_of_work) as sows,
        (SELECT COUNT(*) FROM contractors) as contractors,
        (SELECT COUNT(*) FROM purchase_orders) as pos,
        (SELECT COUNT(*) FROM timecards) as timecards,
        (SELECT COUNT(*) FROM invoices) as invoices,
        (SELECT COUNT(*) FROM expenses) as expenses,
        (SELECT COUNT(*) FROM change_orders) as change_orders,
        (SELECT COUNT(*) FROM alerts WHERE status = 'active') as active_alerts,
        (SELECT COUNT(*) FROM contractor_defects) as defects,
        (SELECT COUNT(*) FROM project_documents) as documents,
        (SELECT COUNT(*) FROM buyers) as buyers,
        (SELECT COUNT(*) FROM client_requirements) as requirements,
        (SELECT COUNT(*) FROM knowledge_insights) as insights
    `);
    
    const c = counts.rows[0];
    console.log('📊 FINAL DATA COUNTS:');
    console.log('─'.repeat(40));
    console.log(`   Projects:           ${c.projects}`);
    console.log(`   Statements of Work: ${c.sows}`);
    console.log(`   Contractors:        ${c.contractors}`);
    console.log(`   Purchase Orders:    ${c.pos}`);
    console.log(`   Timecards:          ${c.timecards}`);
    console.log(`   Invoices:           ${c.invoices}`);
    console.log(`   Expenses:           ${c.expenses}`);
    console.log(`   Change Orders:      ${c.change_orders}`);
    console.log(`   Active Alerts:      ${c.active_alerts}`);
    console.log(`   Contractor Defects: ${c.defects}`);
    console.log(`   Project Documents:  ${c.documents}`);
    console.log(`   Buyers:             ${c.buyers}`);
    console.log(`   Client Requirements:${c.requirements}`);
    console.log(`   Knowledge Insights: ${c.insights}`);
    console.log('─'.repeat(40));
    console.log('\n✅ All data is interlinked with 6 months of history!');
    console.log('🎯 Ready for demo - charts and analytics will show real data.\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
