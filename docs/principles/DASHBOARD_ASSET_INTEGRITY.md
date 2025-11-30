# DAIS - Dashboard Asset Integrity System

## Philosophy: The Sacred Interface

> *"Where the god reaches out and the finger touches the user"*

DAIS (Dashboard Asset Integrity System) guards the most critical point in the entire platform: **the interface where system meets user**. Like Michelangelo's *Creation of Adam*, the dashboard is the moment of contact - where the entire system becomes real.

Everything behind the dashboard - the database, the AI agents, the calculations, the business logic - none of it matters if this interface fails. The dashboard IS the system from the user's perspective. It's the present moment where both sides touch.

This is why DAIS exists: to ensure that sacred interface never breaks, never misleads, never disappoints.

## Overview

The Dashboard Asset Integrity System ensures that all dashboard components remain properly linked, functional, and aligned with the application's routing structure. This is a **critical system** - asset integrity failures are "project killers" that destroy user trust.

## Core Principle: "Every Link Must Lead Somewhere"

Every clickable element on a dashboard MUST:
1. Navigate to a valid, existing route
2. Display meaningful data from a verified source
3. Have a tooltip explaining what it does
4. Be validated before the dashboard renders

## Components

### 1. CustomizableAlertIcon Component Library

Location: `src/components/alert-icons/`

A flexible, configurable icon system that allows users to create custom alert indicators:

```typescript
import { CustomizableAlertIcon, alertIconRegistry } from '@/components/alert-icons';

// Use a pre-registered icon
const icon = alertIconRegistry.get('budget-critical');
<CustomizableAlertIcon config={icon} />

// Create a custom icon
const customIcon = alertIconRegistry.createCustomIcon(
  'My Custom Alert',
  'warning',
  'budget',
  'DollarSign',
  { path: '/analytics-hub' }
);
```

#### Configuration Options

Each icon can be configured with:

- **Severity**: critical, warning, info, success, neutral
- **Category**: budget, compliance, performance, deadline, approval, system, custom
- **Corner Badges**: 4 corners, each with:
  - Icon or text content
  - Background/text color
  - Animation (pulse, bounce)
- **Center Content**: Icon + optional value/percentage
- **Tooltip**: Title, description, action label, timestamp
- **Navigation**: Path + optional params

### 2. Dashboard Asset Validator

Location: `src/services/dashboard-asset-validator.ts`

The validator ensures all dashboard assets are properly linked:

```typescript
import { dashboardAssetValidator, useDashboardValidation } from '@/services/dashboard-asset-validator';

// In a dashboard component
const { isValid, errors, warnings } = useDashboardValidation('executive-dashboard', [
  { id: 'budget-card', type: 'kpi-card', name: 'Budget Utilization', location: 'ExecutiveDashboard', navigation: { path: '/analytics-hub' } },
  { id: 'alerts-card', type: 'kpi-card', name: 'Active Alerts', location: 'ExecutiveDashboard', navigation: { path: '/invoices' } },
  // ... more assets
]);

if (!isValid) {
  console.error('Dashboard has validation errors:', errors);
}
```

### 3. Alert Icon Registry

The registry tracks all registered alert icons and their usage:

```typescript
import { alertIconRegistry } from '@/components/alert-icons';

// Get all icons
const allIcons = alertIconRegistry.getAll();

// Get by severity
const criticalIcons = alertIconRegistry.getBySeverity('critical');

// Track usage for dashboard
alertIconRegistry.trackUsage('budget-critical', 'executive-dashboard');

// Export configuration
const configJson = alertIconRegistry.exportConfig();
```

## Validation Rules

### Navigation Validation

All navigation paths are validated against the application's route registry:

| Check | Severity | Description |
|-------|----------|-------------|
| Path exists | Error | Route must exist in App.tsx |
| Path format | Error | Must start with `/` |
| Params valid | Warning | Dynamic params should match route definition |

### Component Validation

| Check | Severity | Description |
|-------|----------|-------------|
| Icon registered | Error | Alert icons must be in registry |
| Data source defined | Error | Query-based assets need source |
| Dependencies exist | Warning | Referenced assets must exist |
| Orphaned assets | Warning | Assets should be connected |

## Validation Hooks

### useDashboardValidation

```typescript
const {
  isValid,      // boolean - true if no errors
  isValidating, // boolean - validation in progress
  errors,       // ValidationIssue[] - error-level issues
  warnings,     // ValidationIssue[] - warning-level issues
  validate,     // () => ValidationResult - manual validation
  getHistory    // () => ValidationResult[] - past validations
} = useDashboardValidation(dashboardId, assets, options);
```

Options:
- `validateOnMount`: Run validation on component mount (default: true)
- `validateOnChange`: Re-validate when assets change (default: true)
- `throwOnError`: Throw exception on validation errors (default: false)
- `logWarnings`: Log warnings to console (default: true)

### useValidatedNavigation

```typescript
const { createSafeNavigator, isPathValid } = useValidatedNavigation();

// Create a safe navigator that validates before navigating
const safeGo = createSafeNavigator(go);
safeGo('/analytics-hub', 'BudgetCard'); // Only navigates if path is valid

// Check if a path is valid
if (isPathValid('/some-path')) {
  // path exists
}
```

### useAlertIconRegistry

```typescript
const {
  icons,          // AlertIconConfig[] - all registered icons
  getIcon,        // (id) => AlertIconConfig | undefined
  registerIcon,   // (config) => void
  getBySeverity,  // (severity) => AlertIconConfig[]
  getByCategory,  // (category) => AlertIconConfig[]
  createCustomIcon, // Create and register new icon
  exportConfig    // () => string - JSON export
} = useAlertIconRegistry();
```

## Pre-Registration Procedure

When creating or modifying a dashboard:

1. **Define Assets**: List all clickable elements with their navigation targets
2. **Register Dashboard**: Call `registerDashboard()` with asset list
3. **Validate**: Run validation and check results
4. **Fix Issues**: Address any errors before rendering
5. **Monitor**: Track validation history for regression detection

## Error Categories

| Category | Description | Action Required |
|----------|-------------|-----------------|
| `navigation` | Invalid route path | Fix path or add route |
| `component` | Missing/orphaned component | Connect or remove |
| `data` | Data source issue | Fix query or source |
| `icon` | Icon not registered | Register in registry |
| `configuration` | Config error | Fix configuration |

## Best Practices

1. **Validate Early**: Run validation during development, not just production
2. **Track Usage**: Use `trackUsage()` to monitor which icons are used where
3. **Clean Up**: Unregister dashboards when unmounting
4. **Log Everything**: Keep console warnings enabled during development
5. **Export Configs**: Backup icon configurations periodically

## Integration with CI/CD

Add validation to your build process:

```typescript
// In test or build script
const report = dashboardAssetValidator.generateReport();

if (report.totalIssues.errors > 0) {
  console.error('Dashboard validation failed!');
  process.exit(1);
}
```

## Emergency Procedures

If validation fails in production:

1. Check console logs for specific error messages
2. Use `getValidationHistory()` to see recent changes
3. Review `dashboardAssetValidator.generateReport()` for system-wide view
4. Fix issues in order: errors → warnings → infos
5. Re-validate after each fix

## Gamification: Unlockable Textures

The alert icon system includes a gamification layer where users unlock premium textures through engagement:

### Texture Rarity Levels

| Rarity | Examples | Unlock Method |
|--------|----------|---------------|
| Common | Matte, Carbon Fiber | Default available |
| Uncommon | Brushed Metal, Diamond Plate, Honeycomb | 25-50 actions / 3 trainings |
| Rare | Glass, Leather, Circuit Board | Level 5 / 100 actions / 5 trainings |
| Epic | Titanium, Holographic | Level 10 / "Power User" achievement |
| Legendary | Gold Foil, Racing Stripe | Level 25 / "Speed Demon" achievement |

### Usage

```typescript
import { TEXTURES, getUnlockedTextures, getTextureProgress } from '@/components/alert-icons';

// Get textures available to user
const userStats = {
  level: 7,
  trainingCompleted: 4,
  actionsCompleted: 85,
  achievements: ['early_adopter']
};

const unlocked = getUnlockedTextures(userStats);
// Returns: ['matte', 'carbon-fiber', 'brushed-metal', 'diamond-plate', 'honeycomb', 'glass']

// Check progress toward locked texture
const progress = getTextureProgress('titanium', userStats);
// Returns: { unlocked: false, progress: 70, requirement: 'Reach Level 10' }
```

### Customization Philosophy

This personalization system follows the "iPhone Case" principle:
- Users want to express their style through their tools
- Unlocking premium options creates engagement incentives
- Customization builds emotional investment in the platform
- Progress visibility (locked textures with requirements) motivates continued use

## Related Documents

- `docs/architecture/AGENT_ARCHITECTURE_BLUEPRINT.md`
- `docs/principles/CUSTOMIZATION_PHILOSOPHY.md`
- `replit.md` - "Alert Interaction Policy" section
