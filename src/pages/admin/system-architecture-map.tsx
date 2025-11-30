import { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OCRArchitectureMap } from '@/components/admin/ocr-architecture-map';
import { 
  CheckCircle, 
  AlertTriangle, 
  Circle, 
  RefreshCw, 
  Download,
  ExternalLink,
  Clock,
  FileCheck,
  Camera
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleStatus {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  category: string;
  lastUpdated?: string;
  completedBy?: string;
  testsRun?: string[];
  proofScreenshot?: string;
  proofLink?: string;
  dependencies?: string[];
  description?: string;
}

const CustomNode = ({ data }: { data: ModuleStatus }) => {
  const statusColors: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-yellow-500',
    pending: 'bg-gray-400',
    blocked: 'bg-red-500'
  };

  const statusIcons: Record<string, React.ReactElement> = {
    completed: <CheckCircle className="h-4 w-4" />,
    in_progress: <RefreshCw className="h-4 w-4 animate-spin" />,
    pending: <Circle className="h-4 w-4" />,
    blocked: <AlertTriangle className="h-4 w-4" />
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`px-4 py-3 rounded-lg border-2 shadow-lg min-w-[180px] cursor-pointer transition-all hover:scale-105 ${
            data.status === 'completed' ? 'border-green-500 bg-green-50' :
            data.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
            data.status === 'blocked' ? 'border-red-500 bg-red-50' :
            'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`${statusColors[data.status]} text-white p-1 rounded`}>
                {statusIcons[data.status]}
              </div>
              <span className="font-semibold text-sm">{data.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">{data.category}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm p-4">
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              {data.name}
              <Badge variant={
                data.status === 'completed' ? 'default' :
                data.status === 'in_progress' ? 'secondary' :
                data.status === 'blocked' ? 'destructive' :
                'outline'
              }>
                {data.status}
              </Badge>
            </div>
            
            {data.description && (
              <p className="text-sm text-muted-foreground">{data.description}</p>
            )}

            {data.lastUpdated && (
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>Updated: {new Date(data.lastUpdated).toLocaleString()}</span>
              </div>
            )}

            {data.completedBy && (
              <div className="text-xs">
                <span className="font-medium">Completed by:</span> {data.completedBy}
              </div>
            )}

            {data.testsRun && data.testsRun.length > 0 && (
              <div className="text-xs">
                <div className="font-medium flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  Tests Run:
                </div>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {data.testsRun.map((test: string, i: number) => (
                    <li key={i}>{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.proofScreenshot && (
              <div className="pt-2 border-t">
                <a 
                  href={data.proofScreenshot} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                >
                  <Camera className="h-3 w-3" />
                  View Screenshot Proof
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {data.proofLink && (
              <div>
                <a 
                  href={data.proofLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Live Module
                </a>
              </div>
            )}

            {data.dependencies && data.dependencies.length > 0 && (
              <div className="text-xs pt-2 border-t">
                <div className="font-medium">Dependencies:</div>
                <div className="text-muted-foreground">{data.dependencies.join(', ')}</div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function SystemArchitectureMapPage() {
  const [modules, setModules] = useState<ModuleStatus[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load module statuses from localStorage or API
  useEffect(() => {
    const savedModules = localStorage.getItem('velocityModuleStatus');
    if (savedModules) {
      const parsed = JSON.parse(savedModules);
      setModules(parsed);
      buildDiagram(parsed);
    } else {
      // Initialize with current system state
      const initialModules: ModuleStatus[] = [
        // Core Platform
        {
          id: 'auth',
          name: 'Authentication System',
          status: 'completed',
          category: 'Core Platform',
          description: 'JWT-based auth with demo mode support',
          lastUpdated: '2025-11-19T23:00:00Z',
          completedBy: 'System',
          testsRun: ['Login flow test', 'Token validation', 'Demo mode switch'],
          proofLink: '/login'
        },
        {
          id: 'database',
          name: 'PostgreSQL + pgvector',
          status: 'completed',
          category: 'Core Platform',
          description: 'Neon PostgreSQL with hybrid search',
          lastUpdated: '2025-11-19T22:00:00Z',
          completedBy: 'System',
          testsRun: ['Connection test', 'RLS policies', 'Vector search'],
          dependencies: []
        },
        {
          id: 'api',
          name: 'REST API Server',
          status: 'completed',
          category: 'Core Platform',
          description: 'Express.js backend with CORS',
          lastUpdated: '2025-11-20T00:15:00Z',
          completedBy: 'System',
          testsRun: ['Health check', 'Auth middleware', 'CRUD operations'],
          dependencies: ['database', 'auth']
        },

        // Workforce Management
        {
          id: 'contractors',
          name: 'Contractor Management',
          status: 'completed',
          category: 'Workforce',
          description: 'Full contractor lifecycle tracking',
          lastUpdated: '2025-11-19T20:00:00Z',
          completedBy: 'System',
          testsRun: ['Create contractor', 'Update skills', 'Status tracking'],
          dependencies: ['database', 'api'],
          proofLink: '/contractors'
        },
        {
          id: 'purchase_orders',
          name: 'Purchase Orders',
          status: 'completed',
          category: 'Workforce',
          description: 'PO creation and budget tracking',
          lastUpdated: '2025-11-19T20:30:00Z',
          completedBy: 'System',
          testsRun: ['Create PO', 'Budget alerts', 'Spent tracking'],
          dependencies: ['database', 'api'],
          proofLink: '/purchase-orders'
        },
        {
          id: 'timecards',
          name: 'Timecard System',
          status: 'completed',
          category: 'Workforce',
          description: 'Time tracking and approval workflow',
          lastUpdated: '2025-11-19T21:00:00Z',
          completedBy: 'System',
          testsRun: ['Submit timecard', 'Approval flow', 'Hours validation'],
          dependencies: ['contractors', 'api'],
          proofLink: '/timecards'
        },
        {
          id: 'invoices',
          name: 'Invoice Management',
          status: 'completed',
          category: 'Workforce',
          description: 'Invoice generation and payment tracking',
          lastUpdated: '2025-11-19T21:30:00Z',
          completedBy: 'System',
          testsRun: ['Generate invoice', 'Payment status', 'Overdue alerts'],
          dependencies: ['timecards', 'api'],
          proofLink: '/invoices'
        },

        // Dashboards
        {
          id: 'exec_dashboard',
          name: 'Executive Command Center',
          status: 'in_progress',
          category: 'Dashboards',
          description: 'CPO dashboard with real-time alerts',
          lastUpdated: '2025-11-20T00:30:00Z',
          completedBy: 'Agent',
          testsRun: ['Widget rendering', 'Alert system', 'Budget thresholds'],
          dependencies: ['purchase_orders', 'contractors'],
          proofLink: '/dashboard'
        },
        {
          id: 'dashboard_builder',
          name: 'Dashboard Builder',
          status: 'completed',
          category: 'Dashboards',
          description: 'Drag-and-drop dashboard customization',
          lastUpdated: '2025-11-19T23:45:00Z',
          completedBy: 'Agent',
          testsRun: ['Widget drag', 'Template load', 'Save layout'],
          dependencies: ['exec_dashboard'],
          proofLink: '/dashboard/builder'
        },

        // Admin Tools
        {
          id: 'knowledge_mgmt',
          name: 'Knowledge Management',
          status: 'completed',
          category: 'Admin Tools',
          description: 'YouTube transcript capture and organization',
          lastUpdated: '2025-11-20T00:25:00Z',
          completedBy: 'Agent',
          testsRun: ['Transcript extraction', 'Folder save', 'Insight tagging'],
          dependencies: ['database', 'api'],
          proofLink: '/admin/knowledge-hub'
        },
        {
          id: 'demo_data_gen',
          name: 'Demo Data Generator',
          status: 'completed',
          category: 'Admin Tools',
          description: '100% safe demo data with backup/restore',
          lastUpdated: '2025-11-20T00:30:00Z',
          completedBy: 'Agent',
          testsRun: ['Backup creation', 'Data generation', 'Validation', 'Test import', 'Restore'],
          dependencies: ['database'],
          proofLink: '/admin/demo-data-generator'
        },
        {
          id: 'user_mgmt',
          name: 'User Management',
          status: 'completed',
          category: 'Admin Tools',
          description: 'Role-based access control',
          lastUpdated: '2025-11-19T22:30:00Z',
          completedBy: 'System',
          testsRun: ['Create user', 'Assign role', 'Permissions check'],
          dependencies: ['auth', 'database'],
          proofLink: '/admin/users'
        },

        // AI Features
        {
          id: 'contract_intelligence',
          name: 'Contract Intelligence',
          status: 'pending',
          category: 'AI Features',
          description: 'Claude-powered contract analysis',
          dependencies: ['api'],
        },
        {
          id: 'voice_callbacks',
          name: 'Voice Callbacks',
          status: 'pending',
          category: 'AI Features',
          description: 'ElevenLabs voice synthesis for alerts',
          dependencies: ['contract_intelligence'],
        },
        {
          id: 'vinessa_agent',
          name: 'VINessa AI Agent',
          status: 'pending',
          category: 'AI Features',
          description: 'Conversational AI for VMS queries',
          dependencies: ['api', 'knowledge_mgmt'],
        },

        // Compliance & Reporting
        {
          id: 'audit_logs',
          name: 'Audit Logging',
          status: 'completed',
          category: 'Compliance',
          description: 'Complete audit trail',
          lastUpdated: '2025-11-19T22:45:00Z',
          completedBy: 'System',
          testsRun: ['Log capture', 'Query logs', 'Retention policy'],
          dependencies: ['database'],
          proofLink: '/admin/audit-logs'
        },
        {
          id: 'data_quality',
          name: 'Data Quality Dashboard',
          status: 'completed',
          category: 'Compliance',
          description: 'Data integrity monitoring',
          lastUpdated: '2025-11-19T23:00:00Z',
          completedBy: 'System',
          testsRun: ['Validation rules', 'Quality score', 'Issue tracking'],
          dependencies: ['database'],
          proofLink: '/admin/data-quality'
        }
      ];

      setModules(initialModules);
      buildDiagram(initialModules);
      localStorage.setItem('velocityModuleStatus', JSON.stringify(initialModules));
    }
  }, []);

  const buildDiagram = useCallback((moduleList: ModuleStatus[]) => {
    // Create nodes grouped by category
    const categories = [...new Set(moduleList.map(m => m.category))];
    const categoryYPositions: Record<string, number> = {};
    
    categories.forEach((cat, i) => {
      categoryYPositions[cat] = i * 250;
    });

    const newNodes: Node[] = moduleList.map((module, i) => {
      const categoryModules = moduleList.filter(m => m.category === module.category);
      const indexInCategory = categoryModules.indexOf(module);
      
      return {
        id: module.id,
        type: 'custom',
        position: { 
          x: indexInCategory * 220 + 50, 
          y: categoryYPositions[module.category] 
        },
        data: module as unknown as Record<string, unknown>,
      };
    });

    // Create edges based on dependencies
    const newEdges: Edge[] = [];
    moduleList.forEach(module => {
      if (module.dependencies) {
        module.dependencies.forEach(depId => {
          newEdges.push({
            id: `${depId}-${module.id}`,
            source: depId,
            target: module.id,
            animated: module.status === 'in_progress',
            style: { 
              stroke: module.status === 'completed' ? '#22c55e' : 
                      module.status === 'in_progress' ? '#eab308' :
                      module.status === 'blocked' ? '#ef4444' : '#9ca3af'
            }
          });
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  const handleRefresh = () => {
    const saved = localStorage.getItem('velocityModuleStatus');
    if (saved) {
      const parsed = JSON.parse(saved);
      setModules(parsed);
      buildDiagram(parsed);
      setLastRefresh(new Date());
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(modules, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velocity_architecture_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusCounts = {
    completed: modules.filter(m => m.status === 'completed').length,
    in_progress: modules.filter(m => m.status === 'in_progress').length,
    pending: modules.filter(m => m.status === 'pending').length,
    blocked: modules.filter(m => m.status === 'blocked').length,
  };

  const completionRate = Math.round((statusCounts.completed / modules.length) * 100);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">System Architecture Map</h1>
            <p className="text-muted-foreground mt-2">
              50,000-foot view of all Velocity modules with live status tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.in_progress}</p>
                </div>
                <RefreshCw className="h-10 w-10 text-yellow-500 animate-spin" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-gray-600">{statusCounts.pending}</p>
                </div>
                <Circle className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                  <p className="text-3xl font-bold text-red-600">{statusCounts.blocked}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last refreshed: {lastRefresh.toLocaleString()}
        </div>
      </div>

      <Tabs defaultValue="flow" className="flex-1 flex flex-col">
        <div className="px-6 border-b bg-slate-900/50">
          <TabsList className="bg-transparent">
            <TabsTrigger value="flow" className="data-[state=active]:bg-slate-800">Module Flow</TabsTrigger>
            <TabsTrigger value="reference" className="data-[state=active]:bg-slate-800">Reference Architecture</TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-slate-800">Implementation Roadmap</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="flow" className="flex-1 m-0">
          <div className="h-full bg-gray-50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Background />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  const status = node.data.status;
                  return status === 'completed' ? '#22c55e' :
                         status === 'in_progress' ? '#eab308' :
                         status === 'blocked' ? '#ef4444' : '#9ca3af';
                }}
              />
            </ReactFlow>
          </div>
        </TabsContent>
        
        <TabsContent value="reference" className="flex-1 m-0 overflow-auto p-6 bg-slate-950">
          <Card className="bg-slate-900/70 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">HR System Architecture - Multi-Agent Pattern</CardTitle>
              <CardDescription>
                Reference architecture showing User Layer → Frontend → API Gateway/MCP → Core HR Modules → AI Agentic Layer → Backend Services → External Integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img 
                src="/attached_assets/hr_system_architecture_1764121574164.png" 
                alt="HR System Architecture Diagram"
                className="w-full rounded-lg border border-slate-700/50"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">User Layer</h4>
                  <p className="text-slate-400">Employees, Candidates, Hiring Managers, HR Staff, Vendors/Contractors</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">Frontend Layer</h4>
                  <p className="text-slate-400">Refine.dev React App, Candidate Portal, Employee Portal, Admin Dashboard</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">Core HR Modules</h4>
                  <p className="text-slate-400">ATS, VMS, HRIS, PM, Staffing - integrated workforce management</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">AI Agentic Layer</h4>
                  <p className="text-slate-400">Recruitment, Workforce Planning, Compliance, Employee Experience, L&D Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roadmap" className="flex-1 m-0 overflow-auto p-6 bg-slate-950">
          <Card className="bg-slate-900/70 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Implementation Roadmap</CardTitle>
              <CardDescription>
                Phase-based deployment flow with testing checkpoints and validation gates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img 
                src="/attached_assets/implementation_roadmap_1764121574165.png" 
                alt="Implementation Roadmap Diagram"
                className="w-full rounded-lg border border-slate-700/50"
              />
              <div className="mt-4 space-y-3">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-emerald-400 mb-2">Key Deployment Insights</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Phase-gated deployments with validation checkpoints</li>
                    <li>• Integration testing between modules before promotion</li>
                    <li>• Rollback procedures at each gate</li>
                    <li>• Canary deployments for high-risk changes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
