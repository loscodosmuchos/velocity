import { useMemo } from "react";

interface IsometricBarData {
  name: string;
  value: number;
  maxValue: number;
  color: string;
  shadowColor: string;
  highlightColor: string;
}

interface IsometricBarChartProps {
  data: IsometricBarData[];
  height?: number;
  barWidth?: number;
  gap?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animate?: boolean;
}

export function IsometricBarChart({
  data,
  height = 280,
  barWidth = 45,
  gap = 20,
  showLabels = true,
  showValues = true,
  animate = true,
}: IsometricBarChartProps) {
  // Guard against empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
        No data available
      </div>
    );
  }

  const maxValue = useMemo(() => {
    const values = data.map(d => d.maxValue || d.value || 0).filter(v => !isNaN(v) && v > 0);
    return values.length > 0 ? Math.max(...values) : 1; // Default to 1 to avoid division by zero
  }, [data]);
  
  const chartWidth = (barWidth + gap) * data.length + 60;
  const maxBarHeight = height - 80;
  const skewAngle = 12;
  const depthOffset = 18;

  return (
    <div className="relative w-full overflow-hidden">
      <svg 
        viewBox={`0 0 ${chartWidth} ${height}`} 
        className="w-full h-auto"
        style={{ minHeight: height }}
      >
        <defs>
          {data.map((item, i) => (
            <linearGradient key={`grad-front-${i}`} id={`frontGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={item.highlightColor} stopOpacity={1} />
              <stop offset="30%" stopColor={item.color} stopOpacity={1} />
              <stop offset="100%" stopColor={item.shadowColor} stopOpacity={0.9} />
            </linearGradient>
          ))}
          {data.map((item, i) => (
            <linearGradient key={`grad-side-${i}`} id={`sideGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={item.shadowColor} stopOpacity={0.95} />
              <stop offset="100%" stopColor={item.shadowColor} stopOpacity={0.6} />
            </linearGradient>
          ))}
          {data.map((item, i) => (
            <linearGradient key={`grad-top-${i}`} id={`topGrad${i}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
              <stop offset="50%" stopColor={item.highlightColor} stopOpacity={1} />
              <stop offset="100%" stopColor={item.highlightColor} stopOpacity={0.8} />
            </linearGradient>
          ))}
          <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.4)" />
          </filter>
          <filter id="glowEffect">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="gridTexture" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="transparent"/>
            <rect width="1" height="1" fill="rgba(255,255,255,0.03)"/>
          </pattern>
        </defs>

        <rect x="0" y="0" width={chartWidth} height={height} fill="transparent" />

        {data.map((item, index) => {
          const safeValue = item.value || 0;
          const rawBarHeight = maxValue > 0 ? (safeValue / maxValue) * maxBarHeight : 0;
          const barHeight = isNaN(rawBarHeight) ? 0 : Math.max(0, rawBarHeight);
          const x = 40 + index * (barWidth + gap);
          const y = height - 50 - barHeight;
          
          const tiltFactor = maxBarHeight > 0 ? (barHeight / maxBarHeight) * 2 : 0;
          const topOffset = isNaN(tiltFactor) ? 0 : tiltFactor;

          return (
            <g 
              key={item.name} 
              filter="url(#barShadow)"
              className={animate ? "animate-in slide-in-from-bottom-4 fade-in" : ""}
              style={{ 
                animationDelay: animate ? `${index * 100}ms` : undefined,
                animationDuration: animate ? "0.6s" : undefined,
              }}
            >
              <polygon
                points={`
                  ${x + barWidth},${y + barHeight}
                  ${x + barWidth + depthOffset},${y + barHeight - depthOffset/2}
                  ${x + barWidth + depthOffset},${y - topOffset - depthOffset/2}
                  ${x + barWidth},${y - topOffset}
                `}
                fill={`url(#sideGrad${index})`}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.5"
              />

              <rect
                x={x}
                y={y - topOffset}
                width={barWidth}
                height={barHeight + topOffset}
                fill={`url(#frontGrad${index})`}
                rx="2"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
              
              <rect
                x={x}
                y={y - topOffset}
                width={barWidth}
                height={barHeight + topOffset}
                fill="url(#gridTexture)"
                rx="2"
                opacity="0.5"
              />

              <polygon
                points={`
                  ${x},${y - topOffset}
                  ${x + depthOffset},${y - topOffset - depthOffset/2}
                  ${x + barWidth + depthOffset},${y - topOffset - depthOffset/2}
                  ${x + barWidth},${y - topOffset}
                `}
                fill={`url(#topGrad${index})`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                filter="url(#glowEffect)"
              />

              {[0.2, 0.4, 0.6, 0.8].map((fraction, lineIdx) => {
                const lineY = y - topOffset + barHeight * fraction;
                return (
                  <line
                    key={lineIdx}
                    x1={x + 2}
                    y1={lineY}
                    x2={x + barWidth - 2}
                    y2={lineY}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="0.5"
                  />
                );
              })}

              <rect
                x={x + 3}
                y={y - topOffset + 2}
                width={3}
                height={Math.min(barHeight * 0.6, 60)}
                fill="rgba(255,255,255,0.2)"
                rx="1"
              />

              {showValues && (
                <text
                  x={x + barWidth / 2 + depthOffset / 2}
                  y={y - topOffset - depthOffset - 8}
                  textAnchor="middle"
                  className="fill-slate-200 text-[10px] font-semibold"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  ${((item.value || 0) / 1000).toFixed(0)}k
                </text>
              )}

              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height - 28}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-medium"
                  transform={`rotate(-15, ${x + barWidth / 2}, ${height - 28})`}
                >
                  {item.name}
                </text>
              )}
            </g>
          );
        })}

        <line 
          x1="35" 
          y1={height - 50} 
          x2={chartWidth - 20} 
          y2={height - 50} 
          stroke="rgba(100,116,139,0.4)" 
          strokeWidth="1"
        />
        <line 
          x1="35" 
          y1="20" 
          x2="35" 
          y2={height - 50} 
          stroke="rgba(100,116,139,0.3)" 
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      </svg>
    </div>
  );
}

export function DepartmentBudgetSkyscrapers({ 
  departmentSpend,
  onNavigate 
}: { 
  departmentSpend: Array<{
    name: string;
    budget: number;
    spent: number;
    status: string;
  }>;
  onNavigate?: (path: string) => void;
}) {
  const colorSchemes = {
    good: {
      color: "#06b6d4",
      highlightColor: "#22d3ee", 
      shadowColor: "#0891b2"
    },
    warning: {
      color: "#f59e0b",
      highlightColor: "#fbbf24",
      shadowColor: "#d97706"
    },
    critical: {
      color: "#ef4444",
      highlightColor: "#f87171",
      shadowColor: "#dc2626"
    }
  };

  const chartData = departmentSpend.slice(0, 6).map(dept => {
    const statusKey = dept.status as keyof typeof colorSchemes;
    const colors = colorSchemes[statusKey] || colorSchemes.good;
    return {
      name: dept.name.length > 8 ? dept.name.substring(0, 8) + "..." : dept.name,
      value: dept.spent,
      maxValue: dept.budget,
      ...colors
    };
  });

  return (
    <div 
      className="cursor-pointer group"
      onClick={() => onNavigate?.("/analytics-hub")}
    >
      <div className="rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm relative"
        style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-12 -left-12 w-24 h-24 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="border-b border-slate-700/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">Department Budget Analysis</h3>
                <p className="text-slate-400 text-xs">3D Spend Visualization</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
              <svg className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-2">
          <IsometricBarChart 
            data={chartData}
            height={120}
            barWidth={24}
            gap={8}
            showValues={false}
          />
        </div>

        <div className="px-5 pb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-b from-cyan-400 to-cyan-600" />
              <span className="text-slate-400">On Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600" />
              <span className="text-slate-400">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-b from-red-400 to-red-600" />
              <span className="text-slate-400">Critical</span>
            </div>
          </div>
          <span className="text-slate-500">Click to explore</span>
        </div>
      </div>
    </div>
  );
}
