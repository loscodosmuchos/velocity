#!/bin/bash
# Proactive Issue Detection - Run this to find unknown problems

echo "=== COMPREHENSIVE DATA AUDIT ==="
echo ""
echo "1. CHECKING ID RANGES..."
psql -h $PGHOST -U $PGUSER -d $PGDATABASE << 'SQL'
SELECT table_name, min_id, max_id, count FROM (
  SELECT 'invoices' as table_name, MIN(id)::text as min_id, MAX(id)::text as max_id, COUNT(*) as count FROM invoices
  UNION ALL SELECT 'timecards', MIN(id)::text, MAX(id)::text, COUNT(*) FROM timecards
  UNION ALL SELECT 'purchase_orders', MIN(id)::text, MAX(id)::text, COUNT(*) FROM purchase_orders
  UNION ALL SELECT 'change_orders', MIN(id)::text, MAX(id)::text, COUNT(*) FROM change_orders
) t ORDER BY table_name;
SQL

echo ""
echo "2. CHECKING STATUS VALUES..."
psql -h $PGHOST -U $PGUSER -d $PGDATABASE << 'SQL'
SELECT 'Invoice Statuses' as type, array_agg(DISTINCT status ORDER BY status) as values FROM invoices
UNION ALL SELECT 'Timecard Statuses', array_agg(DISTINCT status ORDER BY status) FROM timecards
UNION ALL SELECT 'PO Statuses', array_agg(DISTINCT status ORDER BY status) FROM purchase_orders
UNION ALL SELECT 'Change Order Statuses', array_agg(DISTINCT status ORDER BY status) FROM change_orders;
SQL

echo ""
echo "3. CHECKING FOREIGN KEY INTEGRITY..."
psql -h $PGHOST -U $PGUSER -d $PGDATABASE << 'SQL'
SELECT 'Valid Invoice→PO FKs' as check_name, COUNT(*) as count FROM invoices i 
WHERE EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = i.po_id)
UNION ALL SELECT 'Invalid Invoice→PO FKs', COUNT(*) FROM invoices i 
WHERE NOT EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = i.po_id)
UNION ALL SELECT 'Valid Timecard→PO FKs', COUNT(*) FROM timecards t 
WHERE EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = t.po_id)
UNION ALL SELECT 'Invalid Timecard→PO FKs', COUNT(*) FROM timecards t 
WHERE NOT EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = t.po_id);
SQL

echo ""
echo "4. AUDIT: What IDs should actually be shown?"
psql -h $PGHOST -U $PGUSER -d $PGDATABASE << 'SQL'
SELECT 
  'timecard-' || id as correct_approval_id,
  'Timecard' as type,
  id,
  status
FROM timecards WHERE status = 'Pending'
UNION ALL
SELECT 
  'invoice-' || id,
  'Invoice',
  id,
  status
FROM invoices WHERE status IN ('Draft', 'Submitted', 'Pending')
ORDER BY type, id;
SQL

echo ""
echo "=== AUDIT COMPLETE ==="
