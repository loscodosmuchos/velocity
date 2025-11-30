-- VELOCITY Demo Seed Data
-- Comprehensive data population for all dashboard sections, approval workflows, and functions
-- Generated for Hyundai December 2025 demo

-- Disable triggers temporarily for bulk insert
ALTER TABLE purchase_orders DISABLE TRIGGER trigger_update_po_remaining;
ALTER TABLE timecards DISABLE TRIGGER trigger_calculate_timecard_totals;
ALTER TABLE timecards DISABLE TRIGGER trigger_update_po_on_timecard_approval;
ALTER TABLE invoices DISABLE TRIGGER trigger_calculate_invoice_total;

-- ==================== USERS (Managers, Finance, Procurement) ====================
INSERT INTO users (email, password_hash, first_name, last_name, role, department_id, status) VALUES
  ('ben.ahmed@company.com', 'hash_pwd', 'Ben', 'Ahmed', 'manager', 1, 'active'),
  ('mark.johnson@company.com', 'hash_pwd', 'Mark', 'Johnson', 'manager', 2, 'active'),
  ('wes.taylor@company.com', 'hash_pwd', 'Wes', 'Taylor', 'manager', 3, 'active'),
  ('sarah.chen@company.com', 'hash_pwd', 'Sarah', 'Chen', 'manager', 1, 'active'),
  ('cfo@company.com', 'hash_pwd', 'Patricia', 'Wilson', 'admin', NULL, 'active'),
  ('finance_approver@company.com', 'hash_pwd', 'Robert', 'Lee', 'manager', 2, 'active')
ON CONFLICT DO NOTHING;

-- ==================== DEPARTMENTS ====================
INSERT INTO departments (id, name, budget) VALUES
  (1, 'IT Operations', 5000000),
  (2, 'Finance & Admin', 2000000),
  (3, 'Procurement', 1500000),
  (4, 'Data Science', 3000000),
  (5, 'Cloud Infrastructure', 4000000)
ON CONFLICT DO NOTHING;

-- ==================== CONTRACTORS (Various statuses) ====================
INSERT INTO contractors (contractor_id, first_name, last_name, email, phone, status, start_date, pay_rate, department_id) VALUES
  -- Active contractors
  ('CONT-001', 'John', 'Smith', 'john.smith@contractor.com', '+1-555-0101', 'Active', '2024-01-15', 95.00, 1),
  ('CONT-002', 'Maria', 'Garcia', 'maria.garcia@contractor.com', '+1-555-0102', 'Active', '2024-02-01', 110.00, 4),
  ('CONT-003', 'Alex', 'Chen', 'alex.chen@contractor.com', '+1-555-0103', 'Active', '2024-03-10', 105.00, 5),
  ('CONT-004', 'Priya', 'Patel', 'priya.patel@contractor.com', '+1-555-0104', 'Active', '2024-01-20', 115.00, 4),
  ('CONT-005', 'David', 'Thompson', 'david.t@contractor.com', '+1-555-0105', 'Active', '2024-04-01', 100.00, 1),
  -- Inactive contractors
  ('CONT-006', 'Lisa', 'Anderson', 'lisa.anderson@contractor.com', '+1-555-0106', 'Inactive', '2023-06-15', 90.00, 2),
  -- On Leave
  ('CONT-007', 'James', 'Wilson', 'james.w@contractor.com', '+1-555-0107', 'On Leave', '2024-01-10', 98.00, 1)
ON CONFLICT DO NOTHING;

-- ==================== PURCHASE ORDERS (All statuses for demo) ====================
INSERT INTO purchase_orders (po_number, contractor_id, description, total_amount, amount_spent, status, start_date, end_date, department, project_name, created_by, created_at, updated_at) VALUES
  -- Active POs with various spend levels
  ('PO-2024-001', 1, 'Network Infrastructure Upgrade', 75000.00, 64500.00, 'Active', '2024-01-01', '2024-12-31', 'IT Operations', 'Building B Network', 1, NOW() - INTERVAL '90 days', NOW()),
  ('PO-2024-002', 2, 'Data Science Platform Development', 150000.00, 105000.00, 'Active', '2024-02-01', '2024-12-31', 'Data Science', 'ML Pipeline', 1, NOW() - INTERVAL '75 days', NOW()),
  ('PO-2024-003', 3, 'Cloud Migration Services', 200000.00, 182000.00, 'Active', '2024-01-15', '2024-12-31', 'Cloud Infrastructure', 'AWS Migration', 3, NOW() - INTERVAL '85 days', NOW()),
  ('PO-2024-004', 4, 'Data Analysis and Reporting', 120000.00, 48000.00, 'Active', '2024-03-01', '2024-12-31', 'Data Science', 'Analytics Suite', 1, NOW() - INTERVAL '60 days', NOW()),
  ('PO-2024-005', 5, 'Security Infrastructure', 95000.00, 23750.00, 'Active', '2024-04-01', '2024-12-31', 'IT Operations', 'Security Hardening', 1, NOW() - INTERVAL '30 days', NOW()),
  -- Pending PO for approval workflow demo
  ('PO-2024-006', 1, 'IT Support Services', 50000.00, 0.00, 'Pending', '2024-11-15', '2024-12-31', 'IT Operations', 'Support Team', 1, NOW() - INTERVAL '5 days', NOW()),
  -- Completed PO
  ('PO-2024-007', 2, 'Q3 Analytics Project', 100000.00, 100000.00, 'Completed', '2023-07-01', '2023-09-30', 'Data Science', 'Q3 Analytics', 1, NOW() - INTERVAL '200 days', NOW() - INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- ==================== STATEMENTS OF WORK (With tranches) ====================
INSERT INTO statements_of_work (sow_number, contractor_id, purchase_order_id, type, total_value, invoiced_amount, remaining_value, status, start_date, end_date, terms, deliverables, created_at, updated_at) VALUES
  -- Active SOWs
  ('SOW-2024-001', 1, 1, 'Fixed Fee', 75000.00, 45000.00, 30000.00, 'Active', '2024-01-01', '2024-12-31', 'Net 30', 'Network design, installation, testing', NOW() - INTERVAL '90 days', NOW()),
  ('SOW-2024-002', 2, 2, 'Deliverables Based', 150000.00, 78000.00, 72000.00, 'Active', '2024-02-01', '2024-12-31', 'Net 45', 'ML model development, deployment, documentation', NOW() - INTERVAL '75 days', NOW()),
  ('SOW-2024-003', 3, 3, 'Fixed Fee', 200000.00, 155000.00, 45000.00, 'Active', '2024-01-15', '2024-12-31', 'Net 30', 'Cloud migration planning and execution', NOW() - INTERVAL '85 days', NOW()),
  ('SOW-2024-004', 4, 4, 'Deliverables Based', 120000.00, 42000.00, 78000.00, 'Active', '2024-03-01', '2024-12-31', 'Net 45', 'Dashboard development, data integration', NOW() - INTERVAL '60 days', NOW()),
  ('SOW-2024-005', 5, 5, 'Fixed Fee', 95000.00, 0.00, 95000.00, 'Active', '2024-04-01', '2024-12-31', 'Net 30', 'Security assessment and hardening', NOW() - INTERVAL '30 days', NOW()),
  -- Completed SOW
  ('SOW-2024-006', 2, 7, 'Fixed Fee', 100000.00, 100000.00, 0.00, 'Completed', '2023-07-01', '2023-09-30', 'Net 30', 'Q3 reporting and analysis', NOW() - INTERVAL '200 days', NOW() - INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- ==================== SOW TRANCHES (Different completion states) ====================
INSERT INTO sow_tranches (sow_id, name, description, amount, percentage, due_date, sequence_order, status, created_at, updated_at) VALUES
  -- SOW-2024-001: 75% complete
  (1, 'Phase 1: Design & Planning', 'Network architecture and design documents', 15000.00, 20.0, '2024-02-28', 1, 'Completed', NOW() - INTERVAL '85 days', NOW() - INTERVAL '85 days'),
  (1, 'Phase 2: Equipment Procurement', 'Network equipment acquisition', 22500.00, 30.0, '2024-05-15', 2, 'Completed', NOW() - INTERVAL '75 days', NOW() - INTERVAL '75 days'),
  (1, 'Phase 3: Installation & Testing', 'Installation, testing, and validation', 22500.00, 30.0, '2024-08-31', 3, 'In Progress', NOW() - INTERVAL '30 days', NOW()),
  (1, 'Phase 4: Documentation & Handoff', 'Final documentation and knowledge transfer', 15000.00, 20.0, '2024-12-15', 4, 'Pending', NOW() + INTERVAL '180 days', NOW()),
  
  -- SOW-2024-002: 50% complete
  (2, 'Milestone 1: Data Preparation', 'Data collection and preparation', 37500.00, 25.0, '2024-04-30', 1, 'Completed', NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),
  (2, 'Milestone 2: Model Development', 'ML model development and tuning', 56250.00, 37.5, '2024-08-31', 2, 'In Progress', NOW(), NOW()),
  (2, 'Milestone 3: Deployment', 'Production deployment and optimization', 37500.00, 25.0, '2024-11-30', 3, 'Pending', NOW() + INTERVAL '30 days', NOW()),
  (2, 'Milestone 4: Support & Documentation', 'Ongoing support and final docs', 18750.00, 12.5, '2024-12-31', 4, 'Pending', NOW() + INTERVAL '90 days', NOW()),
  
  -- SOW-2024-005: Just started
  (5, 'Assessment Phase', 'Security assessment and gap analysis', 19000.00, 20.0, '2024-05-15', 1, 'In Progress', NOW(), NOW()),
  (5, 'Remediation Phase', 'Security hardening and fixes', 57000.00, 60.0, '2024-10-31', 2, 'Pending', NOW() + INTERVAL '180 days', NOW()),
  (5, 'Validation Phase', 'Testing and certification', 19000.00, 20.0, '2024-12-15', 3, 'Pending', NOW() + INTERVAL '200 days', NOW())
ON CONFLICT DO NOTHING;

-- ==================== INVOICES (Various statuses for approval demo) ====================
INSERT INTO invoices (invoice_number, contractor_id, purchase_order_id, invoice_date, due_date, amount, tax_amount, status, created_at, updated_at) VALUES
  -- Pending invoices (awaiting approval)
  ('INV-2024-1001', 1, 1, '2024-11-15', '2024-12-15', 15000.00, 1350.00, 'Submitted', NOW() - INTERVAL '10 days', NOW()),
  ('INV-2024-1002', 2, 2, '2024-11-18', '2024-12-18', 21000.00, 1890.00, 'Submitted', NOW() - INTERVAL '8 days', NOW()),
  ('INV-2024-1003', 3, 3, '2024-11-20', '2024-12-20', 45000.00, 4050.00, 'Submitted', NOW() - INTERVAL '6 days', NOW()),
  -- Overdue invoice (for risk demo)
  ('INV-2024-1004', 4, 4, '2024-10-15', '2024-11-10', 18000.00, 1620.00, 'Submitted', NOW() - INTERVAL '50 days', NOW()),
  -- Approved invoices
  ('INV-2024-1005', 1, 1, '2024-10-15', '2024-11-15', 15000.00, 1350.00, 'GR Approved', NOW() - INTERVAL '35 days', NOW()),
  -- Paid invoices
  ('INV-2024-1006', 2, 2, '2024-10-01', '2024-11-01', 21000.00, 1890.00, 'Paid', NOW() - INTERVAL '45 days', NOW()),
  ('INV-2024-1007', 3, 3, '2024-09-15', '2024-10-15', 45000.00, 4050.00, 'Paid', NOW() - INTERVAL '60 days', NOW())
ON CONFLICT DO NOTHING;

-- ==================== TIMECARDS (For approval workflow demo) ====================
INSERT INTO timecards (timecard_number, contractor_id, purchase_order_id, week_ending, regular_hours, overtime_hours, hourly_rate, status, submitted_date, created_at, updated_at) VALUES
  -- Pending timecards (awaiting manager approval)
  ('TC-2024-1101', 1, 1, '2024-11-22', 40.0, 4.0, 95.00, 'Pending', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
  ('TC-2024-1102', 2, 2, '2024-11-22', 40.0, 2.0, 110.00, 'Pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
  ('TC-2024-1103', 3, 3, '2024-11-22', 40.0, 8.0, 105.00, 'Pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
  ('TC-2024-1104', 5, 5, '2024-11-22', 40.0, 0.0, 100.00, 'Pending', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()),
  -- Approved timecards
  ('TC-2024-1001', 1, 1, '2024-11-15', 40.0, 2.0, 95.00, 'Approved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '9 days', NOW()),
  ('TC-2024-1002', 2, 2, '2024-11-15', 40.0, 0.0, 110.00, 'Approved', NOW() - INTERVAL '11 days', NOW() - INTERVAL '8 days', NOW()),
  ('TC-2024-1003', 4, 4, '2024-11-15', 40.0, 4.0, 115.00, 'Approved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '7 days', NOW())
ON CONFLICT DO NOTHING;

-- ==================== CHANGE ORDERS (For approval workflow) ====================
INSERT INTO change_orders (co_number, purchase_order_id, description, amount, status, requested_date, created_at, updated_at) VALUES
  -- Pending change orders (awaiting approval)
  ('CO-2024-001', 1, 'Additional network equipment for expansion', 12500.00, 'Pending', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW()),
  ('CO-2024-002', 2, 'Extend ML model scope to include real-time predictions', 25000.00, 'Pending', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
  -- Approved change orders
  ('CO-2024-003', 3, 'Additional cloud services for performance optimization', 15000.00, 'Approved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- ==================== MESSAGE TEMPLATES ====================
INSERT INTO message_templates (name, category, subject, body, variables, is_active) VALUES
  ('Timecard Approval', 'approval_reminder', 'Timecard {{timecard_number}} requires your approval', 'Hi {{manager_name}},\n\nTimecard {{timecard_number}} from {{contractor_name}} for week ending {{week_ending}} is pending your approval.\n\nHours: {{total_hours}} hours\nAmount: ${{total_amount}}\n\nPlease review and approve.', ARRAY['timecard_number', 'manager_name', 'contractor_name', 'week_ending', 'total_hours', 'total_amount'], true),
  ('Invoice Reminder', 'payment_notification', 'Invoice {{invoice_number}} processing', 'Invoice {{invoice_number}} from {{contractor_name}} has been submitted for processing.\n\nAmount: ${{amount}}\nDue Date: {{due_date}}\n\nThis invoice is now in the approval queue.', ARRAY['invoice_number', 'contractor_name', 'amount', 'due_date'], true),
  ('Change Order Status', 'status_update', 'Change Order {{co_number}} Status Update', 'Your change order {{co_number}} has been {{status}}.\n\nAmount: ${{amount}}\nPO: {{po_number}}\n\nDetails: {{details}}', ARRAY['co_number', 'status', 'amount', 'po_number', 'details'], true),
  ('Document Request', 'document_request', 'Required documents for {{po_number}}', 'We need the following documents for {{po_number}}:\n\n{{document_list}}\n\nPlease submit by {{due_date}}.', ARRAY['po_number', 'document_list', 'due_date'], true),
  ('Payment Confirmation', 'payment_notification', 'Payment Confirmed - {{invoice_number}}', 'Payment has been processed for {{invoice_number}}.\n\nAmount: ${{amount}}\nTransaction ID: {{transaction_id}}\n\nThank you for your work.', ARRAY['invoice_number', 'amount', 'transaction_id'], true),
  ('Escalation Notice', 'escalation', 'Escalation: {{entity_type}} {{entity_number}} requires attention', '{{entity_type}} {{entity_number}} has been escalated.\n\nReason: {{reason}}\nPriority: {{priority}}\n\nImmediate action required.', ARRAY['entity_type', 'entity_number', 'reason', 'priority'], true)
ON CONFLICT DO NOTHING;

-- ==================== MESSAGES (Linking to SOWs, POs, Invoices) ====================
INSERT INTO messages (subject, body, sender_id, receiver_id, receiver_type, related_sow_id, related_invoice_id, related_po_id, template_id, status, created_at) VALUES
  -- Messages with SOW context
  ('SOW-2024-001 Phase 2 Complete', 'Phase 2 installation is complete and ready for testing.', 1, 1, 'manager', 1, NULL, 1, 1, 'read', NOW() - INTERVAL '20 days'),
  ('SOW-2024-002 Model Update', 'Initial ML model showing 94% accuracy. Ready for review.', 2, 1, 'manager', 2, NULL, 2, 1, 'read', NOW() - INTERVAL '10 days'),
  -- Messages with Invoice context
  ('INV-2024-1001 Submitted', 'Invoice INV-2024-1001 has been submitted for your approval.', 1, 2, 'manager', NULL, 1, 1, 2, 'read', NOW() - INTERVAL '10 days'),
  ('INV-2024-1002 Status', 'Invoice INV-2024-1002 awaiting GR approval before payment.', 2, 2, 'manager', NULL, 2, 2, 1, 'read', NOW() - INTERVAL '8 days'),
  -- Messages with PO context
  ('PO-2024-006 Awaiting Approval', 'Purchase Order PO-2024-006 requires your approval to proceed.', 1, 1, 'manager', NULL, NULL, 6, 1, 'unread', NOW() - INTERVAL '5 days'),
  ('CO-2024-001 Approval Needed', 'Change Order CO-2024-001 for PO-2024-001 requires your approval.', 1, 1, 'manager', 1, NULL, 1, 3, 'unread', NOW() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- ==================== PROJECT DOCUMENTS (Linked to SOWs) ====================
INSERT INTO project_documents (sow_id, original_filename, document_type, status, mime_type, file_size_bytes, created_at) VALUES
  (1, 'Network_Design_Spec.pdf', 'sow', 'classified', 'application/pdf', 2500000, NOW() - INTERVAL '80 days'),
  (1, 'Installation_Plan.docx', 'contract', 'classified', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1200000, NOW() - INTERVAL '75 days'),
  (2, 'ML_Model_Architecture.pdf', 'sow', 'classified', 'application/pdf', 1800000, NOW() - INTERVAL '65 days'),
  (2, 'Data_Preparation_Guide.docx', 'amendment', 'classified', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 950000, NOW() - INTERVAL '60 days'),
  (3, 'AWS_Migration_Plan.pdf', 'contract', 'classified', 'application/pdf', 3200000, NOW() - INTERVAL '80 days'),
  (5, 'Security_Assessment_Report.pdf', 'sow', 'classified', 'application/pdf', 2100000, NOW() - INTERVAL '25 days')
ON CONFLICT DO NOTHING;

-- ==================== RE-ENABLE TRIGGERS ====================
ALTER TABLE purchase_orders ENABLE TRIGGER trigger_update_po_remaining;
ALTER TABLE timecards ENABLE TRIGGER trigger_calculate_timecard_totals;
ALTER TABLE timecards ENABLE TRIGGER trigger_update_po_on_timecard_approval;
ALTER TABLE invoices ENABLE TRIGGER trigger_calculate_invoice_total;

-- ==================== REFRESH MATERIALIZED VIEWS (if any) ====================
-- REFRESH MATERIALIZED VIEW IF EXISTS purchase_order_summary;

-- ==================== VERIFY DATA ====================
SELECT 'Contractors' as entity, COUNT(*) as count FROM contractors
UNION ALL
SELECT 'Purchase Orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'Statements of Work', COUNT(*) FROM statements_of_work
UNION ALL
SELECT 'SOW Tranches', COUNT(*) FROM sow_tranches
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Timecards', COUNT(*) FROM timecards
UNION ALL
SELECT 'Change Orders', COUNT(*) FROM change_orders
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Documents', COUNT(*) FROM project_documents;

COMMIT;
