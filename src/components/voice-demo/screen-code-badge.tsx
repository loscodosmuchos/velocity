/**
 * SCREEN CODE BADGE
 * Small corner indicator showing current screen code for voice navigation
 * 
 * Displays: A1, B2, C3, etc.
 * Voice-addressable: User can say "Take me to B3" and chatbot navigates
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Radio, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getScreenCodeForPath, 
  isVoiceDemoActive, 
  getVoiceDemoSession,
  updateSessionLocation,
  type ScreenCodeMapping 
} from "@/lib/voice-demo-session";

interface ScreenCodeBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScreenCodeBadge({ 
  position = 'bottom-right',
  showLabel = false,
  size = 'md'
}: ScreenCodeBadgeProps) {
  const location = useLocation();
  const [screenCode, setScreenCode] = useState<ScreenCodeMapping | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    const code = getScreenCodeForPath(location.pathname);
    setScreenCode(code);
    
    const session = getVoiceDemoSession();
    setIsActive(isVoiceDemoActive());
    setSessionId(session?.sessionId || null);
    
    if (session && code) {
      updateSessionLocation(location.pathname, 'user');
    }
  }, [location.pathname]);
  
  if (!screenCode) return null;
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "fixed z-50 flex items-center gap-2",
              positionClasses[position]
            )}
          >
            <Badge 
              variant="outline"
              className={cn(
                "font-mono font-bold transition-all duration-300",
                sizeClasses[size],
                isActive 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse" 
                  : "bg-slate-800/80 text-slate-300 border-slate-600/50 hover:bg-slate-700/80"
              )}
            >
              {isActive && <Radio className="h-3 w-3 mr-1 animate-pulse" />}
              {screenCode.code}
              {showLabel && (
                <span className="ml-2 font-normal opacity-70">
                  {screenCode.label}
                </span>
              )}
            </Badge>
            
            {isActive && (
              <Badge 
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs"
              >
                <Mic className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="bg-slate-900 border-slate-700 max-w-xs"
        >
          <div className="space-y-2">
            <div className="font-semibold text-slate-100">
              Screen {screenCode.code}: {screenCode.label}
            </div>
            <div className="text-xs text-slate-400">
              Category: {screenCode.category}
            </div>
            {isActive && sessionId && (
              <div className="text-xs text-emerald-400 border-t border-slate-700 pt-2 mt-2">
                Voice Demo Active: {sessionId}
              </div>
            )}
            {screenCode.talkingPoints && screenCode.talkingPoints.length > 0 && (
              <div className="text-xs text-slate-400 border-t border-slate-700 pt-2 mt-2">
                <div className="font-medium text-slate-300 mb-1">Talking Points:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {screenCode.talkingPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-xs text-slate-500 italic">
              Say "Go to {screenCode.code}" in voice demo mode
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ScreenCodeOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <ScreenCodeBadge 
      position="bottom-right" 
      showLabel={false} 
      size="md" 
    />
  );
}
