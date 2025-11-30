# VELOCITY User Module - Critical Architecture Fix
## Current Problems:
1. ❌ Contractors are SEPARATE from users - can't log in
2. ❌ No project assignments
3. ❌ No contractor portal access
4. ❌ No document sharing mechanism
5. ❌ No staffing partner (Amber) support
6. ❌ Minimal user fields (no phone, address, company)

## Solution: Unified User Architecture

### PHASE 1: Database Schema Updates (IMMEDIATE)
1. Add to users table:
   - user_type: 'employee' | 'contractor' | 'staffing_partner' | 'approver'
   - phone VARCHAR(20)
   - company_id INT (for staffing partners)
   - contractor_id INT (link to contractors table)
   - portal_access BOOLEAN (can login to contractor portal?)
   - notification_email VARCHAR(255) (separate from login email)

2. Create project_assignments table:
   - user_id, project_id, role, assigned_date, status

3. Create contractor_document_access table:
   - contractor_id, document_id, access_type, permission_date

4. Create staffing_partners table:
   - id, company_name, contact_email, contact_phone, service_types, active

### PHASE 2: API Updates
1. POST /api/users - support creating contractor users with optional contractor_id
2. POST /api/auth/contractor-login - contractor portal authentication
3. POST /api/users/:id/project-assign - assign user to projects
4. POST /api/contractors/:id/documents/:doc_id/share - share documents
5. GET /api/users - filter by user_type

### PHASE 3: Frontend Updates
1. User creation form:
   - user_type selector (employee/contractor/staffing_partner)
   - If contractor: link to existing contractor or create new
   - phone, address fields
   - projects multi-select
   - notification preferences

2. Contractor portal:
   - Login as contractor
   - View assigned projects/SOWs
   - Download documents
   - Upload signatures
   - Receive notifications

3. Staffing view (Amber):
   - For staffing partners
   - Show placements, rates, utilization
   - Alerts for capacity/cost

## Why This Matters:
- Contractors MUST be users to receive emails, log in, access documents
- Projects need assignments to show who's doing what
- Document sharing enables signatures and portals
- Staffing partners need visibility into their workers
