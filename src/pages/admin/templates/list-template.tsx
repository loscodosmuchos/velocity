import { useState } from "react";
import { 
  Users, Search, Filter, CheckCircle, AlertTriangle, Calendar,
  DollarSign, Clock, TrendingUp, TrendingDown, ChevronRight,
  Eye, Edit, MessageSquare, RefreshCw, Building2, MapPin,
  ClipboardCheck, ArrowRight, Activity, Zap, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

function StatusIcon({ type }: { type: 'healthy' | 'attention' | 'critical' | 'pending' }) {
  const config = {
    healthy: { icon: CheckCircle, bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', color: 'text-emerald-400' },
    attention: { icon: AlertTriangle, bg: 'bg-amber-500/20', border: 'border-amber-500/40', color: 'text-amber-400' },
    critical: { icon: AlertTriangle, bg: 'bg-red-500/20', border: 'border-red-500/40', color: 'text-red-400' },
    pending: { icon: ClipboardCheck, bg: 'bg-blue-500/20', border: 'border-blue-500/40', color: 'text-blue-400' }
  };
  const c = config[type];
  const Icon = c.icon;
  
  return (
    <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center", c.bg, c.border)}>
      <Icon className={cn("h-4 w-4", c.color)} />
    </div>
  );
}

function MiniSparkline({ data, color = "emerald" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const colors: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-400",
    amber: "from-amber-500 to-amber-400",
    red: "from-red-500 to-red-400"
  };
  
  return (
    <div className="flex items-end gap-px h-4 w-12">
      {data.slice(-6).map((value, i) => (
        <div 
          key={i}
          className={cn("flex-1 bg-gradient-to-t rounded-t opacity-70", colors[color])}
          style={{ height: `${Math.max(((value - min) / range) * 100, 15)}%` }}
        />
      ))}
    </div>
  );
}

function BudgetGauge({ percentage }: { percentage: number }) {
  const color = percentage > 50 ? 'emerald' : percentage > 20 ? 'amber' : 'red';
  const colors: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-400' },
    red: { bg: 'bg-red-500', text: 'text-red-400' }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div className={cn("h-full rounded-full", colors[color].bg)} style={{ width: `${percentage}%` }} />
      </div>
      <span className={cn("text-xs font-medium", colors[color].text)}>{percentage}%</span>
    </div>
  );
}

function WorkflowArrow({ action, outcome }: { action: string; outcome: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-xs text-slate-400 cursor-help">
            <ArrowRight className="h-3 w-3" />
            <span>{action}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="text-xs">
            <div className="font-semibold mb-1">What happens next:</div>
            <div className="text-slate-300">{outcome}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ActionButton({ icon: Icon, label, outcome, variant = "default" }: {
  icon: React.ElementType;
  label: string;
  outcome: string;
  variant?: "default" | "warning" | "primary";
}) {
  const variants: Record<string, string> = {
    default: "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border-slate-600/50",
    warning: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/50",
    primary: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/50"
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={cn("p-1.5 rounded-lg border transition-all hover:scale-110", variants[variant])}>
            <Icon className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div className="font-semibold">{label}</div>
            <div className="text-slate-400">{outcome}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FilterPill({ label, count, active, color, onClick }: {
  label: string;
  count: number;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    red: "bg-red-500/20 text-red-400 border-red-500/40",
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
        active ? colors[color] : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50"
      )}
    >
      <span className="text-xs font-medium">{label}</span>
      <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-md", active ? "bg-white/10" : "bg-slate-700")}>
        {count}
      </span>
    </button>
  );
}

function SummaryCard({ icon: Icon, label, value, subtitle, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) {
  const colors: Record<string, { bg: string; border: string; icon: string; value: string }> = {
    blue: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', icon: 'text-blue-400', value: 'text-blue-400' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', icon: 'text-emerald-400', value: 'text-emerald-400' },
    amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', icon: 'text-amber-400', value: 'text-amber-400' },
    red: { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', icon: 'text-red-400', value: 'text-red-400' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', icon: 'text-purple-400', value: 'text-purple-400' }
  };
  const c = colors[color];
  
  return (
    <div className={cn("rounded-xl border p-4 bg-gradient-to-br cursor-pointer hover:scale-[1.02] transition-all", c.bg, c.border)}>
      <div className={cn("p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 w-fit", c.icon)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3">
        <div className={cn("text-2xl font-bold", c.value)}>{value}</div>
        <div className="text-xs font-medium text-slate-400">{label}</div>
        {subtitle && <div className="text-[10px] text-slate-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function ExampleRow({ name, initials, dept, location, status, hours, rate, budget, workflow }: {
  name: string;
  initials: string;
  dept: string;
  location: string;
  status: 'healthy' | 'attention' | 'critical' | 'pending';
  hours: number[];
  rate: number;
  budget: number;
  workflow?: { action: string; outcome: string };
}) {
  const needsAttention = status === 'attention' || status === 'critical' || status === 'pending';
  
  return (
    <div className={cn(
      "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer border border-transparent",
      needsAttention 
        ? "bg-gradient-to-r from-amber-900/10 to-transparent border-l-2 border-l-amber-500"
        : "hover:bg-slate-800/50",
      "hover:border-slate-700/50"
    )}>
      <StatusIcon type={status} />
      
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
        {initials}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{name}</span>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0">
            Active
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{dept}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <MiniSparkline data={hours} color="emerald" />
            <span className="text-xs font-medium text-white">{hours[hours.length - 1]}h</span>
          </div>
          <span className="text-[10px] text-slate-500">This week</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-white">${rate}/hr</span>
          <span className="text-[10px] text-slate-500">Rate</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 w-24">
          <BudgetGauge percentage={budget} />
          <span className="text-[10px] text-slate-500">Budget</span>
        </div>
      </div>
      
      {workflow && (
        <div className="hidden lg:block">
          <WorkflowArrow action={workflow.action} outcome={workflow.outcome} />
        </div>
      )}
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionButton icon={Eye} label="View" outcome="Opens full profile" variant="primary" />
        <ActionButton icon={Edit} label="Edit" outcome="Opens edit form" />
        <ActionButton icon={MessageSquare} label="Message" outcome="Opens chat" />
        <ActionButton icon={RefreshCw} label="Extend" outcome="Opens extension wizard" />
      </div>
      
      <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
    </div>
  );
}

export default function ListTemplatePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const exampleData = [
    { name: "John Martinez", initials: "JM", dept: "Engineering", location: "Dearborn, MI", status: 'pending' as const, hours: [38,42,40,45,41,42], rate: 85, budget: 72, workflow: { action: "Approve", outcome: "Timecard approved → Sent to payroll" } },
    { name: "Lisa Thompson", initials: "LT", dept: "Engineering", location: "Warren, MI", status: 'healthy' as const, hours: [40,38,42,41,40,41], rate: 95, budget: 85 },
    { name: "Robert Kim", initials: "RK", dept: "Procurement", location: "Detroit, MI", status: 'attention' as const, hours: [42,44,45,43,42,44], rate: 110, budget: 28, workflow: { action: "Add Funds", outcome: "PO amended → Budget increased" } },
    { name: "Angela Rodriguez", initials: "AR", dept: "Engineering", location: "Sterling Heights, MI", status: 'healthy' as const, hours: [39,40,41,40,38,40], rate: 90, budget: 65 },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/templates')} className="text-slate-400">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Templates
            </Button>
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              APPROVED TEMPLATE
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">List View Template</h1>
                <p className="text-xs text-slate-400">Purpose-built for scanning large datasets</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/contractors/create')}>+ Create New</Button>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mb-4">
            <SummaryCard icon={Users} label="Total Items" value={156} subtitle="Active in system" color="blue" />
            <SummaryCard icon={AlertTriangle} label="Needs Attention" value={23} subtitle="Low budget or ending" color="amber" />
            <SummaryCard icon={Calendar} label="Ending Soon" value={12} subtitle="Within 30 days" color="red" />
            <SummaryCard icon={ClipboardCheck} label="Pending" value={8} subtitle="Awaiting approval" color="purple" />
            <SummaryCard icon={DollarSign} label="Total Value" value="$4.2M" subtitle="Across all items" color="emerald" />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FilterPill label="All" count={156} active={activeFilter === 'all'} color="blue" onClick={() => setActiveFilter('all')} />
              <FilterPill label="Needs Attention" count={23} active={activeFilter === 'attention'} color="amber" onClick={() => setActiveFilter('attention')} />
              <FilterPill label="Ending Soon" count={12} active={activeFilter === 'ending'} color="red" onClick={() => setActiveFilter('ending')} />
              <FilterPill label="Pending" count={8} active={activeFilter === 'pending'} color="emerald" onClick={() => setActiveFilter('pending')} />
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search..." className="pl-9 bg-slate-800/50 border-slate-700/50" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex items-center gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          <div className="w-8" />
          <div className="w-10" />
          <div className="flex-1">Entity</div>
          <div className="hidden md:flex items-center gap-6">
            <div className="w-20 text-center">Trend</div>
            <div className="w-16 text-center">Rate</div>
            <div className="w-24 text-center">Health</div>
          </div>
          <div className="hidden lg:block w-16">Next</div>
          <div className="w-36">Actions</div>
        </div>
        
        <div className="space-y-1">
          {exampleData.map((item, i) => (
            <ExampleRow key={i} {...item} />
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
          <span>Attention</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50" />
          <span>Critical</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <ArrowRight className="h-3 w-3" />
          <span>Hover for workflow</span>
        </div>
      </div>
      
      <div className="px-6 py-8">
        <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Template Specifications</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Row Anatomy</h4>
              <code className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-1 rounded">
                [STATUS] [AVATAR] NAME+SUBTITLE | METRICS | ALERTS | [ACTIONS→]
              </code>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>• Status icon replaces text status</li>
                <li>• Avatar with initials for identity</li>
                <li>• Name + role + location context</li>
                <li>• Visual metrics (sparklines, gauges)</li>
                <li>• Workflow arrows showing next step</li>
                <li>• Action buttons with outcome tooltips</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Design Principles</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• <span className="text-emerald-400">Visual-first:</span> Icons before words</li>
                <li>• <span className="text-emerald-400">Semantic colors:</span> Green/Amber/Red meaning</li>
                <li>• <span className="text-emerald-400">2-second scan:</span> Understand row instantly</li>
                <li>• <span className="text-emerald-400">Outcome clarity:</span> Every action explains result</li>
                <li>• <span className="text-emerald-400">Smart filters:</span> Surface what needs attention</li>
                <li>• <span className="text-emerald-400">Memory Master:</span> Icon+color = mental shortcut</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
