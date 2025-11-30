import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Briefcase, 
  ClipboardList, 
  Package, 
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

export type DashboardRole = 'all' | 'ben' | 'mark' | 'wes' | 'cfo';

interface RoleConfig {
  id: DashboardRole;
  name: string;
  title: string;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  textColor: string;
  glowColor: string;
  description: string;
}

export const roleConfigs: Record<DashboardRole, RoleConfig> = {
  all: {
    id: 'all',
    name: 'Overview',
    title: 'Command Center',
    icon: LayoutGrid,
    gradient: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-500/30',
    hoverBorder: 'hover:border-slate-400/50',
    textColor: 'text-slate-300',
    glowColor: 'shadow-slate-500/20',
    description: 'Full dashboard overview'
  },
  ben: {
    id: 'ben',
    name: 'Project Manager',
    title: 'Project Manager View',
    icon: Briefcase,
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400/50',
    textColor: 'text-cyan-300',
    glowColor: 'shadow-cyan-500/20',
    description: 'Hiring Manager / Project Lead (Client)'
  },
  mark: {
    id: 'mark',
    name: 'PM Consultant',
    title: 'PM Consultant View',
    icon: ClipboardList,
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400/50',
    textColor: 'text-amber-300',
    glowColor: 'shadow-amber-500/20',
    description: 'Project Management Consultant (Staffing Partner)'
  },
  wes: {
    id: 'wes',
    name: 'Procurement Lead',
    title: 'Procurement View',
    icon: Package,
    gradient: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400/50',
    textColor: 'text-purple-300',
    glowColor: 'shadow-purple-500/20',
    description: 'Procurement / Operations (Client)'
  },
  cfo: {
    id: 'cfo',
    name: 'Executive',
    title: 'Executive View',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-400/50',
    textColor: 'text-emerald-300',
    glowColor: 'shadow-emerald-500/20',
    description: 'C-Suite / Executive Leadership (Client)'
  }
};

interface RoleSelectorProps {
  selectedRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  className?: string;
}

export function RoleSelector({ selectedRole, onRoleChange, className }: RoleSelectorProps) {
  const roles: DashboardRole[] = ['all', 'ben', 'mark', 'wes', 'cfo'];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">
        View As:
      </span>
      {roles.map((role) => {
        const config = roleConfigs[role];
        const Icon = config.icon;
        const isSelected = selectedRole === role;

        return (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
              "border backdrop-blur-sm",
              isSelected ? [
                "bg-gradient-to-r",
                config.gradient,
                "border-transparent",
                "shadow-lg",
                config.glowColor,
                "scale-105"
              ] : [
                "bg-slate-800/60",
                config.borderColor,
                config.hoverBorder,
                "hover:bg-slate-700/60",
                "hover:scale-[1.02]"
              ]
            )}
          >
            {isSelected && (
              <div className="absolute inset-0 rounded-xl opacity-20 bg-white" />
            )}
            <Icon className={cn(
              "h-4 w-4 transition-colors relative z-10",
              isSelected ? "text-white" : config.textColor
            )} />
            <span className={cn(
              "text-sm font-semibold relative z-10",
              isSelected ? "text-white" : config.textColor
            )}>
              {config.name}
            </span>
            {isSelected && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function useRoleSelection(): [DashboardRole, (role: DashboardRole) => void] {
  const [selectedRole, setSelectedRole] = useState<DashboardRole>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboard-role');
      if (stored && ['all', 'ben', 'mark', 'wes', 'cfo'].includes(stored)) {
        return stored as DashboardRole;
      }
    }
    return 'all';
  });

  useEffect(() => {
    localStorage.setItem('dashboard-role', selectedRole);
  }, [selectedRole]);

  return [selectedRole, setSelectedRole];
}
