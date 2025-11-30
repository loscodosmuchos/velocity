# BUG PATTERN DETECTION - MCP SERVICE SPECIFICATION

**Stand-alone service for analyzing bugs, ranking repetition likelihood, and generating searchable patterns**

---

## SERVICE OVERVIEW

A machine-readable service that:
1. **Analyzes** bugs to determine root cause patterns
2. **Ranks** likelihood of repetition (0-100 score with factors)
3. **Generates** grep/regex patterns to find similar bugs
4. **Provides** prevention strategies
5. **Scans** codebases for pattern matches
6. **Outputs** machine-readable JSON for integration

### Use Cases
- **DevOps/CI Systems**: Auto-scan on every commit for known bug patterns
- **Code Review Tools**: Flag risky patterns before merge
- **AI Development Platforms**: Train models on bug prevention
- **Quality Assurance Tools**: Track and prevent bug repetition across teams
- **Security Scanners**: Detect security-related bug patterns

---

## API INTERFACE

### Endpoint 1: Analyze Bug Pattern

**POST** `/api/bug-patterns/analyze`

Request:
```json
{
  "title": "Page Reload Instead of State Update",
  "description": "Using window.location.reload() after approval",
  "rootCause": "Architectural pattern misunderstanding",
  "affectedFiles": ["src/pages/approvals/requests.tsx", "src/pages/invoices/list.tsx"],
  "severity": "high",
  "riskFactorsPresent": ["architectural-pattern", "copy-paste", "state-management"]
}
```

Response:
```json
{
  "likelihoodScore": 72,
  "likelihoodLabel": "LIKELY - Add linting rule",
  "factors": {
    "baseRiskFactors": ["architectural-pattern", "copy-paste", "state-management"],
    "fileCount": 2,
    "severity": "high",
    "severityMultiplier": 1.1
  },
  "grepPattern": "window\\.location\\.reload\\(\\)|window\\.reload\\(\\)",
  "preventionStrategies": [
    "Add ESLint rule to detect pattern",
    "Create automated test case",
    "Update code review checklist"
  ]
}
```

### Endpoint 2: Scan for Pattern Occurrences

**GET** `/api/bug-patterns/{patternId}/scan`

Response:
```json
{
  "patternId": 1,
  "patternTitle": "Page Reload Instead of State Update",
  "grepPattern": "window\\.location\\.reload\\(\\)|window\\.reload\\(\\)",
  "occurrences": [
    {
      "file": "src/pages/approvals/requests.tsx",
      "line": 145,
      "snippet": "onClick={() => window.location.reload()}",
      "severity": "high"
    },
    {
      "file": "src/pages/invoices/list.tsx",
      "line": 89,
      "snippet": "window.reload()",
      "severity": "high"
    }
  ],
  "totalFound": 2
}
```

### Endpoint 3: Store Pattern for Future Scanning

**POST** `/api/bug-patterns`

Request:
```json
{
  "title": "Missing Foreign Key Validation",
  "description": "Approving items that don't exist in database",
  "root_cause": "No pre-operation validation",
  "file_path": "server/index.cjs",
  "bug_type": "logic-error",
  "severity": "critical",
  "likelihood_score": 85,
  "grep_pattern": "UPDATE\\s+\\w+\\s+SET\\s+status.*WHERE\\s+id\\s*=",
  "notes": "Every approval endpoint susceptible"
}
```

Response: Returns stored pattern with ID for future queries

---

## RISK FACTOR SCORING SYSTEM

```
Likelihood Score = Base Factors + File Count × 5 × Severity Multiplier (capped at 100)
```

**Risk Factors:** Points awarded for root cause indicators
```
- architectural-pattern: 15 pts (wrong architectural approach)
- copy-paste: 20 pts (duplicated code)
- type-unsafety: 18 pts (weak type system)
- missing-validation: 22 pts (no input validation)
- async-race: 25 pts (concurrency issue)
- state-management: 16 pts (state sync issue)
- hardcoded-values: 20 pts (hardcoded test data)
- api-mismatch: 14 pts (schema mismatch)
- edge-case: 12 pts (edge case unhandled)
- performance: 8 pts (performance issue)
```

**Severity Multiplier:**
- critical: 1.3×
- high: 1.1×
- medium: 1.0×
- low: 0.8×

**Result Ranges:**
- 75+%: VERY LIKELY - Add linting rule immediately
- 50-74%: LIKELY - Add test case + linting
- 25-49%: POSSIBLE - Add test case
- <25%: UNLIKELY - Monitor

---

## INTEGRATION EXAMPLES

### 1. GitHub Actions CI Pipeline

```yaml
name: Bug Pattern Detection
on: [pull_request, push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Scan for known bug patterns
        run: |
          curl -X GET http://localhost:3000/api/bug-patterns \
            -H "Authorization: Bearer ${{ secrets.VELOCITY_TOKEN }}" | jq .[] > patterns.json
          
          for pattern in $(jq -r '.[] | @base64' patterns.json); do
            _jq() {
              echo ${pattern} | base64 --decode | jq -r ${1}
            }
            grep_pattern=$(_jq '.grep_pattern')
            title=$(_jq '.title')
            
            if grep -r "$grep_pattern" src/ --include="*.tsx"; then
              echo "❌ Found pattern: $title"
              exit 1
            fi
          done
          echo "✅ No bug patterns detected"
```

### 2. Local Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Fetch all bug patterns from service
PATTERNS=$(curl -s http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $API_TOKEN")

# Check each pattern against staged changes
echo $PATTERNS | jq '.[] | select(.severity == "critical")' | while read pattern; do
  GREP_PATTERN=$(echo $pattern | jq -r '.grep_pattern')
  TITLE=$(echo $pattern | jq -r '.title')
  
  if git diff --cached --name-only | xargs grep -l "$GREP_PATTERN" 2>/dev/null; then
    echo "🚨 BLOCKING COMMIT: Pattern detected: $TITLE"
    exit 1
  fi
done
```

### 3. IDE Extension / Code Editor Plugin

```javascript
// Example: VS Code Extension using the service

import axios from 'axios';

class BugPatternLinter {
  async checkFile(filePath, content) {
    const response = await axios.get(
      'http://localhost:3000/api/bug-patterns',
      { headers: { 'Authorization': `Bearer ${this.token}` } }
    );
    
    const diagnostics = [];
    
    for (const pattern of response.data) {
      const regex = new RegExp(pattern.grep_pattern, 'gm');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        diagnostics.push({
          range: new Range(
            new Position(match.index, 0),
            new Position(match.index, match[0].length)
          ),
          message: `🐛 ${pattern.title} (${pattern.likelihood_score}% likely to repeat)`,
          severity: pattern.severity === 'critical' ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning
        });
      }
    }
    
    return diagnostics;
  }
}
```

### 4. AI Training Data Provider

```python
# Python client for collecting training data

import requests
import json

class BugPatternDataset:
    def __init__(self, endpoint, token):
        self.endpoint = endpoint
        self.token = token
    
    def export_training_data(self):
        """Export all patterns as training dataset for ML models"""
        response = requests.get(
            f"{self.endpoint}/api/bug-patterns",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        
        training_data = {
            "patterns": response.json(),
            "format": "bug-pattern-detection-v1",
            "timestamp": datetime.now().isoformat()
        }
        
        return training_data
    
    def get_similar_patterns(self, description):
        """Find patterns similar to given description"""
        patterns = requests.get(
            f"{self.endpoint}/api/bug-patterns",
            headers={"Authorization": f"Bearer {self.token}"}
        ).json()
        
        # Find patterns with same severity/type
        return [p for p in patterns 
                if p['likelihood_score'] > 50]
```

---

## DATABASE SCHEMA FOR EXTERNAL USE

```sql
-- Use this schema to run Bug Pattern Detection as standalone service

CREATE TABLE bug_patterns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  root_cause VARCHAR(255),
  file_path VARCHAR(255),
  bug_type VARCHAR(50),
  severity VARCHAR(20),
  likelihood_score INTEGER,
  likelihood_factors JSONB,
  grep_pattern TEXT,
  files_affected TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  found_at TIMESTAMP,
  fixed_at TIMESTAMP,
  fixed_by VARCHAR(255),
  notes TEXT
);

CREATE TABLE bug_occurrences (
  id SERIAL PRIMARY KEY,
  bug_pattern_id INTEGER REFERENCES bug_patterns(id),
  file_path VARCHAR(255),
  line_number INTEGER,
  code_snippet TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  severity VARCHAR(20)
);

CREATE INDEX idx_likelihood ON bug_patterns(likelihood_score DESC);
CREATE INDEX idx_severity ON bug_patterns(severity);
```

---

## COMMAND-LINE INTERFACE

```bash
# Analyze a new bug
node analyze-bug.js \
  --title "Page Reload Bug" \
  --description "Using window.reload()" \
  --severity high \
  --factors architectural-pattern,copy-paste,state-management \
  --files src/pages/approvals/requests.tsx,src/pages/invoices/list.tsx

# Scan codebase for pattern
node scan-pattern.js \
  --pattern-id 1 \
  --directory ./src \
  --exclude node_modules

# Export patterns for external use
node export-patterns.js \
  --format json \
  --output bug-patterns.json \
  --min-likelihood 50
```

---

## DEPLOYMENT OPTIONS

### Option 1: Standalone Microservice
```bash
# Run as independent service on port 3001
NODE_ENV=production node server.cjs --port 3001
```

### Option 2: Docker Container
```dockerfile
FROM node:20
WORKDIR /app
COPY server/database/bug-patterns-schema.sql ./
COPY server/index.cjs ./
RUN npm install
EXPOSE 3001
CMD ["node", "index.cjs"]
```

### Option 3: Serverless Function (AWS Lambda)
```javascript
// Wrap endpoints as Lambda handlers
exports.analyzeBug = async (event) => {
  const bug = JSON.parse(event.body);
  const analysis = BugAnalyzer.analyze(bug);
  
  return {
    statusCode: 200,
    body: JSON.stringify(analysis)
  };
};
```

---

## SECURITY CONSIDERATIONS

- **API Token Required**: All endpoints require Bearer token authentication
- **Grep Pattern Injection**: Sanitize regex patterns before execution
- **Rate Limiting**: Limit scan operations to prevent resource exhaustion
- **Audit Logging**: Track all pattern creation/modification
- **Data Privacy**: Sanitize file paths in responses to protect IP

---

## TESTING SCRIPTS

See `TESTING_BUG_PATTERNS.md` for:
- Manual test cases
- Automated test suite
- Integration test examples
- Performance benchmarks

---

## SUCCESS METRICS

✅ **Accuracy**: Patterns correctly identify real bugs (>90% precision)
✅ **Coverage**: Catches pattern-based bugs before production (>80% recall)
✅ **Adoption**: External services integrating with API (track via auth tokens)
✅ **Prevention**: Reduction in bug repetition after pattern deployment (-50%)

---

## ROADMAP

- [ ] Fuzzy matching for similar patterns
- [ ] Machine learning pattern discovery
- [ ] Integration with GitHub Security Advisories
- [ ] Slack/Teams notifications on pattern detection
- [ ] Dashboard for cross-team bug pattern analytics
- [ ] Automated fix suggestions based on pattern history
