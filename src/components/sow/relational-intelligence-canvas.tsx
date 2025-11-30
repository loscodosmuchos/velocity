import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  FileText,
  CreditCard,
  Users,
  FolderKanban,
  Building2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Eye,
  EyeOff,
  Network,
  DollarSign,
  Calendar,
  Activity,
  TrendingUp,
  Hash,
} from 'lucide-react';
import type { StatementOfWork, PurchaseOrder, Contractor } from '@/types';

interface Project {
  id: number;
  name: string;
  sowId?: number;
  status?: string;
}

interface Agency {
  id: number;
  name: string;
  contractorIds?: number[];
}

interface RelationalIntelligenceCanvasProps {
  sows: StatementOfWork[];
  purchaseOrders: PurchaseOrder[];
  contractors: Contractor[];
  projects?: Project[];
  agencies?: Agency[];
  onNodeClick?: (nodeType: string, nodeId: number) => void;
  className?: string;
}

type NodeType = 'sow' | 'po' | 'contractor' | 'project' | 'agency';

interface NodeConfig {
  type: NodeType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
}

const NODE_CONFIGS: Record<NodeType, NodeConfig> = {
  sow: {
    type: 'sow',
    label: 'Statement of Work',
    icon: FileText,
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
    borderColor: 'border-emerald-500/50',
    glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    textColor: 'text-emerald-400',
  },
  po: {
    type: 'po',
    label: 'Purchase Order',
    icon: CreditCard,
    color: 'blue',
    bgGradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    textColor: 'text-blue-400',
  },
  contractor: {
    type: 'contractor',
    label: 'Contractor',
    icon: Users,
    color: 'purple',
    bgGradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    textColor: 'text-purple-400',
  },
  project: {
    type: 'project',
    label: 'Project',
    icon: FolderKanban,
    color: 'cyan',
    bgGradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    textColor: 'text-cyan-400',
  },
  agency: {
    type: 'agency',
    label: 'Staffing Agency',
    icon: Building2,
    color: 'amber',
    bgGradient: 'from-amber-500/20 via-amber-600/10 to-transparent',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    textColor: 'text-amber-400',
  },
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

interface CustomNodeData {
  nodeType: NodeType;
  label: string;
  subtitle?: string;
  value?: number;
  status?: string;
  metrics?: Array<{ label: string; value: string }>;
  originalData?: any;
  [key: string]: unknown;
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const config = NODE_CONFIGS[data.nodeType];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'relative px-4 py-3 rounded-xl min-w-[180px] max-w-[220px]',
              'bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-900',
              'border-2 backdrop-blur-sm transition-all duration-300',
              'cursor-pointer hover:scale-105',
              config.borderColor,
              config.glowColor
            )}
          >
            <Handle
              type="target"
              position={Position.Top}
              className="!bg-slate-600 !border-slate-500 !w-3 !h-3"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              className="!bg-slate-600 !border-slate-500 !w-3 !h-3"
            />

            <div className={cn(
              'absolute top-0 left-0 right-0 h-[2px] rounded-t-xl',
              `bg-gradient-to-r from-${config.color}-400 to-${config.color}-600`
            )} />

            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                `bg-gradient-to-br ${config.bgGradient}`,
                'border border-slate-700/50'
              )}>
                <Icon className={cn('h-4 w-4', config.textColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-semibold uppercase tracking-wide mb-0.5', config.textColor)}>
                  {config.label}
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {data.label}
                </p>
                {data.subtitle && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {data.subtitle}
                  </p>
                )}
              </div>
            </div>

            {(data.value !== undefined || data.status) && (
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                {data.value !== undefined && (
                  <span className="text-xs font-mono text-slate-300">
                    {formatCurrency(data.value)}
                  </span>
                )}
                {data.status && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] py-0 h-5',
                      data.status === 'Active' && 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
                      data.status === 'Pending' && 'border-amber-500/50 text-amber-400 bg-amber-500/10',
                      data.status === 'Completed' && 'border-blue-500/50 text-blue-400 bg-blue-500/10',
                      data.status === 'Draft' && 'border-slate-500/50 text-slate-400 bg-slate-500/10',
                      data.status === 'Inactive' && 'border-red-500/50 text-red-400 bg-red-500/10'
                    )}
                  >
                    {data.status}
                  </Badge>
                )}
              </div>
            )}

            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={cn(
                'absolute inset-0 rounded-xl animate-pulse',
                `bg-${config.color}-500/5`
              )} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-800 border-slate-700 max-w-xs p-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', config.textColor)} />
              <span className="font-semibold text-white">{data.label}</span>
            </div>
            {data.metrics && data.metrics.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-700">
                {data.metrics.map((metric, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-400">{metric.label}:</span>
                    <span className="text-white font-medium">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-700">
              Click to view details
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: NodeType | null;
  data: any;
}

function DetailDrawer({ isOpen, onClose, nodeType, data }: DetailDrawerProps) {
  if (!nodeType || !data) return null;

  const config = NODE_CONFIGS[nodeType];
  const Icon = config.icon;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-slate-900 border-slate-700 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              `bg-gradient-to-br ${config.bgGradient}`,
              'border border-slate-700/50'
            )}>
              <Icon className={cn('h-5 w-5', config.textColor)} />
            </div>
            <div>
              <span className={cn('text-xs uppercase tracking-wide block', config.textColor)}>
                {config.label}
              </span>
              <span className="text-white">{data.label || data.name || data.sowNumber || data.poNumber}</span>
            </div>
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            View and manage {config.label.toLowerCase()} details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {nodeType === 'sow' && data.originalData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">SOW Number</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{data.originalData.sowNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-slate-400">Total Value</span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">{formatCurrency(data.originalData.totalValue)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-slate-400">Status</span>
                  </div>
                  <Badge variant="outline" className="mt-1">{data.originalData.status}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-cyan-500" />
                    <span className="text-xs text-slate-400">Remaining</span>
                  </div>
                  <p className="text-sm font-semibold text-cyan-400">{formatCurrency(data.originalData.remainingValue)}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-400">Timeline</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{new Date(data.originalData.startDate).toLocaleDateString()}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-slate-300">{new Date(data.originalData.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </>
          )}

          {nodeType === 'po' && data.originalData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">PO Number</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{data.originalData.poNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-slate-400">Total Amount</span>
                  </div>
                  <p className="text-sm font-semibold text-blue-400">{formatCurrency(data.originalData.totalAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-slate-400">Spent</span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">{formatCurrency(data.originalData.amountSpent)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-slate-400">Remaining</span>
                  </div>
                  <p className="text-sm font-semibold text-amber-400">{formatCurrency(data.originalData.amountRemaining)}</p>
                </div>
              </div>
            </>
          )}

          {nodeType === 'contractor' && data.originalData && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">Name</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {data.originalData.firstName} {data.originalData.lastName}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-slate-400">Status</span>
                  </div>
                  <Badge variant="outline" className="mt-1">{data.originalData.status}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-slate-400">Pay Rate</span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-400">${data.originalData.payRate}/hr</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-3 w-3 text-cyan-500" />
                    <span className="text-xs text-slate-400">Location</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{data.originalData.location}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function RelationalIntelligenceCanvas({
  sows,
  purchaseOrders,
  contractors,
  projects = [],
  agencies = [],
  onNodeClick,
  className,
}: RelationalIntelligenceCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [visibleTypes, setVisibleTypes] = useState<Set<NodeType>>(
    new Set(['sow', 'po', 'contractor', 'project', 'agency'])
  );
  const [selectedNode, setSelectedNode] = useState<{ type: NodeType; data: any } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleNodeType = (type: NodeType) => {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const buildGraph = useCallback(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const sowCount = sows.length;
    const sowSpacing = 300;
    const sowStartX = 400;

    sows.forEach((sow, index) => {
      if (!visibleTypes.has('sow')) return;

      const nodeId = `sow-${sow.id}`;
      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: sowStartX + index * sowSpacing, y: 100 },
        data: {
          nodeType: 'sow',
          label: sow.sowNumber,
          subtitle: sow.type,
          value: sow.totalValue,
          status: sow.status,
          metrics: [
            { label: 'Total Value', value: formatCurrency(sow.totalValue) },
            { label: 'Invoiced', value: formatCurrency(sow.invoicedAmount) },
            { label: 'Remaining', value: formatCurrency(sow.remainingValue) },
            { label: 'Type', value: sow.type },
          ],
          originalData: sow,
        } as CustomNodeData,
      });

      if (sow.purchaseOrderId && visibleTypes.has('po')) {
        newEdges.push({
          id: `sow-${sow.id}-po-${sow.purchaseOrderId}`,
          source: nodeId,
          target: `po-${sow.purchaseOrderId}`,
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
      }

      if (sow.contractorId && visibleTypes.has('contractor')) {
        newEdges.push({
          id: `sow-${sow.id}-contractor-${sow.contractorId}`,
          source: nodeId,
          target: `contractor-${sow.contractorId}`,
          animated: true,
          style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
        });
      }
    });

    purchaseOrders.forEach((po, index) => {
      if (!visibleTypes.has('po')) return;

      const nodeId = `po-${po.id}`;
      const connectedSOWs = sows.filter(s => s.purchaseOrderId === po.id);
      const avgX = connectedSOWs.length > 0
        ? connectedSOWs.reduce((sum, s) => {
            const sowIndex = sows.indexOf(s);
            return sum + (sowStartX + sowIndex * sowSpacing);
          }, 0) / connectedSOWs.length
        : sowStartX + index * sowSpacing;

      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: avgX, y: 300 },
        data: {
          nodeType: 'po',
          label: po.poNumber,
          subtitle: po.department,
          value: po.totalAmount,
          status: po.status,
          metrics: [
            { label: 'Total Amount', value: formatCurrency(po.totalAmount) },
            { label: 'Spent', value: formatCurrency(po.amountSpent) },
            { label: 'Remaining', value: formatCurrency(po.amountRemaining) },
            { label: 'Utilization', value: `${(po.percentUsed ?? 0).toFixed(0)}%` },
          ],
          originalData: po,
        } as CustomNodeData,
      });

      if (po.contractorId && visibleTypes.has('contractor')) {
        newEdges.push({
          id: `po-${po.id}-contractor-${po.contractorId}`,
          source: nodeId,
          target: `contractor-${po.contractorId}`,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        });
      }
    });

    contractors.forEach((contractor, index) => {
      if (!visibleTypes.has('contractor')) return;

      const nodeId = `contractor-${contractor.id}`;
      const connectedPOs = purchaseOrders.filter(po => po.contractorId === contractor.id);
      const connectedSOWs = sows.filter(s => s.contractorId === contractor.id);

      let xPos = sowStartX + index * 250;
      if (connectedPOs.length > 0 || connectedSOWs.length > 0) {
        const allConnected = [
          ...connectedPOs.map(po => {
            const poIndex = purchaseOrders.indexOf(po);
            const connectedSOWsForPO = sows.filter(s => s.purchaseOrderId === po.id);
            return connectedSOWsForPO.length > 0
              ? connectedSOWsForPO.reduce((sum, s) => sum + (sowStartX + sows.indexOf(s) * sowSpacing), 0) / connectedSOWsForPO.length
              : sowStartX + poIndex * sowSpacing;
          }),
          ...connectedSOWs.map(s => sowStartX + sows.indexOf(s) * sowSpacing),
        ];
        xPos = allConnected.reduce((a, b) => a + b, 0) / allConnected.length;
      }

      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: xPos, y: 500 },
        data: {
          nodeType: 'contractor',
          label: `${contractor.firstName} ${contractor.lastName}`,
          subtitle: contractor.jobDescription,
          status: contractor.status,
          metrics: [
            { label: 'Pay Rate', value: `$${contractor.payRate}/hr` },
            { label: 'Location', value: contractor.location },
            { label: 'Status', value: contractor.status },
            { label: 'PO Funds', value: formatCurrency(contractor.poFundsRemaining) },
          ],
          originalData: contractor,
        } as CustomNodeData,
      });
    });

    projects.forEach((project, index) => {
      if (!visibleTypes.has('project')) return;

      const nodeId = `project-${project.id}`;
      const connectedSOW = sows.find(s => s.id === project.sowId);
      const xPos = connectedSOW
        ? sowStartX + sows.indexOf(connectedSOW) * sowSpacing
        : sowStartX + index * 280;

      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: xPos + 50, y: 0 },
        data: {
          nodeType: 'project',
          label: project.name,
          status: project.status,
          metrics: [
            { label: 'Project ID', value: `#${project.id}` },
            { label: 'Status', value: project.status || 'Active' },
          ],
          originalData: project,
        } as CustomNodeData,
      });

      if (project.sowId && visibleTypes.has('sow')) {
        newEdges.push({
          id: `project-${project.id}-sow-${project.sowId}`,
          source: nodeId,
          target: `sow-${project.sowId}`,
          animated: true,
          style: { stroke: '#06b6d4', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
        });
      }
    });

    agencies.forEach((agency, index) => {
      if (!visibleTypes.has('agency')) return;

      const nodeId = `agency-${agency.id}`;
      const connectedContractors = contractors.filter(c =>
        agency.contractorIds?.includes(c.id)
      );

      let xPos = sowStartX + index * 300;
      if (connectedContractors.length > 0) {
        const contractorPositions = connectedContractors.map(c => {
          const cIndex = contractors.indexOf(c);
          return sowStartX + cIndex * 250;
        });
        xPos = contractorPositions.reduce((a, b) => a + b, 0) / contractorPositions.length;
      }

      newNodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: xPos, y: 700 },
        data: {
          nodeType: 'agency',
          label: agency.name,
          subtitle: `${connectedContractors.length} contractors`,
          metrics: [
            { label: 'Agency ID', value: `#${agency.id}` },
            { label: 'Contractors', value: String(connectedContractors.length) },
          ],
          originalData: agency,
        } as CustomNodeData,
      });

      connectedContractors.forEach((contractor) => {
        if (visibleTypes.has('contractor')) {
          newEdges.push({
            id: `agency-${agency.id}-contractor-${contractor.id}`,
            source: nodeId,
            target: `contractor-${contractor.id}`,
            animated: true,
            style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '8,4' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [sows, purchaseOrders, contractors, projects, agencies, visibleTypes, setNodes, setEdges]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const [type, idStr] = node.id.split('-');
      const id = parseInt(idStr, 10);
      const nodeType = type as NodeType;

      setSelectedNode({
        type: nodeType,
        data: node.data,
      });
      setIsDrawerOpen(true);

      onNodeClick?.(nodeType, id);
    },
    [onNodeClick]
  );

  const stats = useMemo(() => ({
    sows: sows.length,
    pos: purchaseOrders.length,
    contractors: contractors.length,
    projects: projects.length,
    agencies: agencies.length,
    totalValue: sows.reduce((sum, s) => sum + s.totalValue, 0),
  }), [sows, purchaseOrders, contractors, projects, agencies]);

  return (
    <Card className={cn(
      'border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900/98 to-slate-800/95 overflow-hidden',
      className
    )}>
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20">
              <Network className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Relational Intelligence Canvas
              </h2>
              <p className="text-xs text-slate-500">
                {stats.sows} SOWs • {stats.pos} POs • {stats.contractors} Contractors • {formatCurrency(stats.totalValue)} Total Portfolio
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-2">
            <Filter className="h-3 w-3 inline mr-1" />
            Filter:
          </span>
          {(Object.keys(NODE_CONFIGS) as NodeType[]).map((type) => {
            const config = NODE_CONFIGS[type];
            const Icon = config.icon;
            const isVisible = visibleTypes.has(type);

            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => toggleNodeType(type)}
                className={cn(
                  'h-7 px-2.5 text-xs gap-1.5 transition-all',
                  isVisible
                    ? cn(
                        'border-2',
                        config.borderColor,
                        config.textColor,
                        'bg-slate-800/50'
                      )
                    : 'border-slate-700 text-slate-500 bg-slate-900/50 opacity-60'
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
                {isVisible ? (
                  <Eye className="h-3 w-3 ml-1" />
                ) : (
                  <EyeOff className="h-3 w-3 ml-1" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="h-[600px] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-slate-900"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#334155"
          />
          <Controls
            className="bg-slate-800 border-slate-700 rounded-lg overflow-hidden [&>button]:bg-slate-800 [&>button]:border-slate-700 [&>button]:text-slate-400 [&>button:hover]:bg-slate-700"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as CustomNodeData;
              switch (data.nodeType) {
                case 'sow': return '#10b981';
                case 'po': return '#3b82f6';
                case 'contractor': return '#a855f7';
                case 'project': return '#06b6d4';
                case 'agency': return '#f59e0b';
                default: return '#64748b';
              }
            }}
            maskColor="rgba(15, 23, 42, 0.8)"
            className="!bg-slate-800/80 border border-slate-700 rounded-lg"
            pannable
            zoomable
          />
        </ReactFlow>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {(Object.keys(NODE_CONFIGS) as NodeType[]).map((type) => {
            const config = NODE_CONFIGS[type];
            const Icon = config.icon;
            const count = type === 'sow' ? stats.sows
              : type === 'po' ? stats.pos
              : type === 'contractor' ? stats.contractors
              : type === 'project' ? stats.projects
              : stats.agencies;

            if (!visibleTypes.has(type)) return null;

            return (
              <div
                key={type}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
                  'bg-slate-800/90 border backdrop-blur-sm',
                  config.borderColor
                )}
              >
                <Icon className={cn('h-3 w-3', config.textColor)} />
                <span className="text-slate-300">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        nodeType={selectedNode?.type ?? null}
        data={selectedNode?.data}
      />
    </Card>
  );
}

export default RelationalIntelligenceCanvas;
