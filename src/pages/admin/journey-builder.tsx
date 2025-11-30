import { useState, useCallback, useMemo, ReactNode } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface JourneyNodeData {
  label: string;
  icon?: ReactNode;
  status?: "healthy" | "warning" | "critical";
  emotion?: "happy" | "neutral" | "frustrated";
  metric?: string;
  value?: string | number;
  sublabel?: string;
  trend?: number;
  lastRun?: string;
  trigger?: string;
}

interface CustomNodeProps {
  data: JourneyNodeData;
}
import {
  Workflow,
  Users,
  ShoppingCart,
  Briefcase,
  Target,
  GitBranch,
  Gauge,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  UserCheck,
  Package,
  ArrowRight,
  Sparkles,
  Activity,
  BarChart3,
  Heart,
  Star,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  Plus,
  GripVertical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const journeyBuilderStyles = `
  @keyframes flowParticle {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2); }
    50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.3); }
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.05); }
    50% { transform: scale(1); }
    75% { transform: scale(1.03); }
  }

  @keyframes energyFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
  }

  @keyframes borderGlow {
    0%, 100% { border-color: rgba(34, 211, 238, 0.5); }
    50% { border-color: rgba(34, 211, 238, 1); }
  }

  @keyframes floatParticle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-20px) translateX(10px); opacity: 0; }
  }

  .journey-canvas {
    background: 
      repeating-linear-gradient(45deg, rgba(71, 85, 105, 0.03) 0px, rgba(71, 85, 105, 0.03) 1px, transparent 1px, transparent 8px),
      repeating-linear-gradient(-45deg, rgba(51, 65, 85, 0.04) 0px, rgba(51, 65, 85, 0.04) 1px, transparent 1px, transparent 8px),
      linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  }

  .journey-node {
    position: relative;
    border-radius: 16px;
    padding: 16px 20px;
    min-width: 180px;
    backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .journey-node:hover {
    transform: scale(1.05) translateY(-2px);
  }

  .journey-node::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(168, 85, 247, 0.5), rgba(34, 211, 238, 0.5));
    background-size: 200% 200%;
    animation: energyFlow 3s ease infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .stage-node {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%);
    border: 1px solid rgba(100, 116, 139, 0.3);
  }

  .stage-node.healthy::before {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(34, 211, 238, 0.6));
  }

  .stage-node.warning::before {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(251, 191, 36, 0.6));
  }

  .stage-node.critical::before {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(248, 113, 113, 0.6));
  }

  .decision-node {
    background: linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(126, 34, 206, 0.8) 100%);
    border: 1px solid rgba(168, 85, 247, 0.4);
    transform: rotate(45deg);
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .decision-node::before {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(192, 132, 252, 0.6));
  }

  .decision-node-content {
    transform: rotate(-45deg);
  }

  .metric-node {
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%);
    border: 1px solid rgba(59, 130, 246, 0.4);
  }

  .metric-node::before {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(96, 165, 250, 0.6));
  }

  .action-node {
    background: linear-gradient(135deg, rgba(21, 128, 61, 0.9) 0%, rgba(34, 197, 94, 0.8) 100%);
    border: 1px solid rgba(74, 222, 128, 0.4);
  }

  .action-node::before {
    background: linear-gradient(135deg, rgba(74, 222, 128, 0.6), rgba(134, 239, 172, 0.6));
  }

  .node-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: statusPulse 2s ease-in-out infinite;
  }

  .status-healthy { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
  .status-warning { background: #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
  .status-critical { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }

  .emotion-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 2px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .metric-gauge {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: conic-gradient(
      from 180deg,
      #10b981 0%,
      #10b981 var(--gauge-percent, 75%),
      rgba(100, 116, 139, 0.3) var(--gauge-percent, 75%)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .metric-gauge::after {
    content: '';
    position: absolute;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  .metric-value {
    position: relative;
    z-index: 1;
    font-size: 14px;
    font-weight: 700;
    color: #f1f5f9;
  }

  .react-flow__edge-path {
    stroke-dasharray: 8 4;
    animation: flowParticle 1s linear infinite;
  }

  .react-flow__edge.animated path {
    stroke-width: 3;
    filter: drop-shadow(0 0 4px currentColor);
  }

  .palette-item {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 12px;
    padding: 12px;
    cursor: grab;
    transition: all 0.2s ease;
  }

  .palette-item:hover {
    border-color: rgba(34, 211, 238, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.1);
  }

  .palette-item:active {
    cursor: grabbing;
  }

  .insight-card {
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%);
    border: 1px solid rgba(100, 116, 139, 0.2);
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  .insight-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22d3ee, #a855f7, #22d3ee);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .carbon-fiber-bg {
    background: 
      repeating-linear-gradient(45deg, rgba(71, 85, 105, 0.08) 0px, rgba(71, 85, 105, 0.08) 2px, transparent 2px, transparent 10px),
      repeating-linear-gradient(-45deg, rgba(51, 65, 85, 0.1) 0px, rgba(51, 65, 85, 0.1) 2px, transparent 2px, transparent 10px),
      linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  }

  .metallic-gradient {
    background: linear-gradient(135deg, #475569 0%, #64748b 25%, #94a3b8 50%, #64748b 75%, #475569 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .glow-text {
    text-shadow: 0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.3);
  }
`;

const getEmotionIcon = (emotion: string) => {
  switch (emotion) {
    case "happy": return <Smile className="w-4 h-4 text-green-400" />;
    case "neutral": return <Meh className="w-4 h-4 text-yellow-400" />;
    case "frustrated": return <Frown className="w-4 h-4 text-red-400" />;
    default: return <Heart className="w-4 h-4 text-pink-400" />;
  }
};

const StageNode = ({ data }: CustomNodeProps) => {
  const statusClass = data.status === "healthy" ? "healthy" : data.status === "warning" ? "warning" : "critical";
  const statusDotClass = data.status === "healthy" ? "status-healthy" : data.status === "warning" ? "status-warning" : "status-critical";

  return (
    <div className={`journey-node stage-node ${statusClass}`}>
      <Handle type="target" position={Position.Left} className="!bg-cyan-400 !border-cyan-600 !w-3 !h-3" />
      <div className="emotion-indicator">
        {getEmotionIcon(data.emotion || "neutral")}
      </div>
      <div className="flex items-center gap-3">
        <div className="node-icon">
          {data.icon || <FileText className="w-5 h-5 text-cyan-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100 truncate">{data.label}</span>
            <div className={`status-dot ${statusDotClass}`} />
          </div>
          {data.metric && (
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {data.metric}
            </div>
          )}
        </div>
      </div>
      {data.value && (
        <div className="mt-3 pt-3 border-t border-slate-600/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Flow Value</span>
            <span className="text-sm font-bold text-emerald-400">{data.value}</span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-cyan-400 !border-cyan-600 !w-3 !h-3" />
    </div>
  );
};

const DecisionNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="journey-node decision-node">
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-purple-600 !w-3 !h-3" style={{ transform: 'rotate(-45deg)', left: '0' }} />
      <div className="decision-node-content text-center">
        <GitBranch className="w-6 h-6 text-purple-300 mx-auto mb-1" />
        <span className="text-xs font-medium text-purple-100">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" className="!bg-green-400 !border-green-600 !w-3 !h-3" style={{ transform: 'rotate(-45deg)', left: '100%' }} />
      <Handle type="source" position={Position.Right} id="no" className="!bg-red-400 !border-red-600 !w-3 !h-3" style={{ transform: 'rotate(-45deg)', top: '100%' }} />
    </div>
  );
};

const MetricNode = ({ data }: CustomNodeProps) => {
  const gaugePercent = data.value || 75;
  
  return (
    <div className="journey-node metric-node">
      <Handle type="target" position={Position.Left} className="!bg-blue-400 !border-blue-600 !w-3 !h-3" />
      <div className="flex items-center gap-4">
        <div className="metric-gauge" style={{ '--gauge-percent': `${gaugePercent}%` } as React.CSSProperties}>
          <span className="metric-value">{gaugePercent}%</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-100 block">{data.label}</span>
          <span className="text-xs text-slate-400">{data.sublabel || "KPI Metric"}</span>
          {data.trend && (
            <div className={`text-xs mt-1 flex items-center gap-1 ${data.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              <TrendingUp className={`w-3 h-3 ${data.trend < 0 ? 'rotate-180' : ''}`} />
              {data.trend > 0 ? '+' : ''}{data.trend}%
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-blue-400 !border-blue-600 !w-3 !h-3" />
    </div>
  );
};

const ActionNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="journey-node action-node">
      <Handle type="target" position={Position.Left} className="!bg-green-400 !border-green-600 !w-3 !h-3" />
      <div className="flex items-center gap-3">
        <div className="node-icon">
          <Zap className="w-5 h-5 text-green-300" />
        </div>
        <div>
          <span className="text-sm font-semibold text-green-100 block">{data.label}</span>
          <span className="text-xs text-green-300/70">{data.trigger || "Automation"}</span>
        </div>
      </div>
      {data.lastRun && (
        <div className="mt-2 text-xs text-green-200/60 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last run: {data.lastRun}
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-green-400 !border-green-600 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  stage: StageNode,
  decision: DecisionNode,
  metric: MetricNode,
  action: ActionNode,
};

const projectJourneyNodes: Node[] = [
  { id: "p1", type: "stage", position: { x: 50, y: 150 }, data: { label: "Project Initiation", status: "healthy", emotion: "happy", icon: <Briefcase className="w-5 h-5 text-cyan-400" />, metric: "100% on track", value: "$250K" } },
  { id: "p2", type: "metric", position: { x: 280, y: 50 }, data: { label: "Budget Health", value: 87, sublabel: "Utilization", trend: 5 } },
  { id: "p3", type: "decision", position: { x: 320, y: 180 }, data: { label: "Scope OK?" } },
  { id: "p4", type: "stage", position: { x: 480, y: 120 }, data: { label: "Resource Allocation", status: "warning", emotion: "neutral", icon: <Users className="w-5 h-5 text-amber-400" />, metric: "85% staffed", value: "$180K" } },
  { id: "p5", type: "action", position: { x: 480, y: 280 }, data: { label: "Alert PM", trigger: "Scope Change", lastRun: "2 hrs ago" } },
  { id: "p6", type: "stage", position: { x: 720, y: 150 }, data: { label: "Execution Phase", status: "healthy", emotion: "happy", icon: <Activity className="w-5 h-5 text-emerald-400" />, metric: "On schedule", value: "$420K" } },
  { id: "p7", type: "metric", position: { x: 960, y: 80 }, data: { label: "Milestone Progress", value: 72, sublabel: "Completion", trend: 12 } },
  { id: "p8", type: "stage", position: { x: 960, y: 200 }, data: { label: "Delivery & Closeout", status: "healthy", emotion: "happy", icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, metric: "Final review", value: "$500K" } },
];

const projectJourneyEdges: Edge[] = [
  { id: "pe1", source: "p1", target: "p2", animated: true, style: { stroke: "#10b981", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "pe2", source: "p1", target: "p3", animated: true, style: { stroke: "#22d3ee", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" } },
  { id: "pe3", source: "p3", target: "p4", sourceHandle: "yes", animated: true, style: { stroke: "#10b981", strokeWidth: 3 }, label: "Yes", labelStyle: { fill: "#10b981", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "pe4", source: "p3", target: "p5", sourceHandle: "no", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, label: "No", labelStyle: { fill: "#ef4444", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" } },
  { id: "pe5", source: "p4", target: "p6", animated: true, style: { stroke: "#f59e0b", strokeWidth: 4 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "pe6", source: "p6", target: "p7", animated: true, style: { stroke: "#10b981", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "pe7", source: "p6", target: "p8", animated: true, style: { stroke: "#22d3ee", strokeWidth: 5 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" } },
];

const procurementJourneyNodes: Node[] = [
  { id: "pr1", type: "stage", position: { x: 50, y: 150 }, data: { label: "Requisition", status: "healthy", emotion: "happy", icon: <FileText className="w-5 h-5 text-cyan-400" />, metric: "12 pending", value: "$85K" } },
  { id: "pr2", type: "decision", position: { x: 280, y: 150 }, data: { label: "Budget?" } },
  { id: "pr3", type: "stage", position: { x: 480, y: 80 }, data: { label: "Vendor Selection", status: "healthy", emotion: "happy", icon: <Users className="w-5 h-5 text-blue-400" />, metric: "3 vendors", value: "$120K" } },
  { id: "pr4", type: "action", position: { x: 480, y: 250 }, data: { label: "Request Approval", trigger: "Over $50K", lastRun: "1 hr ago" } },
  { id: "pr5", type: "stage", position: { x: 720, y: 120 }, data: { label: "PO Creation", status: "warning", emotion: "neutral", icon: <ShoppingCart className="w-5 h-5 text-amber-400" />, metric: "Pending sign-off", value: "$175K" } },
  { id: "pr6", type: "metric", position: { x: 960, y: 50 }, data: { label: "Cycle Time", value: 92, sublabel: "Efficiency", trend: 8 } },
  { id: "pr7", type: "stage", position: { x: 960, y: 180 }, data: { label: "Goods Receipt", status: "healthy", emotion: "happy", icon: <Package className="w-5 h-5 text-emerald-400" />, metric: "On time", value: "$200K" } },
];

const procurementJourneyEdges: Edge[] = [
  { id: "pre1", source: "pr1", target: "pr2", animated: true, style: { stroke: "#22d3ee", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" } },
  { id: "pre2", source: "pr2", target: "pr3", sourceHandle: "yes", animated: true, style: { stroke: "#10b981", strokeWidth: 4 }, label: "Approved", labelStyle: { fill: "#10b981", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "pre3", source: "pr2", target: "pr4", sourceHandle: "no", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, label: "Escalate", labelStyle: { fill: "#f59e0b", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "pre4", source: "pr3", target: "pr5", animated: true, style: { stroke: "#3b82f6", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "pre5", source: "pr5", target: "pr6", animated: true, style: { stroke: "#f59e0b", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "pre6", source: "pr5", target: "pr7", animated: true, style: { stroke: "#10b981", strokeWidth: 5 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
];

const customerJourneyNodes: Node[] = [
  { id: "c1", type: "stage", position: { x: 50, y: 150 }, data: { label: "Lead Capture", status: "healthy", emotion: "happy", icon: <Target className="w-5 h-5 text-cyan-400" />, metric: "48 new leads", value: "High Value" } },
  { id: "c2", type: "metric", position: { x: 280, y: 50 }, data: { label: "Conversion Rate", value: 68, sublabel: "Lead → Opp", trend: 15 } },
  { id: "c3", type: "stage", position: { x: 280, y: 180 }, data: { label: "Qualification", status: "healthy", emotion: "happy", icon: <UserCheck className="w-5 h-5 text-blue-400" />, metric: "32 qualified", value: "$1.2M Pipeline" } },
  { id: "c4", type: "decision", position: { x: 500, y: 150 }, data: { label: "Enterprise?" } },
  { id: "c5", type: "stage", position: { x: 720, y: 80 }, data: { label: "Enterprise Track", status: "warning", emotion: "neutral", icon: <Briefcase className="w-5 h-5 text-amber-400" />, metric: "8 accounts", value: "$800K" } },
  { id: "c6", type: "stage", position: { x: 720, y: 220 }, data: { label: "SMB Track", status: "healthy", emotion: "happy", icon: <Users className="w-5 h-5 text-emerald-400" />, metric: "24 accounts", value: "$400K" } },
  { id: "c7", type: "action", position: { x: 960, y: 150 }, data: { label: "Win Notification", trigger: "Deal Closed", lastRun: "30 min ago" } },
];

const customerJourneyEdges: Edge[] = [
  { id: "ce1", source: "c1", target: "c2", animated: true, style: { stroke: "#22d3ee", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" } },
  { id: "ce2", source: "c1", target: "c3", animated: true, style: { stroke: "#10b981", strokeWidth: 4 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "ce3", source: "c3", target: "c4", animated: true, style: { stroke: "#3b82f6", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "ce4", source: "c4", target: "c5", sourceHandle: "yes", animated: true, style: { stroke: "#f59e0b", strokeWidth: 4 }, label: "Yes", labelStyle: { fill: "#f59e0b", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "ce5", source: "c4", target: "c6", sourceHandle: "no", animated: true, style: { stroke: "#10b981", strokeWidth: 3 }, label: "No", labelStyle: { fill: "#10b981", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "ce6", source: "c5", target: "c7", animated: true, style: { stroke: "#a855f7", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" } },
  { id: "ce7", source: "c6", target: "c7", animated: true, style: { stroke: "#10b981", strokeWidth: 5 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
];

const resourceJourneyNodes: Node[] = [
  { id: "r1", type: "stage", position: { x: 50, y: 150 }, data: { label: "Resource Request", status: "healthy", emotion: "happy", icon: <Users className="w-5 h-5 text-cyan-400" />, metric: "18 requests", value: "Critical" } },
  { id: "r2", type: "metric", position: { x: 280, y: 50 }, data: { label: "Fill Rate", value: 94, sublabel: "Positions", trend: 3 } },
  { id: "r3", type: "decision", position: { x: 280, y: 180 }, data: { label: "Internal?" } },
  { id: "r4", type: "stage", position: { x: 500, y: 80 }, data: { label: "Internal Mobility", status: "healthy", emotion: "happy", icon: <ArrowRight className="w-5 h-5 text-emerald-400" />, metric: "6 transfers", value: "Cost Saving" } },
  { id: "r5", type: "stage", position: { x: 500, y: 250 }, data: { label: "External Hiring", status: "warning", emotion: "neutral", icon: <UserCheck className="w-5 h-5 text-amber-400" />, metric: "12 in pipeline", value: "$45K/hire" } },
  { id: "r6", type: "stage", position: { x: 720, y: 150 }, data: { label: "Onboarding", status: "healthy", emotion: "happy", icon: <Sparkles className="w-5 h-5 text-purple-400" />, metric: "8 active", value: "30-day avg" } },
  { id: "r7", type: "action", position: { x: 960, y: 150 }, data: { label: "Welcome Package", trigger: "Start Date", lastRun: "Today" } },
];

const resourceJourneyEdges: Edge[] = [
  { id: "re1", source: "r1", target: "r2", animated: true, style: { stroke: "#22d3ee", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" } },
  { id: "re2", source: "r1", target: "r3", animated: true, style: { stroke: "#3b82f6", strokeWidth: 4 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "re3", source: "r3", target: "r4", sourceHandle: "yes", animated: true, style: { stroke: "#10b981", strokeWidth: 3 }, label: "Yes", labelStyle: { fill: "#10b981", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "re4", source: "r3", target: "r5", sourceHandle: "no", animated: true, style: { stroke: "#f59e0b", strokeWidth: 3 }, label: "No", labelStyle: { fill: "#f59e0b", fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "re5", source: "r4", target: "r6", animated: true, style: { stroke: "#10b981", strokeWidth: 5 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" } },
  { id: "re6", source: "r5", target: "r6", animated: true, style: { stroke: "#f59e0b", strokeWidth: 4 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" } },
  { id: "re7", source: "r6", target: "r7", animated: true, style: { stroke: "#a855f7", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" } },
];

const nodePalette = [
  { type: "stage", label: "Stage Node", icon: <FileText className="w-5 h-5" />, description: "Journey stage with emotion" },
  { type: "decision", label: "Decision Node", icon: <GitBranch className="w-5 h-5" />, description: "Branching logic point" },
  { type: "metric", label: "Metric Node", icon: <Gauge className="w-5 h-5" />, description: "KPI with gauge display" },
  { type: "action", label: "Action Node", icon: <Zap className="w-5 h-5" />, description: "Trigger automation" },
];

const journeyInsights = [
  { id: 1, title: "Critical Path Detected", value: "3 bottlenecks", status: "warning", icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 2, title: "Flow Velocity", value: "12.4 days avg", status: "healthy", icon: <Activity className="w-4 h-4" /> },
  { id: 3, title: "Value Throughput", value: "$2.4M/month", status: "healthy", icon: <DollarSign className="w-4 h-4" /> },
  { id: 4, title: "Completion Rate", value: "94.2%", status: "healthy", icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function JourneyBuilderPage() {
  const [activeTab, setActiveTab] = useState("project");
  
  const getJourneyData = (tab: string) => {
    switch (tab) {
      case "project": return { nodes: projectJourneyNodes, edges: projectJourneyEdges };
      case "procurement": return { nodes: procurementJourneyNodes, edges: procurementJourneyEdges };
      case "customer": return { nodes: customerJourneyNodes, edges: customerJourneyEdges };
      case "resource": return { nodes: resourceJourneyNodes, edges: resourceJourneyEdges };
      default: return { nodes: projectJourneyNodes, edges: projectJourneyEdges };
    }
  };

  const { nodes: initialNodes, edges: initialEdges } = getJourneyData(activeTab);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: "#22d3ee", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" }
    }, eds));
  }, [setEdges]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const { nodes: newNodes, edges: newEdges } = getJourneyData(value);
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <>
      <style>{journeyBuilderStyles}</style>
      <div className="h-screen flex flex-col carbon-fiber-bg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                <Workflow className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 glow-text flex items-center gap-3">
                  Universal Journey Engine
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                </h1>
                <p className="text-sm text-slate-400">Visualize, optimize, and automate any workflow with intelligent flow mapping</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-slate-300">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-3 border-b border-slate-700/30 bg-slate-900/50">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
              <TabsTrigger value="project" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-cyan-500/30 text-slate-400 border border-transparent">
                <Briefcase className="w-4 h-4 mr-2" />
                Project Journey
              </TabsTrigger>
              <TabsTrigger value="procurement" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 data-[state=active]:border-amber-500/30 text-slate-400 border border-transparent">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Procurement
              </TabsTrigger>
              <TabsTrigger value="customer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-slate-400 border border-transparent">
                <Target className="w-4 h-4 mr-2" />
                Customer Journey
              </TabsTrigger>
              <TabsTrigger value="resource" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-500/30 text-slate-400 border border-transparent">
                <Users className="w-4 h-4 mr-2" />
                Resource Allocation
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 flex min-h-0">
            <div className="w-64 border-r border-slate-700/30 bg-slate-900/30 p-4 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-slate-500" />
                Node Palette
              </h3>
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {nodePalette.map((item) => (
                    <div
                      key={item.type}
                      className="palette-item"
                      draggable
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-700/50 text-cyan-400">
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-200 block">{item.label}</span>
                          <span className="text-xs text-slate-500">{item.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t border-slate-700/30">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all">
                  <Plus className="w-4 h-4" />
                  Add Custom Node
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <TabsContent value={activeTab} className="flex-1 m-0 min-h-0">
                <div className="h-full journey-canvas">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    className="h-full"
                  >
                    <Background
                      variant={BackgroundVariant.Dots}
                      gap={20}
                      size={1}
                      color="rgba(100, 116, 139, 0.3)"
                    />
                    <Controls className="!bg-slate-800/80 !border-slate-700/50 !rounded-lg [&>button]:!bg-slate-700/50 [&>button]:!border-slate-600/50 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-600/50" />
                  </ReactFlow>
                </div>
              </TabsContent>

              <div className="border-t border-slate-700/30 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    Journey Intelligence
                  </h3>
                  <span className="text-xs text-slate-500">Real-time analytics</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {journeyInsights.map((insight) => (
                    <div key={insight.id} className="insight-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg ${insight.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {insight.icon}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${insight.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{insight.title}</p>
                      <p className="text-lg font-bold text-slate-100">{insight.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
