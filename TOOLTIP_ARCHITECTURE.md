# Velocity Tooltip Architecture
**Site-Wide Contextual Information System**

> *"Every piece of data worthy of showing should be worthy of showing MORE on hover."*

## Overview
Velocity implements a universal tooltip infrastructure where **every database-backed element** can reveal rich contextual information on hover. This supports executive triage workflows by providing instant depth without forced navigation.

---

## Core Philosophy

### The Tooltip Principle
If data is important enough to display to the user, it's important enough to provide additional context on demand.

**Examples:**
- Department name → Role breakdown, budget, headcount
- Contractor name → Equipment, tenure, performance, manager
- Budget number → Trend chart, variance, forecast
- Equipment item → Model, serial, assignment date, warranty

### Why Universal Tooltips?

**User Benefits:**
- ✅ **Instant context** without navigation
- ✅ **Triage support** - Assess priority before clicking
- ✅ **Reduced cognitive load** - No need to remember what each number means
- ✅ **Privacy-aware** - Details only on intentional hover

**Business Benefits:**
- ✅ **Faster decision-making** - All info at fingertips
- ✅ **Reduced training time** - Self-documenting interface
- ✅ **Increased productivity** - Less navigation, more insight
- ✅ **Better compliance** - Audit trails visible on hover

---

## Architecture Design

### Universal TooltipWrapper Component

```tsx
// src/components/universal-tooltip-wrapper.tsx

interface TooltipWrapperProps {
  children: React.ReactNode;
  entityType: 'department' | 'contractor' | 'equipment' | 'metric' | 'po' | 'invoice' | 'timecard';
  entityId: string;
  data?: any; // Pre-loaded data (optional)
  lazyLoad?: boolean; // Fetch on hover (default: false)
}

export function TooltipWrapper({ 
  children, 
  entityType, 
  entityId, 
  data, 
  lazyLoad = false 
}: TooltipWrapperProps) {
  const [tooltipData, setTooltipData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleHover = async () => {
    if (lazyLoad && !tooltipData) {
      setIsLoading(true);
      const fetchedData = await fetchTooltipData(entityType, entityId);
      setTooltipData(fetchedData);
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild onMouseEnter={handleHover}>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-md p-0 bg-white border-2 shadow-2xl rounded-lg"
        >
          {isLoading ? (
            <TooltipSkeleton />
          ) : (
            <TooltipRenderer 
              type={entityType} 
              data={tooltipData} 
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### TooltipRenderer (Type-Specific Content)

```tsx
function TooltipRenderer({ type, data }: { type: EntityType, data: any }) {
  switch(type) {
    case 'department':
      return <DepartmentTooltip data={data} />;
    case 'contractor':
      return <ContractorTooltip data={data} />;
    case 'equipment':
      return <EquipmentTooltip data={data} />;
    case 'metric':
      return <MetricTooltip data={data} />;
    case 'po':
      return <POTooltip data={data} />;
    case 'invoice':
      return <InvoiceTooltip data={data} />;
    case 'timecard':
      return <TimecardTooltip data={data} />;
    default:
      return <GenericTooltip data={data} />;
  }
}
```

---

## Tooltip Content Patterns

### 1. Department Tooltip

**Hover over**: "Engineering" department label

**Shows:**
```tsx
<DepartmentTooltip>
  <Header>
    <Icon>⚙️</Icon>
    <Title>Engineering Department</Title>
    <Badge>25 Active</Badge>
  </Header>
  
  <Body>
    <RoleBreakdown>
      <RoleItem icon="🤖" label="AI/ML Specialists" count={12} />
      <RoleItem icon="💻" label="C++ Developers" count={8} />
      <RoleItem icon="🔧" label="Hardware Designers" count={5} />
    </RoleBreakdown>
    
    <BudgetChart 
      allocated="$2.4M" 
      spent="$1.8M" 
      remaining="$600K" 
    />
  </Body>
  
  <Footer>
    <Stat label="Avg Tenure" value="3.2 years" />
    <Stat label="Open Reqs" value="4" />
  </Footer>
</DepartmentTooltip>
```

**Visual:**
```
┌─────────────────────────────────┐
│ ⚙️ Engineering Department  [25] │
├─────────────────────────────────┤
│ Role Breakdown:                 │
│ 🤖 AI/ML Specialists      12    │
│ 💻 C++ Developers         8     │
│ 🔧 Hardware Designers     5     │
│                                 │
│ Budget: $2.4M allocated         │
│ [███████████░░░] 75% deployed   │
│                                 │
│ Avg Tenure: 3.2 years           │
│ Open Reqs: 4                    │
└─────────────────────────────────┘
```

### 2. Contractor Tooltip

**Hover over**: "John Martinez" contractor name

**Shows:**
```tsx
<ContractorTooltip>
  <Header>
    <Avatar src={avatar} />
    <Name>John Martinez</Name>
    <Department icon="⚙️">Engineering</Department>
  </Header>
  
  <Body>
    <Section title="Equipment Inventory">
      <EquipmentItem 
        icon="💻" 
        name="MacBook Pro M3 Max" 
        serial="C02XY1234" 
      />
      <EquipmentItem 
        icon="📱" 
        name="iPhone 15 Pro" 
        serial="DNPQR98765" 
      />
      <EquipmentItem 
        icon="🔌" 
        name="USB-C Thunderbolt Dock" 
        serial="TD-4829" 
      />
      <EquipmentItem 
        icon="🔐" 
        name="YubiKey 5 NFC" 
        serial="YK-9284729" 
      />
    </Section>
    
    <TenureBadge years={2.3} rank="Senior" color="blue" />
  </Body>
  
  <Footer>
    <Stat label="Start Date" value="Mar 15, 2023" />
    <Stat label="PO" value="PO-2847" />
    {isManager && <Stat label="Performance" value="Top 10%" />}
  </Footer>
</ContractorTooltip>
```

**Visual:**
```
┌─────────────────────────────────┐
│ 👤 John Martinez                │
│    ⚙️ Engineering               │
├─────────────────────────────────┤
│ Equipment Inventory:            │
│ 💻 MacBook Pro M3 Max           │
│    Serial: C02XY1234            │
│ 📱 iPhone 15 Pro                │
│    Serial: DNPQR98765           │
│ 🔌 USB-C Thunderbolt Dock       │
│    Serial: TD-4829              │
│ 🔐 YubiKey 5 NFC                │
│    Serial: YK-9284729           │
│                                 │
│ [2.3 years | Senior]            │
│                                 │
│ Start: Mar 15, 2023             │
│ PO: PO-2847                     │
│ Performance: Top 10% ⭐         │
└─────────────────────────────────┘
```

### 3. Budget Metric Tooltip

**Hover over**: "$1.4M" budget utilization number

**Shows:**
```tsx
<MetricTooltip>
  <Header>
    <Icon>💰</Icon>
    <Title>Budget Utilization</Title>
    <Value>$1.4M / $2.2M (63%)</Value>
  </Header>
  
  <Body>
    <TrendChart 
      data={last6Months} 
      height={120}
      showForecast={true}
    />
    
    <VarianceAnalysis>
      <Variance label="vs. Forecast" value="+$12K" trend="up" />
      <Variance label="vs. Last Month" value="-$8K" trend="down" />
    </VarianceAnalysis>
  </Body>
  
  <Footer>
    <RecommendedAction>
      Review Q4 contractor hours in Engineering dept
    </RecommendedAction>
  </Footer>
</MetricTooltip>
```

**Visual:**
```
┌─────────────────────────────────┐
│ 💰 Budget Utilization           │
│    $1.4M / $2.2M (63%)          │
├─────────────────────────────────┤
│ 6-Month Trend:                  │
│     ╱                           │
│    ╱                            │
│   ╱    ╱╲                       │
│  ╱    ╱  ╲  ╱                   │
│ ╱────╱────╲╱──── Forecast       │
│                                 │
│ Variance:                       │
│ vs. Forecast:   +$12K ⬆️        │
│ vs. Last Month: -$8K ⬇️         │
│                                 │
│ 💡 Review Q4 contractor hours   │
│    in Engineering dept          │
└─────────────────────────────────┘
```

### 4. Hiring Manager Tooltip

**Hover over**: "Sarah Chen" (hiring manager name)

**Shows:**
```tsx
<HiringManagerTooltip>
  <Header>
    <Avatar src={avatar} />
    <Name>Sarah Chen</Name>
    <Role>Engineering Manager</Role>
  </Header>
  
  <Body>
    <Section title="Team Overview">
      <Stat label="Direct Reports" value="12" />
      <Stat label="Active Contractors" value="8" />
      <Stat label="Open Reqs" value="3" />
    </Section>
    
    <Section title="Budget">
      <BudgetBar 
        allocated="$1.8M" 
        spent="$1.2M" 
        remaining="$600K" 
      />
    </Section>
    
    <Section title="Open Requisitions">
      <ReqItem title="Senior AI/ML Engineer" level="L5" />
      <ReqItem title="Hardware Designer" level="L4" />
      <ReqItem title="C++ Developer" level="L3" />
    </Section>
  </Body>
</HiringManagerTooltip>
```

### 5. Equipment Item Tooltip

**Hover over**: "MacBook Pro M3" in equipment list

**Shows:**
```tsx
<EquipmentTooltip>
  <Header>
    <Icon>💻</Icon>
    <Model>MacBook Pro 16" M3 Max</Model>
  </Header>
  
  <Body>
    <Specs>
      <Spec label="Processor" value="M3 Max (16-core)" />
      <Spec label="RAM" value="64GB" />
      <Spec label="Storage" value="2TB SSD" />
    </Specs>
    
    <Assignment>
      <AssignedTo name="John Martinez" dept="Engineering" />
      <AssignDate>Mar 15, 2023</AssignDate>
    </Assignment>
    
    <Administrative>
      <Serial>C02XY1234</Serial>
      <PurchaseDate>Mar 1, 2023</PurchaseDate>
      <WarrantyExpires>Mar 1, 2026</WarrantyExpires>
      <Cost>$4,299</Cost>
    </Administrative>
  </Body>
</EquipmentTooltip>
```

---

## Data Schemas

### Tooltip Data Structure

```typescript
// Universal tooltip data schema
interface TooltipData {
  entityType: EntityType;
  entityId: string;
  header: {
    icon?: string;
    title: string;
    subtitle?: string;
    badge?: {
      text: string;
      variant: 'success' | 'warning' | 'danger' | 'info';
    };
  };
  sections: TooltipSection[];
  footer?: {
    stats?: { label: string; value: string }[];
    action?: { label: string; onClick: () => void };
  };
}

interface TooltipSection {
  id: string;
  title?: string;
  type: 'list' | 'chart' | 'stats' | 'breakdown' | 'custom';
  content: any; // Type-specific content
}
```

### Department Data Schema

```typescript
interface DepartmentTooltipData extends TooltipData {
  sections: [
    {
      id: 'role-breakdown',
      type: 'breakdown',
      content: {
        roles: Array<{
          icon: string;
          label: string;
          count: number;
          percentage: number;
        }>;
      }
    },
    {
      id: 'budget-chart',
      type: 'chart',
      content: {
        allocated: number;
        spent: number;
        remaining: number;
        chartData: Array<{ month: string; value: number }>;
      }
    }
  ];
  footer: {
    stats: [
      { label: 'Avg Tenure', value: string },
      { label: 'Open Reqs', value: string }
    ];
  };
}
```

### Contractor Data Schema

```typescript
interface ContractorTooltipData extends TooltipData {
  sections: [
    {
      id: 'equipment-inventory',
      type: 'list',
      content: {
        items: Array<{
          icon: string;
          name: string;
          serial: string;
          category: 'laptop' | 'phone' | 'dock' | 'security';
        }>;
      }
    },
    {
      id: 'tenure-badge',
      type: 'custom',
      content: {
        years: number;
        rank: 'Junior' | 'Mid' | 'Senior' | 'Principal';
        color: string;
      }
    }
  ];
  footer: {
    stats: [
      { label: 'Start Date', value: string },
      { label: 'PO', value: string },
      { label: 'Performance', value: string } // If manager viewing
    ];
  };
}
```

---

## Implementation Guidelines

### Performance Optimization

**1. Lazy Loading Strategy**
```tsx
// For static data (already loaded): lazyLoad={false}
<TooltipWrapper entityType="department" data={department}>
  Engineering
</TooltipWrapper>

// For dynamic data (fetch on hover): lazyLoad={true}
<TooltipWrapper entityType="contractor" entityId="123" lazyLoad>
  John Martinez
</TooltipWrapper>
```

**2. Caching Strategy**
```tsx
// Cache tooltip data for 5 minutes
const tooltipCache = new Map();

async function fetchTooltipData(type: string, id: string) {
  const cacheKey = `${type}-${id}`;
  const cached = tooltipCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }
  
  const data = await api.getTooltipData(type, id);
  tooltipCache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}
```

**3. Skeleton Loading**
```tsx
function TooltipSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
```

### Accessibility

**Keyboard Support:**
```tsx
// Focus triggers tooltip (like hover)
<TooltipWrapper>
  <button onFocus={handleHover}>
    Engineering
  </button>
</TooltipWrapper>
```

**Screen Reader:**
```tsx
// ARIA labels provide context
<div 
  aria-label="Engineering department, 25 active contractors"
  aria-describedby="tooltip-engineering"
>
  Engineering
</div>
```

---

## Backend API Requirements

### Tooltip Data Endpoint

```typescript
// GET /api/tooltip/:entityType/:entityId
// Returns: TooltipData

router.get('/tooltip/:entityType/:entityId', async (req, res) => {
  const { entityType, entityId } = req.params;
  
  switch(entityType) {
    case 'department':
      return res.json(await getDepartmentTooltip(entityId));
    case 'contractor':
      return res.json(await getContractorTooltip(entityId));
    case 'equipment':
      return res.json(await getEquipmentTooltip(entityId));
    // ... etc
  }
});
```

### Data Aggregation

Backend should pre-compute tooltip data for performance:

```sql
-- Department tooltip (cached view)
CREATE MATERIALIZED VIEW department_tooltip_data AS
SELECT 
  d.id,
  d.name,
  COUNT(DISTINCT c.id) as contractor_count,
  json_agg(DISTINCT jsonb_build_object(
    'role', c.role,
    'count', (SELECT COUNT(*) FROM contractors WHERE department_id = d.id AND role = c.role)
  )) as role_breakdown,
  SUM(po.amount) as budget_allocated,
  SUM(po.amount - po.remaining) as budget_spent
FROM departments d
LEFT JOIN contractors c ON c.department_id = d.id
LEFT JOIN purchase_orders po ON po.department_id = d.id
GROUP BY d.id, d.name;

-- Refresh every hour
REFRESH MATERIALIZED VIEW CONCURRENTLY department_tooltip_data;
```

---

## Testing Strategy

### Unit Tests
```tsx
describe('TooltipWrapper', () => {
  it('renders children correctly', () => {
    render(
      <TooltipWrapper entityType="department" data={mockData}>
        <span>Engineering</span>
      </TooltipWrapper>
    );
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
  
  it('shows tooltip on hover', async () => {
    render(<TooltipWrapper {...props}>Hover me</TooltipWrapper>);
    
    await userEvent.hover(screen.getByText('Hover me'));
    
    expect(await screen.findByText('Engineering Department')).toBeVisible();
  });
  
  it('lazy loads data on hover', async () => {
    const fetchSpy = jest.spyOn(api, 'getTooltipData');
    
    render(<TooltipWrapper lazyLoad {...props}>Hover</TooltipWrapper>);
    
    await userEvent.hover(screen.getByText('Hover'));
    
    expect(fetchSpy).toHaveBeenCalledWith('department', '123');
  });
});
```

### E2E Tests (Playwright)
```typescript
test('Department tooltip shows role breakdown', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Hover over Engineering department
  await page.hover('[data-testid="department-engineering"]');
  
  // Wait for tooltip to appear
  const tooltip = page.locator('[role="tooltip"]');
  await expect(tooltip).toBeVisible();
  
  // Verify content
  await expect(tooltip.getByText('AI/ML Specialists')).toBeVisible();
  await expect(tooltip.getByText('12')).toBeVisible();
});
```

---

## Migration Plan

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create `TooltipWrapper` component
- [ ] Create `TooltipRenderer` with type switching
- [ ] Implement lazy loading and caching
- [ ] Build backend `/api/tooltip` endpoint

### Phase 2: Priority Tooltips (Week 2)
- [ ] Department tooltips (role breakdown, budget chart)
- [ ] Contractor tooltips (equipment inventory, tenure)
- [ ] Metric tooltips (trend charts, variance)

### Phase 3: Comprehensive Coverage (Week 3)
- [ ] PO tooltips (budget health, GR status)
- [ ] Invoice tooltips (variance details, approval chain)
- [ ] Timecard tooltips (hours breakdown, approval status)
- [ ] Equipment tooltips (specs, assignment, warranty)

### Phase 4: Polish & Optimize (Week 4)
- [ ] Performance tuning (caching, prefetching)
- [ ] Accessibility audit
- [ ] Visual polish (animations, shadows)
- [ ] User testing and feedback

---

## Do's and Don'ts

### ✅ DO
- Pre-load tooltip data when possible (avoid loading flicker)
- Cache tooltip data for 5 minutes
- Show skeleton loading state during fetch
- Use type-specific content (not generic "Click for more")
- Implement keyboard navigation (focus = hover)
- Test with real data and edge cases

### ❌ DON'T
- Fetch tooltip data on every hover (use caching)
- Show empty/broken tooltips (handle errors gracefully)
- Make tooltips too large (max-w-md, scrollable if needed)
- Forget mobile experience (tap to show, tap away to hide)
- Ignore performance (monitor tooltip render time)
- Use tooltips for critical actions (use modals instead)

---

**Last Updated**: November 20, 2025  
**Maintained By**: Velocity Platform Team
