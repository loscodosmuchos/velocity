# Velocity UX Patterns
**Human-Centered Design for Executive Decision-Making**

> *"Exclamations, Not Explanations"* — Users should exclaim "Look how fast this works!" never require explanations.

## Overview
Velocity's UX patterns are designed for stressed executives who need instant comprehension, rapid triage capabilities, and zero "mystery click-throughs" to assess priority. Every interaction anticipates user needs and supports decision-making workflows.

---

## Core UX Principles

### 1. "Hovering is Intentional Action"
When users hover over an element, they're **actively seeking information**. Show full details to support triage workflow, not generic placeholders.

**Philosophy:**
- Hovering is a deliberate action indicating interest
- Users are evaluating priority and need context to decide
- Don't force navigation for basic information assessment
- Support triage by showing details; don't force clicks "just to find out"

**Example:**
```tsx
// ❌ BAD - Generic placeholder
<Tooltip>
  <TooltipContent>Finance • Critical • 2 alerts</TooltipContent>
</Tooltip>

// ✅ GOOD - Full triage support
<Tooltip>
  <TooltipContent>
    <h4>Budget Overrun Alert</h4>
    <p>Engineering PO-2847 exceeded by $47,200</p>
    <div>Impact: Q4 budget at risk</div>
    <div>Recommended: Review contractor hours</div>
  </TooltipContent>
</Tooltip>
```

### 2. Privacy-Aware Triage Support
Users may view dashboards in **non-private situations** (open office, meetings, shared screens).

**Design Strategy:**
- **Default display**: Minimal/safe information (counts, categories, colors)
- **Hover reveals**: Full details only when user takes intentional action
- **Quick actions**: In tooltips prevent forced page transitions

**Example:**
```tsx
// Default: Safe for public viewing
<AlertCube severity="critical" count={3} />

// Hover: User took action, show details
<Tooltip>
  <TooltipContent>
    <AlertDetail title="Invoice Variance: $12,400" />
    <AlertDetail title="Timecard Missing: J. Martinez" />
    <AlertDetail title="Budget Overrun: Engineering" />
    <QuickActions>
      <Button>Acknowledge</Button>
      <Button>Snooze 1hr</Button>
    </QuickActions>
  </TooltipContent>
</Tooltip>
```

### 3. User Context Understanding
**Who are our users?**
- Stressed CPOs and executives
- Managing 10+ different concerns simultaneously
- Need instant status assessment
- Making decisions with incomplete information
- May be interrupted at any moment

**What they need:**
- ✅ Instant comprehension without scrolling
- ✅ Rapid triage capabilities
- ✅ Zero "mystery click-throughs" to assess priority
- ✅ Contextual information on demand (hover)
- ✅ Quick actions to defer/acknowledge without deep navigation

**What they don't need:**
- ❌ Forced navigation to see basic details
- ❌ Multi-step workflows for simple tasks
- ❌ Generic tooltips that say "Click for more"
- ❌ Hidden information requiring discovery

---

## Interaction Patterns

### Triage Workflow
**Goal**: Let users assess priority and take action without forced navigation.

**Pattern:**
1. **Visual Scan** - Color-coded alerts, status badges, trend indicators
2. **Hover for Details** - Full context appears (titles, values, impacts, recommendations)
3. **Quick Action or Navigate** - User decides:
   - Take quick action (Acknowledge, Snooze, Add To-Do)
   - Navigate for deep dive
   - Ignore (not urgent)

**Implementation:**
```tsx
<AlertCube onClick={() => navigate('/alert-detail')}>
  <Tooltip>
    <TooltipContent>
      {/* Full Alert Details */}
      <AlertList alerts={alerts} maxVisible={3} />
      
      {/* Quick Actions Grid */}
      <QuickActions>
        <Button onClick={(e) => {
          e.stopPropagation(); // Don't navigate
          acknowledge();
        }}>✓ Acknowledge</Button>
        <Button onClick={(e) => {
          e.stopPropagation();
          snooze('1hr');
        }}>🕐 Snooze 1hr</Button>
      </QuickActions>
      
      {/* Footer */}
      <div>Click cube to view all details</div>
    </TooltipContent>
  </Tooltip>
</AlertCube>
```

### Progressive Disclosure
Show the **right amount of information** at each interaction level:

**Level 1: Visual Scan (No interaction)**
- Color coding (red = critical, green = nominal)
- Count badges (3 alerts, 12 pending)
- Status indicators (healthy, warning, critical)

**Level 2: Hover (Intentional action)**
- Full titles and descriptions
- Impact values and metrics
- Recommended actions
- Preview of top 3 items (if multiple)

**Level 3: Click (Deep dive)**
- Complete history and audit trail
- All related data and context
- Full action capabilities
- Detailed analytics

### Anticipatory Design
Every clickable element should **anticipate the user's next need**.

**Examples:**
- **Metric cards** → Click navigates to filtered view of that data
- **Alert cubes** → Hover shows triage info, click shows full detail
- **Department labels** → Hover shows headcount breakdown, click shows team roster
- **Budget numbers** → Hover shows variance chart, click shows full P&L

**Pattern:**
```tsx
<MetricCard 
  onClick={() => navigate('/contractors?status=active')}
  tooltip={{
    title: "Active Contractors Breakdown",
    content: <DepartmentChart data={deptData} />,
    stats: { engineering: 12, finance: 5, procurement: 8 }
  }}
>
  <Value>25</Value>
  <Label>Active Contractors</Label>
</MetricCard>
```

---

## Component-Specific Patterns

### Alert System

**Visual Hierarchy:**
1. **Compact cubes** (64px × 64px) - Multiple visible without scrolling
2. **Multi-dimensional indicators** - 4 layers of visual information
3. **Enhanced tooltips** - Up to 3 alerts with full details
4. **Quick actions** - 2×2 grid of common actions

**Quick Actions:**
- ✓ **Acknowledge** (green) - "I saw this, will deal with it"
- 🕐 **Snooze 1hr** (blue) - "Remind me in an hour"
- 📅 **Next Login** (purple) - "Show me next time I log in"
- 📋 **Add To-Do** (amber) - "Put this on my to-do list"

**Implementation Notes:**
- `e.stopPropagation()` prevents tooltip from closing on button click
- Color-coded hover states for each action
- Icons + text for clarity

### Metric Cards

**Automotive Precision Design:**
- **4px left border** - Color-coded by category
- **Gradient background** - Premium feel (color/50 → white)
- **Uppercase titles** - Professional, industrial
- **Contextual messaging** - Changes based on state
- **Reduced padding** - Higher data density

**Example:**
```tsx
<Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
  <CardHeader className="pb-1.5 pt-3">
    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-blue-700">
      Active Contractors
    </CardTitle>
  </CardHeader>
  <CardContent className="pb-3">
    <div className="text-3xl font-bold text-blue-900">42</div>
    <p className="text-xs text-blue-600 font-medium">
      of 50 total workforce
    </p>
  </CardContent>
</Card>
```

### Tooltips (Site-Wide Pattern)

**Philosophy:**
> "Every piece of data worthy of showing should be worthy of showing MORE on hover."

**Universal Tooltip Structure:**
```tsx
<TooltipWrapper data={entityData} type="contractor">
  <TooltipContent>
    {/* Header */}
    <TooltipHeader icon={icon} title={name} category={category} />
    
    {/* Primary Details */}
    <TooltipBody>
      {/* Contextual breakdown based on type */}
      {type === 'department' && <DepartmentBreakdown data={data} />}
      {type === 'contractor' && <EquipmentInventory data={data} />}
      {type === 'metric' && <TrendChart data={data} />}
    </TooltipBody>
    
    {/* Quick Stats (if applicable) */}
    <TooltipStats stats={computedStats} />
    
    {/* Footer Action */}
    <TooltipFooter>Click for full details</TooltipFooter>
  </TooltipContent>
</TooltipWrapper>
```

**Contextual Examples:**

**Department Tooltip:**
```tsx
// Engineering dept → Hover shows:
- AI/ML Specialists: 12
- C++ Developers: 8  
- Hardware Designers: 5
- Budget: $2.4M allocated
- [Mini pie chart showing role distribution]
```

**Contractor Tooltip:**
```tsx
// John Martinez → Hover shows:
- Equipment: MacBook Pro M3, iPhone 15 Pro, USB-C Dock, YubiKey 5 NFC
- Tenure: 2.3 years (color-coded badge)
- Department: Engineering (icon)
- Performance: Top 10% (if manager viewing)
```

**Metric Tooltip:**
```tsx
// Budget utilization → Hover shows:
- Trend chart (last 6 months)
- Variance: +$12K over forecast
- Forecast: $1.8M by year-end
- Recommended action: Review Q4 spending
```

---

## Navigation Patterns

### Menu System Conventions
- **≤18 Character Limit** - All menu labels must fit without truncation
- **fullLabel Metadata** - Store complete names for tooltips
- **Hover Tooltips** - Show full names on hover for abbreviated items

**Example:**
```tsx
{
  name: "Voice Intel",           // Display (18 chars)
  fullLabel: "Voice Intelligence System",  // Tooltip
  path: "/voice-intelligence"
}
```

### Role-Based Filtering
Menus automatically filter based on user role:
```tsx
const filteredMenuItems = menuItems.filter(item => {
  const visibleFor = item.meta?.visibleFor;
  if (!visibleFor || visibleFor.length === 0) return true;
  return visibleFor.includes(userRole);
});
```

---

## Responsive Behavior

### Mobile-First Considerations
While Velocity is primarily desktop-focused (executive dashboards), we maintain mobile-friendly patterns:

- Touch targets: Minimum 44px × 44px
- Hover → Tap on mobile
- Tooltips → Modal sheets on small screens
- Swipe gestures for quick actions

### Breakpoints
```css
--mobile: 640px    /* sm: */
--tablet: 768px    /* md: */
--laptop: 1024px   /* lg: */
--desktop: 1280px  /* xl: */
--wide: 1536px     /* 2xl: */
```

---

## Accessibility Patterns

### Keyboard Navigation
- **Tab order**: Logical flow (top → bottom, left → right)
- **Focus indicators**: Visible 2px outline
- **Escape key**: Closes modals, tooltips, dropdowns
- **Arrow keys**: Navigate lists, menus

### Screen Readers
- **ARIA labels**: All interactive elements
- **Live regions**: Dynamic content updates
- **Skip links**: Navigate to main content
- **Descriptive text**: Not just icons

---

## Performance UX

### Perceived Performance
- **Skeleton screens** during loading
- **Optimistic UI** for quick actions (assume success)
- **Instant feedback** on interactions (<100ms)
- **Progressive loading** for large datasets

### Loading States
```tsx
// ❌ BAD - Blank screen
{isLoading && <Spinner />}

// ✅ GOOD - Show structure immediately
{isLoading ? <SkeletonCard /> : <MetricCard data={data} />}
```

---

## Error Handling UX

### Error States
- **Inline validation** - Real-time feedback on forms
- **Toast notifications** - Non-blocking for background operations
- **Error boundaries** - Graceful degradation, not white screen
- **Retry mechanisms** - Let users recover without refresh

### Example:
```tsx
<Alert variant="destructive">
  <AlertTitle>Budget calculation failed</AlertTitle>
  <AlertDescription>
    Unable to fetch latest PO data. 
    <Button onClick={retry}>Try Again</Button>
  </AlertDescription>
</Alert>
```

---

## Animation Guidelines

### Purposeful Motion
Use animation to:
- ✅ Direct attention (hover scale, pulse)
- ✅ Provide feedback (button press, success states)
- ✅ Explain transitions (modal slide-in, page fade)

Avoid:
- ❌ Gratuitous motion (spinning logos, bouncing elements)
- ❌ Slow animations (>300ms)
- ❌ Motion without purpose

### Standard Durations
```css
--duration-instant: 100ms   /* Hover, focus */
--duration-fast: 150ms      /* Button press */
--duration-base: 200ms      /* Default transitions */
--duration-slow: 300ms      /* Modal, sheet */
```

---

## Do's and Don'ts

### ✅ DO
- Show full details on hover (they took the action)
- Provide quick actions in tooltips (prevent forced navigation)
- Use contextual messaging that reflects actual state
- Support triage workflow with progressive disclosure
- Anticipate next action on every clickable element
- Maintain privacy-aware defaults (safe for public viewing)

### ❌ DON'T
- Force navigation to see basic information
- Use generic "Click for more" tooltips
- Show sensitive data by default (without hover)
- Require multiple clicks for simple tasks
- Ignore user context (stress, interruptions, multitasking)
- Create "mystery click-throughs" that waste time

---

**Last Updated**: November 20, 2025  
**Maintained By**: Velocity Platform Team
