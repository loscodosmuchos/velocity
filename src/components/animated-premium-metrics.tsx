import React from 'react';

/**
 * Premium Animated Metrics Card
 * Solarwinds-inspired: lightweight CSS animations, elegant motion, zero performance impact
 */
export const AnimatedMetricCard = ({ 
  icon: Icon,
  label, 
  value, 
  subtitle,
  color = 'cyan'
}: {
  icon: any;
  label: string;
  value: string | number;
  subtitle: string;
  color?: 'cyan' | 'amber' | 'red' | 'emerald' | 'slate';
}) => {
  const colorMap = {
    cyan: { border: 'border-cyan-700/50', bg: 'rgba(6, 182, 212, 0.08)', icon: 'text-cyan-400', accent: 'from-cyan-500 to-blue-600' },
    amber: { border: 'border-amber-700/30', bg: 'rgba(120, 53, 15, 0.08)', icon: 'text-amber-400', accent: 'from-amber-500 to-orange-600' },
    red: { border: 'border-red-700/30', bg: 'rgba(127, 29, 29, 0.08)', icon: 'text-red-400', accent: 'from-red-500 to-rose-600' },
    emerald: { border: 'border-emerald-700/30', bg: 'rgba(6, 78, 59, 0.08)', icon: 'text-emerald-400', accent: 'from-emerald-500 to-green-600' },
    slate: { border: 'border-slate-700/50', bg: 'rgba(15, 23, 42, 0.6)', icon: 'text-slate-400', accent: 'from-slate-400 to-slate-600' },
  };

  const c = colorMap[color];

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
        }
        @keyframes icon-rotate {
          0%, 100% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .metric-card-animate {
          animation: float 3s ease-in-out infinite;
        }
        .metric-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .metric-icon-gentle {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      
      <div 
      className={`rounded-lg border ${c.border} p-5 relative overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer metric-card-animate`}
      style={{ background: c.bg }}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Floating background glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top-right, ${color === 'cyan' ? '#06b6d4' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#10b981'} 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        {/* Left: Label & Value */}
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
          <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        </div>

        {/* Right: Icon with gentle animation */}
        <div 
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${c.icon} metric-icon-gentle`}
          style={{
            background: `linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`,
            border: `1px solid ${color === 'cyan' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(100, 116, 139, 0.2)'}`,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

        {/* Bottom accent line - animated */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </>
  );
};

/**
 * Animated Data Flow Indicator
 * Shows real-time metric flow with lightweight animation
 */
export const AnimatedDataFlow = ({ direction = 'up' }: { direction?: 'up' | 'down' }) => {
  return (
    <style>{`
      @keyframes flow-up {
        0% { transform: translateY(8px); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-8px); opacity: 0; }
      }
      @keyframes flow-down {
        0% { transform: translateY(-8px); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(8px); opacity: 0; }
      }
      .flow-indicator {
        animation: ${direction === 'up' ? 'flow-up' : 'flow-down'} 1.5s ease-in-out infinite;
      }
    `}</style>
  );
};

/**
 * Premium Animated Badge
 * Lightweight pulse effect for alerts/notifications
 */
export const AnimatedBadge = ({ 
  children, 
  variant = 'critical',
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'critical' | 'warning' | 'info' | 'success';
  className?: string;
}) => {
  const variants = {
    critical: 'bg-red-500/20 text-red-400 border-red-700/50',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-700/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-700/50',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-700/30',
  };

  return (
    <style>{`
      @keyframes pulse-subtle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      .badge-pulse {
        animation: pulse-subtle 2s ease-in-out infinite;
      }
    `}</style>
  );
};

/**
 * Luxury Gauge Display
 * Circular animated gauge with smooth transitions
 */
export const LuxuryGauge = ({ 
  value, 
  max = 100,
  color = 'cyan'
}: {
  value: number;
  max?: number;
  color?: 'cyan' | 'amber' | 'red' | 'emerald';
}) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    cyan: '#06b6d4',
    amber: '#f59e0b',
    red: '#ef4444',
    emerald: '#10b981',
  };

  return (
    <style>{`
      @keyframes gauge-fill {
        from { stroke-dashoffset: ${circumference}; }
        to { stroke-dashoffset: ${offset}; }
      }
      .gauge-circle {
        animation: gauge-fill 1.5s ease-out;
      }
    `}</style>
  );
};

/**
 * Animated Status Indicator Ring
 * Ultra-lightweight pulse for live metrics
 */
export const AnimatedStatusRing = ({ 
  status = 'active',
  size = 'md'
}: {
  status?: 'active' | 'warning' | 'critical' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeMap = { sm: 'h-2 w-2', md: 'h-3 w-3', lg: 'h-4 w-4' };
  const statusMap = {
    active: 'bg-emerald-500 shadow-emerald-500/50',
    warning: 'bg-amber-500 shadow-amber-500/50',
    critical: 'bg-red-500 shadow-red-500/50',
    inactive: 'bg-slate-600 shadow-slate-600/30',
  };

  return (
    <style>{`
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 currentColor; }
        70% { box-shadow: 0 0 0 6px rgba(0, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
      }
      .status-pulse {
        animation: pulse-ring 2s infinite;
      }
    `}</style>
  );
};

/**
 * Elegant Data Transition Animation
 * Smooth number counter with elegant easing
 */
export const AnimatedCounter = ({ 
  value, 
  prefix = '', 
  suffix = '' 
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    if (typeof value === 'number' && typeof displayValue === 'number') {
      const duration = 800;
      const start = displayValue;
      const end = value;
      const diff = end - start;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        setDisplayValue(Math.round(start + diff * easeOutQuad));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <>{prefix}{displayValue}{suffix}</>
  );
};
