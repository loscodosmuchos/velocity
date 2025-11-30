import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Brain,
  FileText,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Hammer,
} from "lucide-react";

export default function AdminDemoPresentation() {
  const [activeSection, setActiveSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: 0, name: "Company Ethos", icon: Target },
    { id: 1, name: "Demo Walkthrough", icon: FileText },
    { id: 2, name: "ROI Metrics", icon: TrendingUp },
  ];

  const problemsSolved = [
    { icon: AlertTriangle, problem: "Scattered Data", solution: "Unified workforce intelligence hub" },
    { icon: Clock, problem: "Manual Processes", solution: "AI-powered automation" },
    { icon: Shield, problem: "Compliance Risks", solution: "Proactive gap detection" },
    { icon: DollarSign, problem: "Budget Overruns", solution: "Real-time spend monitoring" },
  ];

  const demoChecklist = [
    { id: 1, name: "Executive Command Center", description: "Real-time KPIs, AI insights, action items", icon: LayoutDashboard, duration: "3 min" },
    { id: 2, name: "Purchase Order Management", description: "Lifecycle tracking, budget health, approvals", icon: FileText, duration: "4 min" },
    { id: 3, name: "Contractor Lifecycle", description: "Onboarding, compliance, performance tracking", icon: Users, duration: "3 min" },
    { id: 4, name: "AI Intelligence", description: "Predictive analytics, anomaly detection, insights", icon: Brain, duration: "3 min" },
    { id: 5, name: "Dashboard Builder", description: "Custom views, drag-and-drop, role-based", icon: Hammer, duration: "2 min" },
  ];

  const roiMetrics = [
    { label: "Time Savings", value: "$400K", description: "15-20 hrs/week saved per role", color: "from-blue-500 to-cyan-400", icon: Clock },
    { label: "Early Detection", value: "$450K", description: "Problems caught before they escalate", color: "from-purple-500 to-pink-400", icon: Brain },
    { label: "Smart Alerts", value: "$250K", description: "Proactive notifications prevent issues", color: "from-amber-500 to-orange-400", icon: Zap },
    { label: "Compliance", value: "$200K", description: "Audit-ready, always compliant", color: "from-emerald-500 to-teal-400", icon: Shield },
  ];

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: `
          repeating-linear-gradient(45deg, rgba(71, 85, 105, 0.15) 0px, rgba(71, 85, 105, 0.15) 2px, transparent 2px, transparent 10px),
          repeating-linear-gradient(-45deg, rgba(51, 65, 85, 0.2) 0px, rgba(51, 65, 85, 0.2) 2px, transparent 2px, transparent 10px),
          linear-gradient(135deg, rgb(15,23,42) 0%, rgb(30,41,59) 25%, rgb(51,65,85) 50%, rgb(30,41,59) 75%, rgb(15,23,42) 100%)
        `,
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div 
            className={`flex items-center justify-center gap-4 mb-8 transition-all duration-1000 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse" />
              <img 
                src="/branding/velocity-badge.png" 
                alt="Velocity" 
                className="h-20 w-20 rounded-full shadow-2xl shadow-blue-500/40 relative z-10 ring-2 ring-slate-600/50"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
                VELOCITY
              </h1>
              <p className="text-slate-400 text-sm tracking-[0.3em] uppercase mt-1">
                Workforce Intelligence Platform
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {sections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(idx)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${activeSection === idx 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white border border-slate-700/50'}
                `}
              >
                <section.icon className="h-4 w-4" />
                {section.name}
              </button>
            ))}
          </div>

          {activeSection === 0 && (
            <div className={`space-y-8 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <Card className="border-2 border-slate-600/50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
                <CardContent className="p-10">
                  <div className="text-center mb-10">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4 px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      OUR MISSION
                    </Badge>
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                      Revolutionizing Workforce Management<br />
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Through Intelligence
                      </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                      We give workforce leaders their time back — so they can focus on what matters most: their people.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    {problemsSolved.map((item, idx) => (
                      <div 
                        key={idx}
                        className="group p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300">
                            <item.icon className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div>
                            <div className="text-red-400/80 text-sm font-medium line-through mb-1">
                              {item.problem}
                            </div>
                            <div className="text-emerald-400 font-semibold flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              {item.solution}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-center gap-3">
                      <Target className="h-6 w-6 text-blue-400" />
                      <span className="text-xl font-semibold text-white">
                        Why We Exist
                      </span>
                    </div>
                    <p className="text-center text-slate-300 mt-3 text-lg">
                      Because 10 expert roles shouldn't operate in silos. Because decisions shouldn't wait for data. 
                      <span className="text-blue-400 font-medium"> Because your workforce deserves intelligence.</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 1 && (
            <div className="space-y-6 transition-all duration-500">
              <Card className="border-2 border-slate-600/50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="h-8 w-8 text-emerald-400" />
                        Today's Demo
                      </h2>
                      <p className="text-slate-400 mt-2">What we'll experience together</p>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <Clock className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold text-lg">15-20 minutes</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {demoChecklist.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xl">
                          {item.id}
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
                          <item.icon className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-lg">{item.name}</div>
                          <div className="text-slate-400 text-sm">{item.description}</div>
                        </div>
                        <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                          {item.duration}
                        </Badge>
                        <CheckCircle2 className="h-6 w-6 text-emerald-500/30 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-center">
                    <p className="text-slate-300 text-lg">
                      <span className="text-emerald-400 font-semibold">Interactive Experience</span> — 
                      Ask questions anytime. Every feature is live and connected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-6 transition-all duration-500">
              <Card className="border-2 border-slate-600/50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />
                <CardContent className="p-10">
                  <div className="text-center mb-10">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4 px-4 py-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      QUANTIFIED VALUE
                    </Badge>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <DollarSign className="h-12 w-12 text-amber-400" />
                      <span className="text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                        $1.3M+
                      </span>
                    </div>
                    <p className="text-2xl text-white font-semibold">Annual Savings</p>
                    <p className="text-slate-400 mt-2">Measurable ROI from Day One</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {roiMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 overflow-hidden"
                      >
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                            <metric.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">
                              {metric.label}
                            </div>
                            <div className={`text-4xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mt-1`}>
                              {metric.value}
                            </div>
                            <div className="text-slate-400 text-sm mt-2">
                              {metric.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">75-80%</div>
                        <div className="text-amber-300 text-sm">Time Saved</div>
                      </div>
                      <div className="h-12 w-px bg-amber-500/30" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">10x</div>
                        <div className="text-amber-300 text-sm">Decision Speed</div>
                      </div>
                      <div className="h-12 w-px bg-amber-500/30" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">85%</div>
                        <div className="text-amber-300 text-sm">Issue Prevention</div>
                      </div>
                      <div className="h-12 w-px bg-amber-500/30" />
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">100%</div>
                        <div className="text-amber-300 text-sm">Audit Ready</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>© 2025 Velocity — Transforming Workforce Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
