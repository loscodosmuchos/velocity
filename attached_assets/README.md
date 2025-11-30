# Missing Data Generator Module

A comprehensive React-based module for analyzing contracts and generating missing data requirements with automated client portal integration.

## Overview

This module transforms manual contract analysis into an intelligent, automated workflow that identifies missing information and creates actionable client requirements with real-time notifications.

## Features

- **AI-Powered Contract Analysis**: Intelligent document parsing and gap identification
- **Missing Data Categorization**: 8 predefined categories with customizable fields
- **Client Portal Integration**: Automated requirement generation and notification system
- **Real-Time Workflow**: End-to-end data flow from analysis to client completion
- **Priority Management**: Critical, High, Medium priority classification
- **Database Integration**: Full PostgreSQL backend with API endpoints

## Module Components

### Frontend Components
- `MissingDataGenerator.tsx` - Main analysis interface
- `ClientPortal.tsx` - Client-facing requirement portal
- Supporting UI components with Tailwind CSS styling

### Backend Services
- REST API endpoints for client requirements
- Notification management system
- Database schema and storage layer
- Real-time data synchronization

### Database Schema
- Client requirements table with full audit trail
- Notification system with read/unread status
- Category and field definitions with validation

## Installation

```bash
# Install dependencies
npm install @tanstack/react-query wouter lucide-react

# Database setup
npm run db:setup
```

## Usage

```typescript
import { MissingDataGenerator } from './missing-data-module';

// Basic implementation
<MissingDataGenerator 
  onRequirementCreated={(requirement) => {
    console.log('New requirement:', requirement.id);
  }}
/>
```

## API Endpoints

- `POST /api/client-requirements` - Create new requirement
- `GET /api/client-requirements` - Fetch requirements by client
- `GET /api/client-notifications/:client` - Get client notifications
- `PATCH /api/client-notifications/:id/read` - Mark notification as read

## Integration with o5g34xapps

This module is designed for seamless integration with your existing o5g34xapps infrastructure:

1. **Shared Database**: Uses existing PostgreSQL connection
2. **API Compatibility**: RESTful endpoints following your conventions
3. **Component Architecture**: Modular React components with TypeScript
4. **Styling**: Tailwind CSS compatible with your design system

## Configuration

```javascript
const config = {
  apiBaseUrl: process.env.API_BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  notificationSettings: {
    autoSend: true,
    priority: 'Critical'
  }
};
```

## Module ID: 3n4ir3

This module maintains full compatibility with the existing ATS platform while providing standalone functionality for missing data analysis workflows.