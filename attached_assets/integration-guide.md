# Integration Guide for o5g34xapps

## Quick Start

```bash
# Install the module
npm install @velocity-ats/missing-data-generator

# Or copy the module folder directly
cp -r missing-data-module/ /path/to/o5g34xapps/modules/
```

## Integration Steps

### 1. Database Setup

Run the database schema:
```sql
-- Execute missing-data-module/src/schemas/database.sql
-- This creates the required tables and indexes
```

### 2. API Endpoints

Add these routes to your Express server:

```javascript
// In your o5g34xapps routes file
import { createClientRequirement, getClientRequirements } from '@velocity-ats/missing-data-generator';

app.post('/api/client-requirements', async (req, res) => {
  // Implementation provided in the module
});

app.get('/api/client-requirements', async (req, res) => {
  // Implementation provided in the module  
});
```

### 3. Frontend Integration

```jsx
// In your React application
import { MissingDataGenerator, ClientPortal } from '@velocity-ats/missing-data-generator';

function App() {
  return (
    <div>
      <MissingDataGenerator 
        apiBaseUrl="/api"
        onRequirementCreated={(req) => console.log('Created:', req.id)}
      />
      <ClientPortal clientName="Your Client" />
    </div>
  );
}
```

### 4. Configuration

```javascript
// Configure the module
import { setModuleConfig } from '@velocity-ats/missing-data-generator';

setModuleConfig({
  apiBaseUrl: process.env.API_BASE_URL,
  theme: {
    primaryColor: '#your-brand-color',
    accentColor: '#your-accent-color'
  }
});
```

## Module Features

✅ **Complete Workflow**: Contract analysis → Missing data identification → Client portal generation
✅ **Database Integration**: PostgreSQL schemas with full audit trail
✅ **API Layer**: RESTful endpoints for all operations
✅ **React Components**: Fully functional UI components
✅ **TypeScript Support**: Full type definitions included
✅ **Customizable**: Configurable categories, themes, and behaviors

## File Structure

```
missing-data-module/
├── src/
│   ├── components/           # React components
│   ├── api/                 # API utilities
│   ├── types/               # TypeScript definitions
│   ├── schemas/             # Database schemas
│   └── config.ts            # Module configuration
├── dist/                    # Compiled output
├── package.json            # NPM package definition
└── README.md               # Module documentation
```

## API Compatibility

The module follows RESTful conventions compatible with o5g34xapps:

- `POST /api/client-requirements` - Create new requirement
- `GET /api/client-requirements` - List requirements (with optional client filter)
- `GET /api/client-notifications/:client` - Get client notifications
- `PATCH /api/client-notifications/:id/read` - Mark notification as read

## Testing

```javascript
// Test the workflow
const requirement = await createClientRequirement({
  clientName: 'Test Client',
  contractTitle: 'Test Contract',
  contractId: 'TEST-001',
  categories: [/* your categories */],
  dueDate: '2025-09-01',
  requestedBy: 'System Test',
  priority: 'High'
});

console.log('Created requirement:', requirement.id);
```

## Support

Module ID: **3n4ir3**
Version: **1.0.0**
Compatibility: o5g34xapps integration ready