# Dashboard Builder API Reference

Complete API documentation for the Dashboard Builder Module backend endpoints.

## Base URL

All API endpoints are prefixed with `/api/dashboard`

## Authentication

Currently uses a default user ID (`"default-user"`). In production, integrate with your authentication system:

```typescript
// Modify in server/routes.ts
const userId = req.user?.id || req.session?.userId;
```

## Endpoints

### Modules

#### GET `/api/dashboard/modules`

Retrieve available dashboard modules (widgets).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter modules by category |

**Categories:**
- `recruitment` - Hiring and candidate metrics
- `procurement` - Vendor and procurement tracking
- `project_mgmt` - Project portfolio management
- `it_ops` - IT systems and operations
- `compliance` - VMS and contractor compliance
- `finance` - Financial metrics and budgets
- `productivity` - Quick actions and utilities

**Example Request:**
```http
GET /api/dashboard/modules?category=recruitment
```

**Example Response:**
```json
[
  {
    "id": 1,
    "type": "kpi",
    "name": "Total Candidates",
    "description": "Total candidates in pipeline",
    "icon": "Users",
    "category": "recruitment",
    "defaultSize": {
      "w": 3,
      "h": 2,
      "minW": 2,
      "minH": 2
    },
    "configSchema": null,
    "isEnabled": true,
    "createdAt": "2025-11-13T00:00:00.000Z"
  },
  {
    "id": 2,
    "type": "kpi",
    "name": "Active Requisitions",
    "description": "Open positions being recruited for",
    "icon": "Briefcase",
    "category": "recruitment",
    "defaultSize": {
      "w": 3,
      "h": 2,
      "minW": 2,
      "minH": 2
    },
    "configSchema": null,
    "isEnabled": true,
    "createdAt": "2025-11-13T00:00:00.000Z"
  }
]
```

**Error Responses:**

```json
{
  "error": "Failed to get modules"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Templates

#### GET `/api/dashboard/templates`

Retrieve dashboard templates (pre-configured layouts).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| role | string | No | Filter templates by role |

**Available Roles:**
- `recruiter` - Recruitment specialists
- `cpo` - Chief Procurement Officer
- `senior_pm` - Senior Project Managers
- `it_director` - IT Directors
- `vms_specialist` - VMS/Contractor specialists
- `csuite` - C-Suite Executives
- `hr_director` - HR Directors
- `vendor_manager` - Vendor Managers

**Example Request:**
```http
GET /api/dashboard/templates?role=recruiter
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Recruiter Dashboard",
    "description": "Essential metrics for recruitment teams - candidate flow, time to hire, source effectiveness",
    "role": "recruiter",
    "layout": [
      {
        "i": "1",
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 2,
        "moduleId": 1
      },
      {
        "i": "2",
        "x": 3,
        "y": 0,
        "w": 3,
        "h": 2,
        "moduleId": 2
      }
    ],
    "isPublic": true,
    "isDefault": false,
    "thumbnailUrl": null,
    "createdBy": null,
    "createdAt": "2025-11-13T00:00:00.000Z",
    "updatedAt": "2025-11-13T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### POST `/api/dashboard/templates/apply`

Apply a template to create a new user layout.

**Request Body:**

```typescript
{
  templateId: number;
}
```

**Example Request:**
```http
POST /api/dashboard/templates/apply
Content-Type: application/json

{
  "templateId": 1
}
```

**Example Response:**
```json
{
  "id": 15,
  "userId": "default-user",
  "name": "Recruiter Dashboard",
  "layout": [
    {
      "i": "1",
      "x": 0,
      "y": 0,
      "w": 3,
      "h": 2,
      "moduleId": 1
    }
  ],
  "isDefault": false,
  "themeId": null,
  "createdAt": "2025-11-13T10:30:00.000Z",
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

**Error Responses:**

```json
{
  "error": "Template not found"
}
```

**Status Codes:**
- `201` - Layout created successfully
- `404` - Template not found
- `500` - Server error

---

### User Layouts

#### GET `/api/dashboard/layouts`

Retrieve all saved layouts for the current user.

**Example Request:**
```http
GET /api/dashboard/layouts
```

**Example Response:**
```json
[
  {
    "id": 10,
    "userId": "default-user",
    "name": "My Custom Dashboard",
    "layout": [
      {
        "i": "1",
        "x": 0,
        "y": 0,
        "w": 6,
        "h": 4,
        "moduleId": 5
      }
    ],
    "isDefault": true,
    "themeId": 2,
    "createdAt": "2025-11-12T15:00:00.000Z",
    "updatedAt": "2025-11-13T09:15:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### GET `/api/dashboard/layouts/default`

Retrieve the user's default layout.

**Example Request:**
```http
GET /api/dashboard/layouts/default
```

**Example Response:**
```json
{
  "id": 10,
  "userId": "default-user",
  "name": "My Custom Dashboard",
  "layout": [...],
  "isDefault": true,
  "themeId": 2,
  "createdAt": "2025-11-12T15:00:00.000Z",
  "updatedAt": "2025-11-13T09:15:00.000Z"
}
```

**If no default layout:**
```json
null
```

**Status Codes:**
- `200` - Success (may return null)
- `500` - Server error

---

#### POST `/api/dashboard/layouts`

Save a new custom dashboard layout.

**Request Body:**

```typescript
{
  name: string;
  layout: LayoutItem[];
  isDefault?: boolean;
  themeId?: number;
}

// LayoutItem structure:
{
  i: string;           // Unique item ID
  x: number;           // Grid X position
  y: number;           // Grid Y position
  w: number;           // Width in grid units
  h: number;           // Height in grid units
  moduleId: number;    // Reference to dashboard module
}
```

**Example Request:**
```http
POST /api/dashboard/layouts
Content-Type: application/json

{
  "name": "My Custom Dashboard",
  "layout": [
    {
      "i": "1",
      "x": 0,
      "y": 0,
      "w": 3,
      "h": 2,
      "moduleId": 1
    },
    {
      "i": "2",
      "x": 3,
      "y": 0,
      "w": 6,
      "h": 4,
      "moduleId": 5
    }
  ],
  "isDefault": true,
  "themeId": 1
}
```

**Example Response:**
```json
{
  "id": 16,
  "userId": "default-user",
  "name": "My Custom Dashboard",
  "layout": [...],
  "isDefault": true,
  "themeId": 1,
  "createdAt": "2025-11-13T10:45:00.000Z",
  "updatedAt": "2025-11-13T10:45:00.000Z"
}
```

**Validation Errors:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

**Status Codes:**
- `201` - Layout created successfully
- `400` - Validation error
- `500` - Server error

---

#### PUT `/api/dashboard/layouts/:id`

Update an existing layout (typically for theme changes).

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Layout ID to update |

**Request Body:**

```typescript
{
  themeId?: number;
  name?: string;
  layout?: LayoutItem[];
  isDefault?: boolean;
}
```

**Example Request:**
```http
PUT /api/dashboard/layouts/10
Content-Type: application/json

{
  "themeId": 3
}
```

**Example Response:**
```json
{
  "id": 10,
  "userId": "default-user",
  "name": "My Custom Dashboard",
  "layout": [...],
  "isDefault": true,
  "themeId": 3,
  "createdAt": "2025-11-12T15:00:00.000Z",
  "updatedAt": "2025-11-13T10:50:00.000Z"
}
```

**Error Responses:**
```json
{
  "error": "Layout not found"
}
```

**Status Codes:**
- `200` - Layout updated successfully
- `404` - Layout not found
- `500` - Server error

---

#### DELETE `/api/dashboard/layouts/:id`

Delete a saved user layout.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Layout ID to delete |

**Example Request:**
```http
DELETE /api/dashboard/layouts/10
```

**Example Response:**
```json
{
  "success": true,
  "message": "Layout deleted successfully"
}
```

**Error Responses:**
```json
{
  "error": "Layout not found"
}
```

**Status Codes:**
- `200` - Layout deleted successfully
- `404` - Layout not found
- `500` - Server error

---

### Themes

#### GET `/api/dashboard/themes`

Retrieve all available themes.

**Example Request:**
```http
GET /api/dashboard/themes
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Modern Professional",
    "description": "Clean, modern design with blue accents",
    "tokens": {
      "colors": {
        "primary": { "h": 221, "s": 83, "l": 53 },
        "background": { "h": 0, "s": 0, "l": 100 },
        "foreground": { "h": 222, "s": 47, "l": 11 },
        "muted": { "h": 210, "s": 40, "l": 96 },
        "accent": { "h": 210, "s": 40, "l": 96 }
      },
      "spacing": {
        "base": 4,
        "scale": 1.5
      },
      "typography": {
        "fontFamily": "Inter, sans-serif",
        "baseSize": 14
      },
      "borderRadius": {
        "sm": 4,
        "md": 8,
        "lg": 12
      }
    },
    "isPublic": true,
    "createdAt": "2025-11-13T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### GET `/api/dashboard/themes/:id`

Retrieve a specific theme by ID.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Theme ID |

**Example Request:**
```http
GET /api/dashboard/themes/1
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Modern Professional",
  "description": "Clean, modern design with blue accents",
  "tokens": {...},
  "isPublic": true,
  "createdAt": "2025-11-13T00:00:00.000Z"
}
```

**Error Responses:**
```json
{
  "error": "Theme not found"
}
```

**Status Codes:**
- `200` - Success
- `404` - Theme not found
- `500` - Server error

---

#### GET `/api/dashboard/themes/:id/css`

Generate CSS variables for a theme.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Theme ID |

**Example Request:**
```http
GET /api/dashboard/themes/1/css
```

**Example Response:**
```css
--color-primary: 221 83% 53%;
--color-background: 0 0% 100%;
--color-foreground: 222 47% 11%;
--color-muted: 210 40% 96%;
--color-accent: 210 40% 96%;
--spacing-base: 4px;
--spacing-scale: 1.5;
--font-family: Inter, sans-serif;
--font-size-base: 14px;
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
```

**Content-Type:** `text/css`

**Status Codes:**
- `200` - Success
- `404` - Theme not found
- `500` - Server error

---

### Seeding

#### POST `/api/dashboard/seed`

Re-seed the database with initial modules, templates, and themes. **Use with caution in production.**

**Example Request:**
```http
POST /api/dashboard/seed
```

**Example Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

**Status Codes:**
- `200` - Seeding successful
- `500` - Server error

---

## Data Models

### DashboardModule

```typescript
{
  id: number;
  type: 'kpi' | 'chart' | 'table' | 'widget' | 'custom';
  name: string;
  description: string | null;
  icon: string | null;        // Lucide icon name
  category: string | null;
  defaultSize: {
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
  configSchema: object | null;
  isEnabled: boolean;
  createdAt: Date;
}
```

### DashboardTemplate

```typescript
{
  id: number;
  name: string;
  description: string | null;
  role: string | null;
  layout: LayoutItem[];
  isPublic: boolean;
  isDefault: boolean;
  thumbnailUrl: string | null;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### UserDashboardLayout

```typescript
{
  id: number;
  userId: string;
  name: string;
  layout: LayoutItem[];
  isDefault: boolean;
  themeId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### ThemeToken

```typescript
{
  id: number;
  name: string;
  description: string | null;
  tokens: {
    colors?: {
      [key: string]: { h: number; s: number; l: number };
    };
    spacing?: {
      base: number;
      scale: number;
    };
    typography?: {
      fontFamily: string;
      baseSize: number;
    };
    borderRadius?: {
      sm: number;
      md: number;
      lg: number;
    };
  };
  isPublic: boolean;
  createdAt: Date;
}
```

### LayoutItem

```typescript
{
  i: string;           // Unique item identifier
  x: number;           // X position in grid
  y: number;           // Y position in grid
  w: number;           // Width in grid units (max 12)
  h: number;           // Height in grid units
  moduleId: number;    // Foreign key to dashboard_modules
}
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `404` - Resource Not Found
- `500` - Internal Server Error

### Validation Errors

For POST/PUT requests with invalid data:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/dashboard', limiter);
```

## CORS Configuration

For cross-origin requests, configure CORS:

```typescript
import cors from 'cors';

app.use('/api/dashboard', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

## Authentication Integration

To integrate with your auth system:

```typescript
// Middleware example
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply to routes
app.get('/api/dashboard/layouts', requireAuth, async (req, res) => {
  const userId = req.user.id;
  // ... rest of handler
});
```

## Webhooks (Future)

Coming soon: Webhook support for layout changes and template updates.

```typescript
POST /api/dashboard/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["layout.created", "layout.updated"]
}
```
