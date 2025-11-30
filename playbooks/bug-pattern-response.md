# Bug Pattern Response Playbook
**What to do when Bug Pattern Detection finds a potential issue**

## When High-Likelihood Pattern Detected (>75%)

### Example: Page Reload Pattern (72% likelihood)
1. Pattern detected: `window.location.reload()` found in code
2. Likelihood: 72% likely to repeat (architectural pattern + copy-paste + state-management)
3. Files affected: Checked grep, found in 2 files
4. Action: FIX ALL OCCURRENCES NOW

### Steps to Respond
1. [ ] View pattern in `/admin/bug-pattern-detector`
2. [ ] Click "Scan for This Pattern" → see all occurrences
3. [ ] Fix ALL at once (don't fix one, miss others)
4. [ ] Add test case to prevent recurrence
5. [ ] Add linting rule if architectural pattern
6. [ ] Mark pattern as "resolved" in database
7. [ ] Recapture screenshots to verify fix

## When Visual Change Detected
1. [ ] Go to `/admin/visual-change-gallery`
2. [ ] Review visual change: expected or not?
3. [ ] If EXPECTED: mark resolved, document why ("Changed approval button color per design")
4. [ ] If UNEXPECTED: fix code immediately, recapture
5. [ ] Never merge code with unresolved CRITICAL visual changes

## Prevention Strategy by Likelihood Score

**75+%: CRITICAL - Act Immediately**
- Add ESLint rule to block pattern
- Create test case
- Update code review checklist

**50-74%: HIGH - Act This Sprint**
- Add linting rule
- Create test case
- Monitor for occurrences

**25-49%: MEDIUM - Add to Backlog**
- Add test case
- Add to grep scanning
- Monitor quarterly

**<25%: LOW - Monitor**
- Document pattern
- Review monthly
- Alert if frequency increases

