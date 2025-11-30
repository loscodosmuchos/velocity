import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Gauge, Zap, Fuel, Thermometer, Battery, 
  AlertTriangle, CheckCircle2, Clock, DollarSign,
  Users, TrendingUp, Activity
} from "lucide-react";

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: "cyan" | "amber" | "emerald" | "red";
  size?: "sm" | "md" | "lg";
}

function CircularGauge({ value, max, label, unit = "", color = "cyan", size = "md" }: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 270 - 135;
  
  const sizes = {
    sm: { container: "w-24 h-24", text: "text-lg", label: "text-[10px]" },
    md: { container: "w-32 h-32", text: "text-2xl", label: "text-xs" },
    lg: { container: "w-40 h-40", text: "text-3xl", label: "text-sm" },
  };
  
  const colors = {
    cyan: { glow: "shadow-cyan-500/30", ring: "stroke-cyan-400", text: "text-cyan-400" },
    amber: { glow: "shadow-amber-500/30", ring: "stroke-amber-400", text: "text-amber-400" },
    emerald: { glow: "shadow-emerald-500/30", ring: "stroke-emerald-400", text: "text-emerald-400" },
    red: { glow: "shadow-red-500/30", ring: "stroke-red-400", text: "text-red-400" },
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizes[size].container
    )}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-slate-800"
          strokeDasharray="198"
          strokeDashoffset="66"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="6"
          className={colors[color].ring}
          strokeDasharray="198"
          strokeDashoffset={198 - (percentage / 100) * 132}
          strokeLinecap="round"
          style={{ 
            filter: `drop-shadow(0 0 8px ${color === 'cyan' ? '#22d3ee' : color === 'amber' ? '#fbbf24' : color === 'emerald' ? '#34d399' : '#f87171'})`,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold tabular-nums", sizes[size].text, colors[color].text)}>
          {value.toLocaleString()}
        </span>
        <span className={cn("text-slate-400 uppercase tracking-wider", sizes[size].label)}>
          {unit && <span className="mr-1">{unit}</span>}
          {label}
        </span>
      </div>
      
      <div 
        className={cn(
          "absolute w-1 bg-white rounded-full origin-bottom transition-transform duration-1000",
          size === "sm" ? "h-8" : size === "md" ? "h-10" : "h-12"
        )}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          boxShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}
      />
    </div>
  );
}

function SpeedometerCard({ value, label, icon: Icon, trend }: { 
  value: string; 
  label: string; 
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-4 shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
      
      <div className="relative flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
            {trend && (
              <TrendingUp className={cn(
                "h-4 w-4",
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400 rotate-180" : "text-slate-400"
              )} />
            )}
          </div>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
      </div>
      
      <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl" />
    </div>
  );
}

function HorizontalGauge({ value, max, label, color = "cyan" }: GaugeProps) {
  const percentage = (value / max) * 100;
  
  const colors = {
    cyan: "from-cyan-600 to-cyan-400",
    amber: "from-amber-600 to-amber-400",
    emerald: "from-emerald-600 to-emerald-400",
    red: "from-red-600 to-red-400",
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-medium text-slate-200 tabular-nums">{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", colors[color])}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 10px ${color === 'cyan' ? '#22d3ee' : color === 'amber' ? '#fbbf24' : color === 'emerald' ? '#34d399' : '#f87171'}`
          }}
        />
      </div>
    </div>
  );
}

function AlertIndicator({ type, active }: { type: "warning" | "critical" | "ok"; active: boolean }) {
  const styles = {
    warning: { bg: "bg-amber-500", shadow: "shadow-amber-500/50", icon: AlertTriangle },
    critical: { bg: "bg-red-500", shadow: "shadow-red-500/50", icon: AlertTriangle },
    ok: { bg: "bg-emerald-500", shadow: "shadow-emerald-500/50", icon: CheckCircle2 },
  };
  
  const Icon = styles[type].icon;
  
  return (
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
      active ? styles[type].bg : "bg-slate-800",
      active && `shadow-lg ${styles[type].shadow} animate-pulse`
    )}>
      <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-600")} />
    </div>
  );
}

export function AutomotiveDashDemo() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [fuel, setFuel] = useState(73);
  const [temp, setTemp] = useState(85);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const next = prev + (Math.random() - 0.3) * 15;
        return Math.max(0, Math.min(180, next));
      });
      setRpm(prev => {
        const next = prev + (Math.random() - 0.3) * 800;
        return Math.max(800, Math.min(7000, next));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Automotive Dashboard Demo</h1>
          <p className="text-slate-400">Velocity Design System - Luxury Sports Car Aesthetic</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDEgMiAwYTEgMSAwIDEgMS0yIDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 opacity-80" />
          
          <div className="relative grid grid-cols-3 gap-8 items-center">
            <CircularGauge 
              value={Math.round(rpm)} 
              max={8000} 
              label="RPM" 
              unit="x1000"
              color={rpm > 6000 ? "red" : rpm > 4000 ? "amber" : "cyan"}
              size="lg"
            />
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white tabular-nums tracking-tight">
                  {Math.round(speed)}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-widest">MPH</div>
              </div>
              
              <div className="flex justify-center gap-3">
                <AlertIndicator type="ok" active={true} />
                <AlertIndicator type="warning" active={temp > 90} />
                <AlertIndicator type="critical" active={fuel < 20} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <HorizontalGauge value={fuel} max={100} label="Fuel" color="emerald" />
                <HorizontalGauge value={temp} max={120} label="Temp" color={temp > 90 ? "amber" : "cyan"} />
              </div>
            </div>
            
            <CircularGauge 
              value={fuel} 
              max={100} 
              label="Fuel" 
              unit="%"
              color={fuel < 20 ? "red" : fuel < 40 ? "amber" : "emerald"}
              size="lg"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Applied to Workforce Metrics</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <SpeedometerCard value="34" label="Active Contractors" icon={Users} trend="up" />
          <SpeedometerCard value="$1.88M" label="Total PO Budget" icon={DollarSign} trend="neutral" />
          <SpeedometerCard value="127" label="Pending Timecards" icon={Clock} trend="down" />
          <SpeedometerCard value="98.2%" label="Compliance Rate" icon={Activity} trend="up" />
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-6">
            <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Budget Utilization</h3>
            <CircularGauge value={73} max={100} label="Used" unit="%" color="cyan" size="md" />
          </div>
          
          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-6">
            <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Contract Health</h3>
            <CircularGauge value={89} max={100} label="Score" unit="%" color="emerald" size="md" />
          </div>
          
          <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-6">
            <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Risk Level</h3>
            <CircularGauge value={23} max={100} label="Risk" unit="%" color="amber" size="md" />
          </div>
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>Stack: React + TypeScript, Tailwind CSS 4.1, SVG, CSS Animations</p>
          <p className="mt-1">Export this component for external development, then integrate back.</p>
        </div>
      </div>
    </div>
  );
}
