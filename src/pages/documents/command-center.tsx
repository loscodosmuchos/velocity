import { useNavigate } from "react-router";
import { 
  Zap, Upload, Search, Brain, History, FolderOpen, Sparkles, 
  Shield, TrendingUp, Clock, ArrowRight, Play, Scale, DollarSign, 
  Users, Wand2, Lock, Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const commandActions = [
  {
    id: "upload", title: "Upload & Analyze", description: "Multi-lens AI contract analysis",
    icon: Upload, color: "text-cyan-400", gradient: "from-cyan-500 to-blue-600",
    path: "/documents/upload", badge: "AI-Powered"
  },
  {
    id: "browse", title: "Browse Library", description: "Visual gallery with AI insights",
    icon: FolderOpen, color: "text-emerald-400", gradient: "from-emerald-500 to-green-600",
    path: "/projects/documents"
  },
  {
    id: "search", title: "Semantic Search", description: "Find any clause instantly",
    icon: Search, color: "text-purple-400", gradient: "from-purple-500 to-indigo-600",
    path: "/documents/search", badge: "pgvector"
  },
  {
    id: "analyze", title: "Deep Analysis", description: "5-lens risk assessment",
    icon: Brain, color: "text-amber-400", gradient: "from-amber-500 to-orange-600",
    path: "/documents/analyze"
  },
  {
    id: "audit", title: "Audit Trail", description: "100% defensibility log",
    icon: History, color: "text-rose-400", gradient: "from-rose-500 to-red-600",
    path: "/documents/audit", badge: "Defensible"
  },
  {
    id: "create", title: "AI Creator", description: "Generate SOWs with AI",
    icon: Wand2, color: "text-pink-400", gradient: "from-pink-500 to-fuchsia-600",
    path: "/ai/legendary-builder", badge: "Soon"
  }
];

const lenses = [
  { lens: "Legal", icon: Scale, color: "text-blue-400" },
  { lens: "Financial", icon: DollarSign, color: "text-emerald-400" },
  { lens: "Operational", icon: Target, color: "text-amber-400" },
  { lens: "Vendor", icon: Users, color: "text-purple-400" },
  { lens: "Compliance", icon: Shield, color: "text-rose-400" }
];

export function DocumentsCommandCenter() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      
      {/* COMPACT HERO */}
      <div className="flex-shrink-0 border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Documents Command Center</h1>
              <p className="text-sm text-slate-400">AI-powered contract intelligence</p>
            </div>
          </div>
          
          {/* INLINE METRICS */}
          <div className="flex items-center gap-6">
            {[
              { icon: Clock, value: "85%", label: "Time Saved", color: "text-cyan-400" },
              { icon: Shield, value: "99.2%", label: "Risk Detection", color: "text-emerald-400" },
              { icon: Lock, value: "100%", label: "Audit Ready", color: "text-purple-400" },
              { icon: TrendingUp, value: "$2.1M", label: "Savings", color: "text-amber-400" }
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-xl font-bold text-white">{m.value}</span>
                </div>
                <div className="text-[10px] text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto p-6">
        
        {/* ACTION CARDS - 6 in 2 rows of 3 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {commandActions.map((action) => (
            <Card 
              key={action.id}
              className="border-slate-700/50 bg-slate-800/30 backdrop-blur-sm cursor-pointer 
                transition-all duration-200 hover:scale-[1.02] hover:border-slate-600 group overflow-hidden"
              onClick={() => navigate(action.path)}
            >
              <div className={`h-1 bg-gradient-to-r ${action.gradient}`} />
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} 
                    flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {action.title}
                      </h3>
                      {action.badge && (
                        <Badge variant="outline" className={`${action.color} border-current text-[10px] px-1.5 py-0`}>
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>
                  </div>
                  <ArrowRight className={`h-4 w-4 ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 5-LENS STRIP */}
        <Card className="border-slate-700/50 bg-slate-800/30 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-white text-sm">5-Lens AI Risk Analysis</span>
            </div>
            <div className="flex items-center justify-between">
              {lenses.map((lens) => (
                <div key={lens.lens} className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center`}>
                    <lens.icon className={`h-5 w-5 ${lens.color}`} />
                  </div>
                  <span className={`text-[10px] font-medium ${lens.color}`}>{lens.lens}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QUICK START CTA - FULL WIDTH ACTION BAR */}
        <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-400/70" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-300">Ready to analyze?</h3>
                  <p className="text-xs text-slate-500">AI-powered contract insights</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/documents/upload')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                  text-white shadow-lg shadow-amber-500/25 gap-2"
                size="lg"
              >
                <Sparkles className="h-5 w-5" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DocumentsCommandCenter;
