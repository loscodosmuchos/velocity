# Business Logic Extraction & Recreation Guide

**Purpose**: Document the "how to get to this calculation" - the formulas, decision trees, and logic flows that make features work. Extract patterns like "options chooser" for easy recreation in other apps.

---

## **⚡ Quick Start: Run the Automation**

```bash
# Ensure docs/insights/ exists
chmod +x scripts/generate-documentation.sh
./scripts/generate-documentation.sh

# If missing files, copy prompt:
cat docs/AUTO_ANALYZER_PROMPT.md
# Then paste into AI assistant
```

---

## **🎯 What Gets Captured**

### **1. Calculations & Formulas**
Every mathematical operation in the codebase:
- How totals are computed
- How percentages are derived
- How costs are estimated
- How time is calculated
- How scores/ratings are determined

### **2. Decision Trees**
Every if/else, switch, or conditional logic:
- Status determinations
- Alert triggers
- Validation rules
- Access control
- Feature flags

### **3. Data Transformations**
Every data manipulation:
- Formatting (dates, currency, numbers)
- Aggregations (sum, average, max, min)
- Grouping (by date, category, status)
- Filtering (search, sort, pagination)
- Mapping (API response → UI display)

### **4. Reusable Patterns**
Complex UI/UX flows that work well:
- Options chooser / shopping cart builder
- Multi-step forms / wizards
- Approval workflows
- Bulk operations
- Import/export systems

---

## **📋 Template: Calculation Documentation**

### Example: Budget Remaining Calculation (REAL VIN EXAMPLE)

**Calculation Name**: Budget Remaining
**Location**: Calculated on-the-fly in API/UI layer (NOT stored in database)
**Used In**: Dashboard KPIs, PO Detail Page, Budget Tracking

**Plain English**:
```
Budget Remaining = Total PO Amount - Sum of Approved Timecards
```

**Actual Schema** (from `shared/schema.ts`):
```typescript
// Purchase Orders - stores budget in cents
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  vendor: text("vendor").notNull(),
  vendorId: integer("vendor_id").notNull().references(() => vendors.id),
  amount: integer("amount").notNull(), // ✅ CENTS: $250,000 = 25000000
  status: text("status").notNull(), // pending, approved, exhausted
  // ...
});

// Timecards - tracks spending against PO
export const timecards = pgTable("timecards", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id").notNull()
    .references(() => purchaseOrders.id),
  totalAmount: integer("total_amount").notNull(), // ✅ CENTS
  status: text("status").notNull(), // pending, approved, rejected
  // ...
});
```

**Calculation Implementation**:
```typescript
// Pseudocode for budget remaining
function calculateBudgetRemaining(po: PurchaseOrder, timecards: Timecard[]): number {
  // Filter to approved timecards only
  const approvedTimecards = timecards.filter(tc => tc.status === 'approved');
  
  // Sum spending (all amounts already in cents)
  const totalSpent = approvedTimecards.reduce((sum, tc) => sum + tc.totalAmount, 0);
  
  // Calculate remaining (still in cents)
  const remaining = po.amount - totalSpent;
  
  return remaining; // Can be negative if overspent
}

// Display formatting (convert cents → dollars)
function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

// Usage example
const remaining = calculateBudgetRemaining(po, timecards);
console.log(formatCurrency(remaining)); // "$125,450.00"
```

**Inputs**:
- `budgetAllocated`: number (stored as cents: integer)
- `approvedTimesheets`: array of timesheet objects with `total_amount` field

**Output**:
- Type: number (cents)
- Can be negative (indicates overspent)
- Display: Convert to dollars and format as currency

**Edge Cases**:
```typescript
// What if no budget allocated?
if (!po.budget_allocated) return 0;

// What if no timesheets?
if (timesheets.length === 0) return po.budget_allocated;

// What if overspent?
const remaining = budgetAllocated - totalSpent;
if (remaining < 0) {
  // Show as negative, add warning indicator
}

// What if soft-deleted timesheets?
// Filter: where(eq(timesheets.deleted_at, null))
```

**Dependencies**:
- Requires `purchase_orders` table with `budget_allocated` column
- Requires `timesheets` table with `total_amount` and `status` columns
- Assumes cents-based storage (divide by 100 for display)

**Testing Examples**:
```typescript
// Test 1: Normal case
budgetAllocated = 10000000 // $100,000 in cents
approvedTimesheets = [
  { total_amount: 4000000 }, // $40,000
  { total_amount: 2500000 }  // $25,000
]
expected = 3500000 // $35,000

// Test 2: Overspent
budgetAllocated = 5000000 // $50,000
approvedTimesheets = [
  { total_amount: 6000000 } // $60,000
]
expected = -1000000 // -$10,000 (overspent by $10k)

// Test 3: No timesheets yet
budgetAllocated = 10000000
approvedTimesheets = []
expected = 10000000 // Full budget available
```

**How to Recreate in Another App**:
```
1. Identify your "budget" entity (could be project budget, campaign spend, etc.)
2. Identify your "expense" entity (could be invoices, purchases, etc.)
3. Ensure both are in database
4. Create function to sum expenses
5. Subtract from budget
6. Handle edge cases (null, negative, no data)
7. Display with appropriate formatting
```

---

## **📋 Template: Decision Tree Documentation**

### Example: Alert Severity Determination

**Decision Name**: Alert Severity Level
**Location**: `server/utils/alerts.ts:34`
**Used In**: Dashboard Alerts, PO Detail, Budget Monitoring

**Logic Flow**:
```
INPUT: budgetUsedPercent (0.0 to 1.0+)

DECISION TREE:
├─ IF budgetUsedPercent >= 1.00 (100%)
│  └─ severity: "critical"
│     color: "red"
│     action: "Block new timesheets"
│     notification: "Immediate email to manager"
│
├─ ELSE IF budgetUsedPercent >= 0.90 (90%)
│  └─ severity: "warning"
│     color: "yellow"
│     action: "Notify manager daily"
│     notification: "Email + dashboard badge"
│
├─ ELSE IF budgetUsedPercent >= 0.80 (80%)
│  └─ severity: "info"
│     color: "blue"
│     action: "Show reminder in UI"
│     notification: "Dashboard badge only"
│
└─ ELSE
   └─ No alert needed
```

**Actual Implementation**:
```typescript
// Constants (define once, use everywhere)
const ALERT_THRESHOLDS = {
  INFO: 0.80,
  WARNING: 0.90,
  CRITICAL: 1.00
} as const;

type AlertSeverity = 'info' | 'warning' | 'critical' | null;

interface AlertConfig {
  severity: AlertSeverity;
  color: string;
  action: string;
  shouldNotify: boolean;
  notificationMethod: string[];
}

function determineAlertSeverity(
  budgetUsed: number,
  budgetTotal: number
): AlertConfig {
  const usedPercent = budgetTotal > 0 ? budgetUsed / budgetTotal : 0;
  
  if (usedPercent >= ALERT_THRESHOLDS.CRITICAL) {
    return {
      severity: 'critical',
      color: 'red',
      action: 'block_timesheets',
      shouldNotify: true,
      notificationMethod: ['email', 'sms', 'dashboard']
    };
  }
  
  if (usedPercent >= ALERT_THRESHOLDS.WARNING) {
    return {
      severity: 'warning',
      color: 'yellow',
      action: 'notify_daily',
      shouldNotify: true,
      notificationMethod: ['email', 'dashboard']
    };
  }
  
  if (usedPercent >= ALERT_THRESHOLDS.INFO) {
    return {
      severity: 'info',
      color: 'blue',
      action: 'show_reminder',
      shouldNotify: false,
      notificationMethod: ['dashboard']
    };
  }
  
  return {
    severity: null,
    color: 'gray',
    action: 'none',
    shouldNotify: false,
    notificationMethod: []
  };
}
```

**Thresholds** (configurable):
```typescript
// Store in environment or config file
export const ALERT_CONFIG = {
  thresholds: {
    info: Number(process.env.ALERT_THRESHOLD_INFO) || 0.80,
    warning: Number(process.env.ALERT_THRESHOLD_WARNING) || 0.90,
    critical: Number(process.env.ALERT_THRESHOLD_CRITICAL) || 1.00
  },
  actions: {
    critical: 'block_timesheets',
    warning: 'notify_daily',
    info: 'show_reminder'
  }
};
```

**How to Recreate**:
```
1. Define your threshold constants
2. Create AlertConfig type/interface
3. Implement decision function
4. Add to your monitoring/alert system
5. Configure notification methods
6. Test all threshold boundaries
```

---

## **🛒 Pattern Deep-Dive: Options Chooser / Cart Builder**

### **Pattern Name**: Shopping Cart / Package Builder with Cost & Time Estimation

**Real-World Use Cases**:
- Software feature selection (choose modules, see price)
- Service package builder (choose services, estimate delivery time)
- Product configurator (choose options, see total cost)
- Training course builder (select courses, see hours + cost)
- Project scope builder (select deliverables, estimate timeline)

---

### **🎯 Core Functionality**

**What It Does**:
1. Display available options (products, features, services)
2. Allow user to select/deselect items
3. Calculate running totals (cost, time, quantity)
4. Show summary/cart view
5. Allow checkout/submission
6. Generate quote/invoice/order

**UI Components**:
- Option grid/list (cards showing available items)
- Selection indicator (checkbox, toggle, +/- buttons)
- Running total display (sticky footer or sidebar)
- Cart summary (itemized list)
- Checkout modal/page

---

### **📊 Data Structure**

```typescript
// The available options (catalog)
interface AvailableOption {
  id: string;
  name: string;
  description: string;
  baseCost: number;              // In cents
  timeEstimate: number;          // In hours
  category: string;              // For grouping
  dependencies?: string[];       // IDs of required options
  incompatibleWith?: string[];   // IDs of mutually exclusive options
  thumbnail?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

// User's selections
interface SelectedOption extends AvailableOption {
  quantity: number;              // For items that can be selected multiple times
  customizations?: Record<string, any>;  // Size, color, etc.
  addedAt: Date;
}

// Cart state
interface CartState {
  items: SelectedOption[];
  subtotal: number;              // Sum of all item costs
  tax: number;                   // Calculated tax
  discount: number;              // Applied discounts
  total: number;                 // Final total
  estimatedTime: number;         // Sum of all time estimates
  estimatedCompletionDate: Date; // Based on start date + time
  notes?: string;                // User notes
}
```

---

### **🧮 Calculation Logic**

**Subtotal Calculation**:
```typescript
function calculateSubtotal(items: SelectedOption[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.baseCost * item.quantity);
  }, 0);
}
```

**Time Estimation**:
```typescript
function calculateTotalTime(items: SelectedOption[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.timeEstimate * item.quantity);
  }, 0);
}

// With dependency adjustment (some items take less time when combined)
function calculateOptimizedTime(items: SelectedOption[]): number {
  let totalTime = 0;
  
  items.forEach(item => {
    let itemTime = item.timeEstimate * item.quantity;
    
    // Check for synergies (e.g., "Setup" is shared across multiple items)
    if (item.category === 'setup') {
      // Setup time doesn't multiply by quantity
      itemTime = item.timeEstimate;
    }
    
    totalTime += itemTime;
  });
  
  return totalTime;
}
```

**Completion Date Estimation**:
```typescript
function estimateCompletionDate(
  startDate: Date,
  totalHours: number,
  workHoursPerDay: number = 8
): Date {
  const businessDays = Math.ceil(totalHours / workHoursPerDay);
  
  // Add business days (skip weekends)
  let currentDate = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  return currentDate;
}
```

**Tax & Discount Logic**:
```typescript
function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return Math.round(subtotal * taxRate); // Round to nearest cent
}

function applyDiscount(
  subtotal: number,
  discountCode?: string
): { discount: number; discountDescription: string } {
  // Example discount logic
  const DISCOUNTS: Record<string, { percent: number; description: string }> = {
    'SAVE10': { percent: 0.10, description: '10% off' },
    'SAVE20': { percent: 0.20, description: '20% off' },
    'BULK': { percent: 0.15, description: '15% bulk discount' }
  };
  
  if (discountCode && DISCOUNTS[discountCode]) {
    const { percent, description } = DISCOUNTS[discountCode];
    return {
      discount: Math.round(subtotal * percent),
      discountDescription: description
    };
  }
  
  // Auto-apply bulk discount for large orders
  if (subtotal >= 100000) { // $1,000+
    return {
      discount: Math.round(subtotal * 0.10),
      discountDescription: 'Automatic 10% bulk discount'
    };
  }
  
  return { discount: 0, discountDescription: '' };
}

function calculateFinalTotal(
  subtotal: number,
  tax: number,
  discount: number
): number {
  return subtotal + tax - discount;
}
```

---

### **⚡ State Management**

**Using React Hooks**:
```typescript
function useCart() {
  const [items, setItems] = useState<SelectedOption[]>([]);
  
  // Add item to cart
  const addItem = useCallback((option: AvailableOption) => {
    setItems(prev => {
      // Check if already in cart
      const existing = prev.find(item => item.id === option.id);
      
      if (existing) {
        // Increment quantity
        return prev.map(item =>
          item.id === option.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new item
      return [...prev, { ...option, quantity: 1, addedAt: new Date() }];
    });
  }, []);
  
  // Remove item from cart
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  // Update quantity
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  }, [removeItem]);
  
  // Calculate totals
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const estimatedTime = useMemo(() => calculateTotalTime(items), [items]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const { discount, discountDescription } = useMemo(() => 
    applyDiscount(subtotal), [subtotal]
  );
  const total = useMemo(() => 
    calculateFinalTotal(subtotal, tax, discount), [subtotal, tax, discount]
  );
  
  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    discount,
    discountDescription,
    total,
    estimatedTime,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}
```

---

### **🎨 UI Components**

**Option Card** (selectable item):
```typescript
interface OptionCardProps {
  option: AvailableOption;
  isSelected: boolean;
  onToggle: () => void;
}

function OptionCard({ option, isSelected, onToggle }: OptionCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggle}
              className="h-5 w-5"
            />
            <h3 className="font-semibold">{option.name}</h3>
            {option.isPopular && (
              <Badge color="blue">Popular</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
        </div>
        
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-blue-600">
            ${(option.baseCost / 100).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {option.timeEstimate} hours
          </div>
        </div>
      </div>
    </Card>
  );
}
```

**Cart Summary** (sticky sidebar or footer):
```typescript
interface CartSummaryProps {
  items: SelectedOption[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  estimatedTime: number;
  onCheckout: () => void;
}

function CartSummary({
  items,
  subtotal,
  tax,
  discount,
  total,
  estimatedTime,
  onCheckout
}: CartSummaryProps) {
  return (
    <Card className="sticky top-4">
      <Title>Cart Summary</Title>
      
      <div className="mt-4 space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>${((item.baseCost * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <Divider />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${(subtotal / 100).toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${(discount / 100).toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${(tax / 100).toFixed(2)}</span>
        </div>
        
        <Divider />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-blue-600">${(total / 100).toFixed(2)}</span>
        </div>
        
        <div className="text-sm text-gray-600">
          Estimated time: {estimatedTime} hours (~{Math.ceil(estimatedTime / 8)} days)
        </div>
      </div>
      
      <Button 
        onClick={onCheckout}
        className="w-full mt-4"
        disabled={items.length === 0}
      >
        Proceed to Checkout ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Button>
    </Card>
  );
}
```

---

### **📦 Complete Recreation Recipe**

**Time Required**: ~6-8 hours for full implementation

**Step 1: Define Data Structures** (30 min)
```typescript
// Copy interfaces from above
// Customize fields for your use case
```

**Step 2: Create Cart Hook** (1 hour)
```typescript
// Copy useCart hook from above
// Add any custom logic (dependencies, incompatibilities)
```

**Step 3: Build Option Card Component** (1 hour)
```typescript
// Copy OptionCard component
// Style to match your design system
```

**Step 4: Build Cart Summary Component** (1 hour)
```typescript
// Copy CartSummary component
// Add discount code input if needed
```

**Step 5: Create Main Page** (2 hours)
```typescript
function PackageBuilderPage() {
  const cart = useCart();
  const [availableOptions, setAvailableOptions] = useState<AvailableOption[]>([]);
  
  // Fetch available options
  useQuery({
    queryKey: ['/api/options'],
    onSuccess: (data) => setAvailableOptions(data)
  });
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Options Grid (2/3 width) */}
      <div className="lg:col-span-2">
        <Title>Choose Your Options</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {availableOptions.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={cart.items.some(item => item.id === option.id)}
              onToggle={() => {
                const isSelected = cart.items.some(item => item.id === option.id);
                isSelected ? cart.removeItem(option.id) : cart.addItem(option);
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Cart Summary (1/3 width) */}
      <div>
        <CartSummary
          items={cart.items}
          subtotal={cart.subtotal}
          tax={cart.tax}
          discount={cart.discount}
          total={cart.total}
          estimatedTime={cart.estimatedTime}
          onCheckout={() => {/* Handle checkout */}}
        />
      </div>
    </div>
  );
}
```

**Step 6: Add Backend API** (1 hour)
```typescript
// GET /api/options - Return available options
app.get('/api/options', async (req, res) => {
  const options = await storage.getAvailableOptions();
  res.json(options);
});

// POST /api/checkout - Process cart
app.post('/api/checkout', async (req, res) => {
  const { items, total, estimatedTime } = req.body;
  
  // Validate
  const calculatedTotal = calculateFinalTotal(/* ... */);
  if (calculatedTotal !== total) {
    return res.status(400).json({ error: 'Total mismatch' });
  }
  
  // Create order
  const order = await storage.createOrder({
    items,
    total,
    estimatedTime,
    userId: req.user.id
  });
  
  res.json(order);
});
```

**Step 7: Add Persistence** (Optional, 30 min)
```typescript
// Save cart to localStorage
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(items));
}, [items]);

// Restore cart on mount
useEffect(() => {
  const saved = localStorage.getItem('cart');
  if (saved) {
    setItems(JSON.parse(saved));
  }
}, []);
```

**Step 8: Add Validation** (1 hour)
```typescript
// Check dependencies
function validateSelection(
  items: SelectedOption[],
  newItem: AvailableOption
): { valid: boolean; error?: string } {
  // Check dependencies
  if (newItem.dependencies) {
    const hasAllDependencies = newItem.dependencies.every(depId =>
      items.some(item => item.id === depId)
    );
    
    if (!hasAllDependencies) {
      return {
        valid: false,
        error: `This option requires: ${newItem.dependencies.join(', ')}`
      };
    }
  }
  
  // Check incompatibilities
  if (newItem.incompatibleWith) {
    const hasIncompatible = items.some(item =>
      newItem.incompatibleWith?.includes(item.id)
    );
    
    if (hasIncompatible) {
      return {
        valid: false,
        error: 'This option is incompatible with items in your cart'
      };
    }
  }
  
  return { valid: true };
}
```

**Step 9: Test** (1 hour)
```typescript
// Test all scenarios
- Add item → totals update
- Remove item → totals update
- Change quantity → totals update
- Apply discount code → discount applied
- Dependencies → can't add without prerequisite
- Incompatibilities → can't add conflicting items
- Checkout → creates order
- Persistence → cart survives page refresh
```

---

### **✅ Testing Checklist**

- [ ] Can add items to cart
- [ ] Can remove items from cart
- [ ] Can change quantities
- [ ] Subtotal calculates correctly
- [ ] Tax calculates correctly
- [ ] Discount applies correctly
- [ ] Total is accurate
- [ ] Time estimate is reasonable
- [ ] Completion date accounts for weekends
- [ ] Dependencies enforce correctly
- [ ] Incompatibilities prevent conflicts
- [ ] Cart persists across page refresh
- [ ] Checkout validation works
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, screen readers)

---

### **🚀 Variations & Extensions**

**Volume Discounts**:
```typescript
function applyVolumeDiscount(items: SelectedOption[]): number {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalQuantity >= 100) return 0.20; // 20% off
  if (totalQuantity >= 50) return 0.15;  // 15% off
  if (totalQuantity >= 10) return 0.10;  // 10% off
  
  return 0;
}
```

**Tiered Pricing**:
```typescript
function getTieredPrice(quantity: number, basePrice: number): number {
  if (quantity >= 100) return basePrice * 0.70; // 30% off per unit
  if (quantity >= 50) return basePrice * 0.80;  // 20% off per unit
  if (quantity >= 10) return basePrice * 0.90;  // 10% off per unit
  
  return basePrice;
}
```

**Subscription Model**:
```typescript
interface SubscriptionOption extends AvailableOption {
  recurringCost: number;  // Monthly cost
  setupFee: number;       // One-time fee
  commitmentMonths: number; // Minimum contract
}

function calculateSubscriptionCost(
  option: SubscriptionOption,
  months: number
): { setupFee: number; recurringTotal: number; total: number } {
  return {
    setupFee: option.setupFee,
    recurringTotal: option.recurringCost * months,
    total: option.setupFee + (option.recurringCost * months)
  };
}
```

---

**Last Updated**: 2025-11-18
**Version**: 1.0
**Ready to Copy-Paste**: Yes
