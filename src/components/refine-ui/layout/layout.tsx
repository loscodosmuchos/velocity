"use client";

import type { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/refine-ui/layout/sidebar";
import { TopNav } from "@/components/refine-ui/layout/top-nav";
import { PageLoadPixel } from "@/components/tracking/PageLoadPixel";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useTexturePreference } from "@/hooks/useTexturePreference";
import { cn } from "@/lib/utils";
import { ScreenCodeOverlay } from "@/components/voice-demo/screen-code-badge";
import { Mic } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const VINessaVoiceButton = () => {
  const handleClick = () => {
    window.open(
      'https://elevenlabs.io/app/talk-to?agent_id=agent_3001k9fxe11yes7v0j4v5y6k3ejp',
      'VINessa',
      'width=420,height=700,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30 border border-emerald-400/30 flex items-center justify-center transition-all hover:scale-105 group"
          aria-label="Talk to VINessa"
        >
          <Mic className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-emerald-500 animate-pulse" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-slate-800 border-slate-700 text-slate-200 max-w-xs">
        <p className="font-medium text-emerald-400">Talk to VINessa</p>
        <p className="text-xs mt-1">Voice assistant for platform questions, features, and navigation help.</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Flexible metal hose / accordion connector effect 
// Creates depth illusion on left edge with industrial bellows aesthetic
const FlexibleConnector = () => (
  <div 
    className="absolute top-0 bottom-0 left-0 w-3 z-[5] pointer-events-none hidden md:block"
    style={{
      background: `
        linear-gradient(90deg, 
          rgba(5, 8, 15, 0.95) 0%,
          rgba(15, 25, 40, 0.8) 30%,
          rgba(25, 40, 60, 0.4) 60%,
          transparent 100%
        ),
        repeating-linear-gradient(
          180deg,
          transparent 0px,
          transparent 4px,
          rgba(50, 70, 100, 0.25) 4px,
          rgba(70, 90, 120, 0.35) 6px,
          rgba(90, 110, 140, 0.3) 8px,
          rgba(70, 90, 120, 0.25) 10px,
          rgba(50, 70, 100, 0.15) 12px,
          transparent 12px,
          transparent 16px
        )
      `,
      boxShadow: `
        inset 2px 0 8px rgba(0, 0, 0, 0.6),
        inset -1px 0 4px rgba(6, 182, 212, 0.05)
      `,
    }}
  >
    {/* Metallic ridge highlights */}
    <div 
      className="absolute inset-0"
      style={{
        background: `
          repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent 6px,
            rgba(140, 160, 190, 0.08) 7px,
            rgba(180, 200, 230, 0.12) 8px,
            rgba(140, 160, 190, 0.06) 9px,
            transparent 10px,
            transparent 16px
          )
        `,
      }}
    />
    {/* Subtle cyan accent line */}
    <div 
      className="absolute top-0 bottom-0 right-0 w-px opacity-20"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.5) 20%, rgba(6, 182, 212, 0.3) 80%, transparent 100%)',
      }}
    />
  </div>
);

export function Layout({ children }: PropsWithChildren) {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\//, '') || 'dashboard';
  const { textureStyle } = useTexturePreference();
  
  useScrollToTop();
  
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset 
        className="velocity-dark-theme relative overflow-hidden"
      >
        <FlexibleConnector />
        <TopNav />
        <main
          className={cn(
            "@container/main",
            "w-full",
            "flex",
            "flex-col",
            "flex-1",
            "px-4",
            "pt-2",
            "md:px-5",
            "lg:px-6",
          )}
          style={{
            ...textureStyle,
            backgroundAttachment: 'fixed',
          }}
        >
          {children}
        </main>
        <PageLoadPixel page={pageName} />
        <ScreenCodeOverlay />
        <VINessaVoiceButton />
      </SidebarInset>
    </SidebarProvider>
  );
}

Layout.displayName = "Layout";
