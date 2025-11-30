import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Check,
  ClockIcon,
  CalendarClock,
  ListTodo,
  EyeOff
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'budget' | 'timecard' | 'contractor' | 'po' | 'invoice' | 'compliance';
  title: string;
  message: string;
  value?: string;
  action?: string;
  timestamp: string;
}

interface AlertSummary {
  category: 'budget' | 'timecard' | 'contractor' | 'po' | 'invoice' | 'compliance';
  type: 'critical' | 'warning' | 'info' | 'success';
  count: number;
  hasAction: boolean;
  alerts: Alert[];
}

const AlertCube = ({ summary }: { summary: AlertSummary }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (summary.count === 1) {
      navigate(`/alerts/${summary.alerts[0].id}`);
    } else {
      navigate(`/alerts?category=${summary.category}&type=${summary.type}`);
    }
  };

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    switch(action) {
      case 'acknowledge':
        toast.success(`${summary.count} alert(s) acknowledged`, { icon: <Check className="h-4 w-4" /> });
        break;
      case 'snooze-1hr':
        toast.info(`Snoozed for 1 hour`, { icon: <ClockIcon className="h-4 w-4" /> });
        break;
      case 'snooze-next-login':
        toast.info(`Snoozed until next login`, { icon: <ClockIcon className="h-4 w-4" /> });
        break;
      case 'add-todo':
        toast.success(`Added ${summary.count} to-do(s)`, { icon: <Check className="h-4 w-4" /> });
        break;
      case 'dismiss':
        toast.info(`Alert dismissed`, { icon: <Check className="h-4 w-4" /> });
        break;
    }
  };

  const typeConfig = {
    critical: {
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      border: 'border-red-700',
      hover: 'hover:from-red-600 hover:to-red-700',
      text: 'text-red-50',
      badge: 'bg-red-700 text-white',
      icon: <XCircle className="h-3.5 w-3.5" />,
      label: 'Critical',
      animation: 'animate-urgent-beacon animate-racing-alert'
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      border: 'border-orange-600',
      hover: 'hover:from-amber-600 hover:to-orange-600',
      text: 'text-orange-50',
      badge: 'bg-orange-600 text-white',
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      label: 'Warning',
      animation: 'animate-warning-flash'
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      border: 'border-blue-700',
      hover: 'hover:from-blue-600 hover:to-blue-700',
      text: 'text-blue-50',
      badge: 'bg-blue-600 text-white',
      icon: <Clock className="h-3.5 w-3.5" />,
      label: 'Info',
      animation: ''
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      border: 'border-green-700',
      hover: 'hover:from-emerald-600 hover:to-green-700',
      text: 'text-green-50',
      badge: 'bg-green-600 text-white',
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      label: 'Success',
      animation: ''
    }
  };

  const categoryConfig = {
    budget: {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Finance',
      color: 'text-emerald-100'
    },
    timecard: {
      icon: <Clock className="h-5 w-5" />,
      label: 'Time Tracking',
      color: 'text-blue-100'
    },
    contractor: {
      icon: <Users className="h-5 w-5" />,
      label: 'Workforce',
      color: 'text-purple-100'
    },
    po: {
      icon: <FileText className="h-5 w-5" />,
      label: 'Contracts',
      color: 'text-indigo-100'
    },
    invoice: {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Invoicing',
      color: 'text-cyan-100'
    },
    compliance: {
      icon: <Shield className="h-5 w-5" />,
      label: 'Compliance',
      color: 'text-rose-100'
    }
  };

  const config = typeConfig[summary.type];
  const catConfig = categoryConfig[summary.category];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={handleClick}
            className={`
              relative w-16 h-16 rounded-xl border-2 shadow-lg cursor-pointer
              transition-all duration-200 hover:scale-110 hover:shadow-2xl
              ${config.bg} ${config.border} ${config.hover} ${config.animation}
            `}
          >
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${config.text}`}>
              <div className={`mb-0.5 ${catConfig.color}`}>
                {catConfig.icon}
              </div>
              
              <div className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5">
                {config.icon}
              </div>
              
              {summary.hasAction && (
                <div className="absolute top-1 left-1 bg-white/90 text-green-600 rounded-full p-0.5">
                  <Zap className="h-3 w-3" />
                </div>
              )}
              
              <div className="absolute bottom-1 right-1">
                <Badge className="bg-white/90 text-gray-900 text-[10px] h-4 px-1.5 border-0 font-bold">
                  {summary.count}
                </Badge>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-md p-0 bg-white border-2 shadow-2xl rounded-lg overflow-hidden"
          sideOffset={8}
        >
          <div className={`${config.bg} p-3 ${config.text} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                {catConfig.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm">{catConfig.label}</h4>
                <p className="text-xs opacity-90">{config.label} • {summary.count} {summary.count === 1 ? 'alert' : 'alerts'}</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
            {summary.alerts.slice(0, 3).map((alert, idx) => (
              <div key={idx} className="border-b last:border-0 pb-2 last:pb-0">
                <h5 className="font-semibold text-xs text-gray-900 mb-1">{alert.title}</h5>
                <p className="text-xs text-gray-600 line-clamp-2">{alert.message}</p>
                {alert.value && (
                  <div className="mt-1 bg-gray-100 border border-gray-200 px-2 py-1 rounded text-xs font-mono font-bold text-gray-900">
                    {alert.value}
                  </div>
                )}
                {alert.action && (
                  <div className="mt-1 flex items-start gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded">
                    <Zap className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-800 font-medium">{alert.action}</p>
                  </div>
                )}
              </div>
            ))}
            {summary.count > 3 && (
              <div className="text-center text-xs text-gray-500 pt-1">
                +{summary.count - 3} more {summary.count - 3 === 1 ? 'alert' : 'alerts'}
              </div>
            )}
          </div>

          <div className="border-t bg-gray-50">
            <div className="px-3 py-2">
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-1.5">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs font-medium hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                  onClick={(e) => handleQuickAction(e, 'acknowledge')}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Acknowledge
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  onClick={(e) => handleQuickAction(e, 'snooze-1hr')}
                >
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Snooze 1hr
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs font-medium hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                  onClick={(e) => handleQuickAction(e, 'snooze-next-login')}
                >
                  <CalendarClock className="h-3 w-3 mr-1" />
                  Next Login
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs font-medium hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
                  onClick={(e) => handleQuickAction(e, 'add-todo')}
                >
                  <ListTodo className="h-3 w-3 mr-1" />
                  Add To-Do
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 border-t px-3 py-1.5 text-center text-[10px] text-gray-600">
              <strong>Click cube</strong> to view all details
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

function aggregateAlertsByCategory(alerts: Alert[]): AlertSummary[] {
  const grouped = new Map<string, AlertSummary>();

  alerts.forEach(alert => {
    const key = `${alert.category}-${alert.type}`;
    const existing = grouped.get(key);
    
    if (existing) {
      existing.count++;
      existing.alerts.push(alert);
      if (alert.action) existing.hasAction = true;
    } else {
      grouped.set(key, {
        category: alert.category,
        type: alert.type,
        count: 1,
        hasAction: !!alert.action,
        alerts: [alert]
      });
    }
  });

  return Array.from(grouped.values())
    .sort((a, b) => {
      const severity = { critical: 4, warning: 3, info: 2, success: 1 };
      return severity[b.type] - severity[a.type];
    });
}

export function CompactAlertCubes({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;
  
  const summaries = aggregateAlertsByCategory(alerts);
  
  return (
    <div className="flex items-center gap-2.5 flex-wrap bg-gray-50/50 p-2 rounded-lg border border-gray-200">
      {summaries.map((summary, idx) => (
        <AlertCube key={`${summary.category}-${summary.type}-${idx}`} summary={summary} />
      ))}
    </div>
  );
}

export type { Alert };
