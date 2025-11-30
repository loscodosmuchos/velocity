-- VELOCITY Workforce Management System
-- PostgreSQL Database Schema
-- Core entities: Users, Contractors, Purchase Orders, Timecards, Invoices

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (authentication & authorization)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  department_id INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Contractors table
CREATE TABLE contractors (
  id SERIAL PRIMARY KEY,
  contractor_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  address TEXT,
  service_type JSONB,
  annual_volume DECIMAL(15, 2) DEFAULT 0,
  payment_terms VARCHAR(50),
  certification JSONB,
  lead_time_days INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  contract_expiry DATE,
  account_manager VARCHAR(100),
  notes TEXT,
  hiring_manager_id INTEGER REFERENCES users(id),
  assigned_manager_id INTEGER REFERENCES users(id),
  department_id INTEGER,
  location VARCHAR(255),
  job_description TEXT,
  pay_rate DECIMAL(10, 2) DEFAULT 0,
  start_date DATE,
  po_funds_remaining DECIMAL(15, 2) DEFAULT 0,
  defect_rate DECIMAL(5, 2) DEFAULT 0,
  quality_score INTEGER DEFAULT 0,
  compliance_rate DECIMAL(5, 2) DEFAULT 100,
  on_time_delivery_rate DECIMAL(5, 2) DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_contractor_id ON contractors(contractor_id);
CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_quality ON contractors(quality_score DESC);
CREATE INDEX idx_contractors_defect_rate ON contractors(defect_rate);

-- Purchase Orders table
CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  description TEXT,
  total_amount DECIMAL(15, 2) NOT NULL,
  amount_spent DECIMAL(15, 2) DEFAULT 0,
  amount_remaining DECIMAL(15, 2),
  percent_used DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  start_date DATE,
  end_date DATE,
  department VARCHAR(100),
  project_name VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  approved_by INTEGER REFERENCES users(id),
  approval_date TIMESTAMP,
  confirmed_at TIMESTAMP,
  dispatched_at TIMESTAMP,
  delivered_at TIMESTAMP,
  is_maverick_spend BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_contractor ON purchase_orders(contractor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);

-- Trigger to calculate amount_remaining
CREATE OR REPLACE FUNCTION update_po_remaining()
RETURNS TRIGGER AS $$
BEGIN
  NEW.amount_remaining := NEW.total_amount - NEW.amount_spent;
  NEW.percent_used := CASE 
    WHEN NEW.total_amount > 0 THEN (NEW.amount_spent / NEW.total_amount) * 100 
    ELSE 0 
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_po_remaining
BEFORE INSERT OR UPDATE ON purchase_orders
FOR EACH ROW
EXECUTE FUNCTION update_po_remaining();

-- Timecards table
CREATE TABLE timecards (
  id SERIAL PRIMARY KEY,
  timecard_number VARCHAR(50) UNIQUE NOT NULL,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  week_ending DATE NOT NULL,
  regular_hours DECIMAL(5, 2) DEFAULT 0,
  overtime_hours DECIMAL(5, 2) DEFAULT 0,
  total_hours DECIMAL(5, 2),
  hourly_rate DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(15, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  submitted_date TIMESTAMP,
  approved_by INTEGER REFERENCES users(id),
  approval_date TIMESTAMP,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timecard_number ON timecards(timecard_number);
CREATE INDEX idx_timecard_contractor ON timecards(contractor_id);
CREATE INDEX idx_timecard_po ON timecards(purchase_order_id);
CREATE INDEX idx_timecard_status ON timecards(status);

-- Trigger to calculate timecard totals
CREATE OR REPLACE FUNCTION calculate_timecard_totals()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_hours := NEW.regular_hours + NEW.overtime_hours;
  NEW.total_amount := (NEW.regular_hours * NEW.hourly_rate) + (NEW.overtime_hours * NEW.hourly_rate * 1.5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_timecard_totals
BEFORE INSERT OR UPDATE ON timecards
FOR EACH ROW
EXECUTE FUNCTION calculate_timecard_totals();

-- Trigger to update PO budget when timecard is approved
CREATE OR REPLACE FUNCTION update_po_on_timecard_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Approved' AND (OLD.status IS NULL OR OLD.status != 'Approved') THEN
    UPDATE purchase_orders
    SET amount_spent = amount_spent + NEW.total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.purchase_order_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_po_on_timecard_approval
AFTER UPDATE ON timecards
FOR EACH ROW
EXECUTE FUNCTION update_po_on_timecard_approval();

-- Invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  due_date DATE,
  amount DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  payment_date DATE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_contractor ON invoices(contractor_id);
CREATE INDEX idx_invoice_po ON invoices(purchase_order_id);
CREATE INDEX idx_invoice_status ON invoices(status);

-- Trigger to calculate invoice total
CREATE OR REPLACE FUNCTION calculate_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount := NEW.amount + COALESCE(NEW.tax_amount, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_invoice_total
BEFORE INSERT OR UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION calculate_invoice_total();

-- Contractor Defects table (quality tracking, supplier performance)
-- Tracks defects, quality issues, and their financial impact for BI dashboards
CREATE TABLE contractor_defects (
  id SERIAL PRIMARY KEY,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  defect_date DATE NOT NULL,
  defect_type VARCHAR(100),
  defect_description TEXT,
  defect_cost DECIMAL(15, 2) DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  resolution_date DATE,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_defects_contractor ON contractor_defects(contractor_id);
CREATE INDEX idx_defects_po ON contractor_defects(purchase_order_id);
CREATE INDEX idx_defects_date ON contractor_defects(defect_date);
CREATE INDEX idx_defects_resolved ON contractor_defects(resolved);

-- Trigger to update contractor defect_rate when defects are logged
-- CORRECTED: Counts ALL POs for contractor, not just POs with defects
-- Handles contractor reassignment by recalculating both OLD and NEW contractor_id
CREATE OR REPLACE FUNCTION update_contractor_defect_rate()
RETURNS TRIGGER AS $$
DECLARE
  total_pos INTEGER;
  total_defects INTEGER;
  new_defect_rate DECIMAL(5,2);
  contractor_to_update INTEGER;
BEGIN
  -- Handle both INSERT/UPDATE (NEW) and DELETE (OLD) cases
  contractor_to_update := COALESCE(NEW.contractor_id, OLD.contractor_id);
  
  -- Count TOTAL POs for this contractor (not just POs with defects)
  SELECT COUNT(*) INTO total_pos
  FROM purchase_orders
  WHERE contractor_id = contractor_to_update;
  
  -- Count total defects for this contractor
  SELECT COUNT(*) INTO total_defects
  FROM contractor_defects
  WHERE contractor_id = contractor_to_update;
  
  -- Calculate defect rate (defects per 100 POs)
  IF total_pos > 0 THEN
    new_defect_rate := (total_defects::DECIMAL / total_pos::DECIMAL) * 100;
  ELSE
    new_defect_rate := 0;
  END IF;
  
  -- Update contractor's defect_rate
  UPDATE contractors
  SET defect_rate = new_defect_rate,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = contractor_to_update;
  
  -- If UPDATE changed contractor_id, also recalculate for OLD contractor
  IF TG_OP = 'UPDATE' AND OLD.contractor_id IS DISTINCT FROM NEW.contractor_id THEN
    -- Recalculate for old contractor
    SELECT COUNT(*) INTO total_pos
    FROM purchase_orders
    WHERE contractor_id = OLD.contractor_id;
    
    SELECT COUNT(*) INTO total_defects
    FROM contractor_defects
    WHERE contractor_id = OLD.contractor_id;
    
    IF total_pos > 0 THEN
      new_defect_rate := (total_defects::DECIMAL / total_pos::DECIMAL) * 100;
    ELSE
      new_defect_rate := 0;
    END IF;
    
    UPDATE contractors
    SET defect_rate = new_defect_rate,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.contractor_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contractor_defect_rate
AFTER INSERT OR UPDATE OR DELETE ON contractor_defects
FOR EACH ROW
EXECUTE FUNCTION update_contractor_defect_rate();

-- Alerts table (budget warnings, timeline risks, etc.)
-- Enhanced with "Waiting Stakeholders" cross-functional coordination visibility
-- Each alert shows: WHO is blocked, WHAT they're waiting for, IMPACT if delayed
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  recommendation TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  resolved_by INTEGER REFERENCES users(id),
  resolved_at TIMESTAMP,
  -- NEW: Waiting stakeholders array - transforms alerts into coordination intelligence
  -- Format: [{"role": "CFO", "waiting_for": "approval", "urgency": "CRITICAL", "impact_if_delayed": "..."}]
  waiting_stakeholders JSONB DEFAULT '[]',
  -- NEW: Urgency score (0-100) calculated from deadline proximity + stakeholder count + degradation cost
  urgency_score INTEGER DEFAULT 0,
  -- NEW: Degradation cost ($X/day) - quantifies delay impact
  degradation_cost_per_day DECIMAL(12, 2) DEFAULT 0,
  -- NEW: Deadline for critical decision/action
  deadline_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_entity ON alerts(entity_type, entity_id);
CREATE INDEX idx_alerts_urgency_score ON alerts(urgency_score DESC);
CREATE INDEX idx_alerts_deadline ON alerts(deadline_date) WHERE deadline_date IS NOT NULL;

-- Function to generate budget alerts with waiting stakeholders
CREATE OR REPLACE FUNCTION check_budget_alerts()
RETURNS TRIGGER AS $$
DECLARE
  percent_used_new DECIMAL;
  percent_used_old DECIMAL;
BEGIN
  percent_used_new := (NEW.amount_spent / NULLIF(NEW.total_amount, 0)) * 100;
  percent_used_old := (OLD.amount_spent / NULLIF(OLD.total_amount, 0)) * 100;
  
  -- Check 25% threshold
  IF percent_used_new >= 25 AND percent_used_old < 25 THEN
    INSERT INTO alerts (
      alert_type, severity, title, description, recommendation, 
      entity_type, entity_id, status,
      waiting_stakeholders, urgency_score, degradation_cost_per_day, deadline_date
    ) VALUES (
      'Budget Threshold',
      'info',
      'Budget 25% Threshold Reached',
      'Purchase Order ' || NEW.po_number || ' has reached 25% of total budget',
      'Monitor spending rate and plan for remaining budget allocation',
      'purchase_order',
      NEW.id,
      'active',
      jsonb_build_array(
        jsonb_build_object(
          'role', 'PM',
          'waiting_for', 'Budget monitoring',
          'urgency', 'INFO',
          'impact_if_delayed', 'Awareness needed for spending rate'
        )
      ),
      25,
      0,
      NOW() + INTERVAL '30 days'
    );
  END IF;
  
  -- Check 50% threshold
  IF percent_used_new >= 50 AND percent_used_old < 50 THEN
    INSERT INTO alerts (
      alert_type, severity, title, description, recommendation,
      entity_type, entity_id, status,
      waiting_stakeholders, urgency_score, degradation_cost_per_day, deadline_date
    ) VALUES (
      'Budget Threshold',
      'warning',
      'Budget 50% Threshold Reached',
      'Purchase Order ' || NEW.po_number || ' has reached 50% of total budget - Review spending rate',
      'Review project timeline and adjust spending if needed to stay within budget',
      'purchase_order',
      NEW.id,
      'active',
      jsonb_build_array(
        jsonb_build_object(
          'role', 'PM',
          'waiting_for', 'Spending review and adjustment',
          'urgency', 'MEDIUM',
          'impact_if_delayed', 'Budget overrun risk increases'
        ),
        jsonb_build_object(
          'role', 'CFO',
          'waiting_for', 'Budget variance review',
          'urgency', 'MEDIUM',
          'impact_if_delayed', 'Financial reporting accuracy compromised'
        )
      ),
      60,
      1000,
      NOW() + INTERVAL '7 days'
    );
  END IF;
  
  -- Check 90% threshold
  IF percent_used_new >= 90 AND percent_used_old < 90 THEN
    INSERT INTO alerts (
      alert_type, severity, title, description, recommendation,
      entity_type, entity_id, status,
      waiting_stakeholders, urgency_score, degradation_cost_per_day, deadline_date
    ) VALUES (
      'Budget Threshold',
      'critical',
      'Budget 90% Threshold Reached - CRITICAL',
      'Purchase Order ' || NEW.po_number || ' has reached 90% of total budget - Immediate action required',
      'URGENT: Stop new expenses, review all pending costs, and initiate budget increase request if needed',
      'purchase_order',
      NEW.id,
      'active',
      jsonb_build_array(
        jsonb_build_object(
          'role', 'CFO',
          'waiting_for', 'Emergency budget increase approval or expense halt',
          'urgency', 'CRITICAL',
          'deadline', (NOW() + INTERVAL '24 hours')::text,
          'impact_if_delayed', 'Budget overrun, unauthorized spend, cascading project delays'
        ),
        jsonb_build_object(
          'role', 'PM',
          'waiting_for', 'Stop new expenses decision',
          'urgency', 'CRITICAL',
          'deadline', (NOW() + INTERVAL '24 hours')::text,
          'impact_if_delayed', 'Project halted, contractor payments delayed'
        ),
        jsonb_build_object(
          'role', 'Executive',
          'waiting_for', 'Budget reallocation approval',
          'urgency', 'CRITICAL',
          'deadline', (NOW() + INTERVAL '24 hours')::text,
          'impact_if_delayed', 'Board visibility into budget mismanagement'
        )
      ),
      95,
      10000,
      NOW() + INTERVAL '24 hours'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_budget_alerts
AFTER UPDATE ON purchase_orders
FOR EACH ROW
EXECUTE FUNCTION check_budget_alerts();

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timecards_updated_at BEFORE UPDATE ON timecards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- MISSING DATA GENERATOR MODULE TABLES
-- ============================================================

-- Client Requirements Table
-- Tracks missing data requests sent to clients/contractors
CREATE TABLE IF NOT EXISTS client_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  contract_title VARCHAR(500) NOT NULL,
  contract_id VARCHAR(100) NOT NULL,
  categories JSONB NOT NULL DEFAULT '[]',
  due_date DATE,
  requested_by VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'overdue')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  responses JSONB DEFAULT '{}'
);

-- Client Notifications Table
-- Tracks notifications sent to clients about missing data requirements
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'new-requirement' CHECK (type IN ('new-requirement', 'reminder', 'completed', 'urgent')),
  requirement_id UUID REFERENCES client_requirements(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for client_requirements
CREATE INDEX IF NOT EXISTS idx_client_requirements_client_name ON client_requirements(client_name);
CREATE INDEX IF NOT EXISTS idx_client_requirements_status ON client_requirements(status);
CREATE INDEX IF NOT EXISTS idx_client_requirements_priority ON client_requirements(priority);
CREATE INDEX IF NOT EXISTS idx_client_requirements_created_at ON client_requirements(created_at);
CREATE INDEX IF NOT EXISTS idx_client_requirements_contract_id ON client_requirements(contract_id);

-- Indexes for client_notifications
CREATE INDEX IF NOT EXISTS idx_client_notifications_client_name ON client_notifications(client_name);
CREATE INDEX IF NOT EXISTS idx_client_notifications_is_read ON client_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_client_notifications_requirement_id ON client_notifications(requirement_id);
CREATE INDEX IF NOT EXISTS idx_client_notifications_type ON client_notifications(type);

-- Apply updated_at trigger to client_requirements
CREATE TRIGGER update_client_requirements_updated_at BEFORE UPDATE ON client_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AI QA BATCH MODULE TABLES
-- ============================================================

-- Generation Batches Table
-- Tracks bulk analysis/generation jobs for AI quality assurance
CREATE TABLE IF NOT EXISTS generation_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_name VARCHAR(255) NOT NULL,
  batch_type VARCHAR(50) NOT NULL CHECK (batch_type IN ('timecard-analysis', 'invoice-validation', 'budget-analysis', 'compliance-check', 'contract-analysis')),
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation Batch Items Table
-- Stores individual items within a batch
CREATE TABLE IF NOT EXISTS generation_batch_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES generation_batches(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL,
  item_config JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  result JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation Batch Findings Table
-- Captures multi-lens analysis results for each item
CREATE TABLE IF NOT EXISTS generation_batch_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_item_id UUID NOT NULL REFERENCES generation_batch_items(id) ON DELETE CASCADE,
  lens_name VARCHAR(100) NOT NULL,
  lens_perspective VARCHAR(100) NOT NULL,
  findings JSONB NOT NULL DEFAULT '[]',
  detected_issues INTEGER DEFAULT 0,
  missed_issues INTEGER DEFAULT 0,
  accuracy_score DECIMAL(5, 2),
  severity_breakdown JSONB DEFAULT '{"critical": 0, "high": 0, "medium": 0, "low": 0}',
  evidence JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for generation_batches
CREATE INDEX IF NOT EXISTS idx_generation_batches_type ON generation_batches(batch_type);
CREATE INDEX IF NOT EXISTS idx_generation_batches_status ON generation_batches(status);
CREATE INDEX IF NOT EXISTS idx_generation_batches_created_by ON generation_batches(created_by);
CREATE INDEX IF NOT EXISTS idx_generation_batches_created_at ON generation_batches(created_at);

-- Indexes for generation_batch_items
CREATE INDEX IF NOT EXISTS idx_generation_batch_items_batch_id ON generation_batch_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_generation_batch_items_status ON generation_batch_items(status);
CREATE INDEX IF NOT EXISTS idx_generation_batch_items_item_order ON generation_batch_items(batch_id, item_order);

-- Indexes for generation_batch_findings
CREATE INDEX IF NOT EXISTS idx_generation_batch_findings_item_id ON generation_batch_findings(batch_item_id);
CREATE INDEX IF NOT EXISTS idx_generation_batch_findings_lens ON generation_batch_findings(lens_name);
CREATE INDEX IF NOT EXISTS idx_generation_batch_findings_accuracy ON generation_batch_findings(accuracy_score);

-- Apply updated_at triggers
CREATE TRIGGER update_generation_batches_updated_at BEFORE UPDATE ON generation_batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generation_batch_items_updated_at BEFORE UPDATE ON generation_batch_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update batch progress
CREATE OR REPLACE FUNCTION update_batch_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE generation_batches
  SET 
    completed_items = (
      SELECT COUNT(*) FROM generation_batch_items 
      WHERE batch_id = NEW.batch_id AND status = 'completed'
    ),
    failed_items = (
      SELECT COUNT(*) FROM generation_batch_items 
      WHERE batch_id = NEW.batch_id AND status = 'failed'
    ),
    success_rate = CASE 
      WHEN total_items > 0 THEN 
        (SELECT COUNT(*)::DECIMAL FROM generation_batch_items 
         WHERE batch_id = NEW.batch_id AND status = 'completed') / total_items * 100
      ELSE 0
    END,
    status = CASE
      WHEN (SELECT COUNT(*) FROM generation_batch_items 
            WHERE batch_id = NEW.batch_id AND status IN ('pending', 'running')) = 0
      THEN 'completed'
      ELSE status
    END
  WHERE id = NEW.batch_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_batch_progress
AFTER UPDATE ON generation_batch_items
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_batch_progress();

-- Voice contract uploads table (email PDF intake)
CREATE TABLE IF NOT EXISTS voice_contract_uploads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  filename VARCHAR(500) NOT NULL,
  contract_text TEXT NOT NULL,
  analysis JSONB NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX idx_voice_contracts_email ON voice_contract_uploads(email);
CREATE INDEX idx_voice_contracts_uploaded ON voice_contract_uploads(uploaded_at);

-- Voice analysis sessions (phone calls)
CREATE TABLE IF NOT EXISTS voice_analysis_sessions (
  id SERIAL PRIMARY KEY,
  contract_id INTEGER REFERENCES voice_contract_uploads(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  conversation_id VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  questions_asked INTEGER DEFAULT 0
);

CREATE INDEX idx_voice_sessions_contract ON voice_analysis_sessions(contract_id);
CREATE INDEX idx_voice_sessions_started ON voice_analysis_sessions(started_at);

-- Voice Q&A logs (for analytics and debugging)
CREATE TABLE IF NOT EXISTS voice_qa_logs (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES voice_analysis_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  confidence_score FLOAT,
  asked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_voice_qa_session ON voice_qa_logs(session_id);
CREATE INDEX idx_voice_qa_asked ON voice_qa_logs(asked_at);

-- ============ DASHBOARD BUILDER MODULE ============
-- Dashboard Builder: User-configurable analytics dashboards
-- Supports drag-and-drop widgets, templates, and custom layouts

-- Theme Tokens (Design system configurations) - Created first due to foreign key dependency
CREATE TABLE IF NOT EXISTS theme_tokens (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tokens JSONB, -- {colors, spacing, typography, borderRadius}
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_theme_tokens_public ON theme_tokens(is_public);

-- Dashboard Modules (Widget Catalog)
CREATE TABLE IF NOT EXISTS dashboard_modules (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'kpi', 'chart', 'table', 'widget', 'custom'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100), -- Lucide icon name
  category VARCHAR(100), -- 'recruitment', 'procurement', 'project_mgmt', etc.
  default_size JSONB, -- {w: number, h: number, minW?: number, minH?: number}
  config_schema JSONB, -- Widget-specific configuration schema
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dashboard_modules_type ON dashboard_modules(type);
CREATE INDEX idx_dashboard_modules_category ON dashboard_modules(category);
CREATE INDEX idx_dashboard_modules_enabled ON dashboard_modules(is_enabled);

-- Dashboard Templates (Pre-configured layouts for different roles)
CREATE TABLE IF NOT EXISTS dashboard_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  role VARCHAR(100), -- 'recruiter', 'executive', 'vendor_manager', 'cpo', etc.
  layout JSONB, -- Array of layout items
  is_public BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dashboard_templates_role ON dashboard_templates(role);
CREATE INDEX idx_dashboard_templates_public ON dashboard_templates(is_public);
CREATE INDEX idx_dashboard_templates_default ON dashboard_templates(is_default);

-- User Dashboard Layouts (Personal customizations)
CREATE TABLE IF NOT EXISTS user_dashboard_layouts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  layout JSONB, -- Array of layout items
  is_default BOOLEAN DEFAULT FALSE,
  theme_id INTEGER REFERENCES theme_tokens(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_dashboard_layouts_user ON user_dashboard_layouts(user_id);
CREATE INDEX idx_user_dashboard_layouts_default ON user_dashboard_layouts(is_default);

-- Comments for documentation
COMMENT ON TABLE users IS 'User authentication and authorization';
COMMENT ON TABLE contractors IS 'Contractor profiles and vendor information';
COMMENT ON TABLE purchase_orders IS 'Purchase orders with budget tracking';
COMMENT ON TABLE timecards IS 'Contractor timecards with approval workflow';
COMMENT ON TABLE invoices IS 'Invoice tracking and payment status';
COMMENT ON TABLE alerts IS 'System-generated alerts for budget, timeline, and compliance risks';
COMMENT ON TABLE client_requirements IS 'Missing data requirements sent to clients for contract completion';
COMMENT ON TABLE client_notifications IS 'Notification system for client requirement updates';
COMMENT ON TABLE generation_batches IS 'Bulk analysis/generation jobs for AI quality assurance';
COMMENT ON TABLE generation_batch_items IS 'Individual items within analysis batches';
COMMENT ON TABLE generation_batch_findings IS 'Multi-lens analysis results for batch items';
COMMENT ON TABLE voice_contract_uploads IS 'Voice-first contract intelligence: email PDF uploads';
COMMENT ON TABLE voice_analysis_sessions IS 'Voice-first contract intelligence: phone call sessions';
COMMENT ON TABLE voice_qa_logs IS 'Voice-first contract intelligence: question/answer history';
COMMENT ON TABLE dashboard_modules IS 'Dashboard Builder: Widget catalog with 37+ configurable modules';
COMMENT ON TABLE dashboard_templates IS 'Dashboard Builder: Pre-configured layouts for different expert personas';
COMMENT ON TABLE user_dashboard_layouts IS 'Dashboard Builder: User-customized dashboard configurations';
COMMENT ON TABLE theme_tokens IS 'Dashboard Builder: Design system theme configurations';

-- ============ KNOWLEDGE CAPTURE & YOUTUBE TRANSCRIPT MODULE ============
-- Knowledge Management: YouTube transcript capture, insight extraction, multi-dimensional tagging
-- Based on Knowledge Capture & Organization Methodology

-- YouTube Transcript Sources (Master source tracking)
CREATE TABLE IF NOT EXISTS youtube_sources (
  id SERIAL PRIMARY KEY,
  video_id VARCHAR(20) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  channel VARCHAR(255),
  upload_date DATE,
  duration VARCHAR(10),
  view_count INTEGER,
  topic_area VARCHAR(100),
  transcript TEXT,
  extraction_date TIMESTAMP DEFAULT NOW(),
  extracted_by INTEGER REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_youtube_sources_video_id ON youtube_sources(video_id);
CREATE INDEX idx_youtube_sources_topic ON youtube_sources(topic_area);
CREATE INDEX idx_youtube_sources_channel ON youtube_sources(channel);

-- Knowledge Insights (Extracted insights from transcripts)
CREATE TABLE IF NOT EXISTS knowledge_insights (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES youtube_sources(id),
  source_type VARCHAR(50) DEFAULT 'youtube',
  timestamp VARCHAR(10),
  title TEXT NOT NULL,
  insight_type VARCHAR(50),
  content TEXT NOT NULL,
  key_quote TEXT,
  topic_area VARCHAR(100),
  sub_topics TEXT[],
  concepts TEXT[],
  roles_relevant_to TEXT[],
  company_size TEXT[],
  industry TEXT[],
  confidence VARCHAR(20),
  verified BOOLEAN DEFAULT FALSE,
  captured_date TIMESTAMP DEFAULT NOW(),
  captured_by INTEGER REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_insights_source ON knowledge_insights(source_id);
CREATE INDEX idx_knowledge_insights_type ON knowledge_insights(insight_type);
CREATE INDEX idx_knowledge_insights_topic ON knowledge_insights(topic_area);
CREATE INDEX idx_knowledge_insights_verified ON knowledge_insights(verified);

-- Knowledge Tags (Multi-dimensional tagging system)
CREATE TABLE IF NOT EXISTS knowledge_tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(100) UNIQUE NOT NULL,
  tag_category VARCHAR(50),
  description TEXT,
  parent_tag_id INTEGER REFERENCES knowledge_tags(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_tags_category ON knowledge_tags(tag_category);
CREATE INDEX idx_knowledge_tags_parent ON knowledge_tags(parent_tag_id);

-- Insight Tags (Many-to-many relationship)
CREATE TABLE IF NOT EXISTS insight_tags (
  insight_id INTEGER REFERENCES knowledge_insights(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES knowledge_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (insight_id, tag_id)
);

CREATE INDEX idx_insight_tags_insight ON insight_tags(insight_id);
CREATE INDEX idx_insight_tags_tag ON insight_tags(tag_id);

-- Knowledge Collections (Synthesis documents and curated collections)
CREATE TABLE IF NOT EXISTS knowledge_collections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  collection_type VARCHAR(50),
  topic_area VARCHAR(100),
  content TEXT,
  insight_ids INTEGER[],
  created_by INTEGER REFERENCES users(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_collections_type ON knowledge_collections(collection_type);
CREATE INDEX idx_knowledge_collections_topic ON knowledge_collections(topic_area);
CREATE INDEX idx_knowledge_collections_published ON knowledge_collections(is_published);

COMMENT ON TABLE youtube_sources IS 'Knowledge Capture: YouTube video source tracking with metadata';
COMMENT ON TABLE knowledge_insights IS 'Knowledge Capture: Extracted insights with multi-dimensional classification';
COMMENT ON TABLE knowledge_tags IS 'Knowledge Capture: Hierarchical tagging system for flexible retrieval';
COMMENT ON TABLE insight_tags IS 'Knowledge Capture: Many-to-many relationship between insights and tags';
COMMENT ON TABLE knowledge_collections IS 'Knowledge Capture: Synthesis documents and curated insight collections';

-- ============ SOW TRANCHES / PAYMENT MILESTONES ============
-- Structured payment milestones for Statements of Work
-- Replaces text-based paymentSchedule with proper tracking

CREATE TABLE IF NOT EXISTS sow_tranches (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES statements_of_work(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  percentage DECIMAL(5, 2),
  due_date DATE,
  sequence_order INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'paid', 'cancelled')),
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  paid_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sow_tranches_sow_id ON sow_tranches(sow_id);
CREATE INDEX IF NOT EXISTS idx_sow_tranches_status ON sow_tranches(status);
CREATE INDEX IF NOT EXISTS idx_sow_tranches_due_date ON sow_tranches(due_date);
CREATE INDEX IF NOT EXISTS idx_sow_tranches_sequence ON sow_tranches(sow_id, sequence_order);

CREATE TRIGGER update_sow_tranches_updated_at BEFORE UPDATE ON sow_tranches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sow_tranches IS 'SOW Tranches: Structured payment milestones for Statements of Work with completion tracking';

-- ============ COMMUNICATION HUB MODULE ============
-- Message templates and messaging with context linking to SOWs/Invoices/POs

-- Message Templates Table
CREATE TABLE IF NOT EXISTS message_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('approval_reminder', 'payment_notification', 'status_update', 'document_request', 'escalation', 'general')),
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_message_templates_category ON message_templates(category);
CREATE INDEX IF NOT EXISTS idx_message_templates_active ON message_templates(is_active);

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Messages Table (with context linking)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER,
  receiver_type VARCHAR(50),
  related_sow_id INTEGER REFERENCES statements_of_work(id) ON DELETE SET NULL,
  related_invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  related_po_id INTEGER REFERENCES purchase_orders(id) ON DELETE SET NULL,
  template_id INTEGER REFERENCES message_templates(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'read')),
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, receiver_type);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_related_sow ON messages(related_sow_id) WHERE related_sow_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_related_invoice ON messages(related_invoice_id) WHERE related_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_related_po ON messages(related_po_id) WHERE related_po_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_template ON messages(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

COMMENT ON TABLE message_templates IS 'Communication Hub: Reusable message templates with variable substitution';
COMMENT ON TABLE messages IS 'Communication Hub: Messages with context linking to SOWs, Invoices, and POs';

-- ============ SOW STAKEHOLDERS / NOTIFICATION SYSTEM ============
-- Stakeholder Management for Statements of Work
-- Tracks stakeholders, their roles, and notification preferences

CREATE TABLE IF NOT EXISTS sow_stakeholders (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES statements_of_work(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Legal', 'Finance', 'Operations', 'Procurement', 'Executive', 'Compliance', 'ProjectManager', 'Approver')),
  notification_preferences JSONB DEFAULT '{"email": true, "inApp": true, "thresholds": {"budgetPercent": 80, "daysRemaining": 14}}',
  added_by INTEGER REFERENCES users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(sow_id, user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_sow_stakeholders_sow ON sow_stakeholders(sow_id);
CREATE INDEX IF NOT EXISTS idx_sow_stakeholders_user ON sow_stakeholders(user_id);
CREATE INDEX IF NOT EXISTS idx_sow_stakeholders_role ON sow_stakeholders(role);
CREATE INDEX IF NOT EXISTS idx_sow_stakeholders_active ON sow_stakeholders(is_active) WHERE is_active = true;

COMMENT ON TABLE sow_stakeholders IS 'SOW Stakeholder Notification System: Track stakeholders and their notification preferences for SOW lifecycle events';

-- ====== UNIFIED USER ARCHITECTURE UPDATES ======

-- Alter users table to support all user types
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'employee',
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS company_id INTEGER,
ADD COLUMN IF NOT EXISTS contractor_id INTEGER REFERENCES contractors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notification_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS portal_access BOOLEAN DEFAULT false;

-- Project Assignments (tracks which users are assigned to which projects/SOWs)
CREATE TABLE IF NOT EXISTS project_assignments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sow_id INTEGER REFERENCES statements_of_work(id) ON DELETE CASCADE,
  role VARCHAR(100),
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  UNIQUE(user_id, sow_id)
);

CREATE INDEX IF NOT EXISTS idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_sow_id ON project_assignments(sow_id);

-- Staffing Partners (for Amber view - contingent workforce suppliers)
CREATE TABLE IF NOT EXISTS staffing_partners (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_first_name VARCHAR(100),
  contact_last_name VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  service_types JSONB,
  rates_standard DECIMAL(10, 2),
  rates_overtime DECIMAL(10, 2),
  available_workers INTEGER DEFAULT 0,
  active_placements INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staffing_partners_active ON staffing_partners(active);

-- Contractor Document Access (controls who can see which documents)
CREATE TABLE IF NOT EXISTS contractor_document_access (
  id SERIAL PRIMARY KEY,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  document_id INTEGER,
  access_type VARCHAR(50),
  permission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(contractor_id, document_id)
);

CREATE INDEX IF NOT EXISTS idx_contractor_document_access_contractor_id ON contractor_document_access(contractor_id);

-- Contractor Signatures (for e-signature tracking)
CREATE TABLE IF NOT EXISTS contractor_signatures (
  id SERIAL PRIMARY KEY,
  contractor_id INTEGER REFERENCES contractors(id) ON DELETE CASCADE,
  document_id INTEGER,
  signature_url TEXT,
  signed_at TIMESTAMP,
  ip_address VARCHAR(50),
  verified BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_contractor_signatures_contractor_id ON contractor_signatures(contractor_id);

-- ========== PROCUREMENT BUDGET ALLOCATION ==========
-- Master budget allocation from CFO to Procurement Manager
-- This is the SOURCE OF TRUTH for total procurement budget
CREATE TABLE IF NOT EXISTS procurement_budgets (
  id SERIAL PRIMARY KEY,
  fiscal_year VARCHAR(4) NOT NULL,
  fiscal_period VARCHAR(10) NOT NULL,
  allocated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  total_budget DECIMAL(15, 2) NOT NULL,
  amount_spent DECIMAL(15, 2) DEFAULT 0,
  amount_remaining DECIMAL(15, 2),
  utilization_percent DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  department_breakdown JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_procurement_budgets_fiscal ON procurement_budgets(fiscal_year, fiscal_period);
CREATE INDEX IF NOT EXISTS idx_procurement_budgets_status ON procurement_budgets(status);

-- Trigger to auto-calculate remaining and utilization
CREATE OR REPLACE FUNCTION update_procurement_budget()
RETURNS TRIGGER AS $$
BEGIN
  NEW.amount_remaining := NEW.total_budget - NEW.amount_spent;
  NEW.utilization_percent := CASE 
    WHEN NEW.total_budget > 0 THEN (NEW.amount_spent / NEW.total_budget) * 100 
    ELSE 0 
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_procurement_budget
BEFORE INSERT OR UPDATE ON procurement_budgets
FOR EACH ROW
EXECUTE FUNCTION update_procurement_budget();

COMMENT ON TABLE procurement_budgets IS 'Master procurement budget allocation - CFO to Procurement Manager single pool';
