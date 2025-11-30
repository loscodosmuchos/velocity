# VELOCITY PLATFORM - COMPREHENSIVE VALIDATION CHECKLIST

**Before ANY demo, verify ALL checks below:**

## 🔴 CRITICAL PATH VALIDATION (Must Pass)
- [ ] **Demo Mode Active**: Server shows `🎭 DEMO MODE ENABLED` on startup
- [ ] **Auth Bypass Works**: Can access app without login, auto-routed to dashboard
- [ ] **SOW List Loads**: `/statement-of-works` shows all 8 SOWs with real data ($185K-$450K)
- [ ] **Contract Analyzer Wired**: `/documents/upload` connects to MultiLensAnalyzer, not stub
- [ ] **Sample Contracts Load**: Can click SOW/PO/Agreement samples and see multi-lens analysis
- [ ] **Role Filtering Works**: Can switch between Legal/Finance/Operations/Procurement/Compliance views
- [ ] **Command Center Accessible**: `/sow/command-center` loads without 404 or timeout
- [ ] **No Broken Routes**: All sidebar links navigate without errors

## 🟠 FUNCTIONAL VALIDATION (Must Pass)
- [ ] **File Upload Handler**: Upload button opens file picker, file reads successfully
- [ ] **CTA Buttons Wired**: All "Browse Files", "Create", "Upload", "Sample SOW" buttons trigger functions
- [ ] **Multi-Lens Analysis Runs**: Clicking "Analyze" generates 5-lens output (Legal/Financial/Operational/Vendor/Compliance)
- [ ] **Approval Auto-Creation**: Critical risks auto-create approval requests
- [ ] **Role-Based Recommendations**: Each role sees only relevant recommendations (no Finance person sees IT security details)
- [ ] **Contractors List Shows**: Real contractor data, not mock arrays
- [ ] **Invoice Data Real**: Invoice list pulls from database, calculations accurate
- [ ] **PO/SOW Link Working**: Can navigate from SOW to related PO/Contractors without errors

## 🟡 DATA INTEGRITY VALIDATION (Must Pass)
- [ ] **Real Data Source**: Network tab shows `/api/statements-of-work`, `/api/contractors`, etc. (not localStorage)
- [ ] **8 SOWs Present**: All 8 SOW records visible in list view
- [ ] **88 Contractors**: Full contractor database loaded (not paginated stub)
- [ ] **11 POs Visible**: Purchase orders list complete
- [ ] **11 Invoices**: Invoice list shows all records
- [ ] **Calculations Correct**: Budget burn rate calculated from real values (not hardcoded)
- [ ] **No Mock Data**: Search codebase for `mockData`, `sampleData`, `fakeData` in production paths (should find 0)

## 🔵 INTEGRATION VALIDATION (Must Pass)
- [ ] **API Endpoints Live**: `curl http://localhost:3001/api/statements-of-work` returns JSON
- [ ] **Database Connected**: Database queries execute, no connection timeouts
- [ ] **Multi-Tenant RLS**: User isolation enforced at database level
- [ ] **Feature Interdependencies**: SOW → Contractor → Performance all linked correctly
- [ ] **Approval Workflow**: Contract analysis → approval request flow complete

## 🟢 STUB PAGE DETECTION (Zero Issues)
- [ ] **No Disconnected Pages**: All routes have real component implementations
- [ ] **No Hardcoded Arrays**: Search for `const recentUploads = [`, `const mockData = [` (should find 0 in pages/)
- [ ] **No Placeholder Buttons**: All buttons trigger functions, not stubs
- [ ] **No "Coming Soon"**: No placeholder content in production paths
- [ ] **Upload Page Connected**: `/documents/upload` imports and uses MultiLensAnalyzer (NOT stub implementation)

## 🟠 NAVIGATION VALIDATION (Zero Broken Links)
- [ ] **Sidebar Navigation**: All menu items link to real pages
- [ ] **Cross-Feature Navigation**: Can navigate SOW → Contractors → Performance without 404s
- [ ] **Breadcrumbs Work**: Breadcrumb links navigate correctly
- [ ] **Back Buttons Work**: Browser back button works, doesn't cause state issues
- [ ] **URL Direct Access**: Can type `/documents/upload`, `/sow/command-center`, etc. directly and page loads

## ⚠️ PERFORMANCE VALIDATION (< 1s load times)
- [ ] **Dashboard Loads Fast**: < 800ms to first paint
- [ ] **SOW List Fast**: < 600ms to render all 8 SOWs
- [ ] **Contract Analyzer Upload**: < 2s to load analyzer interface
- [ ] **No Hanging Pages**: No timeouts on any critical route
- [ ] **Network Tab Clean**: No failed requests (200s only, not 500s/404s)

## 🔐 SECURITY VALIDATION (No Exposed Secrets)
- [ ] **No JWT in Browser**: JWT tokens not logged to console
- [ ] **No API Keys Exposed**: Search for hardcoded API keys (should find 0)
- [ ] **Auth Required Where Needed**: Protected routes enforce auth (except demo mode)
- [ ] **Demo Mode Safe**: Demo bypass only in demo mode, not default

## 📊 DEMO READINESS VALIDATION (Final Checks)
- [ ] **Page Load Order**: Dashboard → SOW List → Contract Analyzer → Multi-Lens works end-to-end
- [ ] **Click Path Works**: Can complete user journey without errors: Browse File → Upload → Analyze → View by Role
- [ ] **No Console Errors**: Browser console has 0 errors (warnings OK)
- [ ] **Network Requests Clean**: No 500 errors, all API calls return data
- [ ] **UI Renders Correctly**: No broken layouts, missing icons, misaligned text
- [ ] **Dark Theme Consistent**: All pages use luxury automotive-grade dark theme
- [ ] **Responsiveness**: Dashboard/pages render well at different zoom levels

---

## 🔍 RUNNING VALIDATION

### Option 1: Manual Checklist (2 min)
Go through checklist above systematically, click each feature

### Option 2: Automated Script (Optional)
```bash
npm run validate
```
(Currently in development - uses src/utils/platform-validation.ts framework)

---

## 🚨 IF ANY CHECK FAILS

**STOP DEMO.** Root cause analysis required:

1. **Stub Page?** Check if page imports real components (not just UI)
2. **Data Not Loading?** Check Network tab → API response → database query
3. **Route 404?** Verify route exists in App.tsx AND component is imported
4. **Button Not Wired?** Search for `onClick` or `onSubmit` handlers
5. **Role Filtering Broken?** Check stakeholder-filter.ts for role logic

---

## BEFORE EVERY DEMO

1. ✅ Run through CRITICAL PATH section (top priority)
2. ✅ Click each sidebar menu item
3. ✅ Upload a test contract, select each role lens
4. ✅ Check Network tab has no red (500) errors
5. ✅ Check Console tab has no red (error) messages
6. ✅ Do quick calculation validation (budget = sum of invoices)
7. ✅ Try direct URL access: `/documents/upload`, `/sow/command-center`

**If all pass → Ready for demo**
**If any fail → Identify root cause before proceeding**
