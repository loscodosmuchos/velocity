import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGradientProgress, ProgressVariant, ProgressTheme } from "@/components/ui/animated-gradient-progress";
import { PremiumBorder, PremiumButton, BorderVariant, BorderColor } from "@/components/ui/premium-borders";
import { Badge } from "@/components/ui/badge";
import { Palette, Layers, Box, MousePointer, Sparkles } from "lucide-react";

const progressVariants: { name: ProgressVariant; description: string; tag?: string }[] = [
  { name: "standard", description: "Clean gradient fill with no animation" },
  { name: "pulse", description: "Breathing glow effect for attention", tag: "Active" },
  { name: "flow", description: "Packets moving through the bar", tag: "Movement" },
  { name: "shimmer", description: "Light sweep across the bar", tag: "Premium" },
  { name: "arrows", description: "Diagonal stripes moving forward", tag: "Progress" },
  { name: "neon", description: "Intense glow based on threshold", tag: "Alert" },
  { name: "glass", description: "Glossy translucent finish", tag: "Luxury" },
  { name: "metallic", description: "3D brushed metal effect", tag: "Premium" },
  { name: "carbon", description: "Carbon fiber weave texture", tag: "Automotive" },
  { name: "holographic", description: "Rainbow color shift animation", tag: "Premium" },
  { name: "plasma", description: "Energetic color plasma effect", tag: "Sci-Fi" },
  { name: "circuit", description: "Electronic nodes pulsing", tag: "Tech" },
];

const progressThemes: { name: ProgressTheme; description: string }[] = [
  { name: "utilization", description: "Green→Yellow→Red (budget burn)" },
  { name: "health", description: "Red→Yellow→Green (recovery)" },
  { name: "warning", description: "Yellow→Orange gradient" },
  { name: "info", description: "Cyan→Blue→Purple" },
  { name: "success", description: "Emerald gradient" },
];

const borderVariants: { name: BorderVariant; description: string; tag?: string }[] = [
  { name: "standard", description: "Simple colored border" },
  { name: "glow", description: "Soft ambient glow", tag: "Hover" },
  { name: "neon", description: "Bright flickering neon", tag: "Alert" },
  { name: "gradient", description: "Animated gradient border", tag: "Premium" },
  { name: "metallic", description: "3D brushed metal finish", tag: "Luxury" },
  { name: "glass", description: "Frosted glass effect", tag: "Modern" },
  { name: "frosted", description: "Heavy blur frosted glass", tag: "Depth" },
  { name: "carbon", description: "Carbon fiber texture", tag: "Automotive" },
  { name: "holographic", description: "Rainbow shifting border", tag: "Premium" },
  { name: "pulse", description: "Breathing glow animation", tag: "Active" },
  { name: "scan", description: "Scanning line effect", tag: "Sci-Fi" },
  { name: "circuit", description: "Circuit board grid pattern", tag: "Tech" },
  { name: "damascus", description: "Damascus steel pattern", tag: "Brand" },
  { name: "luxury", description: "Gold accent premium finish", tag: "VIP" },
  { name: "cyber", description: "Cut corner cyberpunk style", tag: "Edgy" },
];

const borderColors: BorderColor[] = ["cyan", "emerald", "amber", "red", "violet", "blue", "slate"];

export default function StyleGalleryPage() {
  const [selectedProgress, setSelectedProgress] = React.useState<ProgressVariant>("flow");
  const [selectedTheme, setSelectedTheme] = React.useState<ProgressTheme>("utilization");
  const [selectedBorder, setSelectedBorder] = React.useState<BorderVariant>("glow");
  const [selectedColor, setSelectedColor] = React.useState<BorderColor>("cyan");
  const [demoValue, setDemoValue] = React.useState(72);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/30">
            <Palette className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Style Gallery</h1>
            <p className="text-slate-400">Premium UI components for Velocity platform</p>
          </div>
        </div>

        {/* Interactive Demo */}
        <Card className="border-violet-500/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-300">
              <Sparkles className="h-5 w-5" />
              Interactive Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Progress Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Progress Bar</h3>
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                  <AnimatedGradientProgress
                    value={demoValue}
                    variant={selectedProgress}
                    theme={selectedTheme}
                    height="xl"
                    showLabel
                    label={`${selectedProgress} + ${selectedTheme}`}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={demoValue}
                    onChange={(e) => setDemoValue(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-400 w-12">{demoValue}%</span>
                </div>
              </div>

              {/* Border Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Card/Border</h3>
                <PremiumBorder variant={selectedBorder} color={selectedColor}>
                  <div className="p-6 text-center">
                    <p className="text-lg font-medium text-white">{selectedBorder}</p>
                    <p className="text-sm text-slate-400">{selectedColor} accent</p>
                  </div>
                </PremiumBorder>
                <div className="flex gap-2 flex-wrap">
                  {borderColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        selectedColor === c
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar Variants */}
        <Card className="border-cyan-500/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <Layers className="h-5 w-5" />
              Progress Bar Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {progressVariants.map(({ name, description, tag }) => (
                <div
                  key={name}
                  onClick={() => setSelectedProgress(name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProgress === name
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-white capitalize">{name}</span>
                    {tag && (
                      <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                        {tag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{description}</p>
                  <AnimatedGradientProgress
                    value={75}
                    variant={name}
                    theme="utilization"
                    height="md"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Themes */}
        <Card className="border-emerald-500/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-300">
              <Palette className="h-5 w-5" />
              Color Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {progressThemes.map(({ name, description }) => (
                <div
                  key={name}
                  onClick={() => setSelectedTheme(name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTheme === name
                      ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <span className="text-base font-semibold text-white capitalize block mb-1">{name}</span>
                  <p className="text-xs text-slate-400 mb-3">{description}</p>
                  <AnimatedGradientProgress
                    value={65}
                    variant="standard"
                    theme={name}
                    height="sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Border/Card Variants */}
        <Card className="border-amber-500/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-300">
              <Box className="h-5 w-5" />
              Border &amp; Card Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {borderVariants.map(({ name, description, tag }) => (
                <div
                  key={name}
                  onClick={() => setSelectedBorder(name)}
                  className={`cursor-pointer transition-all ${
                    selectedBorder === name ? "scale-105" : "hover:scale-102"
                  }`}
                >
                  <PremiumBorder variant={name} color={selectedColor}>
                    <div className="p-4 text-center min-h-[100px] flex flex-col justify-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white capitalize">{name}</span>
                        {tag && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 bg-amber-500/10 text-amber-300 border-amber-500/30">
                            {tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                  </PremiumBorder>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card className="border-violet-500/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-300">
              <MousePointer className="h-5 w-5" />
              Button Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {(["glow", "neon", "gradient", "metallic", "glass", "cyber", "pulse"] as BorderVariant[]).map((variant) => (
                <div key={variant} className="space-y-2">
                  <PremiumButton variant={variant} color={selectedColor}>
                    {variant} Button
                  </PremiumButton>
                  <p className="text-xs text-slate-500 text-center capitalize">{variant}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-4">Color Variants</h4>
              <div className="flex flex-wrap gap-3">
                {borderColors.map((color) => (
                  <PremiumButton key={color} variant="glow" color={color}>
                    {color}
                  </PremiumButton>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Reference */}
        <Card className="border-slate-600/30 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-slate-300">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Progress Bar Usage</h4>
                <pre className="p-3 rounded bg-slate-800 text-xs text-slate-300 overflow-x-auto">
{`<AnimatedGradientProgress
  value={85}
  variant="${selectedProgress}"
  theme="${selectedTheme}"
  height="lg"
  showLabel
/>`}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-400 mb-2">Border/Card Usage</h4>
                <pre className="p-3 rounded bg-slate-800 text-xs text-slate-300 overflow-x-auto">
{`<PremiumBorder
  variant="${selectedBorder}"
  color="${selectedColor}"
>
  {children}
</PremiumBorder>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
