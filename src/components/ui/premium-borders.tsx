import * as React from "react";
import { cn } from "@/lib/utils";

export type BorderVariant = 
  | "standard"
  | "glow"
  | "neon"
  | "gradient"
  | "metallic"
  | "glass"
  | "frosted"
  | "carbon"
  | "holographic"
  | "pulse"
  | "scan"
  | "circuit"
  | "damascus"
  | "luxury"
  | "cyber";

export type BorderColor = "cyan" | "emerald" | "amber" | "red" | "violet" | "blue" | "slate";

interface PremiumBorderProps {
  variant?: BorderVariant;
  color?: BorderColor;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button" | "card";
}

const colorMap: Record<BorderColor, { primary: string; secondary: string; glow: string }> = {
  cyan: { primary: "#06b6d4", secondary: "#22d3ee", glow: "rgba(6, 182, 212, 0.5)" },
  emerald: { primary: "#10b981", secondary: "#34d399", glow: "rgba(16, 185, 129, 0.5)" },
  amber: { primary: "#f59e0b", secondary: "#fbbf24", glow: "rgba(245, 158, 11, 0.5)" },
  red: { primary: "#ef4444", secondary: "#f87171", glow: "rgba(239, 68, 68, 0.5)" },
  violet: { primary: "#8b5cf6", secondary: "#a78bfa", glow: "rgba(139, 92, 246, 0.5)" },
  blue: { primary: "#3b82f6", secondary: "#60a5fa", glow: "rgba(59, 130, 246, 0.5)" },
  slate: { primary: "#64748b", secondary: "#94a3b8", glow: "rgba(100, 116, 139, 0.3)" },
};

export function PremiumBorder({
  variant = "standard",
  color = "cyan",
  children,
  className,
  onClick,
  as = "div",
}: PremiumBorderProps) {
  const colors = colorMap[color];
  
  const getVariantStyles = (): { outer: string; inner: React.CSSProperties } => {
    switch (variant) {
      case "glow":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            boxShadow: `0 0 20px ${colors.glow}, inset 0 0 20px rgba(0,0,0,0.5)`,
          },
        };
      case "neon":
        return {
          outer: "relative animate-neon-flicker",
          inner: {
            border: `2px solid ${colors.secondary}`,
            boxShadow: `0 0 10px ${colors.primary}, 0 0 20px ${colors.primary}, 0 0 40px ${colors.glow}, inset 0 0 15px rgba(0,0,0,0.8)`,
          },
        };
      case "gradient":
        return {
          outer: "relative p-[2px] bg-gradient-to-r rounded-lg",
          inner: {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
            padding: "2px",
            borderRadius: "0.5rem",
          },
        };
      case "metallic":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)`,
          },
        };
      case "glass":
        return {
          outer: "relative backdrop-blur-sm",
          inner: {
            border: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.3)",
          },
        };
      case "frosted":
        return {
          outer: "relative backdrop-blur-md",
          inner: {
            border: "1px solid rgba(255,255,255,0.15)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4)",
          },
        };
      case "carbon":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.3)",
          },
        };
      case "holographic":
        return {
          outer: "relative",
          inner: {
            border: "2px solid transparent",
            background: `linear-gradient(#0f172a, #0f172a) padding-box,
                        linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #10b981) border-box`,
            backgroundSize: "100% 100%, 200% 100%",
            animation: "holographic-border 3s linear infinite",
          },
        };
      case "pulse":
        return {
          outer: "relative animate-border-pulse",
          inner: {
            border: `2px solid ${colors.primary}`,
            boxShadow: `0 0 15px ${colors.glow}`,
          },
        };
      case "scan":
        return {
          outer: "relative overflow-hidden",
          inner: {
            border: `1px solid ${colors.primary}`,
            boxShadow: `inset 0 0 20px rgba(0,0,0,0.5)`,
          },
        };
      case "circuit":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            backgroundImage: `
              linear-gradient(90deg, ${colors.primary}22 1px, transparent 1px),
              linear-gradient(${colors.primary}22 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            boxShadow: `0 0 20px ${colors.glow}`,
          },
        };
      case "damascus":
        return {
          outer: "relative",
          inner: {
            border: "1px solid rgba(148, 163, 184, 0.3)",
            background: `
              repeating-linear-gradient(
                45deg,
                rgba(100, 116, 139, 0.05) 0px,
                rgba(100, 116, 139, 0.05) 2px,
                transparent 2px,
                transparent 4px
              ),
              repeating-linear-gradient(
                -45deg,
                rgba(148, 163, 184, 0.03) 0px,
                rgba(148, 163, 184, 0.03) 2px,
                transparent 2px,
                transparent 4px
              ),
              linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))
            `,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.4)",
          },
        };
      case "luxury":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            background: `
              linear-gradient(135deg, rgba(255,215,0,0.05) 0%, transparent 50%, rgba(255,215,0,0.03) 100%),
              linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 30%, rgba(0,0,0,0.2) 100%)
            `,
            boxShadow: `inset 0 1px 0 rgba(255,215,0,0.1), 0 4px 20px rgba(0,0,0,0.5), 0 0 1px ${colors.primary}`,
          },
        };
      case "cyber":
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}`,
            background: `
              linear-gradient(90deg, transparent 0%, ${colors.primary}11 50%, transparent 100%),
              linear-gradient(180deg, ${colors.primary}22 0%, transparent 2px, transparent 100%)
            `,
            boxShadow: `0 0 30px ${colors.glow}, inset 0 1px 0 ${colors.primary}44`,
            clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
          },
        };
      default:
        return {
          outer: "relative",
          inner: {
            border: `1px solid ${colors.primary}33`,
          },
        };
    }
  };

  const { outer, inner } = getVariantStyles();
  const Component = as === "button" ? "button" : "div";

  const content = (
    <Component
      className={cn(
        "rounded-lg bg-slate-900/90 transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      style={inner}
      onClick={onClick}
    >
      {variant === "scan" && (
        <div 
          className="absolute inset-0 animate-scan-line pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${colors.glow} 50%, transparent 100%)`,
            height: "4px",
          }}
        />
      )}
      {children}
    </Component>
  );

  if (variant === "gradient") {
    return (
      <div className={outer} style={inner}>
        <div className="bg-slate-900 rounded-lg">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={outer}>
      {content}
    </div>
  );
}

export function PremiumButton({
  variant = "glow",
  color = "cyan",
  children,
  className,
  onClick,
}: Omit<PremiumBorderProps, "as">) {
  return (
    <PremiumBorder
      variant={variant}
      color={color}
      className={cn("px-4 py-2 text-sm font-medium", className)}
      onClick={onClick}
      as="button"
    >
      {children}
    </PremiumBorder>
  );
}

export default PremiumBorder;
