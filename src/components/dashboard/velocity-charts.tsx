import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell,
  PieChart, Pie, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, Zap, Activity, DollarSign, 
  Gauge, ArrowRight, CircleDollarSign, Rocket
} from 'lucide-react';
import { DepartmentBudgetSkyscrapers } from '@/components/charts/isometric-bar-chart';

interface DepartmentData {
  name: string;
  budget: number;
  spent: number;
  remaining: number;
  utilization: number;
  status: 'good' | 'warning' | 'critical';
}

interface VelocityChartsProps {
  departmentSpend: DepartmentData[];
  totalBudget: number;
  totalSpent: number;
  monthlyVelocity?: number;
  onNavigate: (path: string) => void;
}

const chartConfig = {
  spent: { label: "Spent", color: "#06b6d4" },
  budget: { label: "Budget", color: "#475569" },
};

export function VelocityCharts({ 
  departmentSpend, 
  totalBudget, 
  totalSpent, 
  monthlyVelocity = 0,
  onNavigate 
}: VelocityChartsProps) {
  const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const velocityData = [
    { name: 'IT Ops', velocity: 85, fill: '#06b6d4' },
    { name: 'Data Sci', velocity: 72, fill: '#8b5cf6' },
    { name: 'Cloud', velocity: 95, fill: '#14b8a6' },
    { name: 'QA', velocity: 58, fill: '#f59e0b' },
    { name: 'Security', velocity: 43, fill: '#ef4444' },
  ];

  const flowData = [
    { category: 'Active Spend', value: totalSpent, fill: 'url(#flowGradientCyan)' },
    { category: 'Reserved', value: totalBudget * 0.15, fill: 'url(#flowGradientAmber)' },
    { category: 'Available', value: totalBudget - totalSpent - (totalBudget * 0.15), fill: 'url(#flowGradientSlate)' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT CHART: 3D Isometric Department Budget Skyscrapers */}
      <DepartmentBudgetSkyscrapers 
        departmentSpend={departmentSpend} 
        onNavigate={onNavigate} 
      />

      {/* RIGHT CHART: Spend Velocity & Flow (Square) */}
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-slate-700/50 overflow-hidden group backdrop-blur-sm relative"
        style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 50%, rgba(15, 23, 42, 0.9) 100%)',
        }}
        onClick={() => onNavigate("/analytics-hub")}
      >
        {/* Animated corner accent - amber for velocity */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div 
            className="absolute -top-10 -right-10 w-20 h-20 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              animationDelay: '0.5s'
            }}
          />
        </div>

        <CardHeader className="border-b border-slate-700/50 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Rocket className="h-4 w-4 text-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
                Spend Velocity
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">Real-time fund flow analysis</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 text-xs animate-pulse">
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 relative" style={{ background: 'transparent' }}>
          {/* Central Velocity Gauge */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div 
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(6, 182, 212, 0.3) 25%, transparent 50%, rgba(251, 191, 36, 0.3) 75%, transparent 100%)',
                  animationDuration: '8s',
                  filter: 'blur(8px)',
                }}
              />
              
              <ChartContainer config={chartConfig} className="h-[180px] w-[180px]" style={{ background: 'transparent' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    data={[{ name: 'Utilization', value: utilizationRate, fill: 'url(#velocityGradient)' }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <defs>
                      <linearGradient id="velocityGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="flowGradientCyan" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                      <linearGradient id="flowGradientAmber" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="flowGradientSlate" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                    </defs>
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={10} 
                      background={{ fill: 'rgba(51, 65, 85, 0.3)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Center value display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                  {utilizationRate.toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400">Deployed</span>
              </div>
            </div>
          </div>

          {/* Flow indicators */}
          <div className="mt-4 space-y-2">
            {/* Currency flow animation */}
            <div className="relative h-8 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
              <div 
                className="absolute inset-y-0 left-0 flex items-center"
                style={{
                  width: `${utilizationRate}%`,
                  background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.6) 100%)',
                }}
              >
                {/* Animated currency symbols flowing right */}
                <div className="flex items-center gap-2 animate-flow-right">
                  <CircleDollarSign className="h-4 w-4 text-cyan-400" />
                  <ArrowRight className="h-3 w-3 text-cyan-300" />
                  <CircleDollarSign className="h-4 w-4 text-cyan-400" />
                  <ArrowRight className="h-3 w-3 text-cyan-300" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs text-slate-400">$0</span>
                <span className="text-xs font-medium text-cyan-400">
                  ${(totalSpent / 1000).toFixed(0)}K flowing
                </span>
                <span className="text-xs text-slate-400">${(totalBudget / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Velocity metrics row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-slate-700/30">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">Fast</span>
                </div>
                <span className="text-[10px] text-slate-500">IT Ops</span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-cyan-500/30">
                <div className="flex items-center justify-center gap-1">
                  <Activity className="h-3 w-3 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400">Steady</span>
                </div>
                <span className="text-[10px] text-slate-500">Cloud</span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-2 text-center border border-purple-500/30">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400">Rising</span>
                </div>
                <span className="text-[10px] text-slate-500">Data</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Speed lines decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="h-full animate-speed-lines"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.5) 20%, rgba(6, 182, 212, 0.5) 40%, transparent 60%, rgba(139, 92, 246, 0.5) 80%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default VelocityCharts;
