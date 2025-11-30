# Velocity Workforce Management System - Setup Guide

This guide explains how to restore and set up the Velocity project from the compressed source archive (`velocity-source.tar.gz`).

## 📦 What's in the Archive

The 413KB archive contains all source code and configuration files:

### ✅ **Included:**
- `src/` - Complete React/TypeScript frontend (80+ routes, components, pages)
- `server/` - Express.js backend API with PostgreSQL integration
- `package.json` & `pnpm-lock.yaml` - Dependency manifests
- `tsconfig.json` & `vite.config.ts` - TypeScript and build configurations  
- `index.html` & `public/` - Entry point and static assets
- `tests/` - Playwright end-to-end test suite
- `replit.md` - Comprehensive project documentation

### ❌ **Excluded (Must Restore):**
- `.git/` directory (505MB) - Git history and version control
- `node_modules/` (505MB) - NPM dependencies
- `.cache/` - Build caches (regenerated automatically)
- `playwright-report/`, `test-results/` - Test artifacts (regenerated)
- `attached_assets/` (4.9MB) - Generated images and assets
- `*.log` files - Logs (not needed)

---

## 🚀 Setup Instructions

### **1. Extract the Archive**

```bash
# Create a new project directory
mkdir velocity-project
cd velocity-project

# Extract the tar.gz archive
tar -xzf velocity-source.tar.gz

# Verify extraction
ls -la
```

You should see directories like `src/`, `server/`, `public/`, and files like `package.json`, `index.html`.

---

### **2. Restore Git Repository (Optional but Recommended)**

If you have the Git repository hosted on GitHub or another remote:

```bash
# Initialize git
git init

# Add your remote (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/velocity.git

# Fetch all branches and history
git fetch origin

# Check out your main branch
git checkout -b main origin/main
```

**OR** if starting fresh without existing git history:

```bash
# Initialize new git repository
git init

# Create initial commit
git add .
git commit -m "Initial commit - Velocity Workforce Management System"
```

---

### **3. Install Node.js Dependencies**

The project uses `pnpm` (faster than npm). Install dependencies from `package.json`:

```bash
# Install pnpm globally if you don't have it
npm install -g pnpm

# Install all project dependencies (~505MB will be downloaded)
pnpm install

# This restores the entire node_modules/ directory
```

**Expected dependencies include:**
- React 19 + TypeScript
- Vite 6.3 (dev server & bundler)
- Refine.dev (data workflow framework)
- shadcn/ui + Radix UI (component library)
- Express.js (backend API)
- PostgreSQL client (pg)
- Tailwind CSS 4.1
- Playwright (testing)

This will take 2-5 minutes depending on your internet speed.

---

### **4. Set Up Environment Variables**

Create a `.env` file in the project root with required secrets:

```bash
# Copy from example if it exists
cp .env.example .env

# OR create manually
touch .env
```

**Required environment variables:**

```env
# PostgreSQL Database (Neon or local)
DATABASE_URL=postgresql://user:password@host:5432/dbname
PGHOST=your-db-host.neon.tech
PGDATABASE=your-database-name
PGUSER=your-username
PGPASSWORD=your-password
PGPORT=5432

# JWT Authentication
JWT_SECRET=your-secure-random-secret-here

# Demo Mode (set to 'true' for demo/development)
VITE_DEMO_MODE=true

# Optional: API Base URL (defaults to localhost:3001 in dev)
VITE_API_BASE_URL=http://localhost:3001
```

**Generate a secure JWT secret:**

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### **5. Set Up PostgreSQL Database**

#### **Option A: Using Replit's Built-in PostgreSQL (Recommended)**
If you're on Replit, the database is auto-provisioned. Environment variables are set automatically.

#### **Option B: Using Neon (Cloud PostgreSQL)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL` in `.env`

#### **Option C: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database: `createdb velocity_db`
3. Update `.env` with local connection details

---

### **6. Initialize Database Schema**

Push the database schema (creates all tables, triggers, and indexes):

```bash
# Push schema to database (Drizzle ORM)
npm run db:push

# If you encounter warnings about data loss, force push:
npm run db:push --force
```

**This creates 20+ tables including:**
- `users`, `contractors`, `employees`
- `purchase_orders`, `timecards`, `invoices`
- `statement_of_works`, `change_orders`, `expenses`
- `assets`, `asset_assignments`
- `generation_batches`, `generation_batch_items`, `generation_batch_findings` (AI QA system)
- And more...

---

### **7. Start Development Servers**

The project uses **dual servers**:

#### **Terminal 1: Backend API Server (Port 3001)**
```bash
npm run start:api
# OR
node server/index.cjs
```

Expected output:
```
🚀 VELOCITY API Server running on port 3001
📊 Database connected: neondb
🔒 JWT Secret configured: Yes
🔍 Hybrid Search enabled: pgvector + BM25
⚡ Budget threshold alerts active: 25%/50%/90%
```

#### **Terminal 2: Frontend Dev Server (Port 5000)**
```bash
npm run dev
# OR
pnpm dev
```

Expected output:
```
VITE v6.3.5  ready in 1727 ms
➜  Local:   http://localhost:5000/
➜  Network: http://172.31.x.x:5000/
```

---

### **8. Access the Application**

Open your browser to:

```
http://localhost:5000
```

**Demo Mode Auto-Login:**
- When `VITE_DEMO_MODE=true`, the app automatically authenticates you with a demo user (`demo@velocity.com`)
- No manual login required!

**Production Mode Login:**
- Set `VITE_DEMO_MODE=false`
- Create users via database or registration
- Login with email/password

---

## 🧪 Running Tests

```bash
# Run Playwright end-to-end tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test tests/example.spec.ts
```

---

## 🏗️ Project Structure

```
velocity-project/
├── src/                    # Frontend React application
│   ├── pages/             # All route pages (80+ pages)
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── providers/         # Data & auth providers
├── server/                # Backend Express.js API
│   ├── index.cjs          # Main API server
│   ├── database/          # Database schema & migrations
│   ├── services/          # Business logic (e.g., BatchOrchestrator)
│   ├── routes/            # API route handlers
│   └── middleware/        # Auth & other middleware
├── public/                # Static assets
├── tests/                 # Playwright E2E tests
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite bundler config
├── index.html             # App entry point
└── replit.md              # Project documentation
```

---

## 📋 Available NPM Scripts

```bash
# Development
npm run dev              # Start frontend dev server (port 5000)
npm run start:api        # Start backend API server (port 3001)

# Database
npm run db:push          # Push schema changes to database
npm run db:push --force  # Force push (if warnings)

# Testing
npm run test:e2e         # Run Playwright E2E tests
npm run test:ui          # Run tests in UI mode

# Building
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## 🔑 Key Features Implemented

### **Core Platform:**
- ✅ 10 expert persona dashboards (CPO, PM, VMS Director, Finance, HR, IT, Ops, CISO, Legal, Field Supervisor)
- ✅ Contractor lifecycle management with compliance tracking
- ✅ Purchase order management with budget alerts
- ✅ Timecard approval workflows with variance detection
- ✅ Invoice processing with anomaly detection
- ✅ Statement of Work (SOW) generation and tracking
- ✅ Asset management with RFID tracking
- ✅ Multi-tenant architecture with Row-Level Security (RLS)

### **AI-Powered Intelligence:**
- ✅ **AI QA Batch System** - Systematic quality testing with multi-lens analysis (legal, financial, technical, risk)
- ✅ **Contract Analysis** - Risk scoring, term extraction, compliance checks
- ✅ **Predictive Alerts** - Budget overrun prediction, timeline risk detection
- ✅ **Hybrid Search** - pgvector (semantic) + BM25 (keyword) with RRF scoring
- ✅ **Voice AI Integration** - ElevenLabs conversational agents (placeholder UI)

### **Demo Mode System:**
- ✅ Automatic authentication via `/api/auth/demo` endpoint
- ✅ Demo user auto-provisioning (`demo@velocity.com`)
- ✅ Toggle between demo (mock data) and production (PostgreSQL) modes

---

## 🐛 Troubleshooting

### **"Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .cache
pnpm install
```

### **Database connection fails**
- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### **Port already in use**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5000 (frontend)
lsof -ti:5000 | xargs kill -9
```

### **TypeScript errors**
```bash
# Rebuild TypeScript definitions
npm run build
```

### **Tests failing**
```bash
# Install Playwright browsers
npx playwright install
```

---

## 📚 Additional Resources

- **Project Documentation:** `replit.md` (comprehensive architecture guide)
- **API Endpoints:** See `server/index.cjs` for all REST APIs
- **Database Schema:** `server/database/schema.sql` for full schema
- **Component Library:** [shadcn/ui docs](https://ui.shadcn.com/)
- **Refine Framework:** [Refine.dev docs](https://refine.dev/)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `pnpm install` completed without errors
- [ ] `.env` file created with all required variables
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Backend API server runs on port 3001
- [ ] Frontend dev server runs on port 5000
- [ ] Browser opens to `http://localhost:5000` successfully
- [ ] Demo mode auto-login works (if `VITE_DEMO_MODE=true`)
- [ ] Can navigate to different pages without errors
- [ ] Git repository restored (if using version control)

---

## 🎯 Next Steps

1. **Explore the platform:** Navigate through dashboards, contractors, purchase orders
2. **Review documentation:** Read `replit.md` for detailed architecture
3. **Run tests:** Execute `npm run test:e2e` to validate functionality
4. **Customize:** Modify branding, add features, deploy to production
5. **Deploy:** Use Replit's built-in deployment or export to Netlify/Vercel

---

## 🆘 Need Help?

If you encounter issues:
1. Check `replit.md` for architecture details
2. Review error logs in terminal
3. Inspect browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Ready to build the future of workforce management!** 🚀
