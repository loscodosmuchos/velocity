-- BUG PATTERN DATABASE - Ranks repetition likelihood and detects similar bugs

CREATE TABLE IF NOT EXISTS bug_patterns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  root_cause VARCHAR(255),
  file_path VARCHAR(255),
  line_number INTEGER,
  bug_type VARCHAR(50), -- 'type-mismatch', 'null-reference', 'state-sync', 'api-error', 'async-race', 'logic-error'
  severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  likelihood_score INTEGER DEFAULT 0, -- 0-100, higher = more likely to repeat
  likelihood_factors JSONB, -- stores analysis of why this bug is likely to repeat
  grep_pattern TEXT, -- regex to find similar bugs
  files_affected TEXT[], -- list of files with this pattern
  created_at TIMESTAMP DEFAULT NOW(),
  found_at TIMESTAMP,
  fixed_at TIMESTAMP,
  fixed_by VARCHAR(255),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS bug_occurrences (
  id SERIAL PRIMARY KEY,
  bug_pattern_id INTEGER REFERENCES bug_patterns(id),
  file_path VARCHAR(255),
  line_number INTEGER,
  code_snippet TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  severity VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS bug_analysis (
  id SERIAL PRIMARY KEY,
  bug_pattern_id INTEGER REFERENCES bug_patterns(id),
  analysis_type VARCHAR(50), -- 'root-cause', 'prevention', 'similar-patterns'
  analysis_result TEXT,
  confidence_score INTEGER, -- 0-100
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample bug patterns to demonstrate the system
INSERT INTO bug_patterns (title, description, root_cause, file_path, bug_type, severity, likelihood_score, grep_pattern, notes)
VALUES
  ('Type Mismatch in useState', 'useState with string|number|null instead of proper union type', 'Missing type annotation', 'src/pages/approvals/requests.tsx', 'type-mismatch', 'medium', 45, 'useState<string\s*\|\s*number\s*\|\s*null>', 'Seen in approval buttons - likely repeated in other approval flows'),
  ('Page Reload Instead of State Update', 'Using window.location.reload() instead of React state management', 'Architectural pattern misunderstanding', 'src/pages', 'state-sync', 'high', 72, 'window\.location\.reload\(\)|window\.reload\(\)', 'Very likely to repeat - developers frequently use this shortcut'),
  ('Missing FK Validation', 'Approving items that dont exist in database', 'No pre-operation validation', 'server/index.cjs', 'logic-error', 'critical', 85, 'UPDATE\s+\w+\s+SET\s+status.*WHERE\s+id\s*=', 'Critical pattern - every approval endpoint susceptible'),
  ('Hardcoded Mock IDs', 'Using hardcoded test IDs instead of dynamic data', 'Copy-paste from dev environment', 'src/pages', 'logic-error', 'high', 68, 'invoice-1461|timecard-1461|id:\s*\d{4}', 'Extremely likely - seen in approval page already');

CREATE INDEX idx_bug_patterns_likelihood ON bug_patterns(likelihood_score DESC);
CREATE INDEX idx_bug_patterns_type ON bug_patterns(bug_type);
CREATE INDEX idx_bug_occurrences_pattern ON bug_occurrences(bug_pattern_id);
CREATE INDEX idx_bug_analysis_pattern ON bug_analysis(bug_pattern_id);
