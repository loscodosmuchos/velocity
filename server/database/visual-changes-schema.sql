-- VISUAL CHANGE CONTROL SYSTEM
-- Tracks screenshots of all pages/sections with metadata and change detection

CREATE TABLE IF NOT EXISTS page_screenshots (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  section_name VARCHAR(255), -- specific section like "approval-kpi-cards", "topnav", etc
  component_type VARCHAR(50), -- 'page', 'component', 'section'
  screenshot_url TEXT, -- base64 or path to screenshot
  screenshot_hash VARCHAR(64), -- SHA256 of screenshot for comparison
  file_size INTEGER, -- bytes
  dimensions JSONB, -- {width, height}
  captured_at TIMESTAMP DEFAULT NOW(),
  captured_by VARCHAR(255),
  description TEXT,
  version_number INTEGER,
  git_commit VARCHAR(40),
  branch_name VARCHAR(255),
  notes TEXT,
  is_current BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS visual_changes (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  section_name VARCHAR(255),
  change_type VARCHAR(50), -- 'colors', 'layout', 'typography', 'spacing', 'missing-element', 'extra-element', 'position', 'size'
  severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  description TEXT,
  previous_screenshot_id INTEGER REFERENCES page_screenshots(id),
  current_screenshot_id INTEGER REFERENCES page_screenshots(id),
  detected_at TIMESTAMP DEFAULT NOW(),
  detected_by VARCHAR(255),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  visual_diff_url TEXT, -- side-by-side comparison image
  notes TEXT
);

CREATE TABLE IF NOT EXISTS screenshot_comparisons (
  id SERIAL PRIMARY KEY,
  before_screenshot_id INTEGER REFERENCES page_screenshots(id),
  after_screenshot_id INTEGER REFERENCES page_screenshots(id),
  comparison_hash VARCHAR(64),
  differences_json JSONB, -- {color_changes: [], layout_changes: [], etc}
  pixel_diff_percentage NUMERIC,
  compared_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) -- 'identical', 'minor-diff', 'major-diff', 'error'
);

CREATE TABLE IF NOT EXISTS page_coverage (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) UNIQUE NOT NULL,
  last_screenshot_at TIMESTAMP,
  total_screenshots INTEGER DEFAULT 0,
  current_screenshot_id INTEGER REFERENCES page_screenshots(id),
  coverage_status VARCHAR(50), -- 'covered', 'partial', 'uncovered'
  priority INTEGER, -- 1=critical, 2=high, 3=medium, 4=low
  notes TEXT
);

INSERT INTO page_coverage (page_path, priority, coverage_status) VALUES
  ('/approvals', 1, 'covered'),
  ('/admin/change-log-dashboard', 1, 'covered'),
  ('/admin/bug-pattern-detector', 1, 'covered'),
  ('/dashboard', 1, 'covered'),
  ('/contractors', 2, 'uncovered'),
  ('/invoices', 2, 'uncovered'),
  ('/timecards', 2, 'uncovered'),
  ('/purchase-orders', 2, 'uncovered'),
  ('/ai/chatbots', 3, 'uncovered');

CREATE INDEX idx_page_screenshots_path ON page_screenshots(page_path, captured_at DESC);
CREATE INDEX idx_page_screenshots_hash ON page_screenshots(screenshot_hash);
CREATE INDEX idx_visual_changes_severity ON visual_changes(severity, resolved);
CREATE INDEX idx_visual_changes_page ON visual_changes(page_path, detected_at DESC);
CREATE INDEX idx_coverage_priority ON page_coverage(priority, coverage_status);
