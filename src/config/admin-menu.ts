import {
  LayoutDashboard,
  FileText,
  AlertCircle,
  Code2,
  Youtube,
  BookOpen,
  Database,
  Map,
  Users,
  ScrollText,
  ShieldAlert,
  BarChart3,
  MessageSquare,
  Mic,
  FileSpreadsheet,
  Beaker,
  TrendingUp,
  Tv,
  Crown,
  Palette,
} from "lucide-react";

export interface AdminMenuItem {
  key: string;
  name: string;
  fullLabel?: string;
  path: string;
  icon: typeof LayoutDashboard;
}

/**
 * Centralized Admin Menu Configuration
 * Single source of truth for admin routes used by both Sidebar and TopNav
 */
export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    key: "admin-dashboard",
    name: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "platform-definition",
    name: "Platform Def",
    fullLabel: "Platform Definition",
    path: "/admin/platform-definition",
    icon: FileText,
  },
  {
    key: "error-tracking",
    name: "Error Tracking",
    path: "/admin/error-tracking",
    icon: AlertCircle,
  },
  {
    key: "logic-studio",
    name: "Logic Studio",
    path: "/admin/logic-studio",
    icon: Code2,
  },
  {
    key: "youtube-capture",
    name: "YouTube Capture",
    path: "/admin/youtube-capture",
    icon: Youtube,
  },
  {
    key: "knowledge-hub",
    name: "Knowledge Hub",
    path: "/admin/knowledge-hub",
    icon: BookOpen,
  },
  {
    key: "demo-data-gen",
    name: "Demo Data Gen",
    fullLabel: "Demo Data Generator",
    path: "/admin/demo-data-generator",
    icon: Database,
  },
  {
    key: "system-arch-map",
    name: "System Arch Map",
    fullLabel: "System Architecture Map",
    path: "/admin/system-architecture-map",
    icon: Map,
  },
  {
    key: "user-management",
    name: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    key: "audit-logs",
    name: "Audit Logs",
    path: "/admin/audit-logs",
    icon: ScrollText,
  },
  {
    key: "exceptions",
    name: "Exceptions",
    fullLabel: "System Exceptions",
    path: "/admin/exceptions",
    icon: ShieldAlert,
  },
  {
    key: "data-quality",
    name: "Data Quality",
    path: "/admin/data-quality",
    icon: BarChart3,
  },
  {
    key: "chatbots-customize",
    name: "Chatbot Config",
    fullLabel: "Chatbots Customize",
    path: "/admin/chatbots-customize",
    icon: MessageSquare,
  },
  {
    key: "voice-panel",
    name: "Voice Panel",
    path: "/admin/voice-panel",
    icon: Mic,
  },
  {
    key: "xlsx-import",
    name: "XLSX Import",
    path: "/admin/xlsx-import",
    icon: FileSpreadsheet,
  },
  {
    key: "ai-qa-lab",
    name: "AI QA Lab",
    path: "/admin/ai-qa-lab",
    icon: Beaker,
  },
  {
    key: "implementation-status",
    name: "Impl Status",
    fullLabel: "Implementation Status",
    path: "/admin/implementation-status",
    icon: TrendingUp,
  },
  {
    key: "demo-presentation",
    name: "Demo Deck",
    fullLabel: "Demo Presentation",
    path: "/admin/demo-presentation",
    icon: TrendingUp,
  },
  {
    key: "architect-command-center",
    name: "Architect CC",
    fullLabel: "Architect CC",
    path: "/admin/architect-command-center",
    icon: Crown,
  },
  {
    key: "style-gallery",
    name: "Style Gallery",
    fullLabel: "Component Style Gallery",
    path: "/admin/style-gallery",
    icon: Palette,
  },
  {
    key: "database-schema-audit",
    name: "DB Schema Audit",
    fullLabel: "Database Schema Audit",
    path: "/admin/database-schema-audit",
    icon: Database,
  },
];

/**
 * Get admin menu item by key
 */
export function getAdminMenuItem(key: string): AdminMenuItem | undefined {
  return ADMIN_MENU_ITEMS.find((item) => item.key === key);
}

/**
 * Check if a path is an admin route
 */
export function isAdminRoute(path: string): boolean {
  return ADMIN_MENU_ITEMS.some((item) => path.startsWith(item.path));
}
