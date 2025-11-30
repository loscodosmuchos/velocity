import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Network,
  GitBranch,
  Users,
  FileText,
  DollarSign,
  Building2,
  Clock,
  Shield,
  Sparkles,
  Play,
  Save,
  Download,
  Copy,
  Eye,
  Layers,
  Box,
  ArrowRight,
  Plus,
  Trash2,
  Settings,
  Palette,
  Layout,
  Database,
  Workflow,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

type GraphTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  nodes: Node[];
  edges: Edge[];
  popular?: boolean;
};

type DataSource = {
  id: string;
  name: string;
  icon: React.ReactNode;
  fields: string[];
  relationships: string[];
};

const dataSources: DataSource[] = [
  {
    id: "sows",
    name: "Statements of Work",
    icon: <FileText className="w-4 h-4" />,
    fields: ["id", "title", "status", "value", "startDate", "endDate", "vendorId", "buyerId"],
    relationships: ["Purchase Orders", "Contractors", "Change Orders", "Documents"],
  },
  {
    id: "purchase-orders",
    name: "Purchase Orders",
    icon: <DollarSign className="w-4 h-4" />,
    fields: ["id", "poNumber", "amount", "status", "sowId", "vendorId", "createdAt"],
    relationships: ["SOWs", "Contractors", "Invoices", "Timecards"],
  },
  {
    id: "contractors",
    name: "Contractors",
    icon: <Users className="w-4 h-4" />,
    fields: ["id", "name", "email", "rate", "status", "vendorId", "skills"],
    relationships: ["Purchase Orders", "Timecards", "Projects", "Vendors"],
  },
  {
    id: "vendors",
    name: "Vendors/Agencies",
    icon: <Building2 className="w-4 h-4" />,
    fields: ["id", "name", "type", "rating", "contractValue", "activeContractors"],
    relationships: ["SOWs", "Contractors", "Invoices", "Purchase Orders"],
  },
  {
    id: "timecards",
    name: "Timecards",
    icon: <Clock className="w-4 h-4" />,
    fields: ["id", "contractorId", "hours", "date", "status", "approvedBy"],
    relationships: ["Contractors", "Purchase Orders", "Invoices"],
  },
  {
    id: "invoices",
    name: "Invoices",
    icon: <FileText className="w-4 h-4" />,
    fields: ["id", "amount", "status", "vendorId", "dueDate", "paidDate"],
    relationships: ["Vendors", "Timecards", "Purchase Orders"],
  },
  {
    id: "approvals",
    name: "Approvals",
    icon: <Shield className="w-4 h-4" />,
    fields: ["id", "type", "status", "requesterId", "approverId", "createdAt"],
    relationships: ["Users", "Timecards", "Expenses", "Change Orders"],
  },
];

const layoutOptions = [
  { id: "hierarchical", name: "Hierarchical (Top-Down)", icon: <GitBranch className="w-4 h-4" /> },
  { id: "radial", name: "Radial (Center-Out)", icon: <Network className="w-4 h-4" /> },
  { id: "force", name: "Force-Directed", icon: <Sparkles className="w-4 h-4" /> },
  { id: "grid", name: "Grid Layout", icon: <Layers className="w-4 h-4" /> },
  { id: "horizontal", name: "Horizontal Flow", icon: <ArrowRight className="w-4 h-4" /> },
];

const graphTemplates: GraphTemplate[] = [
  {
    id: "sow-ecosystem",
    name: "SOW Ecosystem",
    description: "Visualize SOW relationships with POs, contractors, and vendors",
    category: "Procurement",
    icon: <FileText className="w-5 h-5 text-cyan-400" />,
    popular: true,
    nodes: [
      { id: "sow", position: { x: 250, y: 50 }, data: { label: "Statement of Work" }, type: "input" },
      { id: "po1", position: { x: 100, y: 150 }, data: { label: "Purchase Order 1" } },
      { id: "po2", position: { x: 400, y: 150 }, data: { label: "Purchase Order 2" } },
      { id: "c1", position: { x: 50, y: 250 }, data: { label: "Contractor A" } },
      { id: "c2", position: { x: 150, y: 250 }, data: { label: "Contractor B" } },
      { id: "c3", position: { x: 350, y: 250 }, data: { label: "Contractor C" } },
      { id: "c4", position: { x: 450, y: 250 }, data: { label: "Contractor D" } },
      { id: "vendor", position: { x: 250, y: 350 }, data: { label: "Vendor/Agency" }, type: "output" },
    ],
    edges: [
      { id: "e1", source: "sow", target: "po1", animated: true },
      { id: "e2", source: "sow", target: "po2", animated: true },
      { id: "e3", source: "po1", target: "c1" },
      { id: "e4", source: "po1", target: "c2" },
      { id: "e5", source: "po2", target: "c3" },
      { id: "e6", source: "po2", target: "c4" },
      { id: "e7", source: "c1", target: "vendor" },
      { id: "e8", source: "c2", target: "vendor" },
      { id: "e9", source: "c3", target: "vendor" },
      { id: "e10", source: "c4", target: "vendor" },
    ],
  },
  {
    id: "approval-flow",
    name: "Approval Workflow",
    description: "Map approval chains and delegation paths",
    category: "Operations",
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    popular: true,
    nodes: [
      { id: "request", position: { x: 250, y: 50 }, data: { label: "Request Submitted" }, type: "input" },
      { id: "mgr", position: { x: 250, y: 150 }, data: { label: "Manager Review" } },
      { id: "finance", position: { x: 100, y: 250 }, data: { label: "Finance Approval" } },
      { id: "legal", position: { x: 400, y: 250 }, data: { label: "Legal Review" } },
      { id: "exec", position: { x: 250, y: 350 }, data: { label: "Executive Sign-off" } },
      { id: "complete", position: { x: 250, y: 450 }, data: { label: "Approved" }, type: "output" },
    ],
    edges: [
      { id: "e1", source: "request", target: "mgr", animated: true },
      { id: "e2", source: "mgr", target: "finance" },
      { id: "e3", source: "mgr", target: "legal" },
      { id: "e4", source: "finance", target: "exec" },
      { id: "e5", source: "legal", target: "exec" },
      { id: "e6", source: "exec", target: "complete", animated: true },
    ],
  },
  {
    id: "vendor-network",
    name: "Vendor Network",
    description: "Analyze vendor relationships and contractor distribution",
    category: "Vendors",
    icon: <Building2 className="w-5 h-5 text-purple-400" />,
    nodes: [
      { id: "company", position: { x: 250, y: 50 }, data: { label: "Your Company" }, type: "input" },
      { id: "v1", position: { x: 100, y: 150 }, data: { label: "Vendor Alpha" } },
      { id: "v2", position: { x: 250, y: 150 }, data: { label: "Vendor Beta" } },
      { id: "v3", position: { x: 400, y: 150 }, data: { label: "Vendor Gamma" } },
      { id: "c1", position: { x: 50, y: 250 }, data: { label: "5 Contractors" } },
      { id: "c2", position: { x: 150, y: 250 }, data: { label: "3 Contractors" } },
      { id: "c3", position: { x: 250, y: 250 }, data: { label: "8 Contractors" } },
      { id: "c4", position: { x: 350, y: 250 }, data: { label: "2 Contractors" } },
      { id: "c5", position: { x: 450, y: 250 }, data: { label: "4 Contractors" } },
    ],
    edges: [
      { id: "e1", source: "company", target: "v1" },
      { id: "e2", source: "company", target: "v2" },
      { id: "e3", source: "company", target: "v3" },
      { id: "e4", source: "v1", target: "c1" },
      { id: "e5", source: "v1", target: "c2" },
      { id: "e6", source: "v2", target: "c3" },
      { id: "e7", source: "v3", target: "c4" },
      { id: "e8", source: "v3", target: "c5" },
    ],
  },
  {
    id: "budget-flow",
    name: "Budget Flow",
    description: "Track money flow from budget to invoices",
    category: "Finance",
    icon: <DollarSign className="w-5 h-5 text-amber-400" />,
    nodes: [
      { id: "budget", position: { x: 250, y: 50 }, data: { label: "Annual Budget" }, type: "input" },
      { id: "dept1", position: { x: 100, y: 150 }, data: { label: "IT Department" } },
      { id: "dept2", position: { x: 400, y: 150 }, data: { label: "Engineering" } },
      { id: "sow1", position: { x: 50, y: 250 }, data: { label: "Cloud SOW" } },
      { id: "sow2", position: { x: 150, y: 250 }, data: { label: "Security SOW" } },
      { id: "sow3", position: { x: 350, y: 250 }, data: { label: "Dev SOW" } },
      { id: "sow4", position: { x: 450, y: 250 }, data: { label: "QA SOW" } },
      { id: "spent", position: { x: 250, y: 350 }, data: { label: "Total Spent" }, type: "output" },
    ],
    edges: [
      { id: "e1", source: "budget", target: "dept1", label: "$2M" },
      { id: "e2", source: "budget", target: "dept2", label: "$3M" },
      { id: "e3", source: "dept1", target: "sow1" },
      { id: "e4", source: "dept1", target: "sow2" },
      { id: "e5", source: "dept2", target: "sow3" },
      { id: "e6", source: "dept2", target: "sow4" },
      { id: "e7", source: "sow1", target: "spent" },
      { id: "e8", source: "sow2", target: "spent" },
      { id: "e9", source: "sow3", target: "spent" },
      { id: "e10", source: "sow4", target: "spent" },
    ],
  },
  {
    id: "timecard-pipeline",
    name: "Timecard Pipeline",
    description: "Visualize timecard submission to payment flow",
    category: "Operations",
    icon: <Clock className="w-5 h-5 text-blue-400" />,
    nodes: [
      { id: "submit", position: { x: 50, y: 150 }, data: { label: "Submit" }, type: "input" },
      { id: "review", position: { x: 175, y: 150 }, data: { label: "PM Review" } },
      { id: "approve", position: { x: 300, y: 150 }, data: { label: "Approve" } },
      { id: "invoice", position: { x: 425, y: 150 }, data: { label: "Invoice" } },
      { id: "pay", position: { x: 550, y: 150 }, data: { label: "Payment" }, type: "output" },
    ],
    edges: [
      { id: "e1", source: "submit", target: "review", animated: true },
      { id: "e2", source: "review", target: "approve" },
      { id: "e3", source: "approve", target: "invoice" },
      { id: "e4", source: "invoice", target: "pay", animated: true },
    ],
  },
  {
    id: "data-architecture",
    name: "Data Architecture",
    description: "System data model and table relationships",
    category: "Technical",
    icon: <Database className="w-5 h-5 text-slate-400" />,
    nodes: [
      { id: "users", position: { x: 250, y: 50 }, data: { label: "Users" }, type: "input" },
      { id: "sows", position: { x: 100, y: 150 }, data: { label: "SOWs" } },
      { id: "vendors", position: { x: 400, y: 150 }, data: { label: "Vendors" } },
      { id: "pos", position: { x: 100, y: 250 }, data: { label: "Purchase Orders" } },
      { id: "contractors", position: { x: 400, y: 250 }, data: { label: "Contractors" } },
      { id: "timecards", position: { x: 250, y: 350 }, data: { label: "Timecards" } },
      { id: "invoices", position: { x: 250, y: 450 }, data: { label: "Invoices" }, type: "output" },
    ],
    edges: [
      { id: "e1", source: "users", target: "sows" },
      { id: "e2", source: "users", target: "vendors" },
      { id: "e3", source: "sows", target: "pos" },
      { id: "e4", source: "vendors", target: "contractors" },
      { id: "e5", source: "pos", target: "contractors" },
      { id: "e6", source: "contractors", target: "timecards" },
      { id: "e7", source: "timecards", target: "invoices" },
    ],
  },
];

const categoryFilters = ["All", "Procurement", "Operations", "Finance", "Vendors", "Technical"];

export default function GraphBuilderPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<GraphTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  // Query builder state
  const [primarySource, setPrimarySource] = useState("");
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState("hierarchical");
  const [graphTitle, setGraphTitle] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [animateEdges, setAnimateEdges] = useState(true);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const loadTemplate = useCallback((template: GraphTemplate) => {
    setSelectedTemplate(template);
    setNodes(template.nodes.map(n => ({
      ...n,
      style: {
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
        color: '#f1f5f9',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '12px',
        fontWeight: 500,
      },
    })));
    setEdges(template.edges.map(e => ({
      ...e,
      style: { stroke: 'rgba(34, 211, 238, 0.6)' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(34, 211, 238, 0.8)' },
    })));
    setGraphTitle(template.name);
    toast.success(`Loaded "${template.name}" template`);
  }, [setNodes, setEdges]);

  const generateFromQuery = useCallback(() => {
    if (!primarySource) {
      toast.error("Please select a primary data source");
      return;
    }

    const source = dataSources.find(d => d.id === primarySource);
    if (!source) return;

    const newNodes: Node[] = [
      {
        id: primarySource,
        position: { x: 250, y: 50 },
        data: { label: source.name },
        type: "input",
        style: {
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(30, 41, 59, 0.95) 100%)',
          color: '#f1f5f9',
          border: '2px solid rgba(34, 211, 238, 0.5)',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 600,
        },
      },
    ];

    const newEdges: Edge[] = [];
    let yOffset = 150;
    let xOffset = 50;

    selectedRelationships.forEach((rel, idx) => {
      const relSource = dataSources.find(d => d.name === rel);
      if (relSource) {
        const nodeId = `rel-${relSource.id}`;
        newNodes.push({
          id: nodeId,
          position: { x: xOffset + (idx * 150), y: yOffset },
          data: { label: relSource.name },
          style: {
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '12px',
            fontWeight: 500,
          },
        });
        newEdges.push({
          id: `e-${primarySource}-${nodeId}`,
          source: primarySource,
          target: nodeId,
          animated: animateEdges,
          style: { stroke: 'rgba(34, 211, 238, 0.6)' },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(34, 211, 238, 0.8)' },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setGraphTitle(graphTitle || `${source.name} Relationships`);
    toast.success("Graph generated from query");
  }, [primarySource, selectedRelationships, animateEdges, graphTitle, setNodes, setEdges]);

  const exportGraph = useCallback(() => {
    const graphData = {
      title: graphTitle,
      nodes: nodes,
      edges: edges,
      layout: selectedLayout,
      settings: { showLabels, animateEdges },
      createdAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `graph-${graphTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Graph exported successfully");
  }, [graphTitle, nodes, edges, selectedLayout, showLabels, animateEdges]);

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === "All") return graphTemplates;
    return graphTemplates.filter(t => t.category === categoryFilter);
  }, [categoryFilter]);

  const selectedSource = dataSources.find(d => d.id === primarySource);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Network className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Graph Builder</h1>
              <p className="text-slate-400">Create custom interactive relationship visualizations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportGraph} disabled={nodes.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700" disabled={nodes.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              Save Graph
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Builder Controls */}
          <div className="col-span-4 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-slate-900 border border-slate-700">
                <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
                <TabsTrigger value="builder" className="flex-1">Query Builder</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-4 mt-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={categoryFilter === cat ? "default" : "outline"}
                      onClick={() => setCategoryFilter(cat)}
                      className={categoryFilter === cat ? "bg-cyan-600" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Template Cards */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredTemplates.map(template => (
                    <Card
                      key={template.id}
                      className={`bg-slate-900/50 border-slate-700 cursor-pointer transition-all hover:border-cyan-500/50 ${
                        selectedTemplate?.id === template.id ? "border-cyan-500 ring-1 ring-cyan-500/30" : ""
                      }`}
                      onClick={() => loadTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-slate-800/50">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white">{template.name}</h3>
                              {template.popular && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{template.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px] border-slate-600">
                                {template.category}
                              </Badge>
                              <span className="text-[10px] text-slate-500">
                                {template.nodes.length} nodes, {template.edges.length} edges
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="builder" className="space-y-4 mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Data Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs">Primary Entity</Label>
                      <Select value={primarySource} onValueChange={setPrimarySource}>
                        <SelectTrigger className="bg-slate-800 border-slate-600">
                          <SelectValue placeholder="Select data source..." />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map(source => (
                            <SelectItem key={source.id} value={source.id}>
                              <div className="flex items-center gap-2">
                                {source.icon}
                                {source.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedSource && (
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-xs">Include Relationships</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedSource.relationships.map(rel => (
                            <Button
                              key={rel}
                              size="sm"
                              variant={selectedRelationships.includes(rel) ? "default" : "outline"}
                              onClick={() => {
                                if (selectedRelationships.includes(rel)) {
                                  setSelectedRelationships(prev => prev.filter(r => r !== rel));
                                } else {
                                  setSelectedRelationships(prev => [...prev, rel]);
                                }
                              }}
                              className={selectedRelationships.includes(rel) ? "bg-cyan-600" : ""}
                            >
                              {rel}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs">Graph Title</Label>
                      <Input
                        value={graphTitle}
                        onChange={(e) => setGraphTitle(e.target.value)}
                        placeholder="Enter graph title..."
                        className="bg-slate-800 border-slate-600"
                      />
                    </div>

                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      onClick={generateFromQuery}
                      disabled={!primarySource}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Graph
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Example Queries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                         onClick={() => {
                           setPrimarySource("sows");
                           setSelectedRelationships(["Purchase Orders", "Contractors"]);
                           setGraphTitle("SOW to Contractor Flow");
                         }}>
                      <p className="text-xs text-slate-300">"Show me all contractors under each SOW"</p>
                      <p className="text-[10px] text-slate-500 mt-1">SOW → PO → Contractors</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                         onClick={() => {
                           setPrimarySource("vendors");
                           setSelectedRelationships(["SOWs", "Contractors", "Invoices"]);
                           setGraphTitle("Vendor Ecosystem");
                         }}>
                      <p className="text-xs text-slate-300">"Map vendor relationships across the system"</p>
                      <p className="text-[10px] text-slate-500 mt-1">Vendors → SOWs, Contractors, Invoices</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-colors"
                         onClick={() => {
                           setPrimarySource("timecards");
                           setSelectedRelationships(["Contractors", "Invoices"]);
                           setGraphTitle("Timecard to Payment");
                         }}>
                      <p className="text-xs text-slate-300">"Track timecards to invoice generation"</p>
                      <p className="text-[10px] text-slate-500 mt-1">Timecards → Contractors → Invoices</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Layout className="w-4 h-4 text-cyan-400" />
                      Layout Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {layoutOptions.map(layout => (
                      <div
                        key={layout.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedLayout === layout.id
                            ? "bg-cyan-500/20 border border-cyan-500/30"
                            : "bg-slate-800/50 border border-transparent hover:border-slate-600"
                        }`}
                        onClick={() => setSelectedLayout(layout.id)}
                      >
                        <div className="text-slate-400">{layout.icon}</div>
                        <span className="text-sm text-white">{layout.name}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-400" />
                      Display Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Show Labels</Label>
                      <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Animate Edges</Label>
                      <Switch checked={animateEdges} onCheckedChange={setAnimateEdges} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Graph Preview */}
          <div className="col-span-8">
            <Card className="bg-slate-900/50 border-slate-700 h-[600px]">
              <CardHeader className="pb-2 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    {graphTitle || "Graph Preview"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                      {nodes.length} nodes
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                      {edges.length} edges
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                {nodes.length > 0 ? (
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    className="bg-slate-950"
                  >
                    <Controls className="bg-slate-800 border-slate-700 [&>button]:bg-slate-800 [&>button]:border-slate-600 [&>button]:text-slate-300 [&>button:hover]:bg-slate-700" />
                    <Background color="rgba(148, 163, 184, 0.1)" gap={20} />
                  </ReactFlow>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Network className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No graph loaded</p>
                    <p className="text-sm mt-1">Select a template or build a query to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
