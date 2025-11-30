import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { DashboardModule } from "@shared/schema";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

interface DashboardWidgetProps {
  module: DashboardModule | undefined;
}

// Generate realistic demo data based on module name
const getDemoData = (moduleName: string): { value: string; trend?: string; change?: number } => {
  const dataMap: Record<string, { value: string; trend?: string; change?: number }> = {
    // Recruitment
    "Total Candidates": { value: "1,247", trend: "up", change: 12 },
    "Active Requisitions": { value: "38", trend: "down", change: 3 },
    "Time to Hire": { value: "28 days", trend: "down", change: 5 },
    "Offer Acceptance Rate": { value: "87%", trend: "up", change: 2 },
    "Hiring Funnel": { value: "524", trend: "up", change: 8 },
    "Source Effectiveness": { value: "12", trend: "neutral" },
    "Recent Interviews": { value: "23", trend: "neutral" },
    
    // Procurement & Vendors (CPO Focus)
    "Top Vendors": { value: "15", trend: "neutral" },
    "Vendor Spend": { value: "$284K", trend: "up", change: 18 },
    "Active Contractors": { value: "142", trend: "up", change: 7 },
    "Contract Compliance": { value: "94%", trend: "up", change: 3 },
    "Vendor Risk Score": { value: "68/100", trend: "down", change: 12 },
    "SOW Cycle Time": { value: "5 days", trend: "down", change: 40 },
    "Cost Savings": { value: "$127K", trend: "up", change: 22 },
    "Vendor Performance Trends": { value: "8.2/10", trend: "up", change: 5 },
    "Contract Renewals": { value: "7", trend: "neutral" },
    
    // Project Management (Senior PM Focus)
    "Portfolio Health": { value: "78/100", trend: "up", change: 6 },
    "At-Risk Projects": { value: "12", trend: "down", change: 18 },
    "Resource Utilization": { value: "87%", trend: "up", change: 4 },
    "Critical Path Items": { value: "5", trend: "down", change: 28 },
    "Top 5 At-Risk Projects": { value: "165", trend: "neutral" },
    "Dependency Network": { value: "42", trend: "neutral" },
    "Resource Heatmap": { value: "85%", trend: "up", change: 3 },
    
    // IT & Systems (IT Director Focus)
    "System Uptime": { value: "99.8%", trend: "up", change: 0.2 },
    "Integration Health": { value: "14/15", trend: "neutral" },
    "Tech Debt Score": { value: "42/100", trend: "down", change: 8 },
    "API Response Time": { value: "127ms", trend: "down", change: 15 },
    "System Performance": { value: "92%", trend: "up", change: 3 },
    "Active Integrations": { value: "15", trend: "neutral" },
    
    // VMS & Contractors (VMS Specialist Focus)
    "Contractor Compliance": { value: "96%", trend: "up", change: 2 },
    "Skills Gap Score": { value: "38/100", trend: "down", change: 12 },
    "Contractor Performance": { value: "8.6/10", trend: "up", change: 4 },
    "Expiring Certifications": { value: "4", trend: "neutral" },
    
    // Finance
    "Spend Trends": { value: "$52K", trend: "down", change: 4 },
    "Budget Variance": { value: "-3.2%", trend: "up", change: 1 },
    "Cost per Hire": { value: "$4,200", trend: "down", change: 8 },
    
    // Productivity
    "Quick Actions": { value: "8", trend: "neutral" },
  };
  
  return dataMap[moduleName] || { value: Math.floor(Math.random() * 1000).toString(), trend: "neutral" };
};

export function DashboardWidget({ module }: DashboardWidgetProps) {
  if (!module) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Module not found</p>
      </div>
    );
  }

  const getIcon = (iconName: string | null | undefined) => {
    if (!iconName) return LucideIcons.Box;
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return Icon;
  };

  const Icon = getIcon(module.icon);
  const demoData = getDemoData(module.name);

  const renderTrendBadge = () => {
    if (!demoData.trend || demoData.trend === "neutral") return null;
    
    const isPositive = demoData.trend === "up";
    const Icon = isPositive ? ArrowUp : ArrowDown;
    
    return (
      <Badge 
        variant={isPositive ? "default" : "destructive"} 
        className="gap-1 font-semibold text-xs shadow-sm"
      >
        <Icon className="w-3 h-3" />
        {demoData.change}%
      </Badge>
    );
  };

  // Render different widget types
  switch (module.type) {
    case "kpi":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            {renderTrendBadge()}
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {demoData.value}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {module.description}
            </div>
          </div>

          {/* Mini sparkline simulation */}
          <div className="flex items-end gap-0.5 h-7 mt-2">
            {[0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 1.0].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t"
                style={{ height: `${height * 100}%` }}
              />
            ))}
          </div>
        </div>
      );

    case "chart":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 flex items-end justify-around gap-2 pb-2">
            {[65, 45, 80, 55, 70, 50, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div 
                  className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all hover:from-primary/90"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Last 7 days • <span className="text-primary font-medium">+{Math.floor(Math.random() * 20 + 5)}%</span>
            </p>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 overflow-auto">
            {['Sarah Chen', 'Mike Rodriguez', 'Emily Park', 'James Wilson'].map((name, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover-elevate transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">
                      {['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst'][i]}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {['Today', 'Tomorrow', 'Thu', 'Fri'][i]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );

    case "widget":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2 flex-1">
            {['Post New Job', 'Review Applications', 'Schedule Interview'].map((action, i) => (
              <button
                key={i}
                className="w-full p-3 rounded-lg border bg-background hover-elevate active-elevate-2 cursor-pointer text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{action}</span>
                  <LucideIcons.ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="p-3 rounded-xl bg-primary/5 inline-block">
              <Icon className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {module.description}
            </p>
          </div>
        </div>
      );
  }
}
