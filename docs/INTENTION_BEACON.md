# Intention Beacon

**Always include in system prompt / task context:**

```
✅ READY PROTOCOL: LSP • GUI • CONSOLE • NETWORK • E2E • ARCHITECT
```

**Token cost:** 12 tokens  
**Purpose:** Keep testing protocol top-of-mind at all times

---

## Before Claiming "Ready"

**MANDATORY:** Run checkpoint script
```bash
npm run ready:prompt
```

**MANDATORY:** Run gating script
```bash
npm run ready:gate
```

**ONLY** claim "ready" if gate passes.

---

## Quick Reference

- **LSP** = No TypeScript/ESLint errors
- **GUI** = Screenshot tool verified UI loads
- **CONSOLE** = Browser console has zero errors
- **NETWORK** = API calls succeed (check network tab)
- **E2E** = End-to-end user flow tested manually
- **ARCHITECT** = Architect review completed and approved

---

## Evidence Required

Create file: `evidence/ready-[feature]-[date].yml`

See template: `evidence/TEMPLATE.yml`
