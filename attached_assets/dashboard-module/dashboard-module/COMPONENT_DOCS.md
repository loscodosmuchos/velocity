# Dashboard Builder Component Documentation

Detailed documentation for all React components in the Dashboard Builder Module.

## Component Overview

| Component | Type | Purpose |
|-----------|------|---------|
| DashboardBuilder | Page | Main container orchestrating all dashboard functionality |
| GridLayout | Layout | React-grid-layout wrapper with custom behavior |
| ModulePalette | Sidebar | Displays available modules by category |
| TemplateSelector | Dropdown | Template selection and application |
| ThemeSelector | Dropdown | Theme switching interface |
| SaveLayoutDialog | Modal | Save custom layouts with validation |
| DashboardWidget | Widget | Individual widget renderer with demo data |

---

## DashboardBuilder

**File:** `client/src/pages/DashboardBuilder.tsx`

Main page component that orchestrates the entire dashboard builder experience.

### Props

No props - fully self-contained component.

### Features

- Loads modules, templates, and themes via TanStack Query
- Manages active layout state
- Coordinates module addition/removal
- Handles save/load operations
- Manages theme switching

### State Management

```typescript
const [activeLayout, setActiveLayout] = useState<LayoutItem[]>([]);
const [activeModules, setActiveModules] = useState<Map<number, DashboardModule>>(new Map());
const [currentLayoutId, setCurrentLayoutId] = useState<number | null>(null);
```

### Key Queries

```typescript
// Load modules
const { data: modules } = useQuery({
  queryKey: ['/api/dashboard/modules'],
});

// Load templates  
const { data: templates } = useQuery({
  queryKey: ['/api/dashboard/templates'],
});

// Load user layouts
const { data: savedLayouts } = useQuery({
  queryKey: ['/api/dashboard/layouts'],
});

// Load themes
const { data: themes } = useQuery({
  queryKey: ['/api/dashboard/themes'],
});
```

### Key Mutations

```typescript
// Save layout
const saveLayoutMutation = useMutation({
  mutationFn: async (data) => {
    return apiRequest('/api/dashboard/layouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/layouts'] });
  },
});

// Apply template
const applyTemplateMutation = useMutation({
  mutationFn: async (templateId: number) => {
    return apiRequest('/api/dashboard/templates/apply', {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    });
  },
});

// Delete layout
const deleteLayoutMutation = useMutation({
  mutationFn: async (layoutId: number) => {
    return apiRequest(`/api/dashboard/layouts/${layoutId}`, {
      method: 'DELETE',
    });
  },
});
```

### Usage

```tsx
import DashboardBuilder from './pages/DashboardBuilder';

function App() {
  return (
    <div className="min-h-screen">
      <DashboardBuilder />
    </div>
  );
}
```

---

## GridLayout

**File:** `client/src/components/dashboard/GridLayout.tsx`

Wrapper around react-grid-layout with custom moduleId preservation.

### Props

```typescript
interface GridLayoutProps {
  layout: LayoutItem[];
  modules: DashboardModule[];
  onLayoutChange: (newLayout: LayoutItem[]) => void;
  onRemoveModule: (moduleId: number) => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| layout | LayoutItem[] | Yes | Current grid layout configuration |
| modules | DashboardModule[] | Yes | Map of active modules to display |
| onLayoutChange | function | Yes | Callback when layout changes (drag/resize) |
| onRemoveModule | function | Yes | Callback when module is removed |

### Grid Configuration

```typescript
const gridConfig = {
  cols: 12,                    // 12-column grid
  rowHeight: 60,               // Each row is 60px
  width: 1200,                 // Full width (auto-calculated)
  margin: [16, 16],            // 16px margin between items
  containerPadding: [16, 16],  // 16px padding around container
  compactType: 'vertical',     // Vertical compaction
  preventCollision: false,     // Allow overlap during drag
  isDraggable: true,           // Enable dragging
  isResizable: true,           // Enable resizing
};
```

### Critical Implementation

The component preserves `moduleId` through layout changes:

```typescript
const handleLayoutChange = (newLayout: Layout[]) => {
  const updatedLayout = newLayout.map(item => {
    // Find existing item to preserve moduleId
    const existingItem = layout.find(l => l.i === item.i);
    return {
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      moduleId: existingItem?.moduleId || 0,  // Critical: preserve moduleId
    };
  });
  onLayoutChange(updatedLayout);
};
```

### Usage

```tsx
<GridLayout
  layout={activeLayout}
  modules={Array.from(activeModules.values())}
  onLayoutChange={handleLayoutChange}
  onRemoveModule={handleRemoveModule}
/>
```

---

## ModulePalette

**File:** `client/src/components/dashboard/ModulePalette.tsx`

Sidebar component displaying available modules grouped by category.

### Props

```typescript
interface ModulePaletteProps {
  modules: DashboardModule[];
  onAddModule: (module: DashboardModule) => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| modules | DashboardModule[] | Yes | All available dashboard modules |
| onAddModule | function | Yes | Callback when user clicks "Add" button |

### Module Categories

The palette groups modules into these categories:

- **Recruitment** - Hiring and candidate metrics
- **Procurement & Vendors** - Vendor and contract management
- **Project Management** - Portfolio and project tracking
- **IT & Systems** - System health and operations
- **VMS & Contractors** - Contractor compliance
- **Finance** - Financial metrics and budgets
- **Productivity** - Quick actions and utilities

### Category Display Names

```typescript
const categoryNames: Record<string, string> = {
  recruitment: 'Recruitment',
  procurement: 'Procurement & Vendors',
  project_mgmt: 'Project Management',
  it_ops: 'IT & Systems',
  compliance: 'VMS & Contractors',
  finance: 'Finance',
  productivity: 'Productivity',
};
```

### Features

- Collapsible category sections
- Icon display for each module
- Add button for each module
- Scrollable sidebar
- Module count per category

### Usage

```tsx
<ModulePalette
  modules={modules || []}
  onAddModule={handleAddModule}
/>
```

---

## TemplateSelector

**File:** `client/src/components/dashboard/TemplateSelector.tsx`

Dropdown component for selecting and applying templates or loading saved layouts.

### Props

```typescript
interface TemplateSelectorProps {
  templates: DashboardTemplate[];
  savedLayouts: UserDashboardLayout[];
  onApplyTemplate: (templateId: number) => void;
  onLoadLayout: (layout: UserDashboardLayout) => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| templates | DashboardTemplate[] | Yes | System-provided templates |
| savedLayouts | UserDashboardLayout[] | Yes | User's saved custom layouts |
| onApplyTemplate | function | Yes | Callback when template is selected |
| onLoadLayout | function | Yes | Callback when saved layout is loaded |

### Template Roles

Available role-based templates:

- `recruiter` - Recruiter Dashboard
- `cpo` - CPO Dashboard
- `senior_pm` - Senior PM Portfolio Dashboard
- `it_director` - IT Director Dashboard
- `vms_specialist` - VMS Specialist Dashboard
- `csuite` - C-Suite Executive Dashboard
- `hr_director` - HR Director Dashboard
- `vendor_manager` - Vendor Manager Dashboard

### Selection Groups

The dropdown is organized into groups:

1. **System Templates** - Pre-configured role-based layouts
2. **My Saved Layouts** - User's custom saved dashboards

### Usage

```tsx
<TemplateSelector
  templates={templates || []}
  savedLayouts={savedLayouts || []}
  onApplyTemplate={handleApplyTemplate}
  onLoadLayout={handleLoadLayout}
/>
```

---

## ThemeSelector

**File:** `client/src/components/dashboard/ThemeSelector.tsx`

Dropdown component for switching dashboard themes.

### Props

```typescript
interface ThemeSelectorProps {
  themes: ThemeToken[];
  currentThemeId: number | null;
  currentLayoutId: number | null;
  onThemeChange: (themeId: number) => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| themes | ThemeToken[] | Yes | Available theme options |
| currentThemeId | number \| null | Yes | Currently selected theme ID |
| currentLayoutId | number \| null | Yes | Current layout ID (for persistence) |
| onThemeChange | function | Yes | Callback when theme is changed |

### Available Themes

Default themes included:

1. **Modern Professional** - Clean blue design
2. **Dark Executive** - Dark mode with purple accents
3. **Warm Recruiter** - Orange/amber color scheme

### Theme Structure

```typescript
interface ThemeToken {
  id: number;
  name: string;
  description: string;
  tokens: {
    colors: {
      primary: { h: number; s: number; l: number };
      background: { h: number; s: number; l: number };
      // ... more colors
    };
    spacing: { base: number; scale: number };
    typography: { fontFamily: string; baseSize: number };
    borderRadius: { sm: number; md: number; lg: number };
  };
}
```

### Usage

```tsx
<ThemeSelector
  themes={themes || []}
  currentThemeId={currentThemeId}
  currentLayoutId={currentLayoutId}
  onThemeChange={handleThemeChange}
/>
```

---

## SaveLayoutDialog

**File:** `client/src/components/dashboard/SaveLayoutDialog.tsx`

Modal dialog for saving custom dashboard layouts with validation.

### Props

```typescript
interface SaveLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; isDefault: boolean }) => void;
  isSaving: boolean;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| open | boolean | Yes | Controls dialog visibility |
| onOpenChange | function | Yes | Callback when dialog open state changes |
| onSave | function | Yes | Callback with layout name and default flag |
| isSaving | boolean | Yes | Shows loading state during save |

### Form Fields

1. **Name** (required) - Custom layout name
   - Minimum 1 character
   - Validated with Zod

2. **Set as Default** (optional) - Checkbox to make this the default layout
   - Only one layout can be default
   - Previous default is automatically unset

### Form Validation

```typescript
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isDefault: z.boolean().default(false),
});
```

### Form Behavior

- ✅ Preserves form data on validation errors
- ✅ Clears form only on successful save
- ✅ Shows loading spinner during save
- ✅ Prevents submission while saving

### Usage

```tsx
<SaveLayoutDialog
  open={saveDialogOpen}
  onOpenChange={setSaveDialogOpen}
  onSave={handleSaveLayout}
  isSaving={saveLayoutMutation.isPending}
/>
```

---

## DashboardWidget

**File:** `client/src/components/dashboard/DashboardWidget.tsx`

Individual widget renderer with demo data for all 37 modules.

### Props

```typescript
interface DashboardWidgetProps {
  module: DashboardModule;
  onRemove: () => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| module | DashboardModule | Yes | Module configuration and metadata |
| onRemove | function | Yes | Callback when remove button is clicked |

### Module Types

Supports 4 widget types:

1. **KPI** - Single metric cards with trend indicators
2. **Chart** - Area charts, bar charts, line charts
3. **Table** - Data tables with multiple columns
4. **Widget** - Custom widgets (quick actions, etc.)

### Demo Data

Each of the 37 modules has realistic demo data:

```typescript
// Example KPI module
case 'Total Candidates':
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Total Candidates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">1,284</div>
        <p className="text-xs text-muted-foreground">
          <TrendingUp className="inline w-4 h-4 text-green-600" />
          <span className="text-green-600">+12.5%</span> from last month
        </p>
      </CardContent>
    </Card>
  );
```

### Trend Indicators

- **Positive Trends** 🟢 - Green, upward arrow
- **Negative Trends** 🔴 - Red, downward arrow
- **Neutral Trends** ⚪ - Muted, minus icon

### Special Handling

**Time to Hire**: Shows downward trend as positive (lower is better)

```typescript
case 'Time to Hire':
  return (
    <div className="text-3xl font-bold">32 days</div>
    <p className="text-xs text-muted-foreground">
      <TrendingDown className="inline w-4 h-4 text-green-600" />
      <span className="text-green-600">-8.5%</span> faster than last month
    </p>
  );
```

### Fallback Behavior

Unknown modules display a fallback card:

```typescript
return (
  <Card>
    <CardHeader>
      <CardTitle>Unknown Module</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Module type not recognized: {module.type}
      </p>
    </CardContent>
  </Card>
);
```

### Usage

```tsx
<DashboardWidget
  module={module}
  onRemove={() => handleRemoveModule(module.id)}
/>
```

---

## Styling Guidelines

### Tailwind Classes

All components use Tailwind CSS with consistent spacing:

- **Padding**: `p-4`, `p-6` for cards
- **Margin**: `mb-4`, `gap-4` for spacing
- **Typography**: `text-sm`, `font-medium`, `text-muted-foreground`
- **Layout**: `flex`, `grid`, `space-y-4`

### Component Variants

Using `class-variance-authority` for button and card variants:

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
  }
);
```

### Icons

Using Lucide React for all icons:

```typescript
import { 
  Users, Briefcase, TrendingUp, TrendingDown,
  DollarSign, Calendar, Settings, X
} from 'lucide-react';
```

---

## Testing Components

### Unit Testing Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ModulePalette } from './ModulePalette';

test('renders module palette with categories', () => {
  const modules = [
    { id: 1, name: 'Total Candidates', category: 'recruitment' },
  ];
  
  render(
    <ModulePalette 
      modules={modules} 
      onAddModule={jest.fn()} 
    />
  );
  
  expect(screen.getByText('Recruitment')).toBeInTheDocument();
  expect(screen.getByText('Total Candidates')).toBeInTheDocument();
});

test('calls onAddModule when add button clicked', () => {
  const mockAdd = jest.fn();
  const modules = [
    { id: 1, name: 'Total Candidates', category: 'recruitment' },
  ];
  
  render(
    <ModulePalette 
      modules={modules} 
      onAddModule={mockAdd} 
    />
  );
  
  fireEvent.click(screen.getByText('Add'));
  expect(mockAdd).toHaveBeenCalledWith(modules[0]);
});
```

### E2E Testing Example

```typescript
import { test, expect } from '@playwright/test';

test('dashboard builder flow', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Add module
  await page.getByTestId('add-module-1').click();
  await expect(page.getByTestId('widget-1')).toBeVisible();
  
  // Apply template
  await page.getByRole('combobox').click();
  await page.getByText('Recruiter Dashboard').click();
  
  // Save layout
  await page.getByText('Save Layout').click();
  await page.getByPlaceholder('Layout name').fill('My Test Layout');
  await page.getByRole('button', { name: 'Save' }).click();
  
  await expect(page.getByText('Layout saved')).toBeVisible();
});
```

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet standards

### Example ARIA Usage

```tsx
<Button
  aria-label="Remove module"
  onClick={onRemove}
  data-testid={`remove-module-${module.id}`}
>
  <X className="h-4 w-4" />
</Button>
```

---

## Performance Considerations

### Optimizations

1. **React Query Caching**: 5-minute stale time for modules/templates
2. **Layout Throttling**: Debounced layout change handler
3. **Lazy Loading**: Components loaded on demand
4. **Memoization**: Module maps memoized to prevent re-renders

### Performance Tips

```typescript
// Memoize expensive calculations
const moduleMap = useMemo(() => {
  return new Map(modules.map(m => [m.id, m]));
}, [modules]);

// Debounce layout changes
const debouncedLayoutChange = useMemo(
  () => debounce((layout) => {
    onLayoutChange(layout);
  }, 300),
  [onLayoutChange]
);
```

---

## Common Patterns

### Adding Custom Module Renderers

```typescript
// In DashboardWidget.tsx
const renderModule = (module: DashboardModule) => {
  switch (module.name) {
    case 'Custom Widget':
      return <CustomWidgetComponent data={fetchCustomData()} />;
    default:
      return renderStandardModule(module);
  }
};
```

### Customizing Grid Behavior

```typescript
// In GridLayout.tsx
const gridProps = {
  ...defaultGridProps,
  maxRows: 10,              // Limit maximum rows
  compactType: 'vertical',  // Or 'horizontal' or null
  allowOverlap: false,      // Prevent module overlap
};
```

---

## Troubleshooting

### Common Issues

**Module not rendering:**
- Check if module ID exists in DashboardWidget switch statement
- Verify module is in activeModules map
- Check console for errors

**Layout not persisting:**
- Verify moduleId is preserved in handleLayoutChange
- Check API response for saved layout
- Ensure TanStack Query cache is invalidated

**Theme not applying:**
- Check if theme ID is saved to layout
- Verify CSS variables are injected
- Clear browser cache

---

## See Also

- [API Reference](./API_REFERENCE.md) - Backend API documentation
- [Integration Guide](./INTEGRATION_GUIDE.md) - Setup instructions
- [Main README](./DASHBOARD_MODULE_README.md) - Module overview
