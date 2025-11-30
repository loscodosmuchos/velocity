import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, PlayCircle, Search, Server } from "lucide-react";
import { ApiTestingDialog } from "@/components/admin/api-testing-dialog";

interface ApiEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requiresAuth: boolean;
  category: "summary" | "crud" | "notifications" | "search" | "compliance";
  requestSchema?: {
    queryParams?: Record<string, { type: string; description: string; required?: boolean }>;
    bodyParams?: Record<string, { type: string; description: string; required?: boolean }>;
  };
  responseSchema?: {
    description: string;
    example: any;
  };
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "timecards-summary",
    name: "Timecards Summary",
    method: "GET",
    path: "/api/timecards/summary",
    description: "Whole-dataset timecard metrics (hours, amount, status breakdown, anomalies)",
    requiresAuth: true,
    category: "summary",
    responseSchema: {
      description: "Aggregated metrics across all timecards in the system",
      example: {
        totalHours: 1247.5,
        totalAmount: 124750,
        statusBreakdown: {
          Pending: { count: 15, hours: 120, amount: 12000 },
          Approved: { count: 85, hours: 850, amount: 85000 },
          Rejected: { count: 3, hours: 24, amount: 2400 },
        },
        pendingCount: 15,
        anomalyCount: 2,
      },
    },
  },
  {
    id: "po-summary",
    name: "Purchase Orders Summary",
    method: "GET",
    path: "/api/purchase-orders/summary",
    description: "Portfolio-wide PO budget tracking (total, at-risk, expiring)",
    requiresAuth: true,
    category: "summary",
    responseSchema: {
      description: "Aggregated budget metrics across all purchase orders",
      example: {
        totalCount: 42,
        totalBudget: 1500000,
        totalSpent: 1125000,
        totalRemaining: 375000,
        atRiskCount: 8,
        activeCount: 35,
        expiringCount: 5,
      },
    },
  },
  {
    id: "notifications-poll",
    name: "Notifications Polling",
    method: "GET",
    path: "/api/notifications/poll",
    description: "Real-time alerts (budget warnings, pending approvals, missing data)",
    requiresAuth: true,
    category: "notifications",
    requestSchema: {
      queryParams: {
        lastChecked: {
          type: "ISO timestamp",
          description: "Only return notifications after this timestamp (defaults to 5 minutes ago)",
          required: false,
        },
      },
    },
    responseSchema: {
      description: "Recent alerts, budget warnings, and pending actions",
      example: {
        alerts: [
          {
            id: 123,
            title: "Budget Threshold Alert",
            message: "PO #1234 has exceeded 90% of budget",
            severity: "critical",
            resourceType: "purchase_order",
            resourceId: 1234,
            createdAt: "2025-11-13T19:00:00Z",
          },
        ],
        budgetWarnings: [
          {
            id: 1234,
            poNumber: "PO-2025-1234",
            totalAmount: 100000,
            spentAmount: 92000,
            percentUsed: "92",
          },
        ],
        pendingApprovalsCount: 15,
        missingDataCount: 3,
        timestamp: "2025-11-13T19:32:00Z",
      },
    },
  },
  {
    id: "dashboard-kpis",
    name: "Dashboard KPIs",
    method: "GET",
    path: "/api/dashboard/kpis",
    description: "Dashboard-wide KPIs (contractors, POs, timecards, alerts)",
    requiresAuth: true,
    category: "summary",
    responseSchema: {
      description: "High-level metrics for executive dashboard",
      example: {
        activeContractors: 127,
        activePOs: 35,
        totalPOValue: 1500000,
        pendingTimecards: 15,
        criticalAlerts: 3,
      },
    },
  },
  {
    id: "hybrid-search",
    name: "Hybrid Search (pgvector + BM25)",
    method: "POST",
    path: "/api/search/hybrid",
    description: "Hybrid search with RRF scoring (keyword + semantic)",
    requiresAuth: true,
    category: "search",
    requestSchema: {
      bodyParams: {
        query: {
          type: "string",
          description: "Search query text",
          required: true,
        },
        limit: {
          type: "number",
          description: "Maximum results to return (default: 10)",
          required: false,
        },
      },
    },
    responseSchema: {
      description: "Ranked search results combining semantic and keyword matching",
      example: {
        results: [
          {
            id: 45,
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            skills: "JavaScript, React, Node.js",
            score: 0.92,
            matchType: "hybrid",
          },
        ],
        executionTime: 45,
        totalResults: 5,
      },
    },
  },
  {
    id: "client-requirements-get",
    name: "Get Client Requirements",
    method: "GET",
    path: "/api/client-requirements",
    description: "Retrieve pending compliance requirements for contractor portal",
    requiresAuth: true,
    category: "compliance",
    requestSchema: {
      queryParams: {
        status: {
          type: "string",
          description: "Filter by status (pending, in_progress, completed)",
          required: false,
        },
        contractorId: {
          type: "number",
          description: "Filter by contractor ID",
          required: false,
        },
      },
    },
    responseSchema: {
      description: "List of pending compliance document requests",
      example: [
        {
          id: "req_abc123",
          contractId: 456,
          contractorId: 789,
          category: "Insurance",
          specificRequirement: "Certificate of Insurance with $2M liability coverage",
          priority: "high",
          dueDate: "2025-12-01",
          status: "pending",
          createdAt: "2025-11-13T10:00:00Z",
        },
      ],
    },
  },
  {
    id: "client-requirements-post",
    name: "Submit Client Requirements",
    method: "POST",
    path: "/api/client-requirements",
    description: "Submit missing data requests from contract analysis",
    requiresAuth: true,
    category: "compliance",
    requestSchema: {
      bodyParams: {
        contractId: {
          type: "number",
          description: "Contract ID",
          required: true,
        },
        requirements: {
          type: "array",
          description: "List of requirement objects with category, requirement, priority",
          required: true,
        },
      },
    },
    responseSchema: {
      description: "Created requirements with IDs",
      example: {
        success: true,
        count: 3,
        requirements: [
          {
            id: "req_abc123",
            category: "Insurance",
            priority: "high",
          },
        ],
      },
    },
  },
];

/**
 * DEVELOPER-ONLY TOOL
 * 
 * This page is for internal API testing and debugging.
 * NOT exposed to end users (CPO, PM, Finance, etc.)
 * 
 * Access via direct URL only: /admin/api-testing
 * No navigation links in main UI
 */
export default function ApiTestingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filteredEndpoints = API_ENDPOINTS.filter((endpoint) => {
    const matchesSearch =
      endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || endpoint.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(API_ENDPOINTS.map((e) => e.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Server className="h-8 w-8" />
          API Testing Lab
        </h1>
        <p className="text-muted-foreground mt-2">
          Test and validate backend API endpoints with interactive VIEW/TEST modals
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search endpoints by name, path, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={categoryFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(null)}>
            All ({API_ENDPOINTS.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(category)}>
              {category} ({API_ENDPOINTS.filter((e) => e.category === category).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEndpoints.map((endpoint) => (
          <Card key={endpoint.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium">{endpoint.name}</CardTitle>
                <Badge variant={endpoint.method === "GET" ? "default" : "secondary"} className="text-xs">
                  {endpoint.method}
                </Badge>
              </div>
              <CardDescription className="text-xs line-clamp-2">{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Endpoint</div>
                <code className="text-xs bg-muted px-2 py-1 rounded block truncate">{endpoint.path}</code>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {endpoint.category}
                </Badge>
                {endpoint.requiresAuth && (
                  <Badge variant="destructive" className="text-xs">
                    Auth Required
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedEndpoint(endpoint)}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="default" size="sm" className="flex-1" onClick={() => setSelectedEndpoint(endpoint)}>
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEndpoints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No endpoints match your search criteria</p>
        </div>
      )}

      {/* Testing Dialog */}
      {selectedEndpoint && (
        <ApiTestingDialog
          open={!!selectedEndpoint}
          onOpenChange={(open) => !open && setSelectedEndpoint(null)}
          endpoint={selectedEndpoint}
        />
      )}
    </div>
  );
}
