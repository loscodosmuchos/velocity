import { 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Bell,
  FileText,
  Users,
  Zap,
  AlertCircle,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  Receipt,
  Calendar,
  BarChart3
} from 'lucide-react';
import { 
  AlertIconConfig, 
  AlertIconRegistryEntry, 
  SEVERITY_THEMES, 
  AlertSeverity, 
  AlertCategory 
} from './types';

const ICON_MAP: Record<string, any> = {
  AlertTriangle, DollarSign, Clock, CheckCircle, Shield, TrendingUp, Bell,
  FileText, Users, Zap, AlertCircle, Target, Brain, Lightbulb, Sparkles,
  Receipt, Calendar, BarChart3
};

class AlertIconRegistry {
  private registry: Map<string, AlertIconRegistryEntry> = new Map();
  private listeners: Set<(registry: Map<string, AlertIconRegistryEntry>) => void> = new Set();

  constructor() {
    this.initializeDefaultIcons();
  }

  private initializeDefaultIcons() {
    const defaultConfigs: AlertIconConfig[] = [
      {
        id: 'budget-critical',
        name: 'Budget Critical Alert',
        description: 'Alerts when budget exceeds threshold',
        severity: 'critical',
        category: 'budget',
        theme: SEVERITY_THEMES.critical,
        centerIcon: DollarSign,
        corners: {
          'top-right': { enabled: true, icon: AlertTriangle, backgroundColor: 'bg-white/90', textColor: 'text-red-600', pulse: true }
        },
        tooltip: {
          title: 'Budget Critical',
          description: 'Budget has exceeded the critical threshold. Immediate action required.',
          actionLabel: 'view budget details'
        },
        navigation: { path: '/analytics-hub' }
      },
      {
        id: 'budget-warning',
        name: 'Budget Warning Alert',
        description: 'Alerts when budget is approaching threshold',
        severity: 'warning',
        category: 'budget',
        theme: SEVERITY_THEMES.warning,
        centerIcon: DollarSign,
        corners: {
          'top-right': { enabled: true, icon: AlertCircle, backgroundColor: 'bg-white/90', textColor: 'text-amber-600' }
        },
        tooltip: {
          title: 'Budget Warning',
          description: 'Budget is approaching the warning threshold. Monitor closely.',
          actionLabel: 'view budget details'
        },
        navigation: { path: '/analytics-hub' }
      },
      {
        id: 'compliance-alert',
        name: 'Compliance Alert',
        description: 'Alerts for compliance issues',
        severity: 'critical',
        category: 'compliance',
        theme: SEVERITY_THEMES.critical,
        centerIcon: Shield,
        corners: {
          'top-left': { enabled: true, icon: AlertTriangle, backgroundColor: 'bg-white/90', textColor: 'text-red-600', pulse: true }
        },
        tooltip: {
          title: 'Compliance Issue',
          description: 'A compliance violation has been detected. Review immediately.',
          actionLabel: 'view compliance details'
        },
        navigation: { path: '/approvals' }
      },
      {
        id: 'deadline-approaching',
        name: 'Deadline Approaching',
        description: 'Alerts when deadline is near',
        severity: 'warning',
        category: 'deadline',
        theme: SEVERITY_THEMES.warning,
        centerIcon: Clock,
        corners: {
          'top-right': { enabled: true, icon: AlertCircle, backgroundColor: 'bg-white/90', textColor: 'text-amber-600' }
        },
        tooltip: {
          title: 'Deadline Approaching',
          description: 'A deadline is approaching. Take action to ensure completion.',
          actionLabel: 'view deadline details'
        },
        navigation: { path: '/timecards' }
      },
      {
        id: 'approval-required',
        name: 'Approval Required',
        description: 'Alerts when approval is pending',
        severity: 'info',
        category: 'approval',
        theme: SEVERITY_THEMES.info,
        centerIcon: CheckCircle,
        corners: {
          'top-right': { enabled: true, content: '!', backgroundColor: 'bg-blue-100', textColor: 'text-blue-700' }
        },
        tooltip: {
          title: 'Approval Required',
          description: 'An item requires your approval.',
          actionLabel: 'view pending approvals'
        },
        navigation: { path: '/approvals' }
      },
      {
        id: 'performance-insight',
        name: 'Performance Insight',
        description: 'AI-generated performance insight',
        severity: 'info',
        category: 'performance',
        theme: SEVERITY_THEMES.info,
        centerIcon: TrendingUp,
        corners: {
          'top-right': { enabled: true, icon: Brain, backgroundColor: 'bg-purple-100', textColor: 'text-purple-600', pulse: true },
          'top-left': { enabled: true, icon: Sparkles, backgroundColor: 'bg-amber-100', textColor: 'text-amber-600' }
        },
        tooltip: {
          title: 'AI Performance Insight',
          description: 'AI has detected a performance trend worth reviewing.',
          actionLabel: 'view AI insights',
          showTimestamp: true
        },
        navigation: { path: '/ai-insights' }
      },
      {
        id: 'invoice-variance',
        name: 'Invoice Variance Alert',
        description: 'Alerts when invoice has variance',
        severity: 'warning',
        category: 'budget',
        theme: SEVERITY_THEMES.warning,
        centerIcon: Receipt,
        corners: {
          'top-right': { enabled: true, icon: AlertTriangle, backgroundColor: 'bg-white/90', textColor: 'text-amber-600' }
        },
        tooltip: {
          title: 'Invoice Variance',
          description: 'An invoice has variance that exceeds acceptable thresholds.',
          actionLabel: 'view invoice details'
        },
        navigation: { path: '/invoices' }
      },
      {
        id: 'sow-overrun',
        name: 'SOW Budget Overrun',
        description: 'Alerts when SOW exceeds budget',
        severity: 'critical',
        category: 'budget',
        theme: SEVERITY_THEMES.critical,
        centerIcon: FileText,
        corners: {
          'top-right': { enabled: true, icon: AlertTriangle, backgroundColor: 'bg-white/90', textColor: 'text-red-600', pulse: true },
          'bottom-right': { enabled: true, icon: DollarSign, backgroundColor: 'bg-red-100', textColor: 'text-red-700' }
        },
        tooltip: {
          title: 'SOW Budget Overrun',
          description: 'Statement of Work has exceeded its allocated budget.',
          actionLabel: 'view SOW details'
        },
        navigation: { path: '/statement-of-works' }
      },
      {
        id: 'system-success',
        name: 'System All Clear',
        description: 'All systems operating normally',
        severity: 'success',
        category: 'system',
        theme: SEVERITY_THEMES.success,
        centerIcon: CheckCircle,
        corners: {},
        tooltip: {
          title: 'All Systems Nominal',
          description: 'All systems are operating within expected parameters.',
          showTimestamp: true
        },
        clickable: false
      }
    ];

    defaultConfigs.forEach(config => {
      this.registry.set(config.id, {
        config,
        usageCount: 0,
        dashboards: []
      });
    });
  }

  register(config: AlertIconConfig): void {
    if (!config.id) {
      throw new Error('Alert icon config must have an id');
    }
    
    this.registry.set(config.id, {
      config,
      usageCount: 0,
      dashboards: []
    });
    
    this.notifyListeners();
  }

  unregister(id: string): boolean {
    const entry = this.registry.get(id);
    if (entry && entry.dashboards.length > 0) {
      console.warn(`Cannot unregister alert icon "${id}" - still in use by dashboards: ${entry.dashboards.join(', ')}`);
      return false;
    }
    
    const result = this.registry.delete(id);
    if (result) this.notifyListeners();
    return result;
  }

  get(id: string): AlertIconConfig | undefined {
    return this.registry.get(id)?.config;
  }

  getEntry(id: string): AlertIconRegistryEntry | undefined {
    return this.registry.get(id);
  }

  getAll(): AlertIconConfig[] {
    return Array.from(this.registry.values()).map(entry => entry.config);
  }

  getBySeverity(severity: AlertSeverity): AlertIconConfig[] {
    return this.getAll().filter(config => config.severity === severity);
  }

  getByCategory(category: AlertCategory): AlertIconConfig[] {
    return this.getAll().filter(config => config.category === category);
  }

  trackUsage(id: string, dashboardId: string): void {
    const entry = this.registry.get(id);
    if (entry) {
      entry.usageCount++;
      entry.lastUsed = new Date().toISOString();
      if (!entry.dashboards.includes(dashboardId)) {
        entry.dashboards.push(dashboardId);
      }
    }
  }

  untrackUsage(id: string, dashboardId: string): void {
    const entry = this.registry.get(id);
    if (entry) {
      entry.dashboards = entry.dashboards.filter(d => d !== dashboardId);
    }
  }

  subscribe(listener: (registry: Map<string, AlertIconRegistryEntry>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.registry));
  }

  createCustomIcon(
    name: string,
    severity: AlertSeverity,
    category: AlertCategory,
    iconName: string,
    navigation?: { path: string },
    customCorners?: AlertIconConfig['corners']
  ): AlertIconConfig | null {
    const IconComponent = ICON_MAP[iconName];
    
    if (!IconComponent) {
      console.error(`[AlertIconRegistry] Unknown icon name: "${iconName}". Available icons: ${Object.keys(ICON_MAP).join(', ')}`);
      return null;
    }
    
    const config: AlertIconConfig = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      severity,
      category,
      theme: SEVERITY_THEMES[severity],
      centerIcon: IconComponent,
      corners: customCorners || {},
      tooltip: {
        title: name,
        description: `Custom ${category} alert: ${name}`,
        showTimestamp: true
      },
      navigation,
      createdAt: new Date().toISOString()
    };

    this.register(config);
    return config;
  }

  getAvailableIconNames(): string[] {
    return Object.keys(ICON_MAP);
  }

  resolveIcon(iconName: string): any | null {
    return ICON_MAP[iconName] || null;
  }

  exportConfig(): string {
    const configs = this.getAll().map(config => ({
      ...config,
      centerIcon: config.centerIcon.displayName || 'Bell',
      corners: Object.fromEntries(
        Object.entries(config.corners).map(([pos, badge]) => [
          pos,
          badge ? { ...badge, icon: badge.icon?.displayName || undefined } : undefined
        ])
      )
    }));
    return JSON.stringify(configs, null, 2);
  }
}

export const alertIconRegistry = new AlertIconRegistry();
export { ICON_MAP };
