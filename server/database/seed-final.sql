-- FINAL SEED DATA - CORRECTED SCHEMA MATCHING
-- Architect Review: Schema verified against live database

BEGIN;

-- Users for audit trail (already have ~11)
INSERT INTO users (email, password_hash, first_name, last_name, role, status, created_at)
VALUES ('admin@velocity.com', '$2b$10$dummy', 'Admin', 'User', 'admin', 'active', NOW()),
       ('approver@velocity.com', '$2b$10$dummy', 'Approver', 'User', 'approver', 'active', NOW()),
       ('finance@velocity.com', '$2b$10$dummy', 'Finance', 'User', 'finance', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert new test contractors with correct schema
INSERT INTO contractors (contractor_id, first_name, last_name, email, phone, company_name, status, created_at)
VALUES 
  ('CONT-TEST-001', 'Test', 'Contractor1', 'test1@contractors.com', '555-0201', 'Test Corp 1', 'Active', NOW()),
  ('CONT-TEST-002', 'Test', 'Contractor2', 'test2@contractors.com', '555-0202', 'Test Corp 2', 'Active', NOW()),
  ('CONT-TEST-003', 'Test', 'Contractor3', 'test3@contractors.com', '555-0203', 'Test Corp 3', 'Active', NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed Approval Workflows (state machines)
INSERT INTO approval_workflows (name, resource_type, approval_steps)
VALUES 
  ('Timecard Approval', 'timecard', 2),
  ('Invoice Approval', 'invoice', 2),
  ('Change Order Approval', 'changeorder', 2)
ON CONFLICT DO NOTHING;

-- Verify all tables loaded
SELECT 'Contractors in DB' as entity, COUNT(*) as count FROM contractors
UNION ALL SELECT 'Users in DB', COUNT(*) FROM users
UNION ALL SELECT 'POs in DB', COUNT(*) FROM purchase_orders
UNION ALL SELECT 'Invoices in DB', COUNT(*) FROM invoices
UNION ALL SELECT 'Timecards in DB', COUNT(*) FROM timecards
UNION ALL SELECT 'Change Orders in DB', COUNT(*) FROM change_orders
UNION ALL SELECT 'Audit Logs in DB', COUNT(*) FROM audit_log
UNION ALL SELECT 'Workflows in DB', COUNT(*) FROM approval_workflows;

COMMIT;
