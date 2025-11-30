/**
 * CUSTOM ALERT CUBE BUILDER
 * Users create up to 10 predictive indicator cubes
 * 
 * Philosophy: Proactive action > Reactive firefighting
 * Each cube combines multiple data factors to surface trends BEFORE they become problems
 * 
 * NOT workflows - these are early warning indicators
 * The goal: See something, do something BEFORE unpredictability cascades
 */

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Box, Plus, Trash2, Edit3, Save, Copy, Eye, EyeOff,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
  Bell, BellOff, Zap, Target, Activity, BarChart3, PieChart,
  DollarSign, Users, Clock, FileText, Calendar, Shield,
  ArrowUp, ArrowDown, ArrowRight, Sparkles, Settings, Palette,
  Download, Upload, Share2, RefreshCw, Play, Pause, Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DataFactor {
  id: string;
  name: string;
  source: string;
  category: 'finance' | 'contractors' | 'compliance' | 'operations' | 'time' | 'quality';
  aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'percent';
  icon: React.ElementType;
}

interface TrendTrigger {
  direction: 'up' | 'down' | 'flat' | 'any';
  threshold: number;
  timeWindow: '1h' | '24h' | '7d' | '30d';
  action: 'alert' | 'notify' | 'escalate' | 'log';
}

interface AlertCube {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  factors: string[];
  formula: string;
  trigger: TrendTrigger;
  isActive: boolean;
  currentValue?: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'flat';
  lastUpdated?: string;
  createdAt: string;
  position: number;
}

const AVAILABLE_FACTORS: DataFactor[] = [
  { id: 'active_contractors', name: 'Active Contractors', source: 'contractors', category: 'contractors', aggregation: 'count', icon: Users },
  { id: 'expiring_contracts_30d', name: 'Contracts Expiring (30d)', source: 'contracts', category: 'compliance', aggregation: 'count', icon: Calendar },
  { id: 'pending_timecards', name: 'Pending Timecards', source: 'timecards', category: 'operations', aggregation: 'count', icon: Clock },
  { id: 'overdue_approvals', name: 'Overdue Approvals', source: 'approvals', category: 'operations', aggregation: 'count', icon: AlertTriangle },
  { id: 'budget_utilization', name: 'Budget Utilization %', source: 'purchase_orders', category: 'finance', aggregation: 'percent', icon: DollarSign },
  { id: 'avg_approval_time', name: 'Avg Approval Time (hrs)', source: 'approvals', category: 'time', aggregation: 'avg', icon: Clock },
  { id: 'compliance_score', name: 'Compliance Score', source: 'compliance', category: 'compliance', aggregation: 'avg', icon: Shield },
  { id: 'open_change_orders', name: 'Open Change Orders', source: 'change_orders', category: 'operations', aggregation: 'count', icon: FileText },
  { id: 'invoice_aging_45d', name: 'Invoices >45 Days', source: 'invoices', category: 'finance', aggregation: 'count', icon: DollarSign },
  { id: 'contractor_satisfaction', name: 'Contractor Satisfaction', source: 'surveys', category: 'quality', aggregation: 'avg', icon: Users },
  { id: 'sow_burn_rate', name: 'SOW Burn Rate %', source: 'sows', category: 'finance', aggregation: 'percent', icon: TrendingUp },
  { id: 'documents_pending_review', name: 'Documents Pending Review', source: 'documents', category: 'operations', aggregation: 'count', icon: FileText },
  { id: 'at_risk_projects', name: 'At-Risk Projects', source: 'projects', category: 'operations', aggregation: 'count', icon: AlertTriangle },
  { id: 'new_contractors_mtd', name: 'New Contractors MTD', source: 'contractors', category: 'contractors', aggregation: 'count', icon: Users },
  { id: 'expense_variance', name: 'Expense Variance %', source: 'expenses', category: 'finance', aggregation: 'percent', icon: TrendingDown },
];

const CUBE_COLORS = [
  { name: 'Emerald', value: 'emerald', class: 'from-emerald-500 to-emerald-700' },
  { name: 'Blue', value: 'blue', class: 'from-blue-500 to-blue-700' },
  { name: 'Purple', value: 'purple', class: 'from-purple-500 to-purple-700' },
  { name: 'Amber', value: 'amber', class: 'from-amber-500 to-amber-700' },
  { name: 'Red', value: 'red', class: 'from-red-500 to-red-700' },
  { name: 'Cyan', value: 'cyan', class: 'from-cyan-500 to-cyan-700' },
  { name: 'Rose', value: 'rose', class: 'from-rose-500 to-rose-700' },
  { name: 'Indigo', value: 'indigo', class: 'from-indigo-500 to-indigo-700' },
];

const CUBE_ICONS = [
  { name: 'Target', value: 'target', icon: Target },
  { name: 'Activity', value: 'activity', icon: Activity },
  { name: 'Trending Up', value: 'trending-up', icon: TrendingUp },
  { name: 'Dollar', value: 'dollar', icon: DollarSign },
  { name: 'Users', value: 'users', icon: Users },
  { name: 'Shield', value: 'shield', icon: Shield },
  { name: 'Clock', value: 'clock', icon: Clock },
  { name: 'Zap', value: 'zap', icon: Zap },
];

const MAX_CUBES = 10;

function generateSampleCubes(): AlertCube[] {
  return [
    {
      id: 'cube-1',
      name: 'Compliance Risk Score',
      description: 'Expiring contracts + low compliance score = action needed',
      icon: 'shield',
      color: 'red',
      factors: ['expiring_contracts_30d', 'compliance_score'],
      formula: '(expiring_contracts_30d * 10) + (100 - compliance_score)',
      trigger: { direction: 'up', threshold: 50, timeWindow: '24h', action: 'alert' },
      isActive: true,
      currentValue: 42,
      previousValue: 38,
      trend: 'up',
      lastUpdated: new Date().toISOString(),
      createdAt: '2024-01-15T00:00:00Z',
      position: 0,
    },
    {
      id: 'cube-2',
      name: 'Approval Bottleneck',
      description: 'Pending timecards + overdue approvals + avg time',
      icon: 'clock',
      color: 'amber',
      factors: ['pending_timecards', 'overdue_approvals', 'avg_approval_time'],
      formula: 'pending_timecards + (overdue_approvals * 2) + avg_approval_time',
      trigger: { direction: 'up', threshold: 25, timeWindow: '24h', action: 'notify' },
      isActive: true,
      currentValue: 18,
      previousValue: 22,
      trend: 'down',
      lastUpdated: new Date().toISOString(),
      createdAt: '2024-02-10T00:00:00Z',
      position: 1,
    },
    {
      id: 'cube-3',
      name: 'Budget Pressure Index',
      description: 'High utilization + burn rate + expense variance',
      icon: 'dollar',
      color: 'emerald',
      factors: ['budget_utilization', 'sow_burn_rate', 'expense_variance'],
      formula: '(budget_utilization + sow_burn_rate + expense_variance) / 3',
      trigger: { direction: 'up', threshold: 85, timeWindow: '7d', action: 'escalate' },
      isActive: true,
      currentValue: 72,
      previousValue: 71,
      trend: 'flat',
      lastUpdated: new Date().toISOString(),
      createdAt: '2024-03-01T00:00:00Z',
      position: 2,
    },
  ];
}

function CubeCard({ 
  cube, 
  onEdit, 
  onDelete, 
  onToggle,
  onDuplicate 
}: { 
  cube: AlertCube;
  onEdit: (cube: AlertCube) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onDuplicate: (cube: AlertCube) => void;
}) {
  const colorClass = CUBE_COLORS.find(c => c.value === cube.color)?.class || 'from-slate-500 to-slate-700';
  const IconComponent = CUBE_ICONS.find(i => i.value === cube.icon)?.icon || Target;
  
  const trendIcon = cube.trend === 'up' ? ArrowUp : cube.trend === 'down' ? ArrowDown : ArrowRight;
  const TrendIconComponent = trendIcon;
  const trendColor = cube.trend === 'up' 
    ? (cube.trigger.direction === 'up' ? 'text-red-400' : 'text-emerald-400')
    : cube.trend === 'down' 
      ? (cube.trigger.direction === 'down' ? 'text-red-400' : 'text-emerald-400')
      : 'text-slate-400';
  
  const isTriggered = cube.currentValue !== undefined && cube.currentValue >= cube.trigger.threshold;
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
      cube.isActive ? "bg-slate-800/90" : "bg-slate-900/50 opacity-60",
      isTriggered && cube.isActive && "ring-2 ring-red-500/50"
    )}>
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        colorClass
      )} />
      
      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br flex-shrink-0",
              colorClass
            )}>
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xs font-medium text-slate-200 flex items-center gap-1 line-clamp-1">
                {cube.name}
                {isTriggered && cube.isActive && (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] animate-pulse flex-shrink-0">
                    TRIGGERED
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400 line-clamp-1">
                {cube.description}
              </CardDescription>
            </div>
          </div>
          
          <Switch
            checked={cube.isActive}
            onCheckedChange={() => onToggle(cube.id)}
            className="scale-75 flex-shrink-0"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-1.5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-slate-100">
              {cube.currentValue !== undefined ? cube.currentValue.toFixed(0) : '--'}
            </div>
            <div className={cn("flex items-center gap-0.5 text-[11px]", trendColor)}>
              {React.createElement(trendIcon, { className: "h-3 w-3" })}
              <span>
                {cube.previousValue !== undefined 
                  ? `${((cube.currentValue || 0) - cube.previousValue).toFixed(0)}` 
                  : '--'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Progress 
              value={Math.min((cube.currentValue || 0) / cube.trigger.threshold * 100, 100)} 
              className="h-1"
            />
            <span className="text-[10px] text-slate-500 whitespace-nowrap">
              / {cube.trigger.threshold}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-0.5">
            {cube.factors.slice(0, 2).map(factorId => {
              const factor = AVAILABLE_FACTORS.find(f => f.id === factorId);
              return factor ? (
                <Badge 
                  key={factorId} 
                  variant="outline" 
                  className="text-[10px] bg-slate-700/50 border-slate-600 h-5"
                >
                  {factor.name.split(' ').slice(0, 2).join(' ')}
                </Badge>
              ) : null;
            })}
            {cube.factors.length > 2 && (
              <Badge variant="outline" className="text-[10px] bg-slate-700/50 border-slate-600 h-5">
                +{cube.factors.length - 2}
              </Badge>
            )}
          </div>
          
          <Separator className="bg-slate-700/50 my-1.5" />
          
          <div className="flex items-center justify-between text-[10px] text-slate-500 py-0.5">
            <div className="flex items-center gap-0.5">
              <Bell className="h-2.5 w-2.5" />
              <span className="capitalize">{cube.trigger.action}</span>
              <span>when {cube.trigger.direction}</span>
              <span>({cube.trigger.timeWindow})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 pt-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-200"
              onClick={() => onEdit(cube)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-200"
              onClick={() => onDuplicate(cube)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-red-400"
              onClick={() => onDelete(cube.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertCubeBuilderPage() {
  const [cubes, setCubes] = useState<AlertCube[]>(generateSampleCubes());
  const [isCreating, setIsCreating] = useState(false);
  const [editingCube, setEditingCube] = useState<AlertCube | null>(null);
  const [activeTab, setActiveTab] = useState<'cubes' | 'factors' | 'history'>('cubes');
  
  const [newCube, setNewCube] = useState<Partial<AlertCube>>({
    name: '',
    description: '',
    icon: 'target',
    color: 'emerald',
    factors: [],
    formula: '',
    trigger: { direction: 'up', threshold: 50, timeWindow: '24h', action: 'alert' },
    isActive: true,
  });
  
  const activeCubes = useMemo(() => cubes.filter(c => c.isActive), [cubes]);
  const canAddMore = cubes.length < MAX_CUBES;
  
  const handleCreateCube = () => {
    if (!newCube.name || newCube.factors?.length === 0) {
      toast.error("Name and at least one factor required");
      return;
    }
    
    const cube: AlertCube = {
      id: `cube-${Date.now()}`,
      name: newCube.name,
      description: newCube.description || '',
      icon: newCube.icon || 'target',
      color: newCube.color || 'emerald',
      factors: newCube.factors || [],
      formula: newCube.formula || newCube.factors?.join(' + ') || '',
      trigger: newCube.trigger || { direction: 'up', threshold: 50, timeWindow: '24h', action: 'alert' },
      isActive: true,
      currentValue: Math.floor(Math.random() * 100),
      previousValue: Math.floor(Math.random() * 100),
      trend: ['up', 'down', 'flat'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'flat',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      position: cubes.length,
    };
    
    setCubes(prev => [...prev, cube]);
    setNewCube({
      name: '',
      description: '',
      icon: 'target',
      color: 'emerald',
      factors: [],
      formula: '',
      trigger: { direction: 'up', threshold: 50, timeWindow: '24h', action: 'alert' },
      isActive: true,
    });
    setIsCreating(false);
    toast.success("Alert cube created");
  };
  
  const handleDeleteCube = (id: string) => {
    setCubes(prev => prev.filter(c => c.id !== id));
    toast.info("Cube deleted");
  };
  
  const handleToggleCube = (id: string) => {
    setCubes(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };
  
  const handleDuplicateCube = (cube: AlertCube) => {
    if (!canAddMore) {
      toast.error(`Maximum ${MAX_CUBES} cubes allowed`);
      return;
    }
    
    const duplicate: AlertCube = {
      ...cube,
      id: `cube-${Date.now()}`,
      name: `${cube.name} (Copy)`,
      createdAt: new Date().toISOString(),
      position: cubes.length,
    };
    
    setCubes(prev => [...prev, duplicate]);
    toast.success("Cube duplicated");
  };
  
  const toggleFactor = (factorId: string) => {
    setNewCube(prev => ({
      ...prev,
      factors: prev.factors?.includes(factorId)
        ? prev.factors.filter(f => f !== factorId)
        : [...(prev.factors || []), factorId]
    }));
  };
  
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
              <Box className="h-4 w-4 text-white" />
            </div>
            Custom Alert Cube Builder
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Create up to {MAX_CUBES} predictive indicator cubes that combine multiple factors
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-800 border-slate-700">
            {activeCubes.length} active / {cubes.length} total
          </Badge>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!canAddMore}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Cube
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Create Alert Cube</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Combine multiple data factors into a single predictive indicator
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Cube Name</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 text-slate-200"
                      placeholder="e.g., Compliance Risk Score"
                      value={newCube.name}
                      onChange={(e) => setNewCube(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Description</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 text-slate-200"
                      placeholder="What does this cube measure?"
                      value={newCube.description}
                      onChange={(e) => setNewCube(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Icon</Label>
                    <Select
                      value={newCube.icon}
                      onValueChange={(v) => setNewCube(prev => ({ ...prev, icon: v }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {CUBE_ICONS.map(icon => (
                          <SelectItem key={icon.value} value={icon.value} className="text-slate-200">
                            <div className="flex items-center gap-2">
                              <icon.icon className="h-4 w-4" />
                              {icon.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Color</Label>
                    <Select
                      value={newCube.color}
                      onValueChange={(v) => setNewCube(prev => ({ ...prev, color: v }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {CUBE_COLORS.map(color => (
                          <SelectItem key={color.value} value={color.value} className="text-slate-200">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-4 w-4 rounded bg-gradient-to-br", color.class)} />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Data Factors (select multiple)</Label>
                  <ScrollArea className="h-40 rounded-md border border-slate-700 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_FACTORS.map(factor => (
                        <button
                          key={factor.id}
                          type="button"
                          onClick={() => toggleFactor(factor.id)}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md text-left transition-colors",
                            newCube.factors?.includes(factor.id)
                              ? "bg-purple-600/30 border border-purple-500/50 text-purple-200"
                              : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                          )}
                        >
                          <factor.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{factor.name}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-slate-500">
                    Selected: {newCube.factors?.length || 0} factors
                  </p>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div className="space-y-3">
                  <Label className="text-slate-300">Trigger Configuration</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Direction</Label>
                      <Select
                        value={newCube.trigger?.direction}
                        onValueChange={(v: 'up' | 'down' | 'flat' | 'any') => 
                          setNewCube(prev => ({ 
                            ...prev, 
                            trigger: { ...prev.trigger!, direction: v } 
                          }))
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="up" className="text-slate-200">Trending Up</SelectItem>
                          <SelectItem value="down" className="text-slate-200">Trending Down</SelectItem>
                          <SelectItem value="any" className="text-slate-200">Any Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Threshold</Label>
                      <Input
                        type="number"
                        className="bg-slate-800 border-slate-700 text-slate-200 h-9"
                        value={newCube.trigger?.threshold}
                        onChange={(e) => 
                          setNewCube(prev => ({ 
                            ...prev, 
                            trigger: { ...prev.trigger!, threshold: parseInt(e.target.value) || 0 } 
                          }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Time Window</Label>
                      <Select
                        value={newCube.trigger?.timeWindow}
                        onValueChange={(v: '1h' | '24h' | '7d' | '30d') => 
                          setNewCube(prev => ({ 
                            ...prev, 
                            trigger: { ...prev.trigger!, timeWindow: v } 
                          }))
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="1h" className="text-slate-200">1 Hour</SelectItem>
                          <SelectItem value="24h" className="text-slate-200">24 Hours</SelectItem>
                          <SelectItem value="7d" className="text-slate-200">7 Days</SelectItem>
                          <SelectItem value="30d" className="text-slate-200">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Action</Label>
                      <Select
                        value={newCube.trigger?.action}
                        onValueChange={(v: 'alert' | 'notify' | 'escalate' | 'log') => 
                          setNewCube(prev => ({ 
                            ...prev, 
                            trigger: { ...prev.trigger!, action: v } 
                          }))
                        }
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="alert" className="text-slate-200">Show Alert</SelectItem>
                          <SelectItem value="notify" className="text-slate-200">Send Notification</SelectItem>
                          <SelectItem value="escalate" className="text-slate-200">Escalate</SelectItem>
                          <SelectItem value="log" className="text-slate-200">Log Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreateCube}
                  disabled={!newCube.name || !newCube.factors?.length}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cube
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">
                <strong>Philosophy:</strong> See trends BEFORE they become problems
              </span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="h-4 w-4" />
              <span>Cubes combine multiple data factors into single predictive indicators</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            <div className="flex items-center gap-2 text-slate-400">
              <Zap className="h-4 w-4" />
              <span>Take action proactively, not reactively</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cubes.map(cube => (
          <CubeCard
            key={cube.id}
            cube={cube}
            onEdit={setEditingCube}
            onDelete={handleDeleteCube}
            onToggle={handleToggleCube}
            onDuplicate={handleDuplicateCube}
          />
        ))}
        
        {canAddMore && (
          <Card 
            className="border-2 border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-600 transition-colors cursor-pointer min-h-[200px] flex items-center justify-center"
            onClick={() => setIsCreating(true)}
          >
            <div className="text-center text-slate-500">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p>Add Cube</p>
              <p className="text-xs">{cubes.length}/{MAX_CUBES}</p>
            </div>
          </Card>
        )}
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Available Data Factors ({AVAILABLE_FACTORS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {AVAILABLE_FACTORS.map(factor => (
              <div 
                key={factor.id}
                className="flex items-center gap-2 p-2 rounded-md bg-slate-900/50 border border-slate-700"
              >
                <factor.icon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-300 truncate">{factor.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
