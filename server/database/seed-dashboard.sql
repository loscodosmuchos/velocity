-- Dashboard Builder Seed Data
-- 37 widgets across 7 categories, 8 role templates, 3 themes

-- First, clear existing data
TRUNCATE dashboard_modules, dashboard_templates, theme_tokens, user_dashboard_layouts RESTART IDENTITY CASCADE;

-- ============ THEME TOKENS (3 themes) ============
INSERT INTO theme_tokens (name, description, tokens, is_public) VALUES
('Damascus Steel', 'Professional dark theme with blue accents', '{
  "colors": {
    "primary": {"h": 217, "s": 91, "l": 60},
    "accent": {"h": 25, "s": 95, "l": 53}
  },
  "spacing": {"base": 4, "scale": 1.5},
  "typography": {"fontFamily": "Inter", "baseSize": 14},
  "borderRadius": {"sm": 4, "md": 8, "lg": 12}
}'::jsonb, true),
('Velocity Blue', 'Bright blue theme for high energy workflows', '{
  "colors": {
    "primary": {"h": 210, "s": 100, "l": 56},
    "accent": {"h": 330, "s": 71, "l": 51}
  },
  "spacing": {"base": 4, "scale": 1.6},
  "typography": {"fontFamily": "Inter", "baseSize": 14},
  "borderRadius": {"sm": 6, "md": 10, "lg": 16}
}'::jsonb, true),
('Executive Gray', 'Sophisticated gray theme for executive dashboards', '{
  "colors": {
    "primary": {"h": 220, "s": 13, "l": 18},
    "accent": {"h": 195, "s": 100, "l": 39}
  },
  "spacing": {"base": 4, "scale": 1.4},
  "typography": {"fontFamily": "Inter", "baseSize": 15},
  "borderRadius": {"sm": 2, "md": 6, "lg": 10}
}'::jsonb, true);

-- ============ DASHBOARD MODULES (37 widgets across 7 categories) ============

-- RECRUITMENT CATEGORY (6 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'Total Candidates', 'Active candidate pipeline', 'Users', 'recruitment', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Active Requisitions', 'Open job positions', 'FileText', 'recruitment', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Time to Hire', 'Average hiring cycle time', 'Clock', 'recruitment', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Offer Acceptance Rate', 'Percentage of accepted offers', 'CheckCircle', 'recruitment', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('chart', 'Hiring Funnel', 'Candidate progression visualization', 'TrendingUp', 'recruitment', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('chart', 'Source Effectiveness', 'Recruitment channel performance', 'Target', 'recruitment', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('table', 'Recent Interviews', 'Upcoming interview schedule', 'Calendar', 'recruitment', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('table', 'Top Vendors', 'Best performing staffing agencies', 'Award', 'recruitment', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true);

-- PROCUREMENT & VENDORS CATEGORY (8 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'Vendor Spend', 'Total vendor expenditure', 'DollarSign', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Active Contractors', 'Currently engaged contractors', 'Users', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Contract Compliance', 'Compliance rate percentage', 'Shield', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Vendor Risk Score', 'Average risk assessment', 'AlertTriangle', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'SOW Cycle Time', 'Average SOW approval time', 'Clock', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Cost Savings', 'YTD procurement savings', 'TrendingDown', 'procurement', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('chart', 'Vendor Performance Trends', 'Quarterly performance metrics', 'LineChart', 'procurement', '{"w": 8, "h": 4, "minW": 6, "minH": 3}'::jsonb, true),
('table', 'Contract Renewals', 'Expiring contracts this quarter', 'FileText', 'procurement', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true);

-- PROJECT MANAGEMENT CATEGORY (6 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'Portfolio Health', 'Overall project portfolio status', 'Activity', 'project_mgmt', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'At-Risk Projects', 'Projects requiring attention', 'AlertCircle', 'project_mgmt', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Resource Utilization', 'Team capacity usage', 'Users', 'project_mgmt', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Critical Path Items', 'Blocking dependencies count', 'AlertTriangle', 'project_mgmt', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('table', 'Top 5 At-Risk Projects', 'Projects with highest risk scores', 'Briefcase', 'project_mgmt', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('chart', 'Dependency Network', 'Project interdependencies visualization', 'GitBranch', 'project_mgmt', '{"w": 8, "h": 5, "minW": 6, "minH": 4}'::jsonb, true),
('chart', 'Resource Heatmap', 'Team allocation over time', 'Calendar', 'project_mgmt', '{"w": 8, "h": 4, "minW": 6, "minH": 3}'::jsonb, true);

-- IT & SYSTEMS CATEGORY (5 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'System Uptime', 'Platform availability percentage', 'Server', 'it_systems', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Integration Health', 'API connection status', 'Link', 'it_systems', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Tech Debt Score', 'Technical debt index', 'Code', 'it_systems', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'API Response Time', 'Average API latency', 'Zap', 'it_systems', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('chart', 'System Performance', 'Real-time performance metrics', 'Activity', 'it_systems', '{"w": 8, "h": 4, "minW": 6, "minH": 3}'::jsonb, true),
('table', 'Active Integrations', 'Connected third-party services', 'Puzzle', 'it_systems', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true);

-- VMS & CONTRACTORS CATEGORY (5 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'Contractor Compliance', 'Certification and training status', 'CheckCircle', 'vms', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Skills Gap Score', 'Current skills vs needed', 'TrendingUp', 'vms', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('chart', 'Contractor Performance', 'Performance ratings over time', 'BarChart', 'vms', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('table', 'Expiring Certifications', 'Upcoming certification renewals', 'FileWarning', 'vms', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true),
('chart', 'Spend Trends', 'Monthly contractor spending', 'DollarSign', 'vms', '{"w": 8, "h": 4, "minW": 6, "minH": 3}'::jsonb, true);

-- FINANCE CATEGORY (4 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('kpi', 'Budget Variance', 'Budget vs actual percentage', 'PieChart', 'finance', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('kpi', 'Cost per Hire', 'Average recruitment cost', 'DollarSign', 'finance', '{"w": 3, "h": 2, "minW": 2, "minH": 2}'::jsonb, true),
('chart', 'Spend Trends', 'Quarterly spend analysis', 'TrendingUp', 'finance', '{"w": 8, "h": 4, "minW": 6, "minH": 3}'::jsonb, true),
('table', 'Budget Alerts', 'Over-budget warnings', 'Bell', 'finance', '{"w": 6, "h": 4, "minW": 4, "minH": 3}'::jsonb, true);

-- PRODUCTIVITY CATEGORY (3 widgets)
INSERT INTO dashboard_modules (type, name, description, icon, category, default_size, is_enabled) VALUES
('widget', 'Quick Actions', 'Common workflow shortcuts', 'Zap', 'productivity', '{"w": 3, "h": 4, "minW": 3, "minH": 3}'::jsonb, true),
('widget', 'Recent Activity', 'Latest system updates', 'Clock', 'productivity', '{"w": 4, "h": 4, "minW": 3, "minH": 3}'::jsonb, true),
('widget', 'Notifications', 'Important alerts and messages', 'Bell', 'productivity', '{"w": 3, "h": 4, "minW": 3, "minH": 3}'::jsonb, true);

-- ============ DASHBOARD TEMPLATES (8 role-based templates) ============

-- 1. CPO Template (Chief Procurement Officer) - CRITICAL FOR DEMO
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('CPO Command Center', 'Executive procurement dashboard with vendor performance, contract compliance, and cost savings', 'cpo', 
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":9},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":11},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":12},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":14},
  {"i":"m5","x":0,"y":2,"w":8,"h":4,"moduleId":15},
  {"i":"m6","x":8,"y":2,"w":4,"h":4,"moduleId":16},
  {"i":"m7","x":0,"y":6,"w":6,"h":4,"moduleId":10}
]'::jsonb, true, true);

-- 2. Recruiter Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('Recruiter Dashboard', 'Recruitment metrics with candidate pipeline, time-to-hire, and interview schedule', 'recruiter',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":1},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":2},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":3},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":4},
  {"i":"m5","x":0,"y":2,"w":6,"h":4,"moduleId":5},
  {"i":"m6","x":6,"y":2,"w":6,"h":4,"moduleId":6},
  {"i":"m7","x":0,"y":6,"w":6,"h":4,"moduleId":7}
]'::jsonb, true, false);

-- 3. Vendor Manager Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('Vendor Manager Dashboard', 'Vendor management with performance tracking, compliance, and contract renewals', 'vendor_manager',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":9},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":10},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":11},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":13},
  {"i":"m5","x":0,"y":2,"w":8,"h":4,"moduleId":15},
  {"i":"m6","x":8,"y":2,"w":4,"h":4,"moduleId":16}
]'::jsonb, true, false);

-- 4. Project Manager Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('Project Manager Dashboard', 'Project portfolio health, at-risk projects, and resource utilization', 'project_manager',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":17},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":18},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":19},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":20},
  {"i":"m5","x":0,"y":2,"w":6,"h":4,"moduleId":21},
  {"i":"m6","x":6,"y":2,"w":6,"h":5,"moduleId":22},
  {"i":"m7","x":0,"y":7,"w":8,"h":4,"moduleId":23}
]'::jsonb, true, false);

-- 5. IT Manager Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('IT Systems Dashboard', 'System health, integrations, tech debt, and performance monitoring', 'it_manager',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":24},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":25},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":26},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":27},
  {"i":"m5","x":0,"y":2,"w":8,"h":4,"moduleId":28},
  {"i":"m6","x":8,"y":2,"w":4,"h":4,"moduleId":29}
]'::jsonb, true, false);

-- 6. VMS Coordinator Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('VMS Coordinator Dashboard', 'Contractor compliance, skills management, and performance tracking', 'vms_coordinator',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":30},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":10},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":31},
  {"i":"m4","x":0,"y":2,"w":6,"h":4,"moduleId":32},
  {"i":"m5","x":6,"y":2,"w":6,"h":4,"moduleId":33},
  {"i":"m6","x":0,"y":6,"w":8,"h":4,"moduleId":34}
]'::jsonb, true, false);

-- 7. Finance Manager Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('Finance Dashboard', 'Budget tracking, cost analysis, and financial alerts', 'finance_manager',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":35},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":36},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":9},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":14},
  {"i":"m5","x":0,"y":2,"w":8,"h":4,"moduleId":37},
  {"i":"m6","x":8,"y":2,"w":4,"h":4,"moduleId":38}
]'::jsonb, true, false);

-- 8. Executive Template
INSERT INTO dashboard_templates (name, description, role, layout, is_public, is_default) VALUES
('Executive Overview', 'High-level KPIs across all departments for C-suite visibility', 'executive',
'[
  {"i":"m1","x":0,"y":0,"w":3,"h":2,"moduleId":9},
  {"i":"m2","x":3,"y":0,"w":3,"h":2,"moduleId":17},
  {"i":"m3","x":6,"y":0,"w":3,"h":2,"moduleId":24},
  {"i":"m4","x":9,"y":0,"w":3,"h":2,"moduleId":35},
  {"i":"m5","x":0,"y":2,"w":4,"h":3,"moduleId":39},
  {"i":"m6","x":4,"y":2,"w":4,"h":3,"moduleId":40},
  {"i":"m7","x":8,"y":2,"w":4,"h":3,"moduleId":41}
]'::jsonb, true, false);

-- Verification query
SELECT 
  (SELECT COUNT(*) FROM theme_tokens) as themes,
  (SELECT COUNT(*) FROM dashboard_modules) as modules,
  (SELECT COUNT(*) FROM dashboard_templates) as templates;
