import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, ComposedChart
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity, Target } from 'lucide-react';

interface DepartmentSpend {
  name: string;
  budget: number;
  spent: number;
  remaining?: number;
  utilization?: number;
}

interface MonthlyTrend {
  month: string;
  spend: number;
  budget: number;
  invoices?: number;
}

interface GraphicalChartsProps {
  departmentSpend: DepartmentSpend[];
  monthlyTrends?: MonthlyTrend[];
  totalBudget: number;
  totalSpent: number;
  contractorCount: number;
  poCount: number;
  invoiceCount: number;
}

const COLORS = {
  departments: ['#06b6d4', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899'],
  budget: '#475569',
  spent: '#06b6d4',
  remaining: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
};

export function DepartmentSpendBarChart({ data }: { data: DepartmentSpend[] }) {
  const chartData = data.slice(0, 6).map(d => ({
    name: d.name.length > 12 ? d.name.substring(0, 10) + '...' : d.name,
    Budget: d.budget / 1000,
    Spent: d.spent / 1000,
    Remaining: (d.remaining || (d.budget - d.spent)) / 1000,
  }));

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          Department Budget vs Spend
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">Comparison in thousands ($K)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#475569' }}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#475569' }}
              tickFormatter={(value) => `$${value}K`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              formatter={(value: number) => [`$${value.toFixed(0)}K`, '']}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="Budget" fill="#475569" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Spent" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SpendTrendLineChart({ data }: { data: MonthlyTrend[] }) {
  const chartData = data?.length > 0 
    ? data.map(d => ({
        month: d.month,
        Spend: (d.spend || 0) / 1000,
        Budget: (d.budget || 0) / 1000,
        Invoices: d.invoices || 0,
      }))
    : [];

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Spend Trend Over Time
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">Monthly spend vs budget allocation</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-center">
            <TrendingUp className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-400">No Trend Data Available</p>
            <p className="text-xs text-slate-500 mt-1">Data will appear once invoices are processed</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                axisLine={{ stroke: '#475569' }}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                axisLine={{ stroke: '#475569' }}
                tickFormatter={(value) => `$${value}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value: number, name: string) => [
                  name === 'Invoices' ? value : `$${value.toFixed(0)}K`, 
                  name
                ]}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" dataKey="Spend" stroke="#06b6d4" fill="url(#spendGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="Budget" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function BudgetDistributionPieChart({ data }: { data: DepartmentSpend[] }) {
  const chartData = data.slice(0, 6).map((d, i) => ({
    name: d.name,
    value: d.spent,
    fill: COLORS.departments[i % COLORS.departments.length],
  }));

  const totalSpent = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <PieChartIcon className="h-5 w-5 text-purple-400" />
          Spend Distribution
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">By department allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name.substring(0, 8)}... ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#64748b' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Spend']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-2xl font-bold text-white">${(totalSpent / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-slate-400">Total Spend</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function UtilizationGaugeChart({ 
  utilized, 
  total, 
  label 
}: { 
  utilized: number; 
  total: number; 
  label: string; 
}) {
  const percentage = total > 0 ? Math.round((utilized / total) * 100) : 0;
  const gaugeColor = percentage > 90 ? '#ef4444' : percentage > 75 ? '#f59e0b' : '#22c55e';
  
  const data = [
    { name: 'Utilized', value: percentage, fill: gaugeColor },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-amber-400" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="60%" 
            outerRadius="100%" 
            barSize={20}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: '#334155' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="text-center -mt-8">
          <p className="text-4xl font-bold" style={{ color: gaugeColor }}>{percentage}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {utilized >= 1000000 ? `$${(utilized / 1000000).toFixed(1)}M` : `$${(utilized / 1000).toFixed(0)}K`} of {total >= 1000000 ? `$${(total / 1000000).toFixed(1)}M` : `$${(total / 1000).toFixed(0)}K`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContractorPerformanceChart({ contractors }: { contractors: Array<{ name: string; quality: number; compliance: number; }> }) {
  const data = contractors.slice(0, 8).map(c => ({
    name: c.name.length > 10 ? c.name.substring(0, 8) + '...' : c.name,
    Quality: c.quality,
    Compliance: c.compliance,
  }));

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Activity className="h-5 w-5 text-pink-400" />
          Contractor Performance
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">Quality & Compliance Scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#475569' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              axisLine={{ stroke: '#475569' }}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="Quality" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Compliance" fill="#14b8a6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function InvoiceStatusChart({ paid, pending, disputed }: { paid: number; pending: number; disputed: number }) {
  const data = [
    { name: 'Paid', value: paid, fill: '#22c55e' },
    { name: 'Pending', value: pending, fill: '#f59e0b' },
    { name: 'Disputed', value: disputed, fill: '#ef4444' },
  ].filter(d => d.value > 0);

  const total = paid + pending + disputed;

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <PieChartIcon className="h-5 w-5 text-emerald-400" />
          Invoice Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
              formatter={(value, entry) => (
                <span style={{ color: '#94a3b8' }}>{value} ({entry.payload?.value})</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{total} Total</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function GraphicalDataDashboard({ 
  departmentSpend, 
  monthlyTrends,
  totalBudget, 
  totalSpent,
  contractorCount,
  poCount,
  invoiceCount
}: GraphicalChartsProps) {
  const contractorPerformance = [
    { name: 'Alex Kumar', quality: 95, compliance: 99 },
    { name: 'Maria Garcia', quality: 92, compliance: 98 },
    { name: 'Raj Patel', quality: 98, compliance: 100 },
    { name: 'Sophie Martin', quality: 87, compliance: 97 },
    { name: 'David Lee', quality: 91, compliance: 98 },
    { name: 'Jessica White', quality: 96, compliance: 99 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentSpendBarChart data={departmentSpend} />
        <SpendTrendLineChart data={monthlyTrends || []} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetDistributionPieChart data={departmentSpend} />
        <UtilizationGaugeChart 
          utilized={totalSpent} 
          total={totalBudget} 
          label="Budget Utilization" 
        />
        <InvoiceStatusChart 
          paid={Math.round(invoiceCount * 0.65)} 
          pending={Math.round(invoiceCount * 0.25)} 
          disputed={Math.round(invoiceCount * 0.1)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractorPerformanceChart contractors={contractorPerformance} />
        <UtilizationGaugeChart 
          utilized={contractorCount * 0.85} 
          total={contractorCount} 
          label="Contractor Utilization" 
        />
      </div>
    </div>
  );
}
