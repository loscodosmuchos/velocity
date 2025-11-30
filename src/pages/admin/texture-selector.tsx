import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Layers, Zap, Diamond, Car, Gauge, RefreshCw } from "lucide-react";
import { useTexturePreference, TextureId, textureStyles } from "@/hooks/useTexturePreference";
import { toast } from "sonner";

const textureOptions: Array<{
  id: TextureId;
  name: string;
  description: string;
  icon: typeof Layers;
  preview: React.CSSProperties;
}> = [
  {
    id: "carbon-fiber-bg",
    name: "Classic Carbon Fiber",
    description: "Standard interlocking weave pattern with subtle metallic sheen",
    icon: Layers,
    preview: {
      backgroundColor: "#0d1117",
      backgroundImage: `
        linear-gradient(135deg, transparent 0%, rgba(100, 180, 255, 0.02) 25%, transparent 50%, rgba(100, 180, 255, 0.015) 75%, transparent 100%),
        linear-gradient(27deg, #0f1419 5px, transparent 5px),
        linear-gradient(207deg, #0f1419 5px, transparent 5px),
        linear-gradient(27deg, #151b23 5px, transparent 5px),
        linear-gradient(207deg, #151b23 5px, transparent 5px),
        linear-gradient(90deg, #0c1015 10px, transparent 10px),
        linear-gradient(#0e1318 25%, #0c1015 25%, #0c1015 50%, transparent 50%, transparent 75%, #131921 75%, #131921)
      `,
      backgroundSize: "100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px, 20px 20px, 20px 20px",
      backgroundPosition: "0 0, 0 5px, 10px 0, 0 10px, 10px 5px, 0 0, 0 0"
    }
  },
  {
    id: "carbon-fiber-luxe",
    name: "Luxe Carbon Fiber",
    description: "Premium refined weave with cyan accent glow and micro-line depth",
    icon: Diamond,
    preview: {
      backgroundColor: "#0a0e12",
      backgroundImage: `
        radial-gradient(ellipse at top left, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.02) 0%, transparent 50%),
        repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(255, 255, 255, 0.008) 1px, rgba(255, 255, 255, 0.008) 2px),
        linear-gradient(27deg, #0c1117 4px, transparent 4px),
        linear-gradient(207deg, #0c1117 4px, transparent 4px),
        linear-gradient(27deg, #111920 4px, transparent 4px),
        linear-gradient(207deg, #111920 4px, transparent 4px),
        linear-gradient(90deg, #0a0f14 8px, transparent 8px),
        linear-gradient(#0c1117 25%, #0a0e12 25%, #0a0e12 50%, transparent 50%, transparent 75%, #0f151c 75%, #0f151c)
      `,
      backgroundSize: "100% 100%, 100% 100%, 3px 3px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px",
      backgroundPosition: "0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0"
    }
  },
  {
    id: "velocity-dashboard-shell",
    name: "Dashboard Shell",
    description: "Vignette effect with top nav cyan accent glow",
    icon: Gauge,
    preview: {
      backgroundColor: "#0a0e12",
      backgroundImage: `
        radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%),
        linear-gradient(180deg, rgba(6, 182, 212, 0.02) 0%, transparent 15%),
        linear-gradient(27deg, #0c1117 4px, transparent 4px),
        linear-gradient(207deg, #0c1117 4px, transparent 4px),
        linear-gradient(27deg, #111920 4px, transparent 4px),
        linear-gradient(207deg, #111920 4px, transparent 4px),
        linear-gradient(90deg, #0a0f14 8px, transparent 8px),
        linear-gradient(#0c1117 25%, #0a0e12 25%, #0a0e12 50%, transparent 50%, transparent 75%, #0f151c 75%, #0f151c)
      `,
      backgroundSize: "100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px",
      backgroundPosition: "0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0"
    }
  },
  {
    id: "racing-carbon",
    name: "Racing Carbon",
    description: "High-contrast motorsport inspired with amber racing accents",
    icon: Car,
    preview: {
      backgroundColor: "#080a0c",
      backgroundImage: `
        radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.04) 0%, transparent 40%),
        radial-gradient(ellipse at 70% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 35%),
        linear-gradient(27deg, #0a0d10 4px, transparent 4px),
        linear-gradient(207deg, #0a0d10 4px, transparent 4px),
        linear-gradient(27deg, #0e1216 4px, transparent 4px),
        linear-gradient(207deg, #0e1216 4px, transparent 4px),
        linear-gradient(90deg, #080b0e 8px, transparent 8px),
        linear-gradient(#0a0d10 25%, #080a0c 25%, #080a0c 50%, transparent 50%, transparent 75%, #0c1014 75%, #0c1014)
      `,
      backgroundSize: "100% 100%, 100% 100%, 14px 14px, 14px 14px, 14px 14px, 14px 14px, 14px 14px, 14px 14px",
      backgroundPosition: "0 0, 0 0, 0 4px, 7px 0, 0 7px, 7px 4px, 0 0, 0 0"
    }
  },
  {
    id: "genesis-premium",
    name: "Genesis Premium",
    description: "Hyundai Genesis inspired with rose gold luxury highlights",
    icon: Sparkles,
    preview: {
      backgroundColor: "#0b0d10",
      backgroundImage: `
        radial-gradient(ellipse at 15% 10%, rgba(244, 114, 182, 0.025) 0%, transparent 45%),
        radial-gradient(ellipse at 85% 90%, rgba(168, 162, 158, 0.02) 0%, transparent 40%),
        linear-gradient(45deg, transparent 48%, rgba(244, 114, 182, 0.008) 50%, transparent 52%),
        linear-gradient(27deg, #0c0f13 4px, transparent 4px),
        linear-gradient(207deg, #0c0f13 4px, transparent 4px),
        linear-gradient(27deg, #10141a 4px, transparent 4px),
        linear-gradient(207deg, #10141a 4px, transparent 4px),
        linear-gradient(90deg, #090c0f 8px, transparent 8px),
        linear-gradient(#0c0f13 25%, #0b0d10 25%, #0b0d10 50%, transparent 50%, transparent 75%, #0e1218 75%, #0e1218)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px",
      backgroundPosition: "0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0"
    }
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    description: "EV-inspired with electric blue energy pulses",
    icon: Zap,
    preview: {
      backgroundColor: "#080c12",
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.045) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 45%),
        linear-gradient(135deg, transparent 40%, rgba(59, 130, 246, 0.01) 50%, transparent 60%),
        linear-gradient(27deg, #0a0e14 4px, transparent 4px),
        linear-gradient(207deg, #0a0e14 4px, transparent 4px),
        linear-gradient(27deg, #0e131c 4px, transparent 4px),
        linear-gradient(207deg, #0e131c 4px, transparent 4px),
        linear-gradient(90deg, #080b10 8px, transparent 8px),
        linear-gradient(#0a0e14 25%, #080c12 25%, #080c12 50%, transparent 50%, transparent 75%, #0c1118 75%, #0c1118)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px",
      backgroundPosition: "0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0"
    }
  }
];

export default function TextureSelector() {
  const { textureId: appliedTexture, setTexture } = useTexturePreference();
  const [selectedTexture, setSelectedTexture] = useState<TextureId | null>(null);

  const handleApply = () => {
    if (selectedTexture) {
      setTexture(selectedTexture);
      toast.success(`Applied "${textureOptions.find(t => t.id === selectedTexture)?.name}" texture`, {
        description: "The background texture has been updated across the entire platform."
      });
    }
  };

  const handleReset = () => {
    setTexture('default');
    setSelectedTexture(null);
    toast.info("Reset to default background texture");
  };

  return (
    <div className="velocity-dashboard-shell min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Diamond className="h-7 w-7 text-cyan-400" />
              Premium Texture Selector
            </h1>
            <p className="text-slate-400 mt-1">
              Choose the carbon fiber background texture for the main content area
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Current: <span className="text-cyan-400 font-medium">
                {textureOptions.find(t => t.id === appliedTexture)?.name || "Default"}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!selectedTexture || selectedTexture === appliedTexture}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Selected
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {textureOptions.map((texture) => {
            const Icon = texture.icon;
            const isSelected = selectedTexture === texture.id;
            const isApplied = appliedTexture === texture.id;
            
            return (
              <Card 
                key={texture.id}
                onClick={() => setSelectedTexture(texture.id)}
                className={`
                  relative cursor-pointer transition-all duration-300 overflow-hidden
                  bg-slate-900/60 border-slate-700/50 hover:border-slate-600
                  ${isSelected ? 'ring-2 ring-cyan-500 border-cyan-500/50' : ''}
                  ${isApplied ? 'ring-2 ring-emerald-500/50 border-emerald-500/30' : ''}
                `}
              >
                {isApplied && (
                  <div className="absolute top-2 right-2 z-10 bg-emerald-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </div>
                )}
                
                <div 
                  className="h-40 relative"
                  style={texture.preview}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-cyan-400" />
                        <div>
                          <div className="text-white font-semibold">Preview</div>
                          <div className="text-xs text-slate-400">Sample Card</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/90 to-transparent" />
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Icon className="h-5 w-5 text-cyan-400" />
                    {texture.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-slate-400">{texture.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="text-xs bg-slate-800/80 text-cyan-300 px-2 py-1 rounded font-mono">
                      .{texture.id}
                    </code>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Full-Width Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="h-64 rounded-lg border border-slate-600/50 overflow-hidden relative"
              style={selectedTexture 
                ? textureOptions.find(t => t.id === selectedTexture)?.preview 
                : textureOptions.find(t => t.id === appliedTexture)?.preview
              }
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-6">
                  {[
                    { label: "Active Contractors", value: "847", color: "cyan" },
                    { label: "Pending Approvals", value: "23", color: "amber" },
                    { label: "Compliance Rate", value: "94.2%", color: "emerald" },
                  ].map((kpi, i) => (
                    <div 
                      key={i}
                      className={`
                        bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 
                        border border-slate-600/40 
                        shadow-lg shadow-${kpi.color}-500/10
                      `}
                    >
                      <div className="text-xs text-slate-400 uppercase tracking-wider">{kpi.label}</div>
                      <div className={`text-2xl font-bold text-${kpi.color}-400 mt-1`}>{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-3 left-3 text-xs text-slate-500">
                Previewing: {selectedTexture 
                  ? textureOptions.find(t => t.id === selectedTexture)?.name 
                  : textureOptions.find(t => t.id === appliedTexture)?.name}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          CSS class names can be applied to any container element. 
          Use <code className="text-cyan-400 font-mono">.velocity-dashboard-shell</code> for the main layout.
        </div>
      </div>
    </div>
  );
}
