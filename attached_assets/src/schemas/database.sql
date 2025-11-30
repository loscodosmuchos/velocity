-- Database schema for Missing Data Generator Module
-- Compatible with PostgreSQL

-- Client Requirements Table
CREATE TABLE IF NOT EXISTS client_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  contract_title VARCHAR(500) NOT NULL,
  contract_id VARCHAR(100) NOT NULL,
  categories JSONB NOT NULL DEFAULT '[]',
  due_date DATE,
  requested_by VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  responses JSONB DEFAULT '{}'
);

-- Client Notifications Table  
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'new-requirement',
  requirement_id UUID REFERENCES client_requirements(id),
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_requirements_client_name ON client_requirements(client_name);
CREATE INDEX IF NOT EXISTS idx_client_requirements_status ON client_requirements(status);
CREATE INDEX IF NOT EXISTS idx_client_requirements_priority ON client_requirements(priority);
CREATE INDEX IF NOT EXISTS idx_client_requirements_created_at ON client_requirements(created_at);

CREATE INDEX IF NOT EXISTS idx_client_notifications_client_name ON client_notifications(client_name);
CREATE INDEX IF NOT EXISTS idx_client_notifications_is_read ON client_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_client_notifications_requirement_id ON client_notifications(requirement_id);

-- Sample data for testing
INSERT INTO client_requirements (
  client_name, 
  contract_title, 
  contract_id, 
  categories, 
  due_date, 
  requested_by, 
  priority, 
  status
) VALUES (
  'Sample Corporation',
  'Sample Contract for Testing',
  'SAMPLE-001',
  '[{"id":"financial","name":"Financial Data","fields":[{"id":"budget","label":"Project Budget","required":true}]}]',
  CURRENT_DATE + INTERVAL '14 days',
  'Missing Data Generator',
  'High',
  'pending'
) ON CONFLICT DO NOTHING;