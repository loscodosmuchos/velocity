# VELOCITY BACKEND VALIDATION TEST PLAN

**Purpose:** Prove the backend is REAL, not a facade. Run these tests yourself to verify data persists.

---

## **STAGE 1: Database Schema Verification** ✅ COMPLETE

### Test 1.1: Verify Tables Exist
```bash
psql $DATABASE_URL -c "\dt" | grep -E "(projects|resources|deliverables|allocations)"
```

**Expected Output:**
```
public | allocations   | table | neondb_owner
public | deliverables  | table | neondb_owner
public | projects      | table | neondb_owner
public | resources     | table | neondb_owner
```

**Status:** ✅ PASS if you see all 4 tables

---

### Test 1.2: Verify Projects Table Structure
```bash
psql $DATABASE_URL -c "\d projects"
```

**Expected:** Should show 23 columns including:
- name, priority, status, health_score
- budget_allocated, budget_spent
- created_by, capture_method
- timestamps (created_at, updated_at)

**Status:** ✅ PASS if structure matches Mark's requirements

---

## **STAGE 2: Direct Database Operations** ⏳ IN PROGRESS

### Test 2.1: Insert a Project Directly
```bash
psql $DATABASE_URL -c "
INSERT INTO projects (
  name, 
  priority, 
  status, 
  health_score,
  created_by, 
  capture_method
) VALUES (
  'Database Test Project', 
  'High', 
  'In Progress',
  75,
  'Manual SQL Test', 
  'api'
) RETURNING id, name, priority, status, created_at;
"
```

**Expected Output:**
```
 id |         name          | priority |   status    |         created_at         
----+-----------------------+----------+-------------+----------------------------
  1 | Database Test Project | High     | In Progress | 2024-11-10 04:15:23.456789
```

**Status:** ✅ PASS if row inserted with auto-generated ID

---

### Test 2.2: Query Projects Back
```bash
psql $DATABASE_URL -c "SELECT id, name, priority, status, health_score, budget_spent FROM projects;"
```

**Expected:** See all projects you've inserted

**Status:** ✅ PASS if data persists

---

### Test 2.3: Update a Project
```bash
psql $DATABASE_URL -c "
UPDATE projects 
SET status = 'Completed', health_score = 100 
WHERE id = 1 
RETURNING id, name, status, health_score;
"
```

**Expected:** See updated values

**Status:** ✅ PASS if update succeeds

---

### Test 2.4: Test Cascade Delete
```bash
# Create a project with deliverable
psql $DATABASE_URL -c "
WITH new_project AS (
  INSERT INTO projects (name, priority, status) 
  VALUES ('Cascade Test', 'Low', 'Active')
  RETURNING id
)
INSERT INTO deliverables (project_id, name, status)
SELECT id, 'Test Deliverable', 'Not Started'
FROM new_project
RETURNING *;
"

# Delete the project (should auto-delete deliverable)
psql $DATABASE_URL -c "DELETE FROM projects WHERE name = 'Cascade Test';"

# Verify deliverable was auto-deleted
psql $DATABASE_URL -c "SELECT * FROM deliverables WHERE name = 'Test Deliverable';"
```

**Expected:** Deliverable should be gone (cascade delete worked)

**Status:** ✅ PASS if foreign key cascade works

---

## **STAGE 3: API Endpoints** 🔜 NEXT

### Test 3.1: GET /api/projects
```bash
curl http://localhost:5000/api/projects
```

**Expected:** JSON array of projects from database

**Status:** 🔜 Pending implementation

---

### Test 3.2: POST /api/projects (Create)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Project",
    "priority": "Critical",
    "status": "Not Started",
    "healthScore": 50,
    "createdBy": "API Test",
    "captureMethod": "api"
  }'
```

**Expected:** JSON response with created project (including auto-generated ID)

**Status:** 🔜 Pending implementation

---

### Test 3.3: GET /api/projects/:id (Read Single)
```bash
curl http://localhost:5000/api/projects/1
```

**Expected:** JSON object with project details

**Status:** 🔜 Pending implementation

---

### Test 3.4: PUT /api/projects/:id (Update)
```bash
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "healthScore": 85
  }'
```

**Expected:** JSON response with updated project

**Status:** 🔜 Pending implementation

---

## **STAGE 4: Frontend Integration** 🔜 FUTURE

### Test 4.1: Create Project via UI
1. Open browser: http://localhost:5000
2. Navigate to "Create Project" page
3. Fill form with test data
4. Click "Create"
5. **Verify:** Refresh page → Project still there

**Status:** 🔜 Pending frontend connection to API

---

### Test 4.2: Voice Capture to Database
1. Open voice panel: http://localhost:5000/admin/voice-panel
2. Click microphone
3. Say: "Create project Network Upgrade priority Critical"
4. Run SQL: `psql $DATABASE_URL -c "SELECT * FROM projects ORDER BY id DESC LIMIT 1;"`
5. **Verify:** Voice-captured project in database

**Status:** 🔜 Pending voice integration

---

## **STAGE 5: Persistence Validation** 🔜 CRITICAL

### Test 5.1: Refresh Test
1. Create project via UI
2. Note project ID
3. Close browser completely
4. Restart browser
5. Navigate to projects list
6. **Verify:** Project still visible with same ID

**Expected:** Data survives browser restart (proves database persistence)

**Status:** 🔜 Final validation

---

## **PROGRESS METRICS**

| Stage | Status | Tests Passing | Completion % |
|-------|--------|---------------|--------------|
| 1. Database Schema | ✅ Complete | 2/2 | 100% |
| 2. Direct DB Ops | ⏳ In Progress | 0/4 | 0% |
| 3. API Endpoints | 🔜 Pending | 0/4 | 0% |
| 4. Frontend Integration | 🔜 Pending | 0/2 | 0% |
| 5. Persistence | 🔜 Pending | 0/1 | 0% |
| **OVERALL** | **⏳ In Progress** | **2/13** | **15%** |

---

## **HOW TO USE THIS PLAN**

**After each code change:**
1. Run the tests for that stage
2. Paste results into a file or screenshot
3. Verify expected vs actual output
4. Move to next stage only when tests pass

**If a test fails:**
1. Document the failure (copy exact error)
2. I'll debug and fix
3. Re-run test to confirm fix

**This proves it's real:**
- You run the commands (not me)
- You see actual database results
- Data persists across sessions
- No mock data, no facade

