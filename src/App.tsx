import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import routerProvider from "@refinedev/react-router";
import { useEffect } from "react";
import {
  Home,
  Users,
  FileText,
  Clock,
  Receipt,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  Shield,
  Settings,
  BarChart3,
  Briefcase,
  UserPlus,
  Brain,
  Bot,
  Mic,
  Search,
  BeakerIcon,
  Target,
  Bell,
  LayoutDashboard,
  Wrench,
  Sparkles,
  Network,
  FolderOpen,
  Palette,
  GitBranch,
  Bug,
  Map,
  Zap,
  Library,
  TrendingUp,
  History,
  UserCog,
  Upload,
  FileSearch,
  Layers,
  BookOpen,
  Route as RouteIcon,
  Crown,
  Mountain,
} from "lucide-react";

import { dataProvider, authProvider } from "./providers";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { AlertProvider } from "./contexts/AlertContext";
import { AssistantProvider } from "./contexts/AssistantContext";
import { AssistantDrawer } from "./components/AssistantDrawer";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import { LayoutModeProvider } from "./contexts/layout-mode-context";
import { UserSettingsProvider } from "./contexts/user-settings-context";
import { GatewayPasswordDialog } from "./components/GatewayPasswordDialog";
import { GatewayGuard } from "./components/GatewayGuard";
import { AdminPasswordGate } from "./components/AdminPasswordGate";
import { Layout } from "./components/refine-ui/layout/layout";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";

// Dashboard
import { DashboardPage } from "./pages/dashboard";
import DashboardBuilder from "./pages/dashboard/builder";
import ProcurementDashboard from "./pages/dashboard/procurement";
import ChartGallery from "./pages/dashboard/chart-gallery";

// Triage Pages
import BudgetOverrunTriage from "./pages/triage/budget-overrun";
import BudgetTriage from "./pages/triage/budget";
import ComplianceTriage from "./pages/triage/compliance";
import OperationsTriage from "./pages/triage/operations";
import TimecardsTriage from "./pages/triage/timecards";
import ContractorsTriage from "./pages/triage/contractors";
import InvoicesTriage from "./pages/triage/invoices";
import QualityIssuesTriage from "./pages/triage/quality-issues";
import PaymentDelaysTriage from "./pages/triage/payment-delays";

// Contractors
import { ContractorsListPage } from "./pages/contractors/list";
import { ContractorsShowPage } from "./pages/contractors/show";
import { CreateContractorPage } from "./pages/contractors/create";
import { EditContractorPage } from "./pages/contractors/edit";
import { ImportContractorsPage } from "./pages/contractors/import";

// Buyers
import { BuyersListPage } from "./pages/buyers/list";

// Employees
import { EmployeesListPage } from "./pages/employees/list";
import { EmployeesShowPage } from "./pages/employees/show";
import { CreateEmployeePage } from "./pages/employees/create";

// Purchase Orders
import { PurchaseOrdersListPage } from "./pages/purchaseorders/list";
import { PurchaseOrderShowPage } from "./pages/purchaseorders/show";
import { CreatePurchaseOrderPage } from "./pages/purchaseorders/create";
import { EditPurchaseOrderPage } from "./pages/purchaseorders/edit";
import { ManagePOContractorsPage } from "./pages/purchaseorders/manage-contractors";
import { POTemplatesPage } from "./pages/purchaseorders/templates";

// Timecards
import { TimecardsListPage } from "./pages/timecards/list";
import { TimecardShowPage } from "./pages/timecards/show";
import { CreateTimecardPage } from "./pages/timecards/create";
import { PendingTimecardsPage } from "./pages/timecards/pending";
import { BulkApproveTimecardsPage } from "./pages/timecards/bulk-approve";

// Invoices
import { InvoicesListPage } from "./pages/invoices/list";
import { InvoiceShowPage } from "./pages/invoices/show";
import { CreateInvoicePage } from "./pages/invoices/create";
import { EditInvoicePage } from "./pages/invoices/edit";
import { GenerateInvoicePage } from "./pages/invoices/generate";

// Statements of Work
import { StatementOfWorksListPage } from "./pages/statementofworks/list";
import { SowCommandCenterPage } from "./pages/sow-command-center";
import { StatementOfWorkShowPage } from "./pages/statementofworks/show";
import { CreateStatementOfWorkPage } from "./pages/statementofworks/create";
import SOWImportPage from "./pages/statementofworks/import";
import { EditStatementOfWorkPage } from "./pages/statementofworks/edit";
import { SOWComplianceReportPage } from "./pages/statementofworks/compliance-report";

// Change Orders
import { ChangeOrdersListPage } from "./pages/changeorders/list";
import { ChangeOrderShowPage } from "./pages/changeorders/show";
import { CreateChangeOrderPage } from "./pages/changeorders/create";

// Expenses
import { ExpensesListPage } from "./pages/expenses/list";
import { ExpenseShowPage } from "./pages/expenses/show";
import { CreateExpensePage } from "./pages/expenses/create";
import { BulkApproveExpensesPage } from "./pages/expenses/bulk-approve";
import { ExpenseReportsPage } from "./pages/expenses/reports";

// Assets - using default imports
import AssetsListPage from "./pages/assets/list";
import AssetShowPage from "./pages/assets/show";
import AssetCreatePage from "./pages/assets/create";
import AssetScanPage from "./pages/assets/scan";
import AssetKitsPage from "./pages/assets/kits";
import AssetTransferPage from "./pages/assets/transfer";
import AssetMaintenancePage from "./pages/assets/maintenance";

// AI
import { AIInsightsPage } from "./pages/ai/insights";
import ChatbotsPage from "./pages/ai/chatbots";
import { ChatbotsDisplayPage } from "./pages/ai/chatbots-display";
import AdvancedVoiceSourcing from "./pages/ai/advanced-voice-sourcing";
import VoiceContractIntelligence from "./pages/ai/voice-contract-intelligence";
import { AutomotiveDashDemo } from "./components/dashboard/automotive-dash-demo";
import { LegendaryBuilderExpertPage } from "./pages/ai/legendary-builder-expert";
import { AlertCubeBuilderPage } from "./pages/ai/alert-cube-builder";
import MVPWorkflowStoriesPage from "./pages/admin/mvp-workflow-stories";
import DemoPackagePage from "./pages/admin/demo-package";
import { ClaimsAuditPage } from "./pages/admin/claims-audit";
import { ArchitectCommandCenter } from "./pages/admin/architect-command-center";
import StyleGalleryPage from "./pages/admin/style-gallery";

// Alerts
import AlertDetailPage from "./pages/alerts/alert-detail";

// AI Insights
import AIInsightDetailPage from "./pages/ai/ai-insight-detail";

// Admin
import { AdminHub } from "./pages/hubs/admin-hub";
import { AdminDashboardPage } from "./pages/admin/dashboard";
import { UserManagementPage } from "./pages/admin/user-management";
import { CreateUserPage } from "./pages/admin/users-create";
import { AuditLogsListPage } from "./pages/admin/audit-logs";
import { SystemExceptionsListPage } from "./pages/admin/exceptions";
import { DataQualityDashboardPage } from "./pages/admin/data-quality";
import YouTubeCapturePage from "./pages/admin/youtube-capture";
import KnowledgeHubPage from "./pages/admin/knowledge-hub";
import DemoDataGeneratorPage from "./pages/admin/demo-data-generator";
import SystemArchitectureMapPage from "./pages/admin/system-architecture-map";
import { ChatbotsCustomizePage } from "./pages/admin/chatbots-customize";
import VoicePanelPage from "./pages/admin/voice-panel";
import XLSXImportPage from "./pages/admin/xlsx-import";
import LogicStudio from "./pages/admin/logic-studio";
import JourneyBuilderPage from "./pages/admin/journey-builder";
import GraphBuilderPage from "./pages/admin/graph-builder";
import ValidationStudioPage from "./pages/admin/validation-studio";
import AiQaLabPage from "./pages/admin/ai-qa-lab";
import { ImplementationStatusPage } from "./pages/admin/implementation-status";
import DemoCommandCenterPage from "./pages/admin/demo-command-center";
import AdminDemoPresentation from "./pages/admin/demo-presentation";
import { ChangeLogDashboard } from "./pages/admin/change-log-dashboard";
import { BugPatternDetector } from "./pages/admin/bug-pattern-detector";
import { VisualChangeGallery } from "./pages/admin/visual-change-gallery";
import { FeatureRiskDashboard } from "./pages/admin/feature-risk-dashboard";
import TextureSelector from "./pages/admin/texture-selector";
import DemoPresentation from "./pages/demo-presentation";
import PersonaReferencePage from "./pages/admin/persona-reference";
import DatabaseSchemaAuditPage from "./pages/admin/database-schema-audit";
import WhyVelocity from "./pages/why-velocity";
import ElevenLabsEmbed from "./pages/ai/elevenlabs-embed";
import ProjectTrackerPage from "./pages/super-admin/project-tracker";

// Persona Pages
import { BenCommandCenterPage } from "./pages/persona/ben-command-center";

// Approvals
import { ApprovalRequestsPage } from "./pages/approvals/requests";
import { ApprovalShowPage } from "./pages/approvals/show";
import { ApprovalRulesPage } from "./pages/approvals/rules";
import { ApprovalConfigurationPage } from "./pages/approvals/configure";
import { EmailLogsPage } from "./pages/approvals/email-logs";

// Contractor Portal
import { ContractorPortalDashboard } from "./pages/contractor-portal/dashboard";
import { ContractorProfilePage } from "./pages/contractor-portal/profile";
import { ContractorPortalRequirementsPage } from "./pages/contractor-portal/requirements";
import { ContractorTimecardsPage } from "./pages/contractor-portal/timecards";
import { ContractorTimecardCreatePage } from "./pages/contractor-portal/timecard-create";
import { ContractorInvoicesPage } from "./pages/contractor-portal/invoices";
import { ContractorExpensesPage } from "./pages/contractor-portal/expenses";
import { ContractorExpenseCreatePage } from "./pages/contractor-portal/expense-create";
import { ContractorDocumentsPage } from "./pages/contractor-portal/documents";
import { UploadContractorDocumentPage } from "./pages/contractor-portal/documents-upload";
import { ContractorMessagesPage } from "./pages/contractor-portal/messages";

// Hubs
import { AnalyticsHub } from "./pages/hubs/analytics-hub";
import { PC2PurchaseOrdersHub } from "./pages/hubs/pc2-purchase-orders";
import { PC3WorkforceHub } from "./pages/hubs/pc3-workforce-home";
import { ProcurementHubVariants } from "./pages/hubs/procurement-hub-variants";
import { CommunicationHub } from "./pages/hubs/communication-hub";

// Search & Filters
import { GlobalSearchPage } from "./pages/search/global";
import { FilterPresetsPage } from "./pages/filters/presets";
import { ProcurementAISearchPage } from "./pages/procurement/ai-search";
import ProcurementFlowReference from "./pages/procurement/flow-reference";

// Budget
import { BudgetForecastingPage } from "./pages/budget/forecasting";

// Notifications
import { NotificationCenterPage } from "./pages/notifications/center";

// Admin
import { PlatformDefinitionPage } from "./pages/admin/platform-definition";
import { ErrorTrackingPage } from "./pages/admin/error-tracking";

// Platform Capabilities (user-facing)
import { PlatformCapabilitiesPage } from "./pages/platform-capabilities";

// AI Features
import ContractGapAnalysis from "./pages/ai/contract-gap-analysis";
import VendorExtractionPage from "./pages/ai/vendor-extraction";

// Contracts
import MissingDataAnalyzer from "./pages/contracts/missing-data-analyzer";

// Projects
import { ProjectDocumentsPage } from "./pages/projects/project-documents";
import { ProjectManagementCentralPage } from "./pages/projects/management-central";

// New Stub Pages - SOW
import { SOWTemplatesPage } from "./pages/statementofworks/templates";

// New Stub Pages - Purchase Orders
import { POReportsPage } from "./pages/purchaseorders/reports";

// New Stub Pages - Contractors
import { ContractorOnboardingPage } from "./pages/contractors/onboarding";
import { ContractorCompliancePage } from "./pages/contractors/compliance";
import { ContractorPerformancePage } from "./pages/contractors/performance";

// New Stub Pages - Timecards
import { TimecardAnalyticsPage } from "./pages/timecards/analytics";

// New Stub Pages - Invoices
import { InvoiceAgingPage } from "./pages/invoices/aging";

// New Stub Pages - Approvals
import { ApprovalHistoryPage } from "./pages/approvals/history";
import { ApprovalDelegationsPage } from "./pages/approvals/delegations";

// New Stub Pages - Documents
import { DocumentUploadPage } from "./pages/documents/upload";
import { DocumentSearchPage } from "./pages/documents/search";
import { DocumentAnalyzePage } from "./pages/documents/analyze";
import { DocumentAuditPage } from "./pages/documents/audit";
import { DocumentGalleryPage } from "./pages/documents/gallery";
import { DocumentsCommandCenter } from "./pages/documents/command-center";

// New Stub Pages - Triage & Alerts
import { TriageRoomPage } from "./pages/triage/index";
import { AlertCenterPage } from "./pages/alerts/index";

// New Stub Pages - Dashboard
import { DashboardTemplatesPage } from "./pages/dashboard/templates";
import { DashboardCustomizerPage } from "./pages/dashboard/customizer";
import DashboardTemplateBuilderPage from "./pages/dashboard/template-builder";

// Workflows
import WorkflowsBuilder from "./pages/workflows/builder";

// New Pages - User
import { UserPreferencesPage } from "./pages/user/preferences";
import { CapabilityMapPage } from "./pages/user/capability-map";

// Auth Pages
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ForgotPasswordPage } from "./pages/auth/forgot-password";

export default function App() {
  useEffect(() => {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
    const hasToken = localStorage.getItem('token');
    
    if (isDemoMode && !hasToken) {
      console.log('🎭 Demo mode: Using mock authentication (no backend required)');
      
      const mockUser = {
        id: 1,
        email: 'demo@velocity.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin'
      };
      
      const mockToken = 'demo-mode-mock-token-no-backend-required';
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('✅ Demo authentication complete (mock mode)');
    }
  }, []);

  return (
    <BrowserRouter>
      <AlertProvider>
        <AssistantProvider>
        <AdminAuthProvider>
        <GatewayGuard>
        <ThemeProvider defaultTheme="light" storageKey="velocity-theme">
          <UserSettingsProvider>
          <LayoutModeProvider>
          <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            // ═══════════════════════════════════════════════════════════════
            // TIER 1: DAILY OPERATIONS (Primary work items with submenus)
            // ═══════════════════════════════════════════════════════════════
            {
              name: "dashboard",
              list: "/",
              meta: { label: "Dashboard", icon: <Home />, tier: 1 },
            },
            // SOWs with submenu
            {
              name: "statementofworks",
              meta: { label: "SOWs", icon: <Briefcase />, tier: 1 },
            },
            {
              name: "sow/portfolio",
              list: "/statement-of-works",
              meta: { label: "Portfolio", parent: "statementofworks", icon: <Briefcase /> },
            },
            {
              name: "sow/command-center",
              list: "/sow-command-center",
              meta: { label: "Command Center", parent: "statementofworks", icon: <Zap /> },
            },
            {
              name: "sow/compliance",
              list: "/statement-of-works/compliance-report",
              meta: { label: "Compliance Report", parent: "statementofworks", icon: <Shield /> },
            },
            {
              name: "sow/templates",
              list: "/statement-of-works/templates",
              meta: { label: "Templates", parent: "statementofworks", icon: <FileText /> },
            },
            {
              name: "sow/import",
              list: "/statementofworks/import",
              meta: { label: "Import from Document", parent: "statementofworks", icon: <Upload /> },
            },
            // Purchase Orders with submenu
            {
              name: "purchaseorders",
              meta: { label: "Purchase Orders", icon: <FileText />, tier: 1 },
            },
            {
              name: "po/pipeline",
              list: "/purchase-orders",
              meta: { label: "Pipeline", parent: "purchaseorders", icon: <FileText /> },
            },
            {
              name: "po/create",
              list: "/purchase-orders/create",
              meta: { label: "Create New", parent: "purchaseorders", icon: <FileText /> },
            },
            {
              name: "po/templates",
              list: "/purchase-orders/templates",
              meta: { label: "Templates", parent: "purchaseorders", icon: <FileText /> },
            },
            {
              name: "po/reports",
              list: "/purchase-orders/reports",
              meta: { label: "Reports", parent: "purchaseorders", icon: <BarChart3 /> },
            },
            // Contractors with submenu
            {
              name: "contractors",
              meta: { label: "Contractors", icon: <Users />, tier: 1 },
            },
            {
              name: "contractors/roster",
              list: "/contractors",
              meta: { label: "Roster", parent: "contractors", icon: <Users /> },
            },
            {
              name: "contractors/onboarding",
              list: "/contractors/onboarding",
              meta: { label: "Onboarding", parent: "contractors", icon: <UserPlus /> },
            },
            {
              name: "contractors/compliance",
              list: "/contractors/compliance",
              meta: { label: "Compliance", parent: "contractors", icon: <Shield /> },
            },
            {
              name: "contractors/performance",
              list: "/contractors/performance",
              meta: { label: "Performance", parent: "contractors", icon: <TrendingUp /> },
            },
            // Timecards with submenu
            {
              name: "timecards",
              meta: { label: "Timecards", icon: <Clock />, tier: 1 },
            },
            {
              name: "timecards/active",
              list: "/timecards",
              meta: { label: "Active", parent: "timecards", icon: <Clock /> },
            },
            {
              name: "timecards/pending",
              list: "/timecards/pending",
              meta: { label: "Pending Approval", parent: "timecards", icon: <Clock /> },
            },
            {
              name: "timecards/bulk-approve",
              list: "/timecards/bulk-approve",
              meta: { label: "Bulk Approve", parent: "timecards", icon: <Shield /> },
            },
            {
              name: "timecards/analytics",
              list: "/timecards/analytics",
              meta: { label: "Analytics", parent: "timecards", icon: <BarChart3 /> },
            },
            // Invoices with submenu
            {
              name: "invoices",
              meta: { label: "Invoices", icon: <Receipt />, tier: 1 },
            },
            {
              name: "invoices/pipeline",
              list: "/invoices",
              meta: { label: "Pipeline", parent: "invoices", icon: <Receipt /> },
            },
            {
              name: "invoices/generate",
              list: "/invoices/generate",
              meta: { label: "Generate", parent: "invoices", icon: <Receipt /> },
            },
            {
              name: "invoices/aging",
              list: "/invoices/aging",
              meta: { label: "Aging Report", parent: "invoices", icon: <BarChart3 /> },
            },
            // Expenses with submenu
            {
              name: "expenses",
              meta: { label: "Expenses", icon: <DollarSign />, tier: 1 },
            },
            {
              name: "expenses/active",
              list: "/expenses",
              meta: { label: "Active", parent: "expenses", icon: <DollarSign /> },
            },
            {
              name: "expenses/create",
              list: "/expenses/create",
              meta: { label: "Submit New", parent: "expenses", icon: <DollarSign /> },
            },
            {
              name: "expenses/bulk-approve",
              list: "/expenses/bulk-approve",
              meta: { label: "Bulk Approve", parent: "expenses", icon: <Shield /> },
            },
            {
              name: "expenses/reports",
              list: "/expenses/reports",
              meta: { label: "Reports", parent: "expenses", icon: <BarChart3 /> },
            },
            // Projects with submenu
            {
              name: "projects",
              meta: { label: "Projects", icon: <FolderOpen />, tier: 1 },
            },
            {
              name: "projects/central",
              list: "/projects/central",
              meta: { label: "Management Central", parent: "projects", icon: <FolderOpen /> },
            },
            {
              name: "projects/documents",
              list: "/projects/documents",
              meta: { label: "Documents", parent: "projects", icon: <FileText /> },
            },
            // Approvals with submenu
            {
              name: "approvals",
              meta: { label: "Approvals", icon: <Shield />, tier: 1 },
            },
            {
              name: "approvals/queue",
              list: "/approvals",
              meta: { label: "My Queue", parent: "approvals", icon: <Shield /> },
            },
            {
              name: "approvals/history",
              list: "/approvals/history",
              meta: { label: "History", parent: "approvals", icon: <History /> },
            },
            {
              name: "approvals/delegations",
              list: "/approvals/delegations",
              meta: { label: "Delegations", parent: "approvals", icon: <UserCog /> },
            },
            // Change Orders with submenu
            {
              name: "changeorders",
              meta: { label: "Change Orders", icon: <AlertCircle />, tier: 1 },
            },
            {
              name: "changeorders/lifecycle",
              list: "/change-orders",
              meta: { label: "Lifecycle", parent: "changeorders", icon: <AlertCircle /> },
            },
            {
              name: "changeorders/create",
              list: "/change-orders/create",
              meta: { label: "Create", parent: "changeorders", icon: <AlertCircle /> },
            },
            // Documents with submenu (explicitly requested)
            {
              name: "documents",
              meta: { label: "Documents", icon: <FolderOpen />, tier: 1 },
            },
            {
              name: "documents/command-center",
              list: "/documents",
              meta: { label: "Command Center", parent: "documents", icon: <Zap /> },
            },
            {
              name: "documents/browse",
              list: "/projects/documents",
              meta: { label: "Browse", parent: "documents", icon: <FolderOpen /> },
            },
            {
              name: "documents/upload",
              list: "/documents/upload",
              meta: { label: "Upload", parent: "documents", icon: <Upload /> },
            },
            {
              name: "documents/search",
              list: "/documents/search",
              meta: { label: "Search", parent: "documents", icon: <FileSearch /> },
            },
            {
              name: "documents/analyze",
              list: "/documents/analyze",
              meta: { label: "Analyze", parent: "documents", icon: <Brain /> },
            },
            {
              name: "documents/audit",
              list: "/documents/audit",
              meta: { label: "Audit Trail", parent: "documents", icon: <History /> },
            },
            // ═══════════════════════════════════════════════════════════════
            // TIER 2: SYSTEM ARCHITECTURAL (Demo showcase)
            // ═══════════════════════════════════════════════════════════════
            {
              name: "system-architectural",
              meta: { label: "SYSTEM ARCHITECTURAL", icon: <Network />, group: true, tier: 2 },
            },
            {
              name: "persona-reference",
              list: "/admin/persona-reference",
              meta: { label: "Persona Reference", parent: "system-architectural", icon: <Users /> },
            },
            {
              name: "ai",
              meta: { label: "AI Intelligence", parent: "system-architectural", icon: <Brain /> },
            },
            {
              name: "ai/insights",
              list: "/ai/insights",
              meta: { label: "AI Insights", parent: "ai", icon: <Sparkles /> },
            },
            {
              name: "ai/chatbots",
              list: "/ai/chatbots",
              meta: { label: "Chatbots", parent: "ai", icon: <Bot /> },
            },
            {
              name: "ai/voice-contract",
              list: "/ai/voice-contract",
              meta: { label: "Voice Intel", fullLabel: "Voice Contract Intelligence", parent: "ai", icon: <Mic /> },
            },
            {
              name: "ai/elevenlabs-agents",
              list: "/ai/elevenlabs-agents",
              meta: { label: "Voice Agents", fullLabel: "Velocity Voice Intelligence Agents", parent: "ai", icon: <Bot /> },
            },
            {
              name: "dashboard-builder",
              list: "/dashboard/builder",
              meta: { label: "Dashboard Builder", parent: "system-architectural", icon: <LayoutDashboard /> },
            },
            {
              name: "notifications",
              list: "/notifications/center",
              meta: { label: "Notifications", parent: "system-architectural", icon: <Bell /> },
            },
            {
              name: "sow-command",
              list: "/sow-command-center",
              meta: { label: "SOW Command Center", parent: "system-architectural", icon: <Zap /> },
            },
            {
              name: "demo-command",
              list: "/demo-command-center",
              meta: { label: "Demo Command Center", parent: "system-architectural", icon: <Sparkles /> },
            },
            // ═══════════════════════════════════════════════════════════════
            // TIER 3: INTELLIGENCE SUITES (Analytics)
            // ═══════════════════════════════════════════════════════════════
            {
              name: "intelligence",
              meta: { label: "INTELLIGENCE", icon: <Brain />, group: true, tier: 3 },
            },
            {
              name: "triage-room",
              list: "/triage",
              meta: { label: "Triage Room", parent: "intelligence", icon: <AlertTriangle /> },
            },
            {
              name: "budget-forecasting",
              list: "/budget/forecasting",
              meta: { label: "Budget Forecasting", parent: "intelligence", icon: <TrendingUp /> },
            },
            {
              name: "knowledge-vault",
              list: "/admin/knowledge-hub",
              meta: { label: "Knowledge Vault", parent: "intelligence", icon: <Library /> },
            },
            {
              name: "alert-center",
              list: "/alerts",
              meta: { label: "Alert Center", parent: "intelligence", icon: <Bell /> },
            },
            // ═══════════════════════════════════════════════════════════════
            // TIER 4: USER COMMAND (User customization)
            // ═══════════════════════════════════════════════════════════════
            {
              name: "user-command",
              meta: { label: "USER COMMAND", icon: <UserCog />, group: true, tier: 4 },
            },
            {
              name: "user/preferences",
              list: "/user/preferences",
              meta: { label: "My Preferences", parent: "user-command", icon: <Settings /> },
            },
            {
              name: "user/capability-map",
              list: "/user/capability-map",
              meta: { label: "Capability Map", parent: "user-command", icon: <Map /> },
            },
            {
              name: "template-builders",
              meta: { label: "Template Builders", parent: "user-command", icon: <Layers /> },
            },
            {
              name: "template-builders/dashboard",
              list: "/dashboard/templates",
              meta: { label: "Dashboard Templates", parent: "template-builders", icon: <LayoutDashboard /> },
            },
            {
              name: "template-builders/journey",
              list: "/admin/journey-builder",
              meta: { label: "Journey Builder", parent: "template-builders", icon: <RouteIcon /> },
            },
            // ═══════════════════════════════════════════════════════════════
            // TIER 5: SYSTEM ADMIN (IT/Admin)
            // ═══════════════════════════════════════════════════════════════
            {
              name: "admin",
              meta: { label: "SYSTEM ADMIN", icon: <Settings />, group: true, tier: 5 },
            },
            {
              name: "administration",
              meta: { label: "Administration", parent: "admin", icon: <Settings /> },
            },
            {
              name: "admin/architect-command",
              list: "/admin/architect-command-center",
              meta: { label: "⚜️ ARCHITECT CENTER", parent: "administration", icon: <Crown className="text-amber-400" /> },
            },
            {
              name: "admin/architecture-map",
              list: "/admin/system-architecture-map",
              meta: { label: "System Architecture Map", parent: "administration", icon: <Network /> },
            },
            {
              name: "admin/dashboard",
              list: "/admin/dashboard",
              meta: { label: "Admin Dashboard", parent: "administration", icon: <BarChart3 /> },
            },
            {
              name: "admin/users",
              list: "/admin/users",
              create: "/admin/users/create",
              meta: { label: "User Management", parent: "administration", icon: <UserPlus /> },
            },
            {
              name: "admin/ai-qa-lab",
              list: "/admin/ai-qa-lab",
              meta: { label: "AI QA Lab", parent: "administration", icon: <BeakerIcon /> },
            },
            {
              name: "admin/data-quality",
              list: "/admin/data-quality",
              meta: { label: "Data Quality", parent: "administration", icon: <Search /> },
            },
            {
              name: "project-tracker",
              list: "/super-admin/project-tracker",
              meta: { label: "Platform Info", parent: "admin", icon: <Target /> },
            },
            {
              name: "implementation-status",
              list: "/admin/implementation-status",
              meta: { label: "Implementation Status", parent: "admin", icon: <AlertCircle /> },
            },
            {
              name: "admin/persona-ref",
              list: "/admin/persona-reference",
              meta: { label: "Persona Reference", parent: "administration", icon: <Users /> },
            },
            {
              name: "admin/texture-selector",
              list: "/admin/texture-selector",
              meta: { label: "Texture Selector", parent: "administration", icon: <Palette /> },
            },
            {
              name: "admin/feature-risk",
              list: "/admin/feature-risk-dashboard",
              meta: { label: "Feature Risk", parent: "administration", icon: <AlertTriangle /> },
            },
            {
              name: "admin/change-log",
              list: "/admin/change-log-dashboard",
              meta: { label: "Change Log", parent: "administration", icon: <GitBranch /> },
            },
            {
              name: "admin/bug-patterns",
              list: "/admin/bug-pattern-detector",
              meta: { label: "Bug Patterns", parent: "administration", icon: <Bug /> },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            title: {
              icon: <img src="/branding/velocity-badge.png" alt="Velocity Intelligence Network" className="h-10 w-10 rounded-full object-cover shadow-lg shadow-blue-500/30" />,
              text: "",
            },
          }}>
          <Routes>
            {/* Auth Pages - Outside Layout */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }>
              {/* Dashboard */}
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/charts" element={<ChartGallery />} />
              <Route path="dashboard/builder" element={<DashboardBuilder />} />
              <Route path="dashboard/procurement" element={<ProcurementDashboard />} />
              <Route path="dashboard/automotive-demo" element={<AutomotiveDashDemo />} />
              <Route path="dashboard/customizer" element={<DashboardCustomizerPage />} />
              <Route path="dashboard/template-builder" element={<DashboardTemplateBuilderPage />} />

              {/* Triage Pages - Game-like action workspaces */}
              <Route path="triage/budget-overrun" element={<BudgetOverrunTriage />} />
              <Route path="triage/budget-overrun/:entityId" element={<BudgetOverrunTriage />} />
              <Route path="triage/budget" element={<BudgetTriage />} />
              <Route path="triage/compliance" element={<ComplianceTriage />} />
              <Route path="triage/operations" element={<OperationsTriage />} />
              <Route path="triage/timecards" element={<TimecardsTriage />} />
              <Route path="triage/quality-issues" element={<QualityIssuesTriage />} />
              <Route path="triage/payment-delays" element={<PaymentDelaysTriage />} />
              <Route path="triage/contractors" element={<ContractorsTriage />} />
              <Route path="triage/invoices" element={<InvoicesTriage />} />

              {/* Contractors */}
              <Route path="contractors">
                <Route index element={<ContractorsListPage />} />
                <Route path="create" element={<CreateContractorPage />} />
                <Route path="edit/:id" element={<EditContractorPage />} />
                <Route path="show/:id" element={<ContractorsShowPage />} />
                <Route path="import" element={<ImportContractorsPage />} />
                <Route path="onboarding" element={<ContractorOnboardingPage />} />
                <Route path="compliance" element={<ContractorCompliancePage />} />
                <Route path="performance" element={<ContractorPerformancePage />} />
              </Route>

              <Route path="buyers">
                <Route index element={<BuyersListPage />} />
              </Route>

              {/* Employees */}
              <Route path="employees">
                <Route index element={<EmployeesListPage />} />
                <Route path="create" element={<CreateEmployeePage />} />
                <Route path="show/:id" element={<EmployeesShowPage />} />
              </Route>

              {/* Purchase Orders */}
              <Route path="purchase-orders">
                <Route index element={<PurchaseOrdersListPage />} />
                <Route path="create" element={<CreatePurchaseOrderPage />} />
                <Route path="edit/:id" element={<EditPurchaseOrderPage />} />
                <Route path="show/:id" element={<PurchaseOrderShowPage />} />
                <Route path=":id/manage-contractors" element={<ManagePOContractorsPage />} />
                <Route path="templates" element={<POTemplatesPage />} />
                <Route path="reports" element={<POReportsPage />} />
              </Route>
              {/* Alias for purchaseorders (no hyphen) */}
              <Route path="purchaseorders">
                <Route index element={<PurchaseOrdersListPage />} />
                <Route path="create" element={<CreatePurchaseOrderPage />} />
                <Route path="edit/:id" element={<EditPurchaseOrderPage />} />
                <Route path="show/:id" element={<PurchaseOrderShowPage />} />
              </Route>

              {/* Timecards */}
              <Route path="timecards">
                <Route index element={<TimecardsListPage />} />
                <Route path="create" element={<CreateTimecardPage />} />
                <Route path="show/:id" element={<TimecardShowPage />} />
                <Route path="pending" element={<PendingTimecardsPage />} />
                <Route path="bulk-approve" element={<BulkApproveTimecardsPage />} />
                <Route path="analytics" element={<TimecardAnalyticsPage />} />
              </Route>

              {/* Invoices */}
              <Route path="invoices">
                <Route index element={<InvoicesListPage />} />
                <Route path="create" element={<CreateInvoicePage />} />
                <Route path="edit/:id" element={<EditInvoicePage />} />
                <Route path="show/:id" element={<InvoiceShowPage />} />
                <Route path="generate" element={<GenerateInvoicePage />} />
                <Route path="aging" element={<InvoiceAgingPage />} />
              </Route>

              {/* Statements of Work */}
              <Route path="statement-of-works">
                <Route index element={<StatementOfWorksListPage />} />
                <Route path="create" element={<CreateStatementOfWorkPage />} />
                <Route path="import" element={<SOWImportPage />} />
                <Route path="edit/:id" element={<EditStatementOfWorkPage />} />
                <Route path="show/:id" element={<StatementOfWorkShowPage />} />
                <Route path="compliance-report" element={<SOWComplianceReportPage />} />
                <Route path="templates" element={<SOWTemplatesPage />} />
              </Route>
              {/* Alias for statementofworks (no hyphens) */}
              <Route path="statementofworks">
                <Route index element={<StatementOfWorksListPage />} />
                <Route path="create" element={<CreateStatementOfWorkPage />} />
                <Route path="import" element={<SOWImportPage />} />
                <Route path="edit/:id" element={<EditStatementOfWorkPage />} />
                <Route path="show/:id" element={<StatementOfWorkShowPage />} />
                <Route path="compliance-report" element={<SOWComplianceReportPage />} />
              </Route>

              {/* Alias for statements-of-work (common plural variation) */}
              <Route path="statements-of-work">
                <Route index element={<StatementOfWorksListPage />} />
                <Route path="create" element={<CreateStatementOfWorkPage />} />
                <Route path="import" element={<SOWImportPage />} />
                <Route path="edit/:id" element={<EditStatementOfWorkPage />} />
                <Route path="show/:id" element={<StatementOfWorkShowPage />} />
                <Route path="compliance-report" element={<SOWComplianceReportPage />} />
              </Route>

              {/* SOW Command Center - Ultimate Procurement Dashboard */}
              <Route path="sow-command-center" element={<SowCommandCenterPage />} />

              {/* Change Orders */}
              <Route path="change-orders">
                <Route index element={<ChangeOrdersListPage />} />
                <Route path="create" element={<CreateChangeOrderPage />} />
                <Route path="show/:id" element={<ChangeOrderShowPage />} />
              </Route>
              {/* Alias for changeorders (no hyphen) */}
              <Route path="changeorders">
                <Route index element={<ChangeOrdersListPage />} />
                <Route path="create" element={<CreateChangeOrderPage />} />
                <Route path="show/:id" element={<ChangeOrderShowPage />} />
              </Route>

              {/* Expenses */}
              <Route path="expenses">
                <Route index element={<ExpensesListPage />} />
                <Route path="create" element={<CreateExpensePage />} />
                <Route path="show/:id" element={<ExpenseShowPage />} />
                <Route path="bulk-approve" element={<BulkApproveExpensesPage />} />
                <Route path="reports" element={<ExpenseReportsPage />} />
              </Route>

              {/* Assets */}
              <Route path="assets">
                <Route index element={<AssetsListPage />} />
                <Route path="create" element={<AssetCreatePage />} />
                <Route path="show/:id" element={<AssetShowPage />} />
                <Route path="scan" element={<AssetScanPage />} />
                <Route path="kits" element={<AssetKitsPage />} />
                <Route path="transfer/:id" element={<AssetTransferPage />} />
                <Route path="maintenance" element={<AssetMaintenancePage />} />
              </Route>

              {/* Contracts */}
              <Route path="contracts">
                <Route path="missing-data-analyzer" element={<MissingDataAnalyzer />} />
              </Route>

              {/* Projects */}
              <Route path="projects">
                <Route path="central" element={<ProjectManagementCentralPage />} />
                <Route path="documents" element={<ProjectDocumentsPage />} />
              </Route>

              {/* AI */}
              <Route path="ai">
                <Route path="insights" element={<AIInsightsPage />} />
                <Route path="chatbots" element={<ChatbotsPage />} />
                <Route path="chatbots-display" element={<ChatbotsDisplayPage />} />
                <Route path="legendary-builder-expert" element={<LegendaryBuilderExpertPage />} />
                <Route path="alert-cube-builder" element={<AlertCubeBuilderPage />} />
                <Route path="voice-contract" element={<VoiceContractIntelligence />} />
                <Route path="elevenlabs-agents" element={<AdvancedVoiceSourcing />} />
                <Route path="contract-gap-analysis" element={<ContractGapAnalysis />} />
                <Route path="vendor-extraction" element={<VendorExtractionPage />} />
              </Route>

              {/* Demo Tools - No Admin Password Required */}
              <Route path="demo-command-center" element={<DemoCommandCenterPage />} />

              {/* Admin */}
              <Route path="admin" element={<AdminPasswordGate><Outlet /></AdminPasswordGate>}>
                <Route index element={<AdminHub />} />
                <Route path="architect-command-center" element={<ArchitectCommandCenter />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="platform-definition" element={<PlatformDefinitionPage />} />
                <Route path="error-tracking" element={<ErrorTrackingPage />} />
                <Route path="logic-studio" element={<LogicStudio />} />
                <Route path="journey-builder" element={<JourneyBuilderPage />} />
                <Route path="graph-builder" element={<GraphBuilderPage />} />
                <Route path="validation-studio" element={<ValidationStudioPage />} />
                <Route path="youtube-capture" element={<YouTubeCapturePage />} />
                <Route path="knowledge-hub" element={<KnowledgeHubPage />} />
                <Route path="demo-data-generator" element={<DemoDataGeneratorPage />} />
                <Route path="system-architecture-map" element={<SystemArchitectureMapPage />} />
                <Route path="users">
                  <Route index element={<UserManagementPage />} />
                  <Route path="create" element={<CreateUserPage />} />
                </Route>
                <Route path="audit-logs" element={<AuditLogsListPage />} />
                <Route path="exceptions" element={<SystemExceptionsListPage />} />
                <Route path="data-quality" element={<DataQualityDashboardPage />} />
                <Route path="chatbots-customize" element={<ChatbotsCustomizePage />} />
                <Route path="voice-panel" element={<VoicePanelPage />} />
                <Route path="xlsx-import" element={<XLSXImportPage />} />
                <Route path="ai-qa-lab" element={<AiQaLabPage />} />
                <Route path="implementation-status" element={<ImplementationStatusPage />} />
                <Route path="demo-presentation" element={<AdminDemoPresentation />} />
                <Route path="persona-reference" element={<PersonaReferencePage />} />
                <Route path="style-gallery" element={<StyleGalleryPage />} />
                <Route path="change-log-dashboard" element={<ChangeLogDashboard />} />
                <Route path="bug-pattern-detector" element={<BugPatternDetector />} />
                <Route path="visual-change-gallery" element={<VisualChangeGallery />} />
                <Route path="feature-risk-dashboard" element={<FeatureRiskDashboard />} />
                <Route path="texture-selector" element={<TextureSelector />} />
                <Route path="mvp-workflow-stories" element={<MVPWorkflowStoriesPage />} />
                <Route path="demo-package" element={<DemoPackagePage />} />
                <Route path="claims-audit" element={<ClaimsAuditPage />} />
                <Route path="database-schema-audit" element={<DatabaseSchemaAuditPage />} />
              </Route>

              {/* Approvals */}
              <Route path="approvals">
                <Route index element={<ApprovalRequestsPage />} />
                <Route path="rules" element={<ApprovalRulesPage />} />
                <Route path="configure" element={<ApprovalConfigurationPage />} />
                <Route path="email-logs" element={<EmailLogsPage />} />
                <Route path="history" element={<ApprovalHistoryPage />} />
                <Route path="delegations" element={<ApprovalDelegationsPage />} />
              </Route>

              {/* Contractor Portal */}
              <Route path="contractor-portal">
                <Route index element={<ContractorPortalDashboard />} />
                <Route path="profile" element={<ContractorProfilePage />} />
                <Route path="requirements" element={<ContractorPortalRequirementsPage />} />
                <Route path="timecards">
                  <Route index element={<ContractorTimecardsPage />} />
                  <Route path="create" element={<ContractorTimecardCreatePage />} />
                </Route>
                <Route path="invoices" element={<ContractorInvoicesPage />} />
                <Route path="expenses">
                  <Route index element={<ContractorExpensesPage />} />
                  <Route path="create" element={<ContractorExpenseCreatePage />} />
                </Route>
                <Route path="documents">
                  <Route index element={<ContractorDocumentsPage />} />
                  <Route path="upload" element={<UploadContractorDocumentPage />} />
                </Route>
                <Route path="messages" element={<ContractorMessagesPage />} />
              </Route>

              {/* Hubs */}
              <Route path="analytics-hub" element={<AnalyticsHub />} />
              <Route path="pc2-purchase-orders" element={<PC2PurchaseOrdersHub />} />
              <Route path="pc3-workforce-home" element={<PC3WorkforceHub />} />
              <Route path="procurement-hub" element={<ProcurementHubVariants />} />
              <Route path="procurement/ai-search" element={<ProcurementAISearchPage />} />
              <Route path="hubs/communication-hub" element={<CommunicationHub />} />
              <Route path="procurement/flow-reference" element={<ProcurementFlowReference />} />

              {/* Alerts */}
              <Route path="alerts" element={<AlertCenterPage />} />
              <Route path="alerts/:alertId" element={<AlertDetailPage />} />
              
              {/* AI Insights */}
              <Route path="ai-insights/:insightId" element={<AIInsightDetailPage />} />

              {/* Additional Features */}
              <Route path="search/global" element={<GlobalSearchPage />} />
              <Route path="filters/presets" element={<FilterPresetsPage />} />
              <Route path="budget/forecasting" element={<BudgetForecastingPage />} />
              <Route path="notifications" element={<NotificationCenterPage />} />
              <Route path="notifications/center" element={<NotificationCenterPage />} />

              {/* Documents - New Routes */}
              <Route path="documents">
                <Route index element={<DocumentsCommandCenter />} />
                <Route path="gallery" element={<DocumentGalleryPage />} />
                <Route path="upload" element={<DocumentUploadPage />} />
                <Route path="search" element={<DocumentSearchPage />} />
                <Route path="analyze" element={<DocumentAnalyzePage />} />
                <Route path="audit" element={<DocumentAuditPage />} />
              </Route>

              {/* Triage Index */}
              <Route path="triage" element={<TriageRoomPage />} />

              {/* Dashboard Templates */}
              <Route path="dashboard/templates" element={<DashboardTemplatesPage />} />

              {/* Workflows */}
              <Route path="workflows">
                <Route path="builder" element={<WorkflowsBuilder />} />
              </Route>

              {/* User Pages */}
              <Route path="user">
                <Route path="preferences" element={<UserPreferencesPage />} />
                <Route path="capability-map" element={<CapabilityMapPage />} />
              </Route>

              {/* Platform Capabilities (user-facing) */}
              <Route path="platform-capabilities" element={<PlatformCapabilitiesPage />} />

              {/* Super Admin */}
              <Route path="super-admin/project-tracker" element={<ProjectTrackerPage />} />

              {/* Persona Pages */}
              <Route path="persona/ben-command-center" element={<BenCommandCenterPage />} />

              {/* Demo Presentation Pages - Outside Layout */}
              <Route path="demo-presentation" element={<DemoPresentation />} />
              <Route path="why-velocity" element={<WhyVelocity />} />
              
              {/* 404 Catch All */}
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>
          <Toaster />
          <AssistantDrawer />
        </Refine>
          </LayoutModeProvider>
          </UserSettingsProvider>
      </ThemeProvider>
        </GatewayGuard>
        </AdminAuthProvider>
      </AssistantProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}
// Change Log Dashboard import will be added to routes
