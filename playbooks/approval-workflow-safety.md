# Approval Workflow Safety Playbook
**Ensures every approval is transaction-safe and data-consistent**

## Pre-Approval Validation Checklist
- [ ] Contractor exists: `SELECT id FROM contractors WHERE id = $1`
- [ ] Invoice/timecard/PO exists: `SELECT id FROM {table} WHERE id = $1`
- [ ] Status is 'Pending' (not already approved): `SELECT status FROM {table} WHERE id = $1 AND status = 'Pending'`
- [ ] Amount > 0 and within budget
- [ ] No duplicate approval (check approval_logs last 5 minutes)

## Safe Approval Transaction
```sql
BEGIN;
  UPDATE invoices SET status = 'Approved', approved_at = NOW(), approved_by = $1 WHERE id = $2;
  INSERT INTO approval_audit (resource_type, resource_id, action, user_id) VALUES ('invoice', $2, 'approve', $1);
  UPDATE purchase_orders SET spent_amount = spent_amount + {invoice_amount} WHERE id = {po_id};
COMMIT;
```

## If ANY Step Fails
- PostgreSQL automatic ROLLBACK (no partial updates)
- Return 400/500 error with specific reason
- DO NOT retry silently
- Log error for investigation

## Post-Approval (React State Only, No Reload)
- Update React state: setApprovals([...updated array])
- Recalculate KPI cards from state
- Show toast notification
- Do NOT call window.location.reload()

## Error Handling Map
| Error | Cause | HTTP Code | Fix |
|---|---|---|---|
| "FK Constraint" | Contractor doesn't exist | 400 | Validate FK before UPDATE |
| "Budget exceeded" | PO limit reached | 400 | Check budget in transaction |
| "Already approved" | Status not pending | 409 | Add status check |
| "Timeout" | DB taking too long | 500 | Retry, then escalate |

