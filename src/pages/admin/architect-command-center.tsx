import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Shield,
  Zap,
  Eye,
  Target,
  Flame,
  Mountain,
  Compass,
  Anchor,
  Lightbulb,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Users,
  FileText,
  Rocket,
  Star,
  Lock,
  Gem,
  Trophy,
  Brain,
  Heart,
  Sparkles,
} from "lucide-react";

interface Doctrine {
  id: string;
  title: string;
  category: string;
  severity: string;
  summary: string;
  fullDoctrine: string;
  enforcementRules: any;
  createdAt: string;
  carvedInStone: boolean;
}

interface ClaimsAudit {
  summary: {
    total: number;
    claimable: number;
    discoverable: number;
    incomplete: number;
    percentReady: number;
  };
  dataHealth: {
    sows: number;
    contractors: number;
    invoices: number;
    pos: number;
  };
}

const ARCHITECT_PRINCIPLES = [
  {
    icon: Shield,
    title: "THE SYSTEM WON'T LET YOU",
    description: "Like AS/400 mainframes - prevent invalid states, don't just detect them",
    color: "text-blue-400",
    bgColor: "bg-blue-950/50",
    borderColor: "border-blue-500/30",
  },
  {
    icon: Eye,
    title: "WATCHDOGS BARK AUTOMATICALLY",
    description: "No human intervention required - failures trigger alerts automatically",
    color: "text-amber-400",
    bgColor: "bg-amber-950/50",
    borderColor: "border-amber-500/30",
  },
  {
    icon: Database,
    title: "MEMORY LIVES IN THE DATABASE",
    description: "Not in docs that go stale - in Postgres with constraints and foreign keys",
    color: "text-emerald-400",
    bgColor: "bg-emerald-950/50",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: Rocket,
    title: "VELOCITY REQUIRES SUSTAINED SPEED",
    description: "One step forward, two steps back = never fly. Remove ALL wheel blocks.",
    color: "text-purple-400",
    bgColor: "bg-purple-950/50",
    borderColor: "border-purple-500/30",
  },
];

const ARCHITECT_LENS = [
  { label: "Outcomes Over Explanations", detail: "Deliver results with brief confirmation, not lectures" },
  { label: "Exclamations, Not Explanations", detail: "Users exclaim 'Look how fast!' - never require explanation" },
  { label: "Authenticity Pillar", detail: "Zero tolerance for mock/fake/placeholder data - EVER" },
  { label: "Prime Real Estate", detail: "Dashboard cards showing empty/NaN = wasted L1 cache" },
  { label: "Visuals Speak Loudly", detail: "Charts, icons, progress indicators - numbers alone aren't exciting" },
  { label: "Token Efficiency", detail: "Spot-check before full ingestion, assess relevance first" },
  { label: "Call Backup Quickly", detail: "Don't waste time exploring every path - ask for help immediately" },
  { label: "Goal-Oriented Focus", detail: "Completed, working, predictable, reliable, exclaimable, defensible" },
];

export const ArchitectCommandCenter: React.FC = () => {
  const [doctrines, setDoctrines] = useState<Doctrine[]>([]);
  const [claimsAudit, setClaimsAudit] = useState<ClaimsAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("doctrines");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [doctrinesRes, auditRes] = await Promise.all([
          fetch("/api/admin/doctrines"),
          fetch("/api/admin/claims-audit"),
        ]);

        if (doctrinesRes.ok) {
          const data = await doctrinesRes.json();
          setDoctrines(data);
        }

        if (auditRes.ok) {
          const data = await auditRes.json();
          setClaimsAudit(data);
        }
      } catch (err) {
        console.error("Failed to fetch architect data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getReadinessColor = (percent: number) => {
    if (percent >= 90) return "text-emerald-400";
    if (percent >= 70) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center border-2 border-amber-300/50">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                ARCHITECT'S COMMAND CENTER
              </h1>
              <p className="text-slate-400 flex items-center gap-2 mt-1">
                <Gem className="w-4 h-4 text-amber-400" />
                The Creative Force Behind Velocity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              CARVED IN STONE
            </Badge>
            <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white border-0 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Nov 27, 2025
            </Badge>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-red-950/30 border border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Mountain className="w-8 h-8 text-amber-400" />
              <div>
                <h2 className="text-2xl font-bold text-amber-100">THE AS/400 DOCTRINE</h2>
                <p className="text-amber-300/70">Systems That Never Crash Because They Prevent Invalid States</p>
              </div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-amber-500/20">
              <p className="text-slate-300 text-lg leading-relaxed">
                <span className="text-amber-400 font-semibold">AS/400 mainframes from the 1980s still run flawlessly</span> while every other computer crashes, hangs, and breaks. Why? Because{" "}
                <span className="text-amber-400 font-bold">THE SYSTEM WON'T LET YOU DO THINGS WRONG.</span>
              </p>
              <p className="text-slate-400 mt-3">
                Every other system lets you make mistakes and hopes you'll notice. AS/400s <strong className="text-white">prevent the mistake from happening in the first place.</strong>
              </p>
              <p className="text-amber-300 mt-4 font-semibold text-lg">
                THIS IS THE STANDARD FOR VELOCITY.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          {ARCHITECT_PRINCIPLES.map((principle, idx) => (
            <Card key={idx} className={`${principle.bgColor} border ${principle.borderColor} hover:scale-[1.02] transition-transform`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-slate-900/50 ${principle.color}`}>
                    <principle.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">LAW {idx + 1}</Badge>
                </div>
                <h3 className={`font-bold ${principle.color} mb-2`}>{principle.title}</h3>
                <p className="text-slate-400 text-sm">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {claimsAudit && (
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-400" />
                  <CardTitle className="text-white">VELO Authenticity Status</CardTitle>
                </div>
                <div className={`text-4xl font-bold ${getReadinessColor(claimsAudit.summary.percentReady)}`}>
                  {claimsAudit.summary.percentReady}%
                </div>
              </div>
              <CardDescription className="text-slate-400">
                Real-time validation of platform claims against discoverable, executable features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={claimsAudit.summary.percentReady} className="h-3 mb-4" />
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{claimsAudit.summary.claimable}</div>
                  <div className="text-xs text-slate-500">Claimable</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{claimsAudit.summary.discoverable}</div>
                  <div className="text-xs text-slate-500">Discoverable</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{claimsAudit.summary.incomplete}</div>
                  <div className="text-xs text-slate-500">Incomplete</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-300">{claimsAudit.summary.total}</div>
                  <div className="text-xs text-slate-500">Total Claims</div>
                </div>
              </div>
              <Separator className="my-4 bg-slate-700" />
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-sm">SOWs:</span>
                  <span className="text-white font-bold">{claimsAudit.dataHealth.sows}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400 text-sm">Contractors:</span>
                  <span className="text-white font-bold">{claimsAudit.dataHealth.contractors}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400 text-sm">POs:</span>
                  <span className="text-white font-bold">{claimsAudit.dataHealth.pos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400 text-sm">Invoices:</span>
                  <span className="text-white font-bold">{claimsAudit.dataHealth.invoices}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
            <TabsTrigger value="doctrines" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Mountain className="w-4 h-4 mr-2" />
              Set In Stone Doctrines
            </TabsTrigger>
            <TabsTrigger value="lens" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              The Architect's Lens
            </TabsTrigger>
            <TabsTrigger value="philosophy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Core Philosophy
            </TabsTrigger>
            <TabsTrigger value="covenant" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              The Velocity Covenant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctrines" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-amber-400" />
                  <CardTitle className="text-amber-100">IMMUTABLE DOCTRINES</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  These principles are carved in stone. The system enforces them automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {doctrines.length > 0 ? (
                    doctrines.map((doctrine) => (
                      <div key={doctrine.id} className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-amber-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-400" />
                            <h4 className="font-bold text-amber-100">{doctrine.title}</h4>
                          </div>
                          <Badge className="bg-amber-600 text-white border-0">
                            {doctrine.severity}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{doctrine.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Immutable
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-enforced
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(doctrine.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-gradient-to-r from-amber-950/30 to-orange-950/30 rounded-lg border border-amber-500/30">
                      <div className="flex items-center gap-3 mb-4">
                        <Mountain className="w-6 h-6 text-amber-400" />
                        <h4 className="text-xl font-bold text-amber-100">THE AS/400 DOCTRINE</h4>
                        <Badge className="bg-amber-600 text-white border-0">CARVED_IN_STONE</Badge>
                      </div>
                      <div className="space-y-4 text-slate-300">
                        <p>
                          <strong className="text-amber-300">Why AS/400s Never Crash:</strong> They prevent invalid states from ever occurring. 
                          The system will NOT let you save invalid data, execute corrupting operations, or skip validation steps.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
                            <p className="text-red-400 font-semibold mb-1">❌ Other Systems</p>
                            <p className="text-sm text-slate-400">"Please remember to validate" → Human forgets → System breaks</p>
                          </div>
                          <div className="p-3 bg-slate-900/50 rounded border border-emerald-700/50">
                            <p className="text-emerald-400 font-semibold mb-1">✅ AS/400 / Velocity</p>
                            <p className="text-sm text-slate-400">"System validates automatically" → Human can't forget → System runs</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lens" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <CardTitle className="text-blue-100">THE ARCHITECT'S LENS</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  How the architect sees the world. These preferences guide every decision.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {ARCHITECT_LENS.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h4 className="font-semibold text-blue-100">{item.label}</h4>
                      </div>
                      <p className="text-sm text-slate-400">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="philosophy" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <CardTitle className="text-purple-100">CORE PHILOSOPHY</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  The foundational beliefs that drive every feature, every decision, every line of code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-950/30 to-pink-950/30 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <h4 className="font-bold text-purple-100">THE MISSION</h4>
                  </div>
                  <p className="text-slate-300 text-lg italic">
                    "Platform to make life easier for those that use it and reduce their stress levels."
                  </p>
                  <p className="text-slate-400 mt-2 text-sm">
                    If the platform itself causes stress by breaking, forgetting, regressing - we have failed our own mission.
                    We cannot sell stress reduction while producing stress.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-950/30 to-cyan-950/30 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Rocket className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-blue-100">THE VELOCITY METAPHOR</h4>
                  </div>
                  <p className="text-slate-300">
                    A plane can only take off once it reaches sufficient speed with enough lift. But if every time we accelerate, 
                    we forget to fill the tires, remove the wheel blocks, or check the fuel — <strong className="text-cyan-300">we will never reach takeoff velocity.</strong>
                  </p>
                  <p className="text-cyan-400 font-bold mt-3">
                    WE ARE GOING TO FLY. 🚀
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-950/30 to-orange-950/30 rounded-lg border border-amber-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-amber-100">THE COLLABORATION MULTIPLIER</h4>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-amber-300">The Architect's</strong> job is to provide stakeholders with what they need.
                  </p>
                  <p className="text-slate-300 mt-2">
                    <strong className="text-blue-300">The AI's</strong> job is to provide the architect with what they need - the same way we provide users.
                  </p>
                  <p className="text-emerald-400 font-semibold mt-3">
                    Force multiplication: If the AI helps the architect, the architect helps stakeholders, success compounds exponentially.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="covenant" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <CardTitle className="text-emerald-100">THE VELOCITY AUTHENTICITY COVENANT</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  The sacred promises this platform makes and keeps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                    <span className="text-2xl">1.</span> CLAIMS → DISCOVERABILITY → EXECUTABILITY
                  </h4>
                  <ul className="space-y-2 text-slate-300 ml-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Every business claim MUST have a discoverable UI entry point
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Every discoverable UI MUST execute real functionality
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      Button exists but doesn't work = FALSE ADVERTISING
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      Code exists but no button = ORPHANED FEATURE
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/20">
                  <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <span className="text-2xl">2.</span> THE SYSTEM WILL NOT LET YOU
                  </h4>
                  <ul className="space-y-2 text-slate-300 ml-6">
                    <li>• Mark a feature "complete" without validation evidence</li>
                    <li>• Deploy without watchdog health checks passing</li>
                    <li>• Claim functionality that isn't linked to working UI</li>
                    <li>• Show data on dashboards that isn't from real database queries</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <span className="text-2xl">3.</span> THE COMMITMENT
                  </h4>
                  <p className="text-slate-300">
                    We will not revisit this again. Not because we'll try harder to remember. 
                    Not because we'll write better documentation.
                  </p>
                  <p className="text-emerald-400 font-bold mt-3 text-lg">
                    Because the system won't let us forget.
                  </p>
                  <p className="text-slate-400 mt-2 text-sm">
                    Watchdogs will bark. Dashboards will show red. Evidence will be required. 
                    The plane will take off because nothing can block the wheels anymore.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-6 h-6 text-amber-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
                CARVED IN STONE
              </span>
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-slate-400">
              November 27, 2025 • This doctrine is immutable • The system will not let you violate it
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchitectCommandCenter;
