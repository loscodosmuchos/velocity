# Design Lens Guide

## Overview
Design Lens is a design compliance badge/indicator that displays on pages showing real-time design metrics. It helps maintain design consistency across all pages.

## Features
- **Contrast Ratio**: Text/background contrast compliance (target: 92%+)
- **WCAG Accessibility**: Accessibility compliance (target: 88%+)
- **Color Compliance**: Department color standardization (target: 95%+)
- **Typography Score**: Font consistency and sizing (target: 90%+)
- **Data Visualization**: Chart and data display quality (target: 85%+)
- **Overall Score**: Combined design score (target: 90%+)

## Implementation

### Adding Design Lens to Any Page

**Step 1:** Import the component and utilities
```tsx
import { DesignLensBadge } from "@/components/design-lens/design-lens-badge";
import { getDesignLensMetrics } from "@/hooks/useDesignLens";
```

**Step 2:** Add to page header (within your header/title section)
```tsx
export default function MyPage() {
  const designMetrics = getDesignLensMetrics({ 
    pageName: "My Page Name",
    contrast: 95,
    accessibility: 90,
    colorCompliance: 98,
    typographyScore: 92,
    dataVisualization: 88
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Page</h1>
        <DesignLensBadge 
          pageName={designMetrics.pageName} 
          metrics={designMetrics}
        />
      </div>
      {/* Rest of page content */}
    </div>
  );
}
```

### Default Scores
If you don't specify custom metrics, these defaults are used:
- Contrast: 92%
- Accessibility: 88%
- Color Compliance: 95%
- Typography: 90%
- Data Visualization: 85%
- Overall: 90%

## Design Scores Explanation

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | ✅ Excellent | Page meets all design standards |
| 75-89 | ⚠️ Good | Page meets most standards, minor improvements needed |
| <75 | ❌ Needs Work | Page has design compliance issues |

## Color-Coded Indicators
- **Green**: Score 90+ (Excellent)
- **Amber**: Score 75-89 (Good)
- **Red**: Score <75 (Needs Work)

## Adding to Key Pages

All main pages should include Design Lens:
- ✅ Dashboard (all variants: CFO, Ben, Mark, Wes)
- ✅ Purchase Order Detail
- ✅ Contractors List
- ✅ Invoices List
- ✅ Timecards
- ✅ Platform Capabilities
- ✅ SOW Command Center
- ✅ ElevenLabs Agents Dashboard

## Customization Example

```tsx
const designMetrics = getDesignLensMetrics({ 
  pageName: "Finance Dashboard",
  contrast: 96,        // High contrast for financial data
  accessibility: 92,   // Accessible forms and inputs
  colorCompliance: 99, // Strict color usage
  typographyScore: 95, // Clear financial typography
  dataVisualization: 90 // Clear charts and tables
});
```

## Scoring Guidelines

### Contrast Ratio (92% default)
- 100%: Perfect WCAG AAA compliance (>7:1 ratio)
- 95%: WCAG AA compliance (4.5:1 ratio) throughout
- 85%: Mostly compliant with minor exceptions
- <80%: Accessibility issues present

### WCAG Accessibility (88% default)
- 100%: Full WCAG 2.1 AAA compliance
- 95%: WCAG 2.1 AA compliance
- 85%: Mostly accessible with some barriers
- <80%: Accessibility issues impact usability

### Color Compliance (95% default)
- 100%: Perfect department color standardization
- 95%: 95%+ consistent with color palette
- 85%: 80-95% consistent
- <85%: Color inconsistency issues

### Typography Score (90% default)
- 100%: Consistent font usage, proper sizing hierarchy
- 95%: Mostly consistent with minor variations
- 85%: Acceptable consistency
- <80%: Typography issues present

### Data Visualization (85% default)
- 100%: Charts, tables, gauges all optimized
- 95%: Mostly optimized with minor improvements
- 85%: Acceptable visualization quality
- <80%: Visualization clarity issues

## Example Pages

### Dashboard (95/100)
```tsx
const designMetrics = getDesignLensMetrics({ 
  pageName: "CFO Dashboard",
  contrast: 94,
  accessibility: 91,
  colorCompliance: 96,
  typographyScore: 93,
  dataVisualization: 92
});
```

### Purchase Order Detail (92/100)
```tsx
const designMetrics = getDesignLensMetrics({ 
  pageName: "Purchase Order Detail",
  contrast: 93,
  accessibility: 90,
  colorCompliance: 94,
  typographyScore: 91,
  dataVisualization: 88
});
```

## Monitoring Design Quality

Check Design Lens badges regularly to:
1. Ensure all pages meet minimum 85% design score
2. Track color compliance across departments
3. Monitor accessibility improvements
4. Maintain typographic consistency
5. Optimize data visualization quality

## Next Steps

1. Add Design Lens to all dashboard pages
2. Add to detail pages (PO, Contractor, Invoice)
3. Review scores - aim for 90%+ on all pages
4. Create quarterly design audit using Design Lens metrics
5. Update scores as design improvements are made
