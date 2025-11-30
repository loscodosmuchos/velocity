-- ITEM 4: Seed Data with Robustness (INSERT...ON CONFLICT DO NOTHING)
-- This ensures idempotency - script can be run multiple times safely

BEGIN;

-- Load Contractors (already have 41, ensure no duplicates)
INSERT INTO contractors (name, email, phone, status, created_at)
SELECT name, email, phone, status, created_at FROM (
  VALUES 
    ('Alice Johnson', 'alice@contractors.com', '555-0101', 'active', NOW()),
    ('Bob Smith', 'bob@contractors.com', '555-0102', 'active', NOW()),
    ('Carol White', 'carol@contractors.com', '555-0103', 'active', NOW())
) AS t(name, email, phone, status, created_at)
WHERE NOT EXISTS (SELECT 1 FROM contractors WHERE email = t.email)
ON CONFLICT DO NOTHING;

-- Load Users for audit trail
INSERT INTO users (email, password_hash, first_name, last_name, role, status, created_at)
VALUES ('admin@velocity.com', '$2b$10$dummy', 'Admin', 'User', 'admin', 'active', NOW()),
       ('approver@velocity.com', '$2b$10$dummy', 'Approver', 'User', 'approver', 'active', NOW()),
       ('finance@velocity.com', '$2b$10$dummy', 'Finance', 'User', 'finance', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify data loaded
SELECT 'Contractors in DB' as entity, COUNT(*) as count FROM contractors
UNION ALL SELECT 'Users in DB', COUNT(*) FROM users
UNION ALL SELECT 'POs in DB', COUNT(*) FROM purchase_orders
UNION ALL SELECT 'Invoices in DB', COUNT(*) FROM invoices
UNION ALL SELECT 'Timecards in DB', COUNT(*) FROM timecards
UNION ALL SELECT 'Change Orders in DB', COUNT(*) FROM change_orders
UNION ALL SELECT 'Audit Logs in DB', COUNT(*) FROM audit_log;

COMMIT;
