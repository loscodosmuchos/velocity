import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { isDemoMode, toggleDemoMode } from "@/lib/demo-mode";
import { Zap, Database } from "lucide-react";

export function DemoModeToggle() {
  const [enabled, setEnabled] = useState(isDemoMode());
  
  useEffect(() => {
    setEnabled(isDemoMode());
  }, []);
  
  const handleToggle = () => {
    toggleDemoMode();
  };
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center gap-3">
        {enabled ? (
          <Zap className="h-5 w-5 text-amber-400" />
        ) : (
          <Database className="h-5 w-5 text-cyan-400" />
        )}
        <div>
          <Label htmlFor="demo-mode" className="text-sm font-medium text-slate-200">
            Demo Mode
          </Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {enabled 
              ? "Using mock data - no API calls, no auth required" 
              : "Live mode - requires API authentication"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={enabled 
            ? "bg-amber-500/15 text-amber-400/80 border-amber-500/25" 
            : "bg-cyan-500/15 text-cyan-400/80 border-cyan-500/25"}
        >
          {enabled ? "DEMO" : "LIVE"}
        </Badge>
        <Switch
          id="demo-mode"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
}

export function DemoModeIndicator() {
  const [enabled, setEnabled] = useState(isDemoMode());
  
  useEffect(() => {
    setEnabled(isDemoMode());
  }, []);
  
  if (!enabled) return null;
  
  return (
    <Badge 
      variant="outline" 
      className="bg-amber-500/15 text-amber-400/80 border-amber-500/25 text-xs cursor-pointer"
      onClick={toggleDemoMode}
      title="Click to exit demo mode (or press Ctrl+Shift+D)"
    >
      <Zap className="h-3 w-3 mr-1" />
      DEMO
    </Badge>
  );
}
