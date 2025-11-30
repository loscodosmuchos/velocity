import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, RotateCcw, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAIGeneration } from "@/hooks/useAIGeneration";

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  components: string[];
  metrics: string[];
}

interface AICustomizerProps {
  userId: string;
  onApply?: (template: DashboardTemplate) => void;
}

export function AIDAshboardCustomizer({ userId, onApply }: AICustomizerProps) {
  const [prompt, setPrompt] = useState("");
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const { generateContent, loading } = useAIGeneration();
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your dashboard needs");
      return;
    }

    try {
      const systemPrompt = `You are a dashboard design expert. Based on the user's needs, generate a dashboard template.
      Return ONLY valid JSON with this structure:
      {
        "id": "template_xxx",
        "name": "Dashboard Name",
        "description": "Brief description",
        "layout": "2-col|3-col|4-col",
        "components": ["metric-card", "chart", "list", "gauge"],
        "metrics": ["metric1", "metric2"]
      }`;

      const response = await generateContent(prompt, systemPrompt);
      
      try {
        const template = JSON.parse(response) as DashboardTemplate;
        setTemplates([...templates, template]);
        setSelectedTemplate(template);
        setPrompt("");
        toast.success("Dashboard template generated!");
      } catch {
        toast.error("Failed to parse template. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to generate template");
    }
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onApply?.(selectedTemplate);
      toast.success(`Applied: ${selectedTemplate.name}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Generation Input */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-amber-400" />
            AI Dashboard Designer
          </CardTitle>
          <CardDescription>Describe your ideal dashboard and AI will create it for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'I need a dashboard showing budget spend by department, risk alerts, and upcoming approvals. Make it focused on executive decisions.'"
            className="w-full h-24 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateFromPrompt}
              disabled={loading || !prompt.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Dashboard
                </>
              )}
            </Button>
            {templates.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setTemplates([]);
                  setSelectedTemplate(null);
                }}
                className="border-slate-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Templates</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: "Executive Overview", desc: "Portfolio & ROI focus" },
                { name: "Budget Monitor", desc: "Spend & forecasting" },
                { name: "Team Performance", desc: "Resource utilization" },
                { name: "Risk Dashboard", desc: "Alerts & compliance" },
              ].map((t) => (
                <Button
                  key={t.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(t.desc)}
                  className="justify-start text-xs border-slate-700 hover:bg-slate-800"
                >
                  + {t.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Templates */}
      {templates.length > 0 && (
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-emerald-300">Generated Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{template.name}</h4>
                    <p className="text-xs text-slate-400">{template.description}</p>
                  </div>
                  {selectedTemplate?.id === template.id && <Badge className="bg-emerald-600">Selected</Badge>}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="bg-slate-700/50 text-slate-200">
                    Layout: {template.layout}
                  </Badge>
                  {template.components.slice(0, 3).map((c) => (
                    <Badge key={c} variant="outline" className="border-slate-600 text-slate-300">
                      {c}
                    </Badge>
                  ))}
                </div>

                {selectedTemplate?.id === template.id && (
                  <div className="flex gap-2 pt-3 border-t border-slate-700">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(!showPreview);
                      }}
                      variant="outline"
                      className="border-slate-700"
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTemplate();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Apply Template
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(JSON.stringify(template, null, 2));
                        toast.success("Template copied!");
                      }}
                      variant="outline"
                      className="border-slate-700"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {showPreview && selectedTemplate && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Layout Preview: {selectedTemplate.layout}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800/50 rounded p-4 border border-slate-700 text-center text-slate-400 text-sm py-8">
              Components: {selectedTemplate.components.join(", ")}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
