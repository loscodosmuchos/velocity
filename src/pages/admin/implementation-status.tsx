import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  XCircle,
  Loader2,
  ChevronRight,
  Database,
  Zap,
  Code,
  Palette,
} from "lucide-react";
import { Link } from "react-router";

interface ImplementationItem {
  id: string;
  title: string;
  description: string;
  category: "data" | "functionality" | "integration" | "ui";
  status: "complete" | "in-progress" | "blocked" | "not-started";
  priority: "critical" | "high" | "medium" | "low";
  page?: string;
  notes?: string;
  dependencies?: string[];
}

const implementationItems: ImplementationItem[] = [
  {
    id: "elevenlabs-test-buttons",
    title: "ElevenLabs Test Call Buttons",
    description: "Test call buttons show alert() instead of functional voice calls",
    category: "functionality",
    status: "not-started",
    priority: "high",
    page: "/ai/chatbots",
    notes: "Need to implement actual ElevenLabs API integration for test calls",
  },
  {
    id: "chatbot-metrics-backend",
    title: "Chatbot Performance Metrics Backend",
    description: "Implement real backend tracking for conversation count, response time, satisfaction scores",
    category: "data",
    status: "not-started",
    priority: "medium",
    page: "/ai/chatbots",
    notes: "Currently showing no metrics - need database tables and API endpoints",
  },
  {
    id: "vendor-extraction-api",
    title: "Vendor Extraction API Integration",
    description: "Connect vendor extraction to real AI service for document parsing",
    category: "integration",
    status: "in-progress",
    priority: "high",
    page: "/ai/vendor-extraction",
    notes: "Alert dialog shows success but may need validation",
  },
  {
    id: "asset-scanning-camera",
    title: "Asset RFID/Barcode Scanning",
    description: "Implement camera access and barcode scanning functionality",
    category: "functionality",
    status: "not-started",
    priority: "medium",
    page: "/assets/scan",
    notes: "Shows alert for camera access but needs full implementation",
  },
  {
    id: "hybrid-search-ui",
    title: "Hybrid Search Results UI",
    description: "Complete UI for displaying semantic + keyword search results with RRF scoring",
    category: "ui",
    status: "in-progress",
    priority: "medium",
    page: "/search/global",
    notes: "Backend pgvector + BM25 ready, frontend needs enhancement",
  },
  {
    id: "budget-forecasting-ml",
    title: "Budget Forecasting ML Model",
    description: "Implement machine learning model for budget predictions",
    category: "data",
    status: "not-started",
    priority: "low",
    page: "/budget/forecasting",
    notes: "Page structure ready, awaiting ML model integration",
  },
  {
    id: "approval-workflow-automation",
    title: "Approval Workflow Automation",
    description: "Configure automated approval routing based on business rules",
    category: "functionality",
    status: "not-started",
    priority: "high",
    page: "/approvals/configure",
    notes: "Configuration UI exists, needs backend workflow engine",
  },
  {
    id: "xlsx-import-validation",
    title: "XLSX Import Data Validation",
    description: "Add comprehensive validation for bulk import spreadsheets",
    category: "data",
    status: "in-progress",
    priority: "high",
    page: "/admin/xlsx-import",
    notes: "Basic import works, needs error handling and validation rules",
  },
  {
    id: "contractor-portal-auth",
    title: "Contractor Portal Authentication",
    description: "Separate auth flow for contractor self-service portal",
    category: "integration",
    status: "not-started",
    priority: "critical",
    page: "/contractor-portal",
    notes: "Portal pages exist but use same auth as main app",
  },
  {
    id: "multi-tenant-rls-testing",
    title: "Multi-Tenant RLS Testing",
    description: "Comprehensive testing of Row-Level Security across all tables",
    category: "data",
    status: "in-progress",
    priority: "critical",
    page: "Database",
    notes: "RLS policies implemented, need systematic testing",
  },
  {
    id: "ai-qa-batch-retry",
    title: "AI QA Batch Retry Logic",
    description: "Add retry mechanism for failed batch items",
    category: "functionality",
    status: "not-started",
    priority: "medium",
    page: "/admin/ai-qa-lab",
    notes: "Batch system works but no retry for failures",
  },
  {
    id: "notification-center-realtime",
    title: "Real-time Notification Updates",
    description: "Implement WebSocket/SSE for live notification delivery",
    category: "integration",
    status: "not-started",
    priority: "medium",
    page: "/notifications/center",
    notes: "Currently polls API, should push updates",
  },
  {
    id: "dashboard-caching",
    title: "Dashboard Data Caching",
    description: "Implement Redis/in-memory caching for dashboard metrics",
    category: "data",
    status: "not-started",
    priority: "low",
    page: "Multiple dashboards",
    notes: "Performance optimization - not blocking",
  },
  {
    id: "sidebar-professional-styling",
    title: "Sidebar Professional Styling",
    description: "Damascus steel-like background with improved visual hierarchy and density",
    category: "ui",
    status: "in-progress",
    priority: "high",
    page: "Global UI",
    notes: "Reduce padding, add professional background, improve iconography",
  },
];

export function ImplementationStatusPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems =
    selectedCategory === "all"
      ? implementationItems
      : implementationItems.filter((item) => item.category === selectedCategory);

  const stats = {
    total: implementationItems.length,
    complete: implementationItems.filter((i) => i.status === "complete").length,
    inProgress: implementationItems.filter((i) => i.status === "in-progress").length,
    blocked: implementationItems.filter((i) => i.status === "blocked").length,
    notStarted: implementationItems.filter((i) => i.status === "not-started").length,
  };

  const completionPercentage = Math.round((stats.complete / stats.total) * 100);

  const getStatusIcon = (status: ImplementationItem["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "blocked":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "not-started":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ImplementationItem["status"]) => {
    switch (status) {
      case "complete":
        return <Badge variant="default" className="bg-green-500">Complete</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "not-started":
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getPriorityBadge = (priority: ImplementationItem["priority"]) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="default" className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getCategoryIcon = (category: ImplementationItem["category"]) => {
    switch (category) {
      case "data":
        return <Database className="h-4 w-4" />;
      case "functionality":
        return <Zap className="h-4 w-4" />;
      case "integration":
        return <Code className="h-4 w-4" />;
      case "ui":
        return <Palette className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <AlertCircle className="h-8 w-8 text-orange-500" />
          Implementation Status Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track incomplete features, sample data, and implementation gaps across the platform
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.complete}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.blocked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.notStarted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Overall Completion</CardTitle>
          <CardDescription>Percentage of features fully implemented</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold text-lg">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({implementationItems.length})</TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Data ({implementationItems.filter((i) => i.category === "data").length})
          </TabsTrigger>
          <TabsTrigger value="functionality">
            <Zap className="h-4 w-4 mr-2" />
            Functions ({implementationItems.filter((i) => i.category === "functionality").length})
          </TabsTrigger>
          <TabsTrigger value="integration">
            <Code className="h-4 w-4 mr-2" />
            Integrations ({implementationItems.filter((i) => i.category === "integration").length})
          </TabsTrigger>
          <TabsTrigger value="ui">
            <Palette className="h-4 w-4 mr-2" />
            UI ({implementationItems.filter((i) => i.category === "ui").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(item.status)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(item.status)}
                    {getPriorityBadge(item.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getCategoryIcon(item.category)}
                  <span className="capitalize">{item.category}</span>
                  {item.page && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      {item.page.startsWith("/") ? (
                        <Link to={item.page} className="text-primary hover:underline">
                          {item.page}
                        </Link>
                      ) : (
                        <span>{item.page}</span>
                      )}
                    </>
                  )}
                </div>

                {item.notes && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm">{item.notes}</p>
                  </div>
                )}

                {item.dependencies && item.dependencies.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Dependencies:</span>{" "}
                      <span className="text-muted-foreground">{item.dependencies.join(", ")}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
