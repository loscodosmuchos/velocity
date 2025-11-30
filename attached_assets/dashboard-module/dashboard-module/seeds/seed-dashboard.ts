export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Seed Dashboard Modules - Organized by User Persona Needs
  const modules: InsertDashboardModule[] = [
    // ============ RECRUITMENT MODULES ============
    {
      type: "kpi",
      name: "Total Candidates",
      description: "Total number of candidates in the pipeline",
      icon: "Users",
      category: "recruitment",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Active Requisitions",
      description: "Number of open job requisitions",
      icon: "Briefcase",
      category: "recruitment",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Time to Hire",
      description: "Average days to hire a candidate",
      icon: "Clock",
      category: "recruitment",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Offer Acceptance Rate",
      description: "Percentage of accepted offers",
      icon: "CheckCircle2",
      category: "recruitment",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Hiring Funnel",
      description: "Candidate pipeline stages",
      icon: "TrendingUp",
      category: "recruitment",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Source Effectiveness",
      description: "Candidates by source channel",
      icon: "PieChart",
      category: "recruitment",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Recent Interviews",
      description: "Upcoming and recent interviews",
      icon: "Calendar",
      category: "recruitment",
      defaultSize: { w: 12, h: 4, minW: 6, minH: 3 },
      isEnabled: true,
    },

    // ============ VENDOR/PROCUREMENT MODULES (CPO Focus) ============
    {
      type: "table",
      name: "Top Vendors",
      description: "Vendor performance rankings with SLA compliance",
      icon: "Award",
      category: "procurement",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Vendor Spend",
      description: "Total spending with vendors YTD",
      icon: "DollarSign",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Active Contractors",
      description: "Number of active contractors",
      icon: "UserCheck",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Contract Compliance",
      description: "Percentage of contracts meeting SLAs",
      icon: "FileCheck",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Vendor Risk Score",
      description: "AI-powered vendor risk assessment (1-100)",
      icon: "AlertTriangle",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "SOW Cycle Time",
      description: "Average days to complete SOW approval",
      icon: "Timer",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Cost Savings",
      description: "Total cost savings identified this quarter",
      icon: "TrendingDown",
      category: "procurement",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Vendor Performance Trends",
      description: "3-quarter vendor performance history",
      icon: "Activity",
      category: "procurement",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Contract Renewals",
      description: "Contracts expiring in next 90 days",
      icon: "RefreshCw",
      category: "procurement",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },

    // ============ PROJECT MANAGEMENT MODULES (Senior PM Focus) ============
    {
      type: "kpi",
      name: "Portfolio Health",
      description: "Overall portfolio health score (1-100)",
      icon: "Activity",
      category: "project_mgmt",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "At-Risk Projects",
      description: "Number of projects flagged as at-risk",
      icon: "AlertCircle",
      category: "project_mgmt",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Resource Utilization",
      description: "Team capacity utilization percentage",
      icon: "Users",
      category: "project_mgmt",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Critical Path Items",
      description: "Tasks blocking other project dependencies",
      icon: "GitBranch",
      category: "project_mgmt",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Top 5 At-Risk Projects",
      description: "Prioritized list with risk reasons and actions",
      icon: "AlertTriangle",
      category: "project_mgmt",
      defaultSize: { w: 12, h: 4, minW: 6, minH: 3 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Dependency Network",
      description: "Interactive project dependency visualization",
      icon: "Network",
      category: "project_mgmt",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Resource Heatmap",
      description: "Team utilization across weeks (color-coded)",
      icon: "Calendar",
      category: "project_mgmt",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },

    // ============ IT/SYSTEMS MODULES (IT Director Focus) ============
    {
      type: "kpi",
      name: "System Uptime",
      description: "Platform uptime SLA compliance",
      icon: "Server",
      category: "it_systems",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Integration Health",
      description: "Active integrations running successfully",
      icon: "Link",
      category: "it_systems",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Tech Debt Score",
      description: "Technical debt severity index",
      icon: "Code",
      category: "it_systems",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "API Response Time",
      description: "Average API response time (ms)",
      icon: "Zap",
      category: "it_systems",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "System Performance",
      description: "Real-time performance monitoring",
      icon: "BarChart",
      category: "it_systems",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Active Integrations",
      description: "Status of all system integrations",
      icon: "Database",
      category: "it_systems",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },

    // ============ VMS/CONTRACTOR MODULES (VMS Specialist Focus) ============
    {
      type: "kpi",
      name: "Contractor Compliance",
      description: "Percentage meeting all compliance requirements",
      icon: "Shield",
      category: "vms",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Skills Gap Score",
      description: "Predicted skill shortage severity (60-90 days)",
      icon: "Target",
      category: "vms",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Contractor Performance",
      description: "Performance history across all projects",
      icon: "Star",
      category: "vms",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "table",
      name: "Expiring Certifications",
      description: "Compliance items expiring in 30 days",
      icon: "FileWarning",
      category: "vms",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },

    // ============ FINANCE/ANALYTICS MODULES ============
    {
      type: "chart",
      name: "Spend Trends",
      description: "Monthly spending trends by category",
      icon: "LineChart",
      category: "finance",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },
    {
      type: "kpi",
      name: "Budget Variance",
      description: "Percentage over/under budget",
      icon: "TrendingUp",
      category: "finance",
      defaultSize: { w: 3, h: 2, minW: 2, minH: 2 },
      isEnabled: true,
    },
    {
      type: "chart",
      name: "Cost per Hire",
      description: "Trend analysis of hiring costs",
      icon: "DollarSign",
      category: "finance",
      defaultSize: { w: 6, h: 4, minW: 4, minH: 3 },
      isEnabled: true,
    },

    // ============ PRODUCTIVITY MODULES ============
    {
      type: "widget",
      name: "Quick Actions",
      description: "Common actions and shortcuts",
      icon: "Zap",
      category: "productivity",
      defaultSize: { w: 3, h: 4, minW: 2, minH: 3 },
      isEnabled: true,
    },
  ];

  const insertedModules = await db.insert(dashboardModules).values(modules).returning();
  console.log(`✅ Inserted ${insertedModules.length} dashboard modules`);

  // ===== TEMPLATE LAYOUTS BASED ON USER RESEARCH =====
  
  // Helper function to find module ID by name
  const findModuleId = (moduleName: string): number => {
    const module = insertedModules.find(m => m.name === moduleName);
    if (!module) {
      throw new Error(`Module not found: ${moduleName}`);
    }
    return module.id;
  };
  
  // RECRUITER: What they EXPECT - Candidate flow, time to hire, source effectiveness
  const recruiterLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Total Candidates") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Active Requisitions") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Time to Hire") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Offer Acceptance Rate") },
    { i: "5", x: 0, y: 2, w: 6, h: 4, moduleId: findModuleId("Hiring Funnel") },
    { i: "6", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Source Effectiveness") },
    { i: "7", x: 0, y: 6, w: 9, h: 4, moduleId: findModuleId("Recent Interviews") },
    { i: "8", x: 9, y: 6, w: 3, h: 4, moduleId: findModuleId("Quick Actions") },
  ];

  // CPO: What they LOVE - Vendor risk scoring, contract analytics, cost savings visibility
  const cpoLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Vendor Spend") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Contract Compliance") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Vendor Risk Score") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Cost Savings") },
    { i: "5", x: 0, y: 2, w: 3, h: 2, moduleId: findModuleId("SOW Cycle Time") },
    { i: "6", x: 3, y: 2, w: 3, h: 2, moduleId: findModuleId("Active Contractors") },
    { i: "7", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Vendor Performance Trends") },
    { i: "8", x: 0, y: 4, w: 6, h: 4, moduleId: findModuleId("Top Vendors") },
    { i: "9", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Contract Renewals") },
  ];

  // SENIOR PM (165+ Projects): What they NEED - Portfolio health, at-risk projects, dependencies
  const seniorPmLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Portfolio Health") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("At-Risk Projects") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Resource Utilization") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Critical Path Items") },
    { i: "5", x: 0, y: 2, w: 12, h: 4, moduleId: findModuleId("Top 5 At-Risk Projects") },
    { i: "6", x: 0, y: 6, w: 6, h: 4, moduleId: findModuleId("Dependency Network") },
    { i: "7", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Resource Heatmap") },
  ];

  // IT DIRECTOR: What they EXPECT - System health, integration status, tech debt
  const itDirectorLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("System Uptime") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Integration Health") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Tech Debt Score") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("API Response Time") },
    { i: "5", x: 0, y: 2, w: 6, h: 4, moduleId: findModuleId("System Performance") },
    { i: "6", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Active Integrations") },
    { i: "7", x: 0, y: 6, w: 6, h: 4, moduleId: findModuleId("Spend Trends") },
    { i: "8", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Cost per Hire") },
  ];

  // VMS SPECIALIST: What they WANT - Contractor compliance, skills gaps, performance tracking
  const vmsSpecialistLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Contractor Compliance") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Skills Gap Score") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Active Contractors") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Time to Hire") },
    { i: "5", x: 0, y: 2, w: 6, h: 4, moduleId: findModuleId("Contractor Performance") },
    { i: "6", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Expiring Certifications") },
    { i: "7", x: 0, y: 6, w: 6, h: 4, moduleId: findModuleId("Top Vendors") },
    { i: "8", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Spend Trends") },
  ];

  // C-SUITE EXECUTIVE: What they LOVE - Strategic KPIs, high-level health, cost visibility
  const cSuiteLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Portfolio Health") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Vendor Spend") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Cost Savings") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Budget Variance") },
    { i: "5", x: 0, y: 2, w: 3, h: 2, moduleId: findModuleId("At-Risk Projects") },
    { i: "6", x: 3, y: 2, w: 3, h: 2, moduleId: findModuleId("Time to Hire") },
    { i: "7", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Spend Trends") },
    { i: "8", x: 0, y: 4, w: 6, h: 4, moduleId: findModuleId("Hiring Funnel") },
    { i: "9", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Top 5 At-Risk Projects") },
  ];

  // HR DIRECTOR: What they EXPECT - Full recruitment metrics + contractor management
  const hrDirectorLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 3, h: 2, moduleId: findModuleId("Total Candidates") },
    { i: "2", x: 3, y: 0, w: 3, h: 2, moduleId: findModuleId("Active Requisitions") },
    { i: "3", x: 6, y: 0, w: 3, h: 2, moduleId: findModuleId("Offer Acceptance Rate") },
    { i: "4", x: 9, y: 0, w: 3, h: 2, moduleId: findModuleId("Active Contractors") },
    { i: "5", x: 0, y: 2, w: 6, h: 4, moduleId: findModuleId("Hiring Funnel") },
    { i: "6", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Cost per Hire") },
    { i: "7", x: 0, y: 6, w: 6, h: 4, moduleId: findModuleId("Recent Interviews") },
    { i: "8", x: 6, y: 6, w: 6, h: 4, moduleId: findModuleId("Contractor Performance") },
  ];

  // VENDOR MANAGER (Original): Vendor performance and compliance tracking
  const vendorManagerLayout: LayoutItem[] = [
    { i: "1", x: 0, y: 0, w: 4, h: 2, moduleId: findModuleId("Vendor Spend") },
    { i: "2", x: 4, y: 0, w: 4, h: 2, moduleId: findModuleId("Active Contractors") },
    { i: "3", x: 8, y: 0, w: 4, h: 2, moduleId: findModuleId("Contract Compliance") },
    { i: "4", x: 0, y: 2, w: 6, h: 4, moduleId: findModuleId("Top Vendors") },
    { i: "5", x: 6, y: 2, w: 6, h: 4, moduleId: findModuleId("Spend Trends") },
    { i: "6", x: 0, y: 6, w: 12, h: 4, moduleId: findModuleId("Contract Renewals") },
  ];

  // Seed Dashboard Templates
  const templates: InsertDashboardTemplate[] = [
    {
      name: "Recruiter Dashboard",
      description: "Candidate flow, hiring funnel, and source effectiveness tracking",
      role: "recruiter",
      layout: recruiterLayout,
      isPublic: true,
      isDefault: true,
    },
    {
      name: "CPO Dashboard",
      description: "Vendor risk scoring, contract analytics, and cost optimization for procurement leaders",
      role: "cpo",
      layout: cpoLayout,
      isPublic: true,
      isDefault: false,
    },
    {
      name: "Senior PM Portfolio (165+ Projects)",
      description: "Portfolio health, at-risk projects, dependency mapping, and resource conflicts for experienced PMs",
      role: "senior_pm",
      layout: seniorPmLayout,
      isPublic: true,
      isDefault: false,
    },
    {
      name: "IT Director Dashboard",
      description: "System uptime, integration health, tech debt tracking, and performance monitoring",
      role: "it_director",
      layout: itDirectorLayout,
      isPublic: true,
      isDefault: false,
    },
    {
      name: "VMS Specialist Dashboard",
      description: "Contractor compliance, skills gap analysis, performance tracking, and certification management",
      role: "vms_specialist",
      layout: vmsSpecialistLayout,
