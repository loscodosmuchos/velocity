-- Feature Risk Dashboard Schema
-- Tracks feature/change risks, their factors, and post-deploy outcomes

CREATE TABLE IF NOT EXISTS feature_risks (
  id SERIAL PRIMARY KEY,
  feature_name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_factors JSONB DEFAULT '{"complexity": 0, "impact": 0, "vendor_dependencies": 0}'::jsonb,
  mitigations JSONB DEFAULT '[]'::jsonb,
  deploy_date TIMESTAMP,
  bugs_found INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'deployed', 'monitoring', 'stable', 'problematic')),
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_feature_risks_risk_level ON feature_risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_feature_risks_risk_score ON feature_risks(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_feature_risks_status ON feature_risks(status);
CREATE INDEX IF NOT EXISTS idx_feature_risks_deploy_date ON feature_risks(deploy_date DESC);

-- Insert sample data for demonstration
INSERT INTO feature_risks (feature_name, description, file_path, risk_score, risk_level, risk_factors, mitigations, deploy_date, bugs_found, status, created_by, notes)
VALUES 
  ('Real-time Approval Notifications', 'WebSocket-based instant notifications for approval workflows', 'src/pages/approvals/requests.tsx', 35, 'medium', 
   '{"complexity": 4, "impact": 3, "vendor_dependencies": 2}', 
   '["Code review completed", "Unit tests added", "Load testing performed"]', 
   '2025-11-20', 1, 'stable', 'system', 'Minor timing issue found and resolved'),
  
  ('AI Contract Gap Analysis', 'Claude-powered contract analysis for missing clauses', 'src/pages/ai/contract-gap-analysis.tsx', 72, 'high', 
   '{"complexity": 5, "impact": 4, "vendor_dependencies": 5}', 
   '["API rate limiting implemented", "Fallback responses configured", "Error handling robust"]', 
   '2025-11-18', 2, 'monitoring', 'system', 'Monitoring API response times'),
  
  ('Bulk Timecard Approval', 'Batch approval system for multiple timecards', 'src/pages/timecards/bulk-approve.tsx', 18, 'low', 
   '{"complexity": 2, "impact": 3, "vendor_dependencies": 0}', 
   '["Database transactions implemented", "Rollback capability tested"]', 
   '2025-11-15', 0, 'stable', 'system', 'No issues since deployment'),
  
  ('Voice Contract Intelligence', 'ElevenLabs voice interaction for contract queries', 'src/pages/ai/voice-contract-intelligence.tsx', 85, 'critical', 
   '{"complexity": 5, "impact": 5, "vendor_dependencies": 5}', 
   '["Fallback to text mode", "Rate limiting", "Error boundary components"]', 
   '2025-11-22', 3, 'problematic', 'system', 'Audio processing latency issues identified'),
  
  ('Dashboard KPI Cards', 'Real-time KPI summary cards with animations', 'src/components/dashboard/velocity-charts.tsx', 25, 'medium', 
   '{"complexity": 3, "impact": 2, "vendor_dependencies": 1}', 
   '["Performance optimization", "Lazy loading implemented"]', 
   '2025-11-10', 0, 'stable', 'system', 'Smooth performance after optimization'),
  
  ('Expense Report Generator', 'Automated expense report PDF generation', 'src/pages/expenses/reports.tsx', 45, 'medium', 
   '{"complexity": 4, "impact": 3, "vendor_dependencies": 2}', 
   '["PDF library fallback", "Memory usage optimized"]', 
   '2025-11-12', 1, 'stable', 'system', 'One formatting issue fixed'),
  
  ('JWT Token Refresh', 'Automatic session continuation without page reload', 'server/index.cjs', 55, 'high', 
   '{"complexity": 4, "impact": 5, "vendor_dependencies": 1}', 
   '["Token rotation implemented", "Secure storage", "Refresh logic tested"]', 
   '2025-11-08', 0, 'stable', 'system', 'Critical security feature - no issues'),
  
  ('GitHub Auto-Sync', 'Automatic code synchronization with GitHub repository', 'scripts/github-auto-sync.cjs', 62, 'high', 
   '{"complexity": 4, "impact": 4, "vendor_dependencies": 4}', 
   '["Conflict resolution", "Rate limiting", "Manual trigger fallback"]', 
   '2025-11-25', 2, 'monitoring', 'system', 'Occasional sync delays under investigation');
