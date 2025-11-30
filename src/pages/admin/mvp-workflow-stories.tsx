import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Brain,
  Target,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  FileText,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeBlock {
  time: string;
  icon: React.ReactNode;
  title: string;
  without: string;
  with: string;
  savings: string;
  emotion: "stressed" | "neutral" | "relieved" | "excited";
}

interface PersonaStory {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  tagline: string;
  morningAnxiety: string;
  eveningReality: string;
  timeBlocks: TimeBlock[];
  weeklyROI: {
    hoursSaved: number;
    stressReduction: string;
    decisionsImproved: number;
    costAvoidance: string;
  };
}

const personaStories: PersonaStory[] = [
  {
    id: "ben",
    name: "Ben Martinez",
    title: "Senior Project Manager",
    avatar: "BM",
    color: "from-blue-500 to-cyan-500",
    tagline: "From drowning in 165 projects to commanding them",
    morningAnxiety: "Wake up at 5:30am already stressed. Check phone in bed for overnight fires. Wonder which budget is about to blow up today. Feel the weight of 165 active projects pressing down before coffee even touches lips.",
    eveningReality: "Leave at 5:15pm with zero pending approvals. Dashboard already showed tomorrow's priorities. Sleep comes easier knowing the AI caught the budget variance before it became a crisis.",
    timeBlocks: [
      {
        time: "6:00 AM",
        icon: <Coffee className="h-5 w-5" />,
        title: "Morning Review",
        without: "Scroll through 47 emails looking for fires. Miss the budget alert buried in thread #23. Discover SOW is 90% consumed when contractor asks for extension.",
        with: "Dashboard shows 3 priorities needing attention. AI already flagged the SOW at 75% with 30-day runway. One-click approval queue ready.",
        savings: "45 min → 8 min",
        emotion: "relieved",
      },
      {
        time: "9:00 AM",
        icon: <Sun className="h-5 w-5" />,
        title: "Timecard Approvals",
        without: "Open each of 23 timecards individually. Cross-reference with SOW limits. Calculate remaining budget manually. Takes until lunch.",
        with: "Bulk approve 23 timecards with AI validation in 2 clicks. System already verified SOW limits and flagged the one overtime exception.",
        savings: "3 hours → 5 min",
        emotion: "excited",
      },
      {
        time: "1:00 PM",
        icon: <Target className="h-5 w-5" />,
        title: "Budget Meeting Prep",
        without: "Scramble to build slides. Pull data from 4 systems. Numbers don't match. VP asks question about Q3 trend you can't answer.",
        with: "Executive brief auto-generated with accurate data. Trend analysis ready. Walk into meeting with complete picture. VP impressed.",
        savings: "2 hours → 10 min",
        emotion: "excited",
      },
      {
        time: "4:00 PM",
        icon: <Sunset className="h-5 w-5" />,
        title: "Contractor Issue",
        without: "Contractor compliance expires tomorrow. Nobody noticed. Emergency scramble to find documents. Stay late calling HR.",
        with: "Got 30-day alert last month. Contractor submitted renewal docs via voice agent. Already processed and approved.",
        savings: "Crisis avoided",
        emotion: "relieved",
      },
    ],
    weeklyROI: {
      hoursSaved: 18,
      stressReduction: "70%",
      decisionsImproved: 35,
      costAvoidance: "$45,000",
    },
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    title: "Finance/AP Manager",
    avatar: "SC",
    color: "from-amber-500 to-orange-500",
    tagline: "From reconciliation nightmares to first-pass accuracy",
    morningAnxiety: "Start each day knowing there's a discrepancy hiding somewhere. Invoice doesn't match timecard. Timecard doesn't match SOW. Audit file incomplete. Late payment penalty looming.",
    eveningReality: "Invoice processing queue: zero. All payments scheduled. Audit trail complete. Month-end close will be on time for the first time in memory.",
    timeBlocks: [
      {
        time: "7:30 AM",
        icon: <Coffee className="h-5 w-5" />,
        title: "Invoice Processing",
        without: "12 invoices arrived overnight. Manual match to timecards. One discrepancy found after 2 hours of checking. Another hiding in the stack.",
        with: "AI pre-matched all 12 invoices. 11 green-lit for payment. 1 flagged with exact discrepancy: 'Timecard shows 38hrs, invoice shows 40hrs - contact Sarah T.'",
        savings: "3 hours → 15 min",
        emotion: "relieved",
      },
      {
        time: "10:00 AM",
        icon: <DollarSign className="h-5 w-5" />,
        title: "Budget Variance Report",
        without: "Export from 3 systems. Merge in Excel. Formulas break. Numbers don't add up. Rebuild from scratch.",
        with: "Real-time dashboard already shows variance by project. Drill down to any anomaly. Export to CFO with one click.",
        savings: "4 hours → 5 min",
        emotion: "excited",
      },
      {
        time: "2:00 PM",
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "Payment Crisis",
        without: "Vendor calls angry about late payment. Scramble to find what happened. Approval was stuck in someone's queue. Relationship damaged.",
        with: "SLA alerts showed approval at risk 48 hours ago. Auto-escalated. Paid on time. Vendor sends thank you note.",
        savings: "Crisis avoided",
        emotion: "relieved",
      },
      {
        time: "4:30 PM",
        icon: <FileText className="h-5 w-5" />,
        title: "Audit Preparation",
        without: "Auditor asks for documentation trail. Spend evening hunting files. Some missing. Heart rate elevated.",
        with: "Complete audit trail generated automatically. Every approval, timestamp, and document linked. Auditor impressed by compliance maturity.",
        savings: "8 hours → 2 min",
        emotion: "excited",
      },
    ],
    weeklyROI: {
      hoursSaved: 22,
      stressReduction: "80%",
      decisionsImproved: 45,
      costAvoidance: "$125,000",
    },
  },
  {
    id: "marcus",
    name: "Marcus Williams",
    title: "Head of Procurement",
    avatar: "MW",
    color: "from-purple-500 to-indigo-500",
    tagline: "From reactive firefighting to strategic command",
    morningAnxiety: "Another vendor crisis brewing. Contract renewal snuck up again. Negotiating blind without performance data. SOW portfolio scattered across emails and spreadsheets.",
    eveningReality: "Strategic dashboard shows entire vendor portfolio health. Renewal calendar prevents surprises. Performance data backs every negotiation. Procurement finally feels proactive.",
    timeBlocks: [
      {
        time: "6:30 AM",
        icon: <Coffee className="h-5 w-5" />,
        title: "Portfolio Review",
        without: "Open 7 spreadsheets. Try to remember which SOWs are expiring. Miss the one that expires in 2 weeks. Forced into emergency extension at vendor's terms.",
        with: "SOW Command Center shows portfolio health at a glance. 90-day renewal calendar proactive. Strategic decisions made early.",
        savings: "2 hours → 10 min",
        emotion: "relieved",
      },
      {
        time: "9:30 AM",
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Vendor Negotiation",
        without: "Walk into negotiation with gut feeling. Vendor quotes 15% increase. No data to counter. Accept unfavorable terms.",
        with: "AI-generated vendor scorecard shows delivery issues. Market rate comparison ready. Negotiate 5% decrease with performance clauses.",
        savings: "$180K savings",
        emotion: "excited",
      },
      {
        time: "1:00 PM",
        icon: <Brain className="h-5 w-5" />,
        title: "Contract Review",
        without: "Legal returns contract with 12 issues after 2 weeks. Send back to vendor. Delay project by a month.",
        with: "AI gap analysis identified issues in 2 minutes. Addressed before legal review. Contract approved in 3 days.",
        savings: "3 weeks → 3 days",
        emotion: "excited",
      },
      {
        time: "3:30 PM",
        icon: <Users className="h-5 w-5" />,
        title: "Stakeholder Update",
        without: "Spend afternoon building slides. Data is stale. CFO asks about spend trend you haven't calculated.",
        with: "Executive brief auto-generated with real-time data. Walk in confident. CFO asks 'How did you build this?' Answer: 'Velocity.'",
        savings: "3 hours → 5 min",
        emotion: "excited",
      },
    ],
    weeklyROI: {
      hoursSaved: 15,
      stressReduction: "75%",
      decisionsImproved: 25,
      costAvoidance: "$350,000",
    },
  },
  {
    id: "lisa",
    name: "Lisa Thompson",
    title: "Compliance Officer",
    avatar: "LT",
    color: "from-red-500 to-rose-500",
    tagline: "From audit anxiety to compliance confidence",
    morningAnxiety: "Check certification expiration spreadsheet. Pray nothing expired overnight without notification. Wonder what policy violation is hiding in the 400 active contractors.",
    eveningReality: "Compliance dashboard green across the board. 30-day alerts working. Training completion tracked automatically. Sleep soundly knowing exposure is minimal.",
    timeBlocks: [
      {
        time: "7:00 AM",
        icon: <Shield className="h-5 w-5" />,
        title: "Compliance Check",
        without: "Manually check 400 contractor certifications. Miss the 3 that expired yesterday. Discover non-compliant work happened. Remediation required.",
        with: "Dashboard shows 100% compliance. 30-day alerts triggered last month. All renewals processed. Zero exposure.",
        savings: "4 hours → 2 min",
        emotion: "relieved",
      },
      {
        time: "10:00 AM",
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "Policy Violation Alert",
        without: "Manager approved contractor work outside SOW scope. Discover during audit 6 months later. Financial impact unknown.",
        with: "Real-time policy check flagged scope violation before approval. Manager notified. Scope adjusted or change order processed. Clean.",
        savings: "Audit risk avoided",
        emotion: "relieved",
      },
      {
        time: "1:30 PM",
        icon: <FileText className="h-5 w-5" />,
        title: "Audit Response",
        without: "Auditor requests documentation for 50 contractors. Spend 3 days gathering files. Some missing. Finding: 'Material weakness'",
        with: "Generate complete audit package in 2 minutes. Every document linked. Every approval timestamped. Finding: 'Exemplary compliance maturity'",
        savings: "3 days → 2 min",
        emotion: "excited",
      },
      {
        time: "4:00 PM",
        icon: <Brain className="h-5 w-5" />,
        title: "Risk Assessment",
        without: "Build risk matrix in Excel. Data outdated by the time you finish. Present to board with caveats.",
        with: "Real-time risk scoring by contractor, vendor, project. Board sees live dashboard. Questions answered instantly.",
        savings: "8 hours → 10 min",
        emotion: "excited",
      },
    ],
    weeklyROI: {
      hoursSaved: 20,
      stressReduction: "85%",
      decisionsImproved: 30,
      costAvoidance: "$500,000",
    },
  },
  {
    id: "james",
    name: "James Rivera",
    title: "Operations Manager",
    avatar: "JR",
    color: "from-slate-500 to-zinc-500",
    tagline: "From daily chaos to operational flow",
    morningAnxiety: "First call: contractor no-show. Second call: timecard missing. Third call: compliance document expired. By 9am, already in firefighting mode for the rest of the day.",
    eveningReality: "Proactive alerts prevented all three issues. Contractors submitting timecards via voice. Coverage gaps visible before they happen. Operations finally flowing.",
    timeBlocks: [
      {
        time: "6:00 AM",
        icon: <Coffee className="h-5 w-5" />,
        title: "Daily Operations Check",
        without: "Call site supervisors to verify contractor attendance. Chase missing timecards. Discover coverage gap after work started.",
        with: "Dashboard shows all contractors checked in. Timecards 95% submitted. Coverage heat map green. Sip coffee peacefully.",
        savings: "2 hours → 5 min",
        emotion: "relieved",
      },
      {
        time: "9:00 AM",
        icon: <Users className="h-5 w-5" />,
        title: "Onboarding Pipeline",
        without: "New contractor starts Monday. Background check incomplete. Badge not ready. IT access not provisioned. Delay start by a week.",
        with: "Onboarding checklist auto-triggered 2 weeks ago. Every step tracked. Background check, badge, IT access all green. Contractor starts on time.",
        savings: "1 week delay avoided",
        emotion: "excited",
      },
      {
        time: "12:00 PM",
        icon: <MessageSquare className="h-5 w-5" />,
        title: "Contractor Issue",
        without: "Contractor calls confused about timecard submission. Walk through process on phone for 20 minutes. Multiply by 15 calls per day.",
        with: "Contractor texts 'HELP' to VINessa. Voice agent guides them through submission. Issue resolved in 2 minutes. You never get the call.",
        savings: "5 hours → 0",
        emotion: "excited",
      },
      {
        time: "3:00 PM",
        icon: <Calendar className="h-5 w-5" />,
        title: "Compliance Expirations",
        without: "Discover contractor's safety certification expired last week. Already working on site. Stop work order. Scramble for replacement.",
        with: "Got 30-day alert. Sent renewal reminder. Contractor renewed via mobile. Never interrupted work.",
        savings: "Stop work avoided",
        emotion: "relieved",
      },
    ],
    weeklyROI: {
      hoursSaved: 25,
      stressReduction: "65%",
      decisionsImproved: 50,
      costAvoidance: "$75,000",
    },
  },
];

const emotionColors = {
  stressed: "text-red-400 bg-red-500/10",
  neutral: "text-slate-400 bg-slate-500/10",
  relieved: "text-emerald-400 bg-emerald-500/10",
  excited: "text-blue-400 bg-blue-500/10",
};

export function MVPWorkflowStoriesPage() {
  const [selectedPersona, setSelectedPersona] = useState(personaStories[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);

  const playStory = () => {
    setIsPlaying(true);
    setCurrentBlock(0);
    const interval = setInterval(() => {
      setCurrentBlock((prev) => {
        if (prev >= selectedPersona.timeBlocks.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-400" />
            MVP Workflow Stories
          </h1>
          <p className="text-slate-400 text-lg">
            A Day in the Life: Before and After Velocity
          </p>
        </div>

        {/* Philosophy Banner */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <CardContent className="py-4">
            <p className="text-slate-200 text-center italic">
              "We anticipate user needs because we understand that life and your job is hard. 
              With decades of experience in ATS, HR, and systems development, 
              we've built something that makes experts exclaim 'Finally!' instead of 'Why?'"
            </p>
          </CardContent>
        </Card>

        {/* Persona Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {personaStories.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona);
                setCurrentBlock(0);
                setIsPlaying(false);
              }}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all",
                selectedPersona.id === persona.id
                  ? "border-white/50 bg-slate-800"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", persona.color)}>
                  {persona.avatar}
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{persona.name}</p>
                  <p className="text-slate-400 text-xs">{persona.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Morning Anxiety & Persona Info */}
          <div className="space-y-4">
            <Card className={cn("border-2 bg-gradient-to-br", selectedPersona.color.replace("from-", "from-").replace("to-", "to-") + "/10", "border-white/20")}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl", selectedPersona.color)}>
                    {selectedPersona.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-white">{selectedPersona.name}</CardTitle>
                    <CardDescription className="text-slate-300">{selectedPersona.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-white font-medium italic">"{selectedPersona.tagline}"</p>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-300 text-sm flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Morning Anxiety (Without Velocity)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedPersona.morningAnxiety}</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-300 text-sm flex items-center gap-2">
                  <Sunset className="h-4 w-4" />
                  Evening Reality (With Velocity)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedPersona.eveningReality}</p>
              </CardContent>
            </Card>

            {/* Weekly ROI */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  Weekly Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{selectedPersona.weeklyROI.hoursSaved}</p>
                  <p className="text-xs text-slate-400">Hours Saved</p>
                </div>
                <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-400">{selectedPersona.weeklyROI.stressReduction}</p>
                  <p className="text-xs text-slate-400">Stress Reduction</p>
                </div>
                <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{selectedPersona.weeklyROI.decisionsImproved}</p>
                  <p className="text-xs text-slate-400">Better Decisions</p>
                </div>
                <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-400">{selectedPersona.weeklyROI.costAvoidance}</p>
                  <p className="text-xs text-slate-400">Cost Avoidance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center & Right: Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={playStory}
                disabled={isPlaying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Playing..." : "Play Day Story"}
              </Button>
              <div className="flex-1">
                <Progress value={(currentBlock + 1) / selectedPersona.timeBlocks.length * 100} className="h-2" />
              </div>
              <span className="text-slate-400 text-sm">
                {currentBlock + 1} / {selectedPersona.timeBlocks.length}
              </span>
            </div>

            {/* Timeline Blocks */}
            <div className="space-y-4">
              {selectedPersona.timeBlocks.map((block, index) => (
                <Card
                  key={index}
                  className={cn(
                    "transition-all duration-300",
                    index === currentBlock && isPlaying
                      ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                      : "bg-slate-800/30 border-slate-700/50"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg text-slate-300">
                          {block.icon}
                        </div>
                        <div>
                          <Badge variant="outline" className="text-slate-400">
                            {block.time}
                          </Badge>
                          <CardTitle className="text-white text-lg mt-1">{block.title}</CardTitle>
                        </div>
                      </div>
                      <Badge className={cn("text-sm", emotionColors[block.emotion])}>
                        {block.savings}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-red-300 text-xs font-semibold mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          WITHOUT VELOCITY
                        </p>
                        <p className="text-slate-300 text-sm">{block.without}</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-emerald-300 text-xs font-semibold mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          WITH VELOCITY
                        </p>
                        <p className="text-slate-300 text-sm">{block.with}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              The Velocity Difference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">100+</p>
                <p className="text-slate-300">Hours Saved Weekly (Combined)</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-400">$1.1M</p>
                <p className="text-slate-300">Annual Cost Avoidance</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400">10</p>
                <p className="text-slate-300">Expert Personas Transformed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-6">
          <p className="text-slate-400 text-lg mb-4">
            These aren't hypothetical stories. This is what happens when decades of ATS, HR, and systems expertise 
            meets AI that actually anticipates what you need.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            See the Live Demo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MVPWorkflowStoriesPage;
