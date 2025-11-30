-- Change Log Schema for Admin Dashboard
-- Tracks all changes, where to test them, and test plans

CREATE TABLE IF NOT EXISTS change_log (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  component_path VARCHAR(255),
  file_path VARCHAR(255),
  change_type VARCHAR(50), -- 'feature', 'bug-fix', 'refactor', 'optimization'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'testing', 'tested', 'deployed'
  test_location VARCHAR(255), -- URL or page where to test
  test_plan TEXT, -- Steps to test this change
  priority VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  tested_at TIMESTAMP,
  tested_by VARCHAR(255),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  change_id INTEGER REFERENCES change_log(id),
  test_status VARCHAR(50), -- 'passed', 'failed', 'blocked'
  test_output TEXT,
  tester_name VARCHAR(255),
  tested_at TIMESTAMP DEFAULT NOW(),
  findings TEXT
);

CREATE TABLE IF NOT EXISTS page_insights (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255),
  insight_type VARCHAR(50), -- 'error', 'warning', 'todo', 'improvement'
  insight_text TEXT,
  severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  page_hash VARCHAR(32),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

INSERT INTO change_log (title, description, component_path, file_path, change_type, test_location, test_plan, priority, created_by)
VALUES 
  ('KPI Summary Cards', 'Added KPI cards to approvals page showing pending/approved/rejected stats', 'src/pages/approvals/requests.tsx', 'src/pages/approvals/requests.tsx', 'feature', '/approvals', 'Navigate to /approvals - verify 4 KPI cards display with correct colors and numbers', 'high', 'system'),
  ('Transaction Safety on Approvals', 'Added PostgreSQL transactions to approve/reject endpoints for data integrity', 'server/index.cjs', 'server/index.cjs', 'bug-fix', '/approvals', 'Click approve on timecard - verify no partial updates on network failure', 'critical', 'system'),
  ('JWT Refresh Token Endpoint', 'Added /api/auth/refresh for session continuation without page reload', 'server/index.cjs', 'server/index.cjs', 'feature', '/api/auth/refresh', 'Call POST /api/auth/refresh with valid token - verify new token returned', 'high', 'system'),
  ('Approval UI - No Page Reload', 'Replaced window.reload() with React state management in approval buttons', 'src/pages/approvals/requests.tsx', 'src/pages/approvals/requests.tsx', 'feature', '/approvals', 'Click approve/reject - verify no page reload, toast notification appears', 'high', 'system');

CREATE INDEX idx_change_log_status ON change_log(status);
CREATE INDEX idx_change_log_created ON change_log(created_at DESC);
CREATE INDEX idx_page_insights_severity ON page_insights(severity);
