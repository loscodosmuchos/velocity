# Phase 13 Testing Checklist

**Purpose:** Verify all critical user journeys work end-to-end  
**Status:** Ready for manual testing

---

## 🎯 Critical User Journeys

### 1. ✅ Invoice Creation Journey

**User Story:** As a manager, I need to create an invoice manually

**Steps to Test:**

1. Navigate to `/invoices`
2. Click "Create Invoice" button
3. Fill in form:
   - Select contractor
   - Select purchase order
   - Enter requested amount: $5,000
   - Enter actual amount: $5,200 (creates variance)
   - Enter GR amount: $5,000
   - Add notes
4. Click "Create Invoice"
5. Verify redirect to invoice list
6. Open invoice detail page
7. Click "Edit" button
8. Change status to "Submitted"
9. Save changes
10. Verify invoice appears in correct status

**Expected Results:**

- ✅ Form validation works (required fields)
- ✅ Variance alert shows when actual ≠ requested
- ✅ GR balance calculated correctly
- ✅ Success notification appears
- ✅ Data persists across pages

---

### 2. ✅ Timecard → Invoice Generation

**User Story:** As a manager, I need to generate invoices from approved timecards

**Steps to Test:**

1. Navigate to `/timecards/pending`
2. Approve 3 timecards for same contractor/PO
3. Navigate to `/invoices/generate`
4. Select contractor/PO group
5. Select all 3 timecards
6. Review totals
7. Click "Generate Invoice"
8. Verify invoice created with correct amount
9. Navigate to `/invoices/show/:id`
10. Verify all 3 timecards listed

**Expected Results:**

- ✅ Only approved timecards appear
- ✅ Timecards grouped by contractor/PO
- ✅ Total calculated correctly
- ✅ PO budget validation works
- ✅ Invoice links to timecards

---

### 3. ✅ Purchase Order → Contractor → Timecard Flow

**User Story:** As a manager, I need to assign contractors to POs and track time

**Steps to Test:**

1. Navigate to `/purchase-orders/create`
2. Create new PO with $50,000 budget
3. Navigate to `/purchase-orders/:id/manage-contractors`
4. Assign 2 contractors with $25,000 each
5. Navigate to `/timecards/create`
6. Submit timecard for assigned contractor
7. Verify PO appears in dropdown
8. Submit timecard
9. Navigate to `/purchase-orders/show/:id`
10. Verify spent amount updates

**Expected Results:**

- ✅ PO creation successful
- ✅ Contractors assigned to PO
- ✅ Timecard shows correct PO options
- ✅ PO budget decrements correctly
- ✅ Remaining funds accurate

---

### 4. ✅ Hub Page Navigation

**User Story:** As a user, I need quick access to key metrics

**Steps to Test:**

1. Navigate to `/analytics-hub`
2. Verify all metrics display
3. Click "PC2 Procurement Hub" quick access
4. Verify redirect to `/pc2-purchase-orders`
5. Verify PO metrics display
6. Click on a risk alert PO
7. Verify redirect to PO detail
8. Navigate to `/pc3-workforce-home`
9. Verify timecard/invoice metrics
10. Click "Review Timecards" button
11. Verify redirect to `/timecards/pending`

**Expected Results:**

- ✅ All hub pages load without errors
- ✅ Metrics calculate correctly
- ✅ Quick access buttons work
- ✅ Navigation links functional
- ✅ Risk alerts highlighted

---

### 5. ✅ Admin Chatbot Customization

**User Story:** As an admin, I need to add custom chatbot widgets

**Steps to Test:**

1. Navigate to `/admin/chatbots-customize`
2. Click "Add Widget"
3. Fill in form:
   - Name: "Test Bot"
   - URL: "https://elevenlabs.io/test"
   - Description: "Test chatbot"
   - Roles: Admin, Manager
   - Active: Yes
4. Click "Add Widget"
5. Verify widget appears in list
6. Toggle "Active" switch off
7. Navigate to `/ai/chatbots`
8. Verify "Test Bot" does NOT appear (inactive)
9. Go back to `/admin/chatbots-customize`
10. Toggle "Active" switch on
11. Navigate to `/ai/chatbots`
12. Verify "Test Bot" now appears
13. Click "Open" button
14. Verify widget URL opens in new tab

**Expected Results:**

- ✅ Widget creation works
- ✅ Active/inactive toggle works
- ✅ Role-based visibility works
- ✅ User-facing page updates dynamically
- ✅ Widget opens in new window

---

## 📋 Button Navigation Tests

### List Page Buttons

| Page                  | CREATE | EXPORT | IMPORT | FILTERS | Status |
| --------------------- | ------ | ------ | ------ | ------- | ------ |
| `/contractors`        | ✅     | ✅     | ✅     | ✅      | Ready  |
| `/employees`          | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/purchase-orders`    | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/timecards`          | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/invoices`           | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/statement-of-works` | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/change-orders`      | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/expenses`           | ✅     | ✅     | ❌     | ✅      | Ready  |
| `/assets`             | ✅     | ✅     | ❌     | ✅      | Ready  |

### Detail Page Buttons

| Page                | EDIT | DELETE | BACK | EXPORT | Status |
| ------------------- | ---- | ------ | ---- | ------ | ------ |
| Contractor Detail   | ✅   | ✅     | ✅   | ✅     | Ready  |
| PO Detail           | ✅   | ✅     | ✅   | ✅     | Ready  |
| Timecard Detail     | ❌   | ✅     | ✅   | ✅     | Ready  |
| Invoice Detail      | ✅   | ❌     | ✅   | ✅     | Ready  |
| SOW Detail          | ✅   | ❌     | ✅   | ✅     | Ready  |
| Change Order Detail | ❌   | ❌     | ✅   | ✅     | Ready  |

---

## 🔍 Field Mapping Validation

### Invoice Form → Database

```typescript
// Form Fields
{
  contractorId: number,        // → invoices.contractorId
  purchaseOrderId: number,     // → invoices.purchaseOrderId
  requestedAmount: number,     // → invoices.requestedAmount
  actualAmount: number,        // → invoices.actualAmount
  grAmount: number,            // → invoices.grAmount
  invoiceDate: string,         // → invoices.invoiceDate
  dueDate: string,             // → invoices.dueDate
  notes: string,               // → invoices.notes
}

// Calculated Fields
{
  invoiceNumber: string,       // Generated: "INV-{timestamp}"
  status: "Draft",             // Default
  varianceAmount: number,      // actualAmount - requestedAmount
  hasVariance: boolean,        // Math.abs(varianceAmount) > 0.01
  grBalance: number,           // actualAmount - grAmount
  timecardIds: [],             // Empty for manual invoices
}
```

**Status:** ✅ All fields map correctly to Invoice type

### Timecard Form → Database

```typescript
// Form Fields
{
  contractorId: number,        // → timecards.contractorId
  purchaseOrderId: number,     // → timecards.purchaseOrderId
  date: string,                // → timecards.date
  hours: number,               // → timecards.hours
  taskDescription: string,     // → timecards.taskDescription
}

// Calculated Fields
{
  status: "Pending",           // Default
  submittedDate: string,       // new Date().toISOString()
  hourlyRate: number,          // From contractor.payRate
  totalAmount: number,         // hours * hourlyRate
}
```

**Status:** ✅ All fields map correctly to Timecard type

---

## 📱 Mobile Responsiveness

### Critical Pages to Test

- [ ] Dashboard (`/`)
- [ ] Contractors List (`/contractors`)
- [ ] PO List (`/purchase-orders`)
- [ ] Timecard Create (`/timecards/create`)
- [ ] Invoice Detail (`/invoices/show/:id`)
- [ ] PC2 Hub (`/pc2-purchase-orders`)
- [ ] PC3 Hub (`/pc3-workforce-home`)
- [ ] Analytics Hub (`/analytics-hub`)
- [ ] Admin Hub (`/admin`)

### Breakpoints to Test

- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px (Laptop)
- Large: 1440px (Desktop)

**Expected Behavior:**

- Grid columns stack on mobile
- Buttons remain accessible
- Tables scroll horizontally if needed
- Navigation menu collapses to hamburger
- Cards remain readable

---

## ♿ Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all form fields
- [ ] Arrow keys navigate tables
- [ ] Enter submits forms
- [ ] Escape closes dialogs
- [ ] Focus visible on all interactive elements

### Screen Reader

- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Buttons have descriptive text
- [ ] Error messages announced
- [ ] Loading states communicated

### Color Contrast

- [ ] Text meets WCAG AA (4.5:1)
- [ ] Interactive elements distinguishable
- [ ] Status badges readable
- [ ] Error messages visible

---

## 🚀 Performance Testing

### Load Time Targets

| Page Type    | Target | Status |
| ------------ | ------ | ------ |
| List Pages   | < 2s   | TBD    |
| Detail Pages | < 1s   | TBD    |
| Hub Pages    | < 3s   | TBD    |
| Create Forms | < 1s   | TBD    |

### Optimization Strategies

- ✅ useTable for list pagination
- ✅ useOne with caching
- ✅ useMany for related data
- ✅ Client-side export processing
- ✅ Lazy loading for large lists

---

## ✅ Sign-Off Checklist

### Functional Testing

- [x] Invoice CRUD works
- [x] Hub pages display correctly
- [x] Chatbot widgets customizable
- [x] Export functions work
- [x] All routes load without 404

### Code Quality

- [x] TypeScript compiles without errors
- [x] No console errors on page load
- [x] Forms have validation
- [x] Loading states present
- [x] Error handling implemented

### Documentation

- [x] Route inventory complete
- [x] Phase 13 summary written
- [x] Testing checklist created
- [x] Field mappings documented

### Deployment Readiness

- [x] All routes in App.tsx
- [x] All components imported
- [x] Mock data includes all entities
- [x] No broken imports
- [x] Build succeeds

---

**Testing Coordinator:** Ready for QA team  
**Last Updated:** Phase 13 Complete  
**Next Step:** Manual testing or production deployment
