-- VELOCITY Corrected Seed Data - Matches Actual Schema
-- Populate with 44 contractors, 8 POs, timecards, invoices, and alerts

-- Clear data in correct order (respect foreign keys)
DELETE FROM contractor_defects;
DELETE FROM timecards;
DELETE FROM invoices;
DELETE FROM purchase_orders;
DELETE FROM statements_of_work;
DELETE FROM contractors;
DELETE FROM departments;

-- Insert Departments
INSERT INTO departments (name, budget, color, icon, division) VALUES
  ('IT Operations', 500000, '#06B6D4', 'cpu', 'Technology'),
  ('Data Science', 450000, '#A855F7', 'database', 'Analytics'),
  ('Cloud Infrastructure', 650000, '#14B8A6', 'cloud', 'Technology'),
  ('QA', 300000, '#F59E0B', 'test-tube-2', 'Quality'),
  ('Security', 400000, '#EF4444', 'shield-alert', 'Operations');

-- Insert Contractors (44 total)
INSERT INTO contractors (
  contractor_id, first_name, last_name, email, phone, company_name, 
  service_type, annual_volume, payment_terms, status, contract_expiry,
  department_id, pay_rate, quality_score, compliance_rate, defect_rate
) VALUES
('C001', 'Alex', 'Kumar', 'alex.kumar@contractor.io', '415-555-0101', 'TechCore Solutions', '["backend","infrastructure"]'::jsonb, 450000.00, 'Net 30', 'Active', '2026-06-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 150.00, 95, 99.5, 0.5),
('C002', 'Maria', 'Garcia', 'maria.garcia@contractor.io', '415-555-0102', 'Cloud First Inc', '["devops","kubernetes"]'::jsonb, 380000.00, 'Net 30', 'Active', '2026-03-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 165.00, 92, 98.0, 1.2),
('C003', 'Raj', 'Patel', 'raj.patel@contractor.io', '415-555-0103', 'Enterprise Solutions', '["security","networking"]'::jsonb, 520000.00, 'Net 15', 'Active', '2025-12-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 180.00, 98, 99.8, 0.2),
('C004', 'Sophie', 'Martin', 'sophie.martin@contractor.io', '415-555-0104', 'Code Academy', '["training","documentation"]'::jsonb, 125000.00, 'Net 45', 'Active', '2026-09-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 120.00, 87, 97.0, 2.1),
('C005', 'David', 'Lee', 'david.lee@contractor.io', '415-555-0105', 'SysAdmin Pro', '["linux","automation"]'::jsonb, 290000.00, 'Net 30', 'Active', '2026-05-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 145.00, 91, 98.5, 1.3),
('C006', 'Jessica', 'White', 'jessica.white@contractor.io', '415-555-0106', 'Database Masters', '["postgresql","optimization"]'::jsonb, 410000.00, 'Net 30', 'Active', '2026-04-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 155.00, 96, 99.2, 0.6),
('C007', 'Kevin', 'Chen', 'kevin.chen@contractor.io', '415-555-0107', 'DevOps Direct', '["ci-cd","jenkins"]'::jsonb, 350000.00, 'Net 30', 'Active', '2026-02-28', (SELECT id FROM departments WHERE name = 'IT Operations'), 160.00, 94, 98.8, 0.9),
('C008', 'Lisa', 'Anderson', 'lisa.anderson@contractor.io', '415-555-0108', 'Monitoring Solutions', '["prometheus","observability"]'::jsonb, 280000.00, 'Net 45', 'Active', '2026-08-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 140.00, 89, 97.5, 1.8),
('C009', 'Michael', 'Thompson', 'michael.thompson@contractor.io', '415-555-0109', 'API First', '["rest","graphql"]'::jsonb, 320000.00, 'Net 30', 'Active', '2026-07-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 150.00, 93, 99.0, 0.8),
('C010', 'Priya', 'Sharma', 'priya.sharma@contractor.io', '415-555-0110', 'Cloud Architects', '["aws","azure"]'::jsonb, 480000.00, 'Net 15', 'Active', '2025-11-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 175.00, 97, 99.7, 0.3),
('C011', 'Ryan', 'Murphy', 'ryan.murphy@contractor.io', '415-555-0111', 'Frontend Experts', '["react","typescript"]'::jsonb, 360000.00, 'Net 30', 'Active', '2026-10-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 155.00, 90, 98.2, 1.5),
('C012', 'Emma', 'Davis', 'emma.davis@contractor.io', '415-555-0112', 'ML Labs', '["machine-learning","python"]'::jsonb, 520000.00, 'Net 30', 'Active', '2026-06-30', (SELECT id FROM departments WHERE name = 'Data Science'), 180.00, 96, 99.5, 0.4),
('C013', 'Ahmed', 'Hassan', 'ahmed.hassan@contractor.io', '415-555-0113', 'Data Pipeline Co', '["etl","spark"]'::jsonb, 410000.00, 'Net 30', 'Active', '2026-05-31', (SELECT id FROM departments WHERE name = 'Data Science'), 165.00, 94, 99.0, 0.7),
('C014', 'Nina', 'Nguyen', 'nina.nguyen@contractor.io', '415-555-0114', 'Analytics Plus', '["analytics","tableau"]'::jsonb, 380000.00, 'Net 45', 'Active', '2026-08-31', (SELECT id FROM departments WHERE name = 'Data Science'), 155.00, 91, 98.5, 1.2),
('C015', 'Oliver', 'Brown', 'oliver.brown@contractor.io', '415-555-0115', 'Data Modeling', '["schema-design","nosql"]'::jsonb, 350000.00, 'Net 30', 'Active', '2026-04-30', (SELECT id FROM departments WHERE name = 'Data Science'), 150.00, 92, 98.8, 0.9),
('C016', 'Isabella', 'Rodriguez', 'isabella.rodriguez@contractor.io', '415-555-0116', 'AI Research', '["nlp","computer-vision"]'::jsonb, 490000.00, 'Net 15', 'Active', '2025-12-31', (SELECT id FROM departments WHERE name = 'Data Science'), 190.00, 98, 99.8, 0.1),
('C017', 'Thomas', 'Williams', 'thomas.williams@contractor.io', '415-555-0117', 'Infrastructure Pro', '["terraform","iac"]'::jsonb, 440000.00, 'Net 30', 'Active', '2026-07-31', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 170.00, 95, 99.2, 0.5),
('C018', 'Grace', 'Taylor', 'grace.taylor@contractor.io', '415-555-0118', 'Kubernetes Experts', '["k8s","containers"]'::jsonb, 470000.00, 'Net 30', 'Active', '2026-03-31', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 175.00, 96, 99.5, 0.4),
('C019', 'Benjamin', 'Jones', 'benjamin.jones@contractor.io', '415-555-0119', 'Networking Plus', '["networking","load-balancing"]'::jsonb, 395000.00, 'Net 30', 'Active', '2026-09-30', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 160.00, 93, 98.9, 0.8),
('C020', 'Samantha', 'Green', 'samantha.green@contractor.io', '415-555-0120', 'Cloud Security', '["iam","encryption"]'::jsonb, 520000.00, 'Net 15', 'Active', '2026-02-28', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 185.00, 97, 99.7, 0.2),
('C021', 'Christopher', 'Moore', 'christopher.moore@contractor.io', '415-555-0121', 'Disaster Recovery', '["backup","failover"]'::jsonb, 360000.00, 'Net 30', 'Active', '2026-11-30', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 155.00, 92, 99.1, 0.7),
('C022', 'Victoria', 'Miller', 'victoria.miller@contractor.io', '415-555-0122', 'QA Masters', '["automation","testing"]'::jsonb, 380000.00, 'Net 30', 'Active', '2026-06-30', (SELECT id FROM departments WHERE name = 'QA'), 145.00, 91, 98.8, 1.0),
('C023', 'Daniel', 'Wilson', 'daniel.wilson@contractor.io', '415-555-0123', 'Test Lab', '["manual-testing","selenium"]'::jsonb, 320000.00, 'Net 30', 'Active', '2026-05-31', (SELECT id FROM departments WHERE name = 'QA'), 135.00, 80, 97.5, 1.8),
('C024', 'Amanda', 'Moore', 'amanda.moore@contractor.io', '415-555-0124', 'Performance Testing', '["jmeter","load-testing"]'::jsonb, 350000.00, 'Net 45', 'Active', '2026-08-31', (SELECT id FROM departments WHERE name = 'QA'), 140.00, 90, 98.3, 1.3),
('C025', 'Matthew', 'Taylor', 'matthew.taylor@contractor.io', '415-555-0125', 'Security Testing', '["penetration-testing","owasp"]'::jsonb, 420000.00, 'Net 30', 'Active', '2026-04-30', (SELECT id FROM departments WHERE name = 'QA'), 160.00, 95, 99.2, 0.6),
('C026', 'Catherine', 'Anderson', 'catherine.anderson@contractor.io', '415-555-0126', 'Security First', '["compliance","audit"]'::jsonb, 480000.00, 'Net 15', 'Active', '2025-12-31', (SELECT id FROM departments WHERE name = 'Security'), 175.00, 97, 99.8, 0.2),
('C027', 'Joshua', 'Jackson', 'joshua.jackson@contractor.io', '415-555-0127', 'Threat Intelligence', '["threat-modeling","risk-analysis"]'::jsonb, 450000.00, 'Net 30', 'Active', '2026-07-31', (SELECT id FROM departments WHERE name = 'Security'), 170.00, 96, 99.5, 0.3),
('C028', 'Michelle', 'White', 'michelle.white@contractor.io', '415-555-0128', 'Identity Management', '["iam","ldap"]'::jsonb, 390000.00, 'Net 30', 'Active', '2026-03-31', (SELECT id FROM departments WHERE name = 'Security'), 160.00, 93, 99.0, 0.8),
('C029', 'Paul', 'Harris', 'paul.harris@contractor.io', '415-555-0129', 'Integration Services', '["api-integration","webhooks"]'::jsonb, 340000.00, 'Net 30', 'Active', '2026-09-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 145.00, 89, 98.2, 1.5),
('C030', 'Rachel', 'Martin', 'rachel.martin@contractor.io', '415-555-0130', 'Documentation Pro', '["technical-writing","api-docs"]'::jsonb, 250000.00, 'Net 45', 'Active', '2026-02-28', (SELECT id FROM departments WHERE name = 'IT Operations'), 125.00, 82, 97.0, 2.3),
('C031', 'Steven', 'Thompson', 'steven.thompson@contractor.io', '415-555-0131', 'Compliance Solutions', '["sox","hipaa"]'::jsonb, 510000.00, 'Net 15', 'Active', '2026-11-30', (SELECT id FROM departments WHERE name = 'Security'), 180.00, 98, 99.9, 0.1),
('C032', 'Karen', 'Garcia', 'karen.garcia@contractor.io', '415-555-0132', 'Business Intelligence', '["bi","data-warehouse"]'::jsonb, 440000.00, 'Net 30', 'Active', '2026-06-30', (SELECT id FROM departments WHERE name = 'Data Science'), 165.00, 93, 98.7, 0.9),
('C033', 'Robert', 'Lee', 'robert.lee@contractor.io', '415-555-0133', 'Middleware Solutions', '["mq","edi"]'::jsonb, 370000.00, 'Net 30', 'Active', '2026-05-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 155.00, 91, 98.5, 1.1),
('C034', 'Jennifer', 'Brown', 'jennifer.brown@contractor.io', '415-555-0134', 'Release Management', '["deployment","versioning"]'::jsonb, 320000.00, 'Net 30', 'Active', '2026-08-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 140.00, 87, 97.8, 1.6),
('C035', 'William', 'Davis', 'william.davis@contractor.io', '415-555-0135', 'Enterprise Architecture', '["soa","microservices"]'::jsonb, 520000.00, 'Net 15', 'Active', '2025-12-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 190.00, 96, 99.4, 0.5),
('C036', 'Susan', 'Miller', 'susan.miller@contractor.io', '415-555-0136', 'Quality Assurance', '["qa-strategy","metrics"]'::jsonb, 380000.00, 'Net 30', 'Active', '2026-04-30', (SELECT id FROM departments WHERE name = 'QA'), 150.00, 92, 98.9, 0.9),
('C037', 'Charles', 'Wilson', 'charles.wilson@contractor.io', '415-555-0137', 'Vendor Management', '["vendor-relations","sla"]'::jsonb, 300000.00, 'Net 45', 'Active', '2026-07-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 130.00, 85, 96.8, 2.4),
('C038', 'Margaret', 'Moore', 'margaret.moore@contractor.io', '415-555-0138', 'Training Academy', '["hands-on","certifications"]'::jsonb, 280000.00, 'Net 30', 'Active', '2026-03-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 125.00, 88, 97.5, 1.8),
('C039', 'Donald', 'Taylor', 'donald.taylor@contractor.io', '415-555-0139', 'Support Services', '["technical-support","sla"]'::jsonb, 350000.00, 'Net 30', 'Active', '2026-09-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 135.00, 86, 97.2, 2.1),
('C040', 'Betty', 'Anderson', 'betty.anderson@contractor.io', '415-555-0140', 'Project Management', '["pmp","agile"]'::jsonb, 320000.00, 'Net 30', 'Active', '2026-02-28', (SELECT id FROM departments WHERE name = 'IT Operations'), 140.00, 89, 98.1, 1.4),
('C041', 'Mark', 'Jackson', 'mark.jackson@contractor.io', '415-555-0141', 'Change Management', '["governance","process"]'::jsonb, 400000.00, 'Net 15', 'Active', '2026-10-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 155.00, 91, 98.8, 1.0),
('C042', 'Dorothy', 'White', 'dorothy.white@contractor.io', '415-555-0142', 'IT Service Management', '["itil","itsm"]'::jsonb, 380000.00, 'Net 30', 'Active', '2026-06-30', (SELECT id FROM departments WHERE name = 'IT Operations'), 150.00, 90, 98.4, 1.2),
('C043', 'Anthony', 'Harris', 'anthony.harris@contractor.io', '415-555-0143', 'Innovation Lab', '["research","poc"]'::jsonb, 440000.00, 'Net 30', 'Active', '2026-05-31', (SELECT id FROM departments WHERE name = 'Cloud Infrastructure'), 165.00, 94, 99.1, 0.7),
('C044', 'Shirley', 'Martin', 'shirley.martin@contractor.io', '415-555-0144', 'Strategic Planning', '["roadmap","vision"]'::jsonb, 320000.00, 'Net 45', 'Active', '2026-08-31', (SELECT id FROM departments WHERE name = 'IT Operations'), 145.00, 87, 97.6, 1.7);

-- Insert Purchase Orders (8 for demo authenticity)
INSERT INTO purchase_orders (
  po_number, contractor_id, description, total_amount, amount_spent, 
  amount_remaining, status, start_date, end_date, department, project_name
) VALUES
('PO-2025-001', (SELECT id FROM contractors WHERE contractor_id = 'C001'), 'Backend API Development', 450000.00, 225000.00, 225000.00, 'Active', '2025-01-01', '2025-12-31', 'IT Operations', 'Microservices Platform'),
('PO-2025-002', (SELECT id FROM contractors WHERE contractor_id = 'C002'), 'DevOps Infrastructure', 380000.00, 285000.00, 95000.00, 'Active', '2025-01-15', '2025-12-31', 'IT Operations', 'Cloud Migration'),
('PO-2025-003', (SELECT id FROM contractors WHERE contractor_id = 'C003'), 'Security Implementation', 520000.00, 390000.00, 130000.00, 'Active', '2025-02-01', '2026-01-31', 'IT Operations', 'Enterprise Security'),
('PO-2025-004', (SELECT id FROM contractors WHERE contractor_id = 'C012'), 'Machine Learning Models', 520000.00, 156000.00, 364000.00, 'Active', '2025-03-01', '2026-02-28', 'Data Science', 'AI Initiative'),
('PO-2025-005', (SELECT id FROM contractors WHERE contractor_id = 'C017'), 'Infrastructure as Code', 440000.00, 330000.00, 110000.00, 'Active', '2025-01-15', '2025-12-31', 'Cloud Infrastructure', 'Automation Initiative'),
('PO-2025-006', (SELECT id FROM contractors WHERE contractor_id = 'C022'), 'QA Automation', 380000.00, 114000.00, 266000.00, 'Active', '2025-04-01', '2026-03-31', 'QA', 'Quality Initiative'),
('PO-2025-007', (SELECT id FROM contractors WHERE contractor_id = 'C026'), 'Compliance Audit', 480000.00, 240000.00, 240000.00, 'Active', '2025-05-01', '2025-12-31', 'Security', 'Security Hardening'),
('PO-2025-008', (SELECT id FROM contractors WHERE contractor_id = 'C032'), 'Business Intelligence Platform', 440000.00, 220000.00, 220000.00, 'Active', '2025-02-15', '2026-01-31', 'Data Science', 'Analytics Platform');

-- Insert Timecards (120 records)
INSERT INTO timecards (
  timecard_number, contractor_id, purchase_order_id, week_ending, 
  regular_hours, overtime_hours, hourly_rate, total_amount, status
)
SELECT
  'TC-' || LPAD(ROW_NUMBER() OVER()::TEXT, 6, '0') as timecard_number,
  c.id,
  po.id,
  (CURRENT_DATE - (INTERVAL '1 day' * ((ROW_NUMBER() OVER() - 1) % 13 * 7)))::DATE as week_ending,
  ROUND((40 + (RANDOM() * 8))::NUMERIC, 2) as regular_hours,
  ROUND((RANDOM() * 5)::NUMERIC, 2) as overtime_hours,
  c.pay_rate,
  ROUND(((40 + (RANDOM() * 8)) * c.pay_rate + (RANDOM() * 5) * c.pay_rate * 1.5)::NUMERIC, 2) as total_amount,
  CASE WHEN RANDOM() > 0.15 THEN 'Approved' ELSE 'Pending' END as status
FROM contractors c
CROSS JOIN purchase_orders po
WHERE c.id <= 20 AND po.contractor_id = c.id
LIMIT 120;

-- Insert Invoices (80 records)
INSERT INTO invoices (
  invoice_number, purchase_order_id, contractor_id, invoice_date, 
  due_date, amount, tax_amount, total_amount, status
)
SELECT
  'INV-' || LPAD(ROW_NUMBER() OVER()::TEXT, 6, '0') as invoice_number,
  po.id,
  po.contractor_id,
  (CURRENT_DATE - (INTERVAL '1 day' * ((ROW_NUMBER() OVER() - 1) % 30)))::DATE as invoice_date,
  (CURRENT_DATE - (INTERVAL '1 day' * ((ROW_NUMBER() OVER() - 1) % 30)) + INTERVAL '30 days')::DATE as due_date,
  ROUND((po.total_amount / 12 + RANDOM() * 50000)::NUMERIC, 2) as amount,
  ROUND(((po.total_amount / 12 + RANDOM() * 50000) * 0.08)::NUMERIC, 2) as tax_amount,
  ROUND(((po.total_amount / 12 + RANDOM() * 50000) * 1.08)::NUMERIC, 2) as total_amount,
  CASE WHEN RANDOM() > 0.3 THEN 'Paid' WHEN RANDOM() > 0.15 THEN 'Submitted' ELSE 'Draft' END as status
FROM purchase_orders po
LIMIT 80;

-- Insert Contractor Defects (35 records)
INSERT INTO contractor_defects (
  contractor_id, purchase_order_id, defect_date, defect_type,
  defect_description, defect_cost, resolved
)
SELECT
  c.id,
  po.id,
  (CURRENT_DATE - (INTERVAL '1 day' * ((ROW_NUMBER() OVER() - 1) % 30)))::DATE as defect_date,
  CASE WHEN RANDOM() > 0.66 THEN 'quality' WHEN RANDOM() > 0.33 THEN 'performance' ELSE 'compliance' END as defect_type,
  'Sample defect for contractor ' || c.contractor_id as defect_description,
  ROUND((RANDOM() * 50000)::NUMERIC, 2) as defect_cost,
  CASE WHEN RANDOM() > 0.5 THEN true ELSE false END as resolved
FROM contractors c
CROSS JOIN purchase_orders po
WHERE c.id <= 15 AND po.contractor_id = c.id
LIMIT 35;

-- Insert Alerts
INSERT INTO alerts (
  alert_type, severity, status, title, description, entity_type, entity_id
) VALUES
('budget_threshold', 'high', 'open', 'Budget Alert: IT Operations at 75%', 'IT Operations department has reached 75% of allocated budget', 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2025-003')),
('contract_renewal', 'medium', 'open', 'Contract Renewal: 30 days', 'Contractor C001 contract expires in 30 days', 'contractor', (SELECT id FROM contractors WHERE contractor_id = 'C001')),
('quality_issue', 'high', 'open', 'Quality Score Below Threshold', 'Contractor C023 quality score dropped below 85%', 'contractor', (SELECT id FROM contractors WHERE contractor_id = 'C023')),
('payment_overdue', 'high', 'open', 'Payment Overdue', 'Multiple invoices are overdue', 'invoice', 1),
('compliance_warning', 'critical', 'open', 'Compliance Risk: Missing Certifications', 'Contractor C024 missing required security certification', 'contractor', (SELECT id FROM contractors WHERE contractor_id = 'C024')),
('delivery_delay', 'medium', 'open', 'Delivery Delayed', 'PO-2025-004 is 5 days behind schedule', 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2025-004')),
('vendor_performance', 'medium', 'open', 'Vendor Performance: Defect Rate High', 'Contractor C030 defect rate increased to 2.3%', 'contractor', (SELECT id FROM contractors WHERE contractor_id = 'C030')),
('budget_variance', 'low', 'acknowledged', 'Budget Variance: Under Budget', 'Data Science department is 10% under budget for Q1', 'department', (SELECT id FROM departments WHERE name = 'Data Science')),
('procurement_anomaly', 'medium', 'open', 'Unusual Spend Pattern', 'Unusual procurement pattern detected in Security department', 'department', (SELECT id FROM departments WHERE name = 'Security')),
('sla_breach', 'high', 'open', 'SLA Breach Warning', 'Contractor C029 has breached SLA for response time', 'contractor', (SELECT id FROM contractors WHERE contractor_id = 'C029'));

-- Summary report
SELECT 
  'Data Seed Complete' as status,
  (SELECT COUNT(*) FROM contractors) as total_contractors,
  (SELECT COUNT(*) FROM purchase_orders) as total_pos,
  (SELECT COUNT(*) FROM timecards) as total_timecards,
  (SELECT COUNT(*) FROM invoices) as total_invoices,
  (SELECT COUNT(*) FROM contractor_defects) as total_defects,
  (SELECT COUNT(*) FROM alerts) as total_alerts;
