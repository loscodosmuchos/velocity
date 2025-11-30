# ORDER OF OPERATIONS - The Universal Best Practice

**"Confirm the core data contracts and system invariants before coding or extending any surface area."**

*— Architect (Claude Opus 4.1)*

---

## **🎯 THE ONE SENTENCE**

**Before you write ANY code**: Confirm your schema, contracts, and assumptions are correct.

**Why**: Wrong foundations = rebuilding everything later. A 10-minute schema review prevents a 4-hour rewrite.

---

## **📐 THE PHASED SEQUENCE**

### **Phase 1: SCHEMA** (Data Model)
**Location**: `shared/schema.ts`

**Define**:
- Table structures
- Column types
- Relationships (foreign keys)
- Constraints (unique, not null)
- Indexes (for performance)

**Deliverable**:
```typescript
// Example: Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull(),
  // ... rest of columns
});

// Insert schema with drizzle-zod
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type SelectProject = typeof projects.$inferSelect;
```

**Verification**:
```bash
npm run db:push
# ⚠️ Use --force ONLY if needed (aware of potential data-loss risk in shared environments)
# Verify actual database tables match your schema
```

**✅ GATE**: Schema verified in database → Proceed to Phase 2

---

### **Phase 2: CONTRACTS** (Storage Interface)
**Location**: `server/storage.ts`

**Define**:
- Storage interface methods (CRUD operations)
- Input/output types (use types from schema)
- Error handling contracts
- Authentication/authorization rules

**Deliverable**:
```typescript
// IStorage interface
interface IStorage {
  // Projects
  getAllProjects(): Promise<SelectProject[]>;
  getProjectById(id: number): Promise<SelectProject | null>;
  createProject(data: InsertProject): Promise<SelectProject>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<SelectProject>;
  deleteProject(id: number): Promise<void>;
}

// Implementation (MemStorage or DbStorage)
class DbStorage implements IStorage {
  async getAllProjects(): Promise<SelectProject[]> {
    return await db.select().from(projects);
  }
  // ... rest of methods
}
```

**Verification**:
- All CRUD operations defined?
- Types match schema exactly?
- Error cases handled?

**✅ GATE**: Storage interface complete → Proceed to Phase 3

---

### **Phase 3: API** (Backend Routes)
**Location**: `server/routes.ts`

**Define**:
- REST endpoints
- Request validation (Zod schemas)
- Response formats
- Error responses

**Deliverable**:
```typescript
// API Routes
app.get("/api/projects", async (req, res) => {
  const projects = await storage.getAllProjects();
  res.json(projects);
});

app.post("/api/projects", async (req, res) => {
  const validation = insertProjectSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }
  const newProject = await storage.createProject(validation.data);
  res.json(newProject);
});
```

**Verification**:
```bash
# Test with curl
curl http://localhost:5000/api/projects
curl -X POST http://localhost:5000/api/projects -H "Content-Type: application/json" -d '{"projectName":"Test","status":"Active"}'
```

**✅ GATE**: API tested independently with curl/Postman → Proceed to Phase 4

---

### **Phase 4: FRONTEND** (UI Components)
**Location**: `client/src/pages/`

**Build**:
- UI components (forms, tables, cards)
- Data fetching (TanStack Query)
- Loading/error states
- User interactions

**Deliverable**:
```typescript
// Frontend component
export default function ProjectsList() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <Title>Projects</Title>
      {projects?.map(project => (
        <div key={project.id}>{project.projectName}</div>
      ))}
    </Card>
  );
}
```

**Verification**:
- Manual end-to-end test
- All user workflows complete?
- Edge cases handled (empty state, errors)?

**✅ GATE**: End-to-end workflow verified → Proceed to Review

---

## **🚦 VERIFICATION GATES**

### **Gate 1: Schema → Storage**
**Question**: Is my database schema correct?

**Checklist**:
- [ ] Schema defined in `shared/schema.ts`
- [ ] Insert schemas created with drizzle-zod
- [ ] Types exported (Insert/Select)
- [ ] `npm run db:push --force` successful
- [ ] Verified tables exist in database

**If NO**: Fix schema. Re-push. Don't proceed.

---

### **Gate 2: Storage → API**
**Question**: Is my storage interface complete?

**Checklist**:
- [ ] `IStorage` interface updated with new methods
- [ ] All CRUD operations implemented
- [ ] Types match schema exactly
- [ ] Error handling added

**If NO**: Complete storage interface. Don't build routes yet.

---

### **Gate 3: API → Frontend**
**Question**: Does my API work independently?

**Checklist**:
- [ ] Routes defined in `server/routes.ts`
- [ ] Request validation with Zod
- [ ] Tested with curl/Postman
- [ ] Returns expected data format

**If NO**: Debug API first. Don't build UI yet.

---

### **Gate 4: Frontend → Complete**
**Question**: Does the full user workflow work?

**Checklist**:
- [ ] UI components render correctly
- [ ] Forms submit successfully
- [ ] Data displays properly
- [ ] Loading states work
- [ ] Error states work
- [ ] Manual end-to-end test passed

**If NO**: Fix frontend issues. Test again.

---

## **⚠️ WHAT HAPPENS WHEN YOU SKIP PHASES**

### **Skip Schema Definition**
**Problem**: Build UI first, realize data model is wrong  
**Result**: Rewrite schema, storage, API, AND frontend  
**Time Lost**: 4+ hours

### **Skip Storage Interface**
**Problem**: Write API routes with direct DB queries  
**Result**: Can't swap storage implementations, tight coupling  
**Time Lost**: 2+ hours to refactor

### **Skip API Testing**
**Problem**: Build frontend, find API bugs during UI work  
**Result**: Context-switching between frontend and backend  
**Time Lost**: 1-2 hours debugging

### **Skip Manual Testing**
**Problem**: Call task "complete" without testing  
**Result**: User finds broken workflows, you look unprofessional  
**Time Lost**: User trust + 1+ hour fixing

---

## **✅ REAL-WORLD EXAMPLE: Adding Projects Feature**

### **❌ WRONG WAY (Chaos)**
```
1. Build project form UI
2. Realize: no API endpoint
3. Add API route
4. Realize: no storage method
5. Add storage method
6. Realize: no schema
7. Add schema, run db:push
8. Realize: schema column types wrong
9. Fix schema, re-push
10. Fix storage types
11. Fix API types
12. Fix UI types
13. Finally works (4 hours later)
```

**Time**: 4 hours  
**Rewrites**: 4 layers  
**Frustration**: High  
**Quality**: Low

---

### **✅ RIGHT WAY (Order of Operations)**
```
PHASE 1: Schema (10 minutes)
- Define projects table in shared/schema.ts
- Create insert schema with drizzle-zod
- Run npm run db:push --force
- ✅ GATE: Verified in database

PHASE 2: Storage (15 minutes)
- Add methods to IStorage interface
- Implement in DbStorage
- ✅ GATE: Interface complete

PHASE 3: API (10 minutes)
- Add GET/POST routes
- Add Zod validation
- Test with curl
- ✅ GATE: API returns correct data

PHASE 4: Frontend (20 minutes)
- Build form component
- Connect with TanStack Query
- Add loading/error states
- Manual test
- ✅ GATE: Workflow works end-to-end

PHASE 5: Review (5 minutes)
- Call architect
- Fix any issues
- Complete
```

**Time**: 1 hour  
**Rewrites**: 0  
**Frustration**: None  
**Quality**: High  

**Time Saved**: 3 hours (75% reduction)

---

## **🧠 WHY THIS WORKS**

### **1. Linear Dependencies**
Each phase builds on the previous:
- Schema → defines data structure
- Storage → implements data access
- API → exposes data operations
- Frontend → consumes data

You can't build a house from the roof down.

### **2. Early Error Detection**
Catch mistakes when they're cheap to fix:
- Schema wrong? Fix 1 file
- Storage wrong? Fix 2 files
- API wrong? Fix 3 files
- UI wrong? Fix 4 files

The deeper you go, the more expensive the fix.

### **3. Verification at Each Step**
Each gate confirms assumptions before proceeding:
- Database schema matches design ✓
- Storage interface works correctly ✓
- API returns expected data ✓
- UI completes user workflow ✓

No surprises at the end.

---

## **📝 LOG YOUR ASSUMPTIONS**

At each phase, document your design decisions and assumptions. For features, also record them in `docs/FUNCTIONAL_AUDIT_FRAMEWORK.md` to maintain documentation continuity.

At each phase, document:

### **Schema Phase**
```
ASSUMPTION: Projects need status, priority, and risk level
WHY: User workflow requires filtering by these fields
RISK: Might need additional fields later (e.g., tags)
ROLLBACK: Add columns with ALTER if needed
```

### **API Phase**
```
ASSUMPTION: POST /api/projects validates all required fields
WHY: Prevent invalid data from reaching database
RISK: Frontend might send partial data for drafts
ROLLBACK: Add separate /api/projects/drafts endpoint
```

### **Frontend Phase**
```
ASSUMPTION: Users want to see all projects at once
WHY: Current dataset is small (<100 projects)
RISK: Performance issues if dataset grows
ROLLBACK: Add pagination when >500 projects
```

---

## **🎁 THE BOUNTY**

**Time saved per feature**: 2-4 hours  
**Bugs prevented**: Schema mismatches, type errors, API contract violations  
**Confidence gained**: Know each layer works before building the next  
**Professionalism**: Ship features that work on first try

---

## **💡 REMEMBER**

**Before coding**: Confirm your contracts  
**During coding**: Verify each phase  
**After coding**: Test end-to-end

**The foundation determines everything that follows.**

Build it right from the start.

---

**RESPONSE #191 DELIVERABLE** - Comprehensive order of operations framework with verification gates and real-world examples.
