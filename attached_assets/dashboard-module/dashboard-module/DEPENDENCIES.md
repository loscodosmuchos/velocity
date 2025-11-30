# Dashboard Builder Module - Dependencies

Complete dependency checklist for integrating the Dashboard Builder Module.

## Required Dependencies

### Core Framework Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### Dashboard-Specific Dependencies

#### Grid System
```bash
npm install react-grid-layout@1.4.4
npm install -D @types/react-grid-layout
```

**Purpose**: Drag-and-drop grid layout system  
**Size**: ~50KB  
**Required**: Yes

#### Data Fetching & State
```bash
npm install @tanstack/react-query@5.0.0
```

**Purpose**: Server state management, caching, mutations  
**Size**: ~45KB  
**Required**: Yes

#### Database & ORM
```bash
npm install drizzle-orm@0.33.0
npm install drizzle-zod@0.5.1
npm install -D drizzle-kit@0.24.0
```

**Purpose**: Type-safe PostgreSQL ORM, schema validation  
**Size**: ~100KB  
**Required**: Yes

#### Validation
```bash
npm install zod@3.23.8
```

**Purpose**: Schema validation for API requests  
**Size**: ~60KB  
**Required**: Yes

### UI Dependencies

#### Radix UI Primitives
```bash
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-label
npm install @radix-ui/react-toast
npm install @radix-ui/react-separator
```

**Purpose**: Accessible UI component primitives  
**Size**: ~80KB total  
**Required**: Yes (for dialogs, dropdowns, notifications)

#### Icons
```bash
npm install lucide-react
```

**Purpose**: Icon library (350+ icons)  
**Size**: ~150KB  
**Required**: Yes

### Utility Dependencies

#### CSS Utilities
```bash
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
```

**Purpose**: Dynamic class composition, variant management  
**Size**: ~5KB total  
**Required**: Yes (with Tailwind CSS)

## Optional Dependencies

### Date Handling (for future enhancements)
```bash
npm install date-fns
```

**Purpose**: Date formatting and manipulation  
**Size**: ~70KB  
**Required**: No (not currently used)

### Charts (if using custom chart widgets)
```bash
npm install recharts
```

**Purpose**: Chart rendering library  
**Size**: ~200KB  
**Required**: No (demo data uses simple visuals)

## Peer Dependencies

The module expects these to be present in your project:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "typescript": ">=5.0.0"
  }
}
```

## Development Dependencies

### TypeScript Types
```bash
npm install -D @types/react
npm install -D @types/react-dom
npm install -D @types/node
npm install -D @types/react-grid-layout
```

### Build Tools (if not already present)
```bash
npm install -D vite
npm install -D @vitejs/plugin-react
npm install -D tailwindcss
npm install -D postcss
npm install -D autoprefixer
```

## Database Requirements

### PostgreSQL
- **Version**: 14 or higher
- **Driver**: `@neondatabase/serverless` (or `pg`, `postgres.js`)

```bash
npm install @neondatabase/serverless
```

### Required Extensions

Enable these PostgreSQL extensions:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## CSS Requirements

### Tailwind CSS

**Required configuration** in `tailwind.config.ts`:

```typescript
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/src/components/dashboard/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your color scheme
      },
    },
  },
  plugins: [],
};
```

### Required CSS Imports

Add to your `index.css` or main CSS file:

```css
/* React Grid Layout styles */
@import 'react-grid-layout/css/styles.css';
@import 'react-resizable/css/styles.css';

/* Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Environment Variables

### Required

```bash
# Database connection
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional

```bash
# Session secret (if using authentication)
SESSION_SECRET=your-secret-key

# API base URL (for frontend)
VITE_API_BASE_URL=http://localhost:5000

# Node environment
NODE_ENV=development
```

## Version Compatibility

### Tested Versions

| Package | Version | Status |
|---------|---------|--------|
| React | 18.2.0 | ✅ Tested |
| TypeScript | 5.0.0 | ✅ Tested |
| react-grid-layout | 1.4.4 | ✅ Tested |
| @tanstack/react-query | 5.0.0 | ✅ Tested |
| drizzle-orm | 0.33.0 | ✅ Tested |
| zod | 3.23.8 | ✅ Tested |
| Node.js | 18.x | ✅ Tested |
| PostgreSQL | 14.x | ✅ Tested |

### Compatibility Notes

- **React 17**: Not tested, may work with minor adjustments
- **Next.js**: Compatible, requires server component adjustments
- **Remix**: Compatible, adjust data fetching patterns
- **Vite**: Fully compatible (recommended)
- **Create React App**: Compatible (may need CRACO for config)

## Installation Commands

### Full Installation (All Required Dependencies)

```bash
# Core dependencies
npm install react-grid-layout@1.4.4 \
  @tanstack/react-query@5.0.0 \
  drizzle-orm@0.33.0 \
  drizzle-zod@0.5.1 \
  zod@3.23.8 \
  @neondatabase/serverless

# UI dependencies
npm install @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-label \
  @radix-ui/react-toast \
  @radix-ui/react-separator \
  lucide-react

# Utility dependencies
npm install class-variance-authority \
  clsx \
  tailwind-merge

# Development dependencies
npm install -D drizzle-kit@0.24.0 \
  @types/react-grid-layout \
  @types/node

# Tailwind (if not already installed)
npm install -D tailwindcss postcss autoprefixer
```

### Minimal Installation (Bare Essentials)

For the absolute minimum to get started:

```bash
npm install react-grid-layout \
  @tanstack/react-query \
  drizzle-orm \
  drizzle-zod \
  zod \
  @radix-ui/react-dialog \
  @radix-ui/react-select \
  lucide-react
```

## Package Size Analysis

Total bundle size impact:

- **Core Dashboard**: ~180KB (minified + gzipped)
- **UI Components**: ~90KB
- **Grid Layout**: ~50KB
- **Database Layer**: ~100KB
- **Icons**: ~30KB (tree-shaken)

**Total Impact**: ~450KB minified + gzipped

### Optimization Tips

1. **Tree Shaking**: Ensure your bundler supports tree shaking for lucide-react
2. **Code Splitting**: Load dashboard route separately
3. **Lazy Loading**: Use React.lazy() for dashboard components

```typescript
const DashboardBuilder = React.lazy(() => import('./pages/DashboardBuilder'));
```

## Dependency Conflicts

### Known Issues

#### React Grid Layout + TypeScript

If you see type errors with react-grid-layout:

```bash
npm install -D @types/react-grid-layout
```

#### Tailwind CSS Class Conflicts

If using `tailwind-merge`, ensure it's configured:

```typescript
import { cn } from './lib/utils';

// In components
className={cn("base-classes", props.className)}
```

#### Zod Version Conflicts

Ensure drizzle-zod and zod versions are compatible:

```json
{
  "zod": "^3.23.8",
  "drizzle-zod": "^0.5.1"
}
```

## Upgrade Path

### From 1.x to 2.x (Future)

When upgrading major versions:

1. Check CHANGELOG.md for breaking changes
2. Update dependencies:
```bash
npm update react-grid-layout @tanstack/react-query drizzle-orm
```
3. Run database migrations:
```bash
npm run db:push
```
4. Test all dashboard functionality

## Verification Checklist

After installation, verify:

- [ ] `npm list react-grid-layout` shows correct version
- [ ] `npm list @tanstack/react-query` shows v5.x
- [ ] `npm list drizzle-orm` shows v0.33.x
- [ ] PostgreSQL database is accessible
- [ ] Environment variables are set
- [ ] Tailwind CSS is configured
- [ ] Grid layout CSS is imported

## Troubleshooting

### Installation Issues

**Problem**: `npm install` fails with peer dependency errors

**Solution**: Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

**Problem**: Type errors with react-grid-layout

**Solution**: Install type definitions:
```bash
npm install -D @types/react-grid-layout
```

**Problem**: CSS not loading

**Solution**: Ensure CSS imports are in correct order:
```css
@import 'react-grid-layout/css/styles.css';
@import 'react-resizable/css/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Support

For dependency-related issues:

1. Check package.json versions match requirements
2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
3. Verify Node.js version: `node --version` (should be 18+)
4. Check for conflicting versions: `npm list <package-name>`

## License Compliance

All dependencies use MIT or similar permissive licenses:

- react-grid-layout: MIT
- @tanstack/react-query: MIT
- drizzle-orm: Apache 2.0
- zod: MIT
- Radix UI: MIT
- lucide-react: ISC

No GPL or copyleft licenses in dependency tree.
