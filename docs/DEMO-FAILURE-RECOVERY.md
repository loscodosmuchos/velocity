# DEMO FAILURE RECOVERY PLAN
**For Hyundai Demo - December 2025**

---

## 🚨 IF SOMETHING BREAKS DURING DEMO

### ❌ Dashboard Hangs/Doesn't Load

**If**: Dashboard takes >10 seconds or shows loading spinner  
**Do**: 
1. Press `Ctrl+Shift+R` (hard refresh in browser)
2. Wait 3 seconds, click Dashboard link again
3. If still slow: Say "Database is warming up - let me skip to the next step" and go to Step 2

**Backup**: Have `/admin/demo-command-center` in second browser tab ready to click next step

---

### ❌ Document Upload Fails (Step 2)

**If**: PDF upload button doesn't work or "Extract Failed" message  
**Do**:
1. Say "Let me show you the extracted data from a pre-analyzed document"
2. Click "Browse" and select from existing uploads (if available)
3. OR skip Step 2 entirely: "The document is already analyzed, let me show you the results"
4. Go to Step 3 (SOW List)

**Backup**: Have a SOW already pulled up with all details visible

---

### ❌ Role Switcher Breaks

**If**: Can't switch between Ben/Wes/CFO/Mark personas  
**Do**:
1. Hard refresh page (`Ctrl+Shift+R`)
2. If still broken: Say "Let me open the CFO dashboard directly" and type `/` then navigate
3. Click through each dashboard using direct URLs instead of the switcher

**Direct URLs**:
- Ben: `/` (default)
- Wes: `/` + select Wes from shield icon
- CFO: `/` + select CFO from shield icon  
- Mark: `/` + select Mark from shield icon

---

### ❌ API Timeout / Slow Response (>5 seconds)

**If**: Any page takes >5 seconds to load  
**Do**:
1. Say "The database is under load - let me navigate to a cached view"
2. Go to `/admin/demo-command-center` (should load instantly - it's cached)
3. Click next step
4. Skip or retry the slow page

**Why it works**: Demo Command Center is pre-rendered and doesn't fetch live data

---

### ❌ Demo Mode Disabled / Can't Access `/admin/demo-command-center`

**If**: Get "Unauthorized" or "Password Required"  
**Do**:
1. Type password (if prompted): `[admin password goes here]`
2. If password doesn't work: Open Architect Command Center instead (`/admin/architect-command-center`)
3. Use that as fallback demo guide

---

### ❌ Contractor/SOW Details Page Shows No Data

**If**: Click on contractor and page is empty  
**Do**:
1. Go back to list
2. Try clicking a different contractor
3. If all empty: Say "Let me demonstrate the data export instead" and show Download button
4. Fall back to Dashboard view (always has summary data)

---

### ❌ Multi-Lens Analyzer Shows Error

**If**: "Extraction Failed" or "Processing Error"  
**Do**:
1. Say "Let me show you a pre-analyzed document with all lenses extracted"
2. Click "Recent Documents" and select a completed analysis
3. Show the Legal/Financial/Operational/Vendor/Compliance breakdown

---

## 🎯 DEMO FLOW BACKUP PLAN

**If any single step fails:**

1. **Step 1 broken** → Skip to Step 2
2. **Step 2 broken** → Skip to Step 3
3. **Step 3 broken** → Skip to Step 4
4. **Step 4 broken** → Skip to Step 5
5. **Step 5 broken** → Skip to Step 6
6. **Step 6 broken** → Go back to Dashboard

**ALWAYS SAY**: "Let me show you the next part of the platform" - never dwell on failures.

---

## ✅ HEALTH CHECK (Before Demo Starts)

**Run this 5 minutes before demo:**

```
1. Visit https://[your-domain]/admin/demo-command-center
   → Should load in <2 seconds ✓
   
2. Click Dashboard link (Step 1)
   → Should load in <3 seconds, show real data ✓
   
3. Click Documents upload (Step 2)
   → Should show file upload form ✓
   
4. Go to SOW list
   → Should show 8+ SOWs ✓
   
5. Click one SOW → Click a contractor
   → Should show details ✓
   
6. Toggle role switcher (shield icon)
   → Should switch between Ben/Wes/CFO/Mark ✓
```

If all 6 pass → **Demo ready**  
If 1-2 fail → Use backup plans above  
If 3+ fail → **POSTPONE DEMO** (contact support)

---

## 📞 EMERGENCY CONTACTS

- **Replit Support**: [platform status page]
- **Database**: Check `/api/health` endpoint (should return 200 OK)
- **Admin Panel**: Try `/admin/architect-command-center` as alternative

---

## 💡 PRO TIPS

1. **Pre-open tabs**: Have `/admin/demo-command-center` and Dashboard open in 2 tabs
2. **Slow API**: If response slow, start talking while it loads (don't look awkward)
3. **Skip documents**: If PDF extraction takes too long, skip to next step
4. **Show cached data**: Demo Command Center and Dashboard are fastest (use these)
5. **End strong**: If anything fails, always end on Dashboard showing KPIs (most impressive)

---

## AFTER DEMO OPTIMIZATION (Post-Holiday)

- Add database indexes on `contractor_id`, `sow_id`, `department_id`
- Implement API caching layer (Redis)
- Pre-compute SOW/PO aggregations
- Optimize contractor query (currently 65KB payload)

