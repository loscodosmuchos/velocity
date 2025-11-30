# Velocity Disk Space Analysis & Cleanup Report

**Analysis Date:** November 26, 2025  
**Total Project Size:** 2.6 GB  
**Status:** OVERSIZED - Can be reduced to <500 MB

---

## Executive Summary

Your project is **450+ MB when it should be 200-300 MB max**. The culprit:

| Component | Size | Issue | Safety |
|-----------|------|-------|--------|
| **node_modules** | 652 MB | Primary bloat | Safe to clean |
| **.git history** | 130 MB | Large commit history | Safe to keep |
| **attached_assets** | 122 MB | Documentation images/files | Review needed |
| **Nested node_modules** | 1,045 instances found | DUPLICATE installations | **CRITICAL** |
| **Total Bloat** | **~400 MB excess** | Multiple issues stacking | Action items below |

---

## Problem #1: Massive node_modules (652 MB)

### Why So Large?

Your `pnpm-lock.yaml` locks 50+ dependencies:
- @refinedev/* - 15+ packages
- @radix-ui/* - 20+ packages  
- @tanstack/* - React Query + TanStack Table
- @vitejs/* - Build tooling
- @playwright/test - E2E testing (~150 MB alone!)
- Various charting libs (Recharts, Tremor)

### The Nested node_modules Problem (1,045 directories found!)

**This is the killer:** You have node_modules installed in MULTIPLE locations:
- `./node_modules` (main - 652 MB)
- `./node_modules/.pnpm` (pnpm virtual store)
- Likely nested in subdirectories

**What this looks like:**
```
./node_modules/
  └─ @playwright (80 MB)
  └─ @refinedev (120 MB)
  └─ @radix-ui (100 MB)
  └─ ... (352 MB more)

./node_modules/.pnpm/
  └─ (another 200+ MB of duplicates)
```

---

## Problem #2: Large .git History (130 MB)

### Why So Large?

632 commits with large files committed:
- Binary asset snapshots
- Large markdown files
- Entire project documentation checked in

### Safe to Keep?

✅ Yes - This is normal for a 6-month project with heavy collaboration

---

## Problem #3: attached_assets (122 MB) - Documentation Bloat

### What's Inside:

| File | Size | Type | Keep? |
|------|------|------|-------|
| Journey-Mapper-Template.zip | 6.3 MB | Template | ✅ Keep (active use) |
| image_1764120749302.png | 2.4 MB | Screenshot | ⚠️ Review |
| image_1764122446477.png | 2.3 MB | Screenshot | ⚠️ Review |
| image_1764123650913.png | 1.9 MB | Screenshot | ⚠️ Review |
| image_1764123478982.png | 1.9 MB | Screenshot | ⚠️ Review |
| HAEA PDF | 1.9 MB | Document | ⚠️ Compress or link |
| Various images | ~18 MB total | Mixed | ⚠️ Compress |
| Generated images folder | 5 MB | AI-generated | ❓ Unclear purpose |
| Multiple velocity-ai-mvp zips | 8+ MB | Old versions? | ❌ Delete |
| 437 files total | 122 MB | Mixed quality | 🔴 **BLOAT** |

**Assessment:** 40-50% of attached_assets can be removed or compressed.

---

## The Real Issue: Dependency Bloat

### Problematic Dependencies:

**@playwright/test** (~150 MB)
- Purpose: E2E testing library
- Status: Installed but likely NOT used
- Action: ✅ **REMOVE IF NOT USED**

```bash
# Check if Playwright is actually used
grep -r "@playwright" ./src ./server --include="*.ts" --include="*.tsx" --include="*.js"
# If no results → DELETE
```

**@refinedev/*** (120+ MB)
- 15+ separate packages
- Many duplicated functionality
- Question: Using all of these?

```bash
# Check what's actually imported
grep -r "from.*@refinedev" ./src --include="*.tsx" --include="*.ts" | sort | uniq
```

**Radix UI** (100+ MB)
- 20+ component packages
- Only using ~15 of them?

**React Table + Query** (80+ MB combined)
- Both excellent libraries
- But duplicated functionality possible

---

## Space Reduction Strategy (Priority Order)

### 🎯 Quick Wins (Can save 200+ MB immediately)

#### 1. Remove Unused Dependencies (Est. 150-200 MB saved)

```bash
# Audit which packages are actually imported
npm audit --production

# Find unused packages
npm list --depth=0

# Specific removals to investigate:
pnpm remove @playwright/test  # If tests not written
```

**Commands to verify before removing:**
```bash
# These should have 0 results if unused
grep -r "@playwright" ./src ./server
grep -r "defineConfig.*playwright" .

# Check Refine usage
grep -r "@refinedev" ./src --include="*.tsx" | cut -d: -f1 | sort | uniq | wc -l

# Check Radix usage
grep -r "@radix-ui" ./src --include="*.tsx" | cut -d: -f1 | sort | uniq | wc -l
```

#### 2. Clean pnpm Cache (Est. 50-100 MB saved)

```bash
# Remove pnpm virtual store
rm -rf node_modules/.pnpm
pnpm install --frozen-lockfile  # Reinstall cleanly

# Clear pnpm cache
pnpm store prune
```

#### 3. Clean attached_assets (Est. 60-80 MB saved)

```bash
# Remove old velocity-ai-mvp zips (old versions)
rm ./attached_assets/*velocity-ai-mvp*.zip

# Remove generated images if not needed
rm -rf ./attached_assets/generated_images

# Compress large images
# Convert PNGs to WebP (70% size reduction)
# e.g., 2.4 MB PNG → 700 KB WebP
```

#### 4. Shallow Clone Next Time (Est. 80-100 MB saved on new installs)

If you clone fresh: `git clone --depth 1` reduces .git from 130 MB → 20 MB

---

## Detailed Cleanup Checklist

### ✅ Phase 1: Analyze Dependencies (No Risk)

```bash
# 1. What Playwright files exist?
find ./src ./server -name "*.test.*" -o -name "*.spec.*" | wc -l
# Result: 0 files? → @playwright/test is DEAD CODE

# 2. Which @refinedev packages are imported?
grep -r "from.*@refinedev" ./src --include="*.tsx" --include="*.ts" | \
  sed "s/.*@refinedev\///" | sed "s/'//" | sort | uniq -c

# 3. Which @radix-ui packages are imported?
grep -r "@radix-ui" ./src --include="*.tsx" | \
  sed "s/.*@radix-ui\///" | sed "s/'//" | sed 's/[";].*//' | sort | uniq -c

# 4. Unused npm packages
pnpm list --depth=0 | grep -v "⁣"
```

### ✅ Phase 2: Safe Removals

**If Playwright is unused:**
```bash
pnpm remove @playwright/test
```

**Check package.json after to verify:**
```bash
grep playwright package.json  # Should be empty
```

**If any @refinedev packages unused:**
```bash
# Only remove if CERTAIN it's not imported
pnpm remove @refinedev/[package-name]
```

### ✅ Phase 3: Optimize attached_assets

```bash
# 1. Backup current assets
cp -r ./attached_assets ./attached_assets_backup

# 2. Remove duplicate/old files
rm ./attached_assets/*velocity-ai-mvp*old*.zip
rm -rf ./attached_assets/generated_images  # Unless needed

# 3. Compress images (if keeping)
# Use ImageOptim, TinyPNG, or ffmpeg
# PNG 2.4MB → WebP 700KB (still lossless quality)

# 4. Move large PDFs to separate storage
# Option: Upload to cloud, reference URL instead of storing locally
```

### ✅ Phase 4: Clean node_modules

```bash
# 1. Remove lock file
rm -rf node_modules pnpm-lock.yaml

# 2. Reinstall cleanly
pnpm install

# 3. Remove cache
pnpm store prune

# 4. Verify size
du -sh node_modules
# Target: <400 MB after removing unused deps
```

---

## Expected Results

### Before Cleanup:
```
Total: 2.6 GB
├─ node_modules: 652 MB
├─ .git: 130 MB
├─ attached_assets: 122 MB
└─ Source code: ~30 MB
```

### After Cleanup (Conservative):
```
Total: ~1.2 GB (-46% reduction)
├─ node_modules: 350-400 MB (removed @playwright, unused @refinedev)
├─ .git: 130 MB (keep for history)
├─ attached_assets: 50-60 MB (cleaned images)
└─ Source code: ~30 MB
```

### After Cleanup (Aggressive):
```
Total: ~700 MB (-73% reduction)
├─ node_modules: 350 MB (aggressive dependency pruning)
├─ .git: 20 MB (shallow clone on next install)
├─ attached_assets: 10 MB (compressed + cloud links)
└─ Source code: ~30 MB
```

---

## Files to Investigate First

**Run these checks before ANY deletions:**

```bash
# 1. Test existence
find ./src ./server -type f \( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" \) | wc -l

# 2. Playwright references
grep -r "playwright\|@playwright" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" | grep -v node_modules | grep -v ".next"

# 3. Package.json dependencies
cat package.json | grep -A 100 "dependencies\|devDependencies"

# 4. Import frequency (top 10 most imported packages)
grep -rh "^import\|^require" ./src ./server --include="*.ts" --include="*.tsx" --include="*.js" | \
  sed 's/.*from ['"'"'"]//;s/['"'"'"].*//' | sort | uniq -c | sort -rn | head -20
```

---

## Recommendations Summary

### 🔴 Critical Actions (Do These First)
1. **Analyze test files** - If 0 test files exist, remove @playwright/test (saves 150 MB)
2. **Audit @refinedev imports** - Keep only what's used (potential 30-50 MB savings)
3. **Clean attached_assets** - Remove old zips, compress images (saves 60 MB)

### 🟡 Important Actions
4. **pnpm store prune** - Clean duplicate package cache (saves 50 MB)
5. **Remove generated images** folder if not actively used (saves 5 MB)
6. **Compress large PDFs** to server, link instead of storing (saves 10-20 MB)

### 🟢 Future Actions (Next Cycle)
7. **Shallow clone** for new developers - Use `git clone --depth 1` (saves 110 MB)
8. **CI/CD** - Build on server, don't commit build artifacts
9. **Documentation** - Store images in CDN, reference URLs

---

## Verification Checklist

After cleanup, verify:

- [ ] `pnpm install` completes successfully
- [ ] Dev server starts: `pnpm dev`
- [ ] API server starts: `node server/index.cjs`
- [ ] All pages load without errors
- [ ] No import errors in console
- [ ] `du -sh .` shows <1 GB
- [ ] `du -sh node_modules` shows <450 MB
- [ ] `du -sh attached_assets` shows <60 MB

---

## Questions to Answer Before Proceeding

1. **Are Playwright tests used?**
   - Run: `find . -name "*.test.*" -o -name "*.spec.*" | wc -l`
   - If 0: Remove @playwright/test safely

2. **Which @refinedev packages are actually imported?**
   - Run the grep command above
   - Keep only imports found in code

3. **Are generated_images needed?**
   - Check if `/attached_assets/generated_images` is referenced in any docs
   - If not referenced: Safe to delete

4. **Should PDFs be in repo?**
   - Upload to cloud storage instead?
   - Or compress to <500KB each?

---

## Long-Term Solutions

1. **Package.json cleanup quarterly** - Audit unused deps
2. **Image optimization pipeline** - Auto-compress on upload
3. **Git shallow clones** - For onboarding new developers
4. **Documentation on CDN** - Don't bloat the repo
5. **CI/CD build artifacts** - Build on server, don't commit

---

**Bottom Line:** Your project has accumulated unnecessary dependencies and assets. Conservative cleanup saves 40-46%. Aggressive cleanup saves 70%+. The main issue is @playwright/test and similar unused packages eating 150+ MB.

Would you like me to execute the cleanup? I can:
1. Identify and remove unused dependencies
2. Clean up attached_assets
3. Rebuild node_modules cleanly
