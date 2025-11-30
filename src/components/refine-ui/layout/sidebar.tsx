"use client";

import React, { useMemo, useState } from "react";
import {
  useMenu,
  useLink,
  useRefineOptions,
  useGetIdentity,
  type ITreeMenu,
} from "@refinedev/core";
import type { IUser } from "@/providers/auth";
import {
  SidebarRail as ShadcnSidebarRail,
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarFooter as ShadcnSidebarFooter,
  useSidebar as useShadcnSidebar,
  SidebarTrigger as ShadcnSidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown,
  ListIcon, 
  Users, 
  ShieldCheck, 
  LogOut,
  AlertTriangle,
  DollarSign,
  Clock,
  FileText,
  Shield,
  TrendingUp,
  XCircle,
  CheckCircle,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useLogout } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const toggleRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.role = currentRole === 'admin' ? 'client' : 'admin';
      localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleRole}
      className={cn(
        "h-8 w-8 p-0",
        "hover:bg-slate-700/40",
        "transition-colors"
      )}
      title={`Switch to ${currentRole === 'admin' ? 'Client' : 'Admin'} View`}
    >
      {currentRole === 'admin' ? (
        <ShieldCheck className="h-4 w-4 text-blue-400" />
      ) : (
        <Users className="h-4 w-4 text-slate-400" />
      )}
    </Button>
  );
}

function AdminLogoutButton() {
  const { isAdminAuthenticated, logoutAdmin } = useAdminAuth();
  const { mutate: logout } = useLogout();
  const { open } = useShadcnSidebar();

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    logout();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "h-8 p-0",
            open ? "w-auto px-2" : "w-8",
            "hover:bg-red-950/50",
            "text-amber-400 hover:text-red-400",
            "transition-colors",
            "border border-amber-500/30 hover:border-red-500/50"
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-1.5 text-xs">Logout</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-slate-900 border-slate-700">
        <p className="text-xs">Logout from both admin and frontend</p>
      </TooltipContent>
    </Tooltip>
  );
}

function UserProfileDropdown({ identity }: { identity?: IUser }) {
  const { mutate: logout } = useLogout();

  if (!identity) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return '?';
    let initials = firstName.charAt(0).toUpperCase();
    if (lastName) {
      initials += lastName.charAt(0).toUpperCase();
    }
    return initials;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-10 w-10 p-0 rounded-full",
            "hover:bg-slate-700/40",
            "transition-colors"
          )}
        >
          <Avatar className="h-10 w-10">
            {identity.avatarUrl && <AvatarImage src={identity.avatarUrl} alt={`${identity.firstName} ${identity.lastName}`} />}
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {getInitials(identity.firstName, identity.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-600">
        <div className="p-3 border-b border-slate-700">
          <div className="text-sm font-medium text-slate-200">
            {identity.firstName} {identity.lastName}
          </div>
          <div className="text-xs text-slate-400">{identity.email}</div>
          {identity.jobTitle && (
            <div className="text-xs text-slate-500 mt-1">{identity.jobTitle}</div>
          )}
        </div>
        
        <div className="p-2 space-y-2 border-b border-slate-700">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 py-1">
            Theme Options
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm text-slate-200">Mode</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm text-slate-200">Style</span>
            <ThemeSwitcher />
          </div>
        </div>
        
        <DropdownMenuItem
          onClick={() => logout()}
          className="text-red-400 hover:text-red-300 hover:bg-red-950/50 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Sidebar() {
  const { open } = useShadcnSidebar();
  const { menuItems, selectedKey } = useMenu();
  const { data: identity } = useGetIdentity<IUser>();
  
  const userRole = identity?.role || 'admin';
  
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item: ITreeMenu) => {
      const visibleFor = item.meta?.visibleFor as string[] | undefined;
      if (!visibleFor || visibleFor.length === 0) return true;
      return visibleFor.includes(userRole);
    });
  }, [menuItems, userRole]);

  return (
    <ShadcnSidebar 
      collapsible="icon" 
      className={cn(
        "border-none",
        "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        "relative"
      )}
      style={{
        background: 'linear-gradient(to bottom, rgb(2, 6, 23) 0%, rgb(15, 23, 42) 50%, rgb(2, 6, 23) 100%)',
      } as React.CSSProperties}
    >
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          "transition-discrete",
          "duration-200",
          "flex",
          "flex-col",
          "gap-0",
          "pt-6",
          "pb-1",
          "border-r-2",
          "border-slate-700/70",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.05)]",
          {
            "px-2": open,
            "px-1": !open,
          },
        )}
        style={{
          background: [
            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(51, 65, 85, 0.06) 2px, rgba(51, 65, 85, 0.06) 4px)',
            'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(30, 41, 59, 0.06) 2px, rgba(30, 41, 59, 0.06) 4px)',
            'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 25%, rgba(51,65,85,0.95) 50%, rgba(30,41,59,0.95) 75%, rgba(15,23,42,0.95) 100%)'
          ].join(', ')
        } as React.CSSProperties}
      >
        {(() => {
          let lastTier = 0;
          return filteredMenuItems.map((item: ITreeMenu) => {
            const currentTier = (item.meta?.tier as number) || 1;
            const needsSeparator = lastTier !== 0 && currentTier !== lastTier;
            lastTier = currentTier;
            
            return (
              <React.Fragment key={item.key || item.name}>
                {needsSeparator && <TierSeparator />}
                <SidebarItem
                  item={item}
                  selectedKey={selectedKey}
                />
              </React.Fragment>
            );
          });
        })()}
      </ShadcnSidebarContent>
      <ShadcnSidebarFooter
        className={cn(
          "border-t-2",
          "border-slate-700/70",
          "p-2",
          "flex",
          "items-center",
          "justify-between",
          "gap-2"
        )}
      >
        <div className="flex items-center gap-1">
          <RoleSwitcher currentRole={userRole} />
          <AdminLogoutButton />
        </div>
        <UserProfileDropdown identity={identity} />
      </ShadcnSidebarFooter>
    </ShadcnSidebar>
  );
}

type MenuItemProps = {
  item: ITreeMenu;
  selectedKey?: string;
};

function SidebarItem({ item, selectedKey }: MenuItemProps) {
  const { open } = useShadcnSidebar();

  if (item.meta?.group) {
    return <SidebarItemGroup item={item} selectedKey={selectedKey} />;
  }

  if (item.children && item.children.length > 0) {
    if (open) {
      return <SidebarItemCollapsible item={item} selectedKey={selectedKey} />;
    }
    return <SidebarItemDropdown item={item} selectedKey={selectedKey} />;
  }

  return <SidebarItemLink item={item} selectedKey={selectedKey} />;
}

function SidebarItemGroup({ item, selectedKey }: MenuItemProps) {
  const { children } = item;
  const { open } = useShadcnSidebar();

  return (
    <div className={cn("border-t", "border-slate-700/30", "pt-2", "mt-1.5")}>
      <span
        className={cn(
          "ml-2.5",
          "block",
          "text-[10px]",
          "font-bold",
          "uppercase",
          "tracking-wider",
          "text-slate-400",
          "transition-all",
          "duration-200",
          {
            "h-6": open,
            "h-0": !open,
            "opacity-0": !open,
            "opacity-100": open,
            "pointer-events-none": !open,
            "pointer-events-auto": open,
          },
        )}
      >
        {getDisplayName(item)}
      </span>
      {children && children.length > 0 && (
        <div className={cn("flex", "flex-col")}>
          {children.map((child: ITreeMenu) => (
            <SidebarItem
              key={child.key || child.name}
              item={child}
              selectedKey={selectedKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItemCollapsible({ item, selectedKey }: MenuItemProps) {
  const { name, children } = item;

  const chevronIcon = (
    <ChevronRight
      className={cn(
        "h-4",
        "w-4",
        "shrink-0",
        "text-muted-foreground",
        "transition-transform",
        "duration-200",
        "group-data-[state=open]:rotate-90",
      )}
    />
  );

  return (
    <Collapsible key={`collapsible-${name}`} className={cn("w-full", "group")}>
      <CollapsibleTrigger asChild>
        <SidebarButton item={item} rightIcon={chevronIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn("ml-4", "flex", "flex-col", "gap-0.5", "py-0.5")}>
        {children?.map((child: ITreeMenu) => (
          <SidebarItem
            key={child.key || child.name}
            item={child}
            selectedKey={selectedKey}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarItemDropdown({ item, selectedKey }: MenuItemProps) {
  const { children } = item;
  const Link = useLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarButton item={item} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        {children?.map((child: ITreeMenu) => {
          const { key: childKey } = child;
          const isSelected = childKey === selectedKey;

          return (
            <DropdownMenuItem key={childKey || child.name} asChild>
              <Link
                to={child.route || ""}
                className={cn("flex w-full items-center gap-2", {
                  "bg-accent text-accent-foreground": isSelected,
                })}
              >
                <ItemIcon
                  icon={child.meta?.icon ?? child.icon}
                  isSelected={isSelected}
                />
                <span>{getDisplayName(child)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarItemLink({ item, selectedKey }: MenuItemProps) {
  const isSelected = item.key === selectedKey;

  return <SidebarButton item={item} isSelected={isSelected} asLink={true} />;
}

function TierSeparator() {
  return (
    <hr 
      className={cn(
        "my-2",
        "mx-2",
        "border-t",
        "border-slate-700",
        "opacity-60"
      )} 
    />
  );
}

TierSeparator.displayName = "TierSeparator";

function SidebarHeader() {
  const { title } = useRefineOptions();
  const { open, isMobile } = useShadcnSidebar();
  const Link = useLink();

  return (
    <ShadcnSidebarHeader
      className={cn(
        "p-0",
        "h-14",
        "border-b-2",
        "border-slate-700/70",
        "flex-row",
        "items-center",
        "justify-between",
        "overflow-hidden",
        "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950",
        "shadow-lg shadow-black/40",
        "relative",
        "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_0%,rgba(148,163,184,0.1)_50%,transparent_100%)]",
      )}
    >
      <Link
        to="/dashboard"
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-between",
          "w-full",
          "gap-2",
          "transition-discrete",
          "duration-200",
          "cursor-pointer",
          "hover:bg-slate-800/50",
          "group",
          {
            "pl-3": !open,
            "pl-5": open,
          },
        )}
      >
        <div className="flex items-center gap-2">
          <div>{title.icon}</div>
          {title.text && (
            <h2
              className={cn(
                "text-sm",
                "font-bold",
                "transition-opacity",
                "duration-200",
                "text-slate-100",
                "tracking-wide",
                {
                  "opacity-0": !open,
                  "opacity-100": open,
                },
              )}
            >
              {title.text}
            </h2>
          )}
        </div>
        {open && (
          <div 
            className={cn(
              "pr-4",
              "text-[10px]",
              "font-bold",
              "tracking-[0.15em]",
              "uppercase",
              "text-transparent",
              "bg-clip-text",
              "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500",
              "opacity-70",
              "group-hover:opacity-100",
              "transition-opacity",
              "duration-200",
              "select-none",
              "[text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%),_-1px_-1px_1px_rgb(255_255_255_/_10%)]"
            )}
            style={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4), -1px -1px 1px rgba(255, 255, 255, 0.1)',
              filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))'
            } as React.CSSProperties}
          >
            VELOCITY
          </div>
        )}
      </Link>

      <ShadcnSidebarTrigger
        className={cn(
          "text-slate-400 hover:text-white transition-colors",
          "mr-1.5",
          "hover:bg-slate-800/50 rounded-md p-1"
        )}
      />
    </ShadcnSidebarHeader>
  );
}

function getDisplayName(item: ITreeMenu) {
  return item.meta?.label ?? item.label ?? item.name;
}

type IconProps = {
  icon: React.ReactNode;
  isSelected?: boolean;
};

function ItemIcon({ icon, isSelected }: IconProps) {
  return (
    <div
      className={cn("w-4 transition-colors duration-200", {
        "text-cyan-400": !isSelected,
        "text-cyan-300": isSelected,
      })}
    >
      {icon ?? <ListIcon />}
    </div>
  );
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
  item: ITreeMenu;
  isSelected?: boolean;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  onClick?: () => void;
};

function SidebarButton({
  item,
  isSelected = false,
  rightIcon,
  asLink = false,
  className,
  onClick,
  ...props
}: SidebarButtonProps) {
  const Link = useLink();
  const { open } = useShadcnSidebar();
  const fullLabel = item.meta?.fullLabel as string | undefined;
  const showTooltip = fullLabel && open;

  const buttonContent = (
    <>
      <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
      <span
        className={cn("tracking-[-0.00875rem] transition-colors duration-200", {
          "flex-1": rightIcon,
          "text-left": rightIcon,
          "line-clamp-1": !rightIcon,
          truncate: !rightIcon,
          "font-normal": !isSelected,
          "font-semibold": isSelected,
          "text-slate-50": isSelected,
          "text-slate-300": !isSelected,
        })}
      >
        {getDisplayName(item)}
      </span>
      {rightIcon}
    </>
  );

  const button = (
    <Button
      asChild={!!(asLink && item.route)}
      variant="ghost"
      size="sm"
      className={cn(
        "flex w-full items-center justify-start gap-2 py-1.5 !px-2.5 text-sm h-8 transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/30",
        "hover:border-l-2 hover:border-l-blue-400/60 hover:shadow-md hover:shadow-blue-500/10",
        "rounded-md backdrop-blur-sm",
        "border-l-2 border-l-transparent",
        {
          "bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-transparent !border-l-blue-400 shadow-lg shadow-blue-500/30": isSelected,
          "hover:!bg-gradient-to-r hover:from-blue-600/40 hover:via-blue-500/30": isSelected,
          "text-slate-50 font-medium": isSelected,
          "hover:text-slate-100": isSelected,
          "text-slate-300 hover:text-slate-200": !isSelected,
        },
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {asLink && item.route ? (
        <Link to={item.route} className={cn("flex w-full items-center gap-2")}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </Button>
  );

  if (showTooltip) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-600">
            <p className="text-sm font-medium">{fullLabel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

Sidebar.displayName = "Sidebar";

interface SidebarAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'budget' | 'timecard' | 'contractor' | 'po' | 'invoice' | 'compliance';
  title: string;
  message: string;
  value?: string;
  route?: string;
}

const sidebarAlerts: SidebarAlert[] = [
  {
    id: 'budget-1',
    type: 'critical',
    category: 'budget',
    title: 'Budget Overrun',
    message: 'Q4 Engineering budget exceeded by 12%',
    value: '$47,500 over',
    route: '/triage/budget-overrun'
  },
  {
    id: 'timecard-1',
    type: 'warning',
    category: 'timecard',
    title: 'Pending Approvals',
    message: '23 timecards awaiting manager review',
    value: '23 pending',
    route: '/timecards/pending'
  },
  {
    id: 'compliance-1',
    type: 'critical',
    category: 'compliance',
    title: 'Compliance Alert',
    message: '5 contractors missing required certifications',
    value: '5 non-compliant',
    route: '/statementofworks/compliance-report'
  },
  {
    id: 'po-1',
    type: 'warning',
    category: 'po',
    title: 'PO Expiring',
    message: '3 purchase orders expire within 7 days',
    value: '3 expiring',
    route: '/purchaseorders'
  },
  {
    id: 'invoice-1',
    type: 'info',
    category: 'invoice',
    title: 'Invoices Ready',
    message: '12 invoices ready for batch processing',
    value: '$156K total',
    route: '/invoices'
  },
  {
    id: 'contractor-1',
    type: 'success',
    category: 'contractor',
    title: 'Onboarding Complete',
    message: '8 contractors completed onboarding this week',
    value: '8 active',
    route: '/contractors'
  }
];

function SidebarAlertCubes() {
  const { open } = useShadcnSidebar();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const typeConfig = {
    critical: {
      bg: 'bg-slate-800/60',
      border: 'border-red-500/40',
      glow: 'shadow-[inset_0_0_8px_rgba(239,68,68,0.15)]',
      cornerColor: 'bg-red-500',
      iconColor: 'text-red-400',
      textColor: 'text-red-300',
      icon: <XCircle className="h-3 w-3" />,
      badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    warning: {
      bg: 'bg-slate-800/60',
      border: 'border-amber-500/40',
      glow: 'shadow-[inset_0_0_8px_rgba(245,158,11,0.15)]',
      cornerColor: 'bg-amber-500',
      iconColor: 'text-amber-400',
      textColor: 'text-amber-300',
      icon: <AlertTriangle className="h-3 w-3" />,
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    info: {
      bg: 'bg-slate-800/60',
      border: 'border-cyan-500/40',
      glow: 'shadow-[inset_0_0_8px_rgba(6,182,212,0.15)]',
      cornerColor: 'bg-cyan-500',
      iconColor: 'text-cyan-400',
      textColor: 'text-cyan-300',
      icon: <Clock className="h-3 w-3" />,
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    success: {
      bg: 'bg-slate-800/60',
      border: 'border-emerald-500/40',
      glow: 'shadow-[inset_0_0_8px_rgba(16,185,129,0.15)]',
      cornerColor: 'bg-emerald-500',
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-300',
      icon: <CheckCircle className="h-3 w-3" />,
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }
  };

  const categoryIcons = {
    budget: <DollarSign className="h-4 w-4" />,
    timecard: <Clock className="h-4 w-4" />,
    contractor: <Users className="h-4 w-4" />,
    po: <FileText className="h-4 w-4" />,
    invoice: <TrendingUp className="h-4 w-4" />,
    compliance: <Shield className="h-4 w-4" />
  };

  const criticalCount = sidebarAlerts.filter(a => a.type === 'critical').length;
  const warningCount = sidebarAlerts.filter(a => a.type === 'warning').length;
  const totalCount = sidebarAlerts.length;

  const handleCubeClick = (alert: SidebarAlert) => {
    if (alert.route) {
      navigate(alert.route);
    }
  };

  if (!open) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                "mx-auto my-2 relative cursor-pointer",
                "w-8 h-8 rounded-lg",
                "bg-gradient-to-br from-slate-700/80 to-slate-800/80",
                "border border-slate-600/50",
                "flex items-center justify-center",
                "hover:from-slate-600/80 hover:to-slate-700/80",
                "transition-all duration-200",
                "shadow-lg shadow-black/30"
              )}
              onClick={() => navigate('/alerts')}
            >
              <Bell className="h-4 w-4 text-slate-300" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                  {criticalCount}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 border-slate-600">
            <p className="text-sm font-medium text-slate-100">{totalCount} Active Alerts</p>
            <p className="text-xs text-slate-400">{criticalCount} Critical • {warningCount} Warning</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div
      className={cn(
        "mx-2 mt-auto mb-2",
        "rounded-lg",
        "border border-slate-600/50",
        "overflow-hidden",
        "shadow-lg shadow-black/40"
      )}
      style={{
        background: [
          'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(51, 65, 85, 0.08) 1px, rgba(51, 65, 85, 0.08) 2px)',
          'repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(30, 41, 59, 0.08) 1px, rgba(30, 41, 59, 0.08) 2px)',
          'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 50%, rgba(15,23,42,0.98) 100%)'
        ].join(', ')
      } as React.CSSProperties}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full px-3 py-2",
              "flex items-center justify-between",
              "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60",
              "border-b border-slate-600/40",
              "hover:from-slate-700/60 hover:via-slate-600/40 hover:to-slate-700/60",
              "transition-all duration-200",
              "group"
            )}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                Alerts
              </span>
              <div className="flex gap-1">
                {criticalCount > 0 && (
                  <Badge className="h-4 px-1.5 text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                    {criticalCount}
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="h-4 px-1.5 text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {warningCount}
                  </Badge>
                )}
              </div>
            </div>
            <ChevronDown 
              className={cn(
                "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                isExpanded ? "rotate-0" : "-rotate-90"
              )} 
            />
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-1.5">
              {sidebarAlerts.map((alert) => {
                const config = typeConfig[alert.type];
                const categoryIcon = categoryIcons[alert.category];
                
                return (
                  <TooltipProvider key={alert.id} delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => handleCubeClick(alert)}
                          className={cn(
                            "relative w-full aspect-square max-w-[40px] min-h-[40px]",
                            "rounded-lg cursor-pointer",
                            config.bg,
                            "border",
                            config.border,
                            config.glow,
                            "hover:scale-105",
                            "transition-all duration-200",
                            "flex items-center justify-center",
                            "group/cube",
                            "overflow-hidden"
                          )}
                        >
                          {/* Corner indicators */}
                          <div className={cn("absolute top-0 left-0 w-1.5 h-1.5 rounded-br", config.cornerColor, "opacity-80")} />
                          <div className={cn("absolute top-0 right-0 w-1.5 h-1.5 rounded-bl", config.cornerColor, "opacity-80")} />
                          <div className={cn("absolute bottom-0 left-0 w-1.5 h-1.5 rounded-tr", config.cornerColor, "opacity-80")} />
                          <div className={cn("absolute bottom-0 right-0 w-1.5 h-1.5 rounded-tl", config.cornerColor, "opacity-80")} />
                          
                          {/* Main icon */}
                          <div className={cn(config.iconColor, "group-hover/cube:opacity-100 opacity-80 transition-opacity")}>
                            {categoryIcon}
                          </div>
                          
                          {/* Status icon in top right */}
                          <div className={cn("absolute top-1 right-1", config.iconColor, "opacity-70")}>
                            {config.icon}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        className="max-w-[200px] p-0 bg-slate-900 border-slate-700 overflow-hidden"
                        sideOffset={8}
                      >
                        <div className={cn("px-3 py-2 border-b border-slate-700/50", config.bg)}>
                          <p className={cn("text-xs font-bold", config.textColor)}>{alert.title}</p>
                        </div>
                        <div className="p-2 space-y-1.5">
                          <p className="text-xs text-slate-400">{alert.message}</p>
                          {alert.value && (
                            <p className={cn("text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block border", config.badge)}>
                              {alert.value}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

SidebarAlertCubes.displayName = "SidebarAlertCubes";
