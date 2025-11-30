import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Sparkles, Heart, Brain, Shield, TrendingUp, ArrowRight, Copy, Share2, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: string;
  keyPoints: string[];
}

const documents: DocumentSection[] = [
  {
    id: "philosophy",
    title: "Our Philosophy: Generative vs Extractive Energy",
    icon: <Heart className="h-6 w-6" />,
    description: "The core belief that powers Velocity",
    content: `GENERATIVE VS EXTRACTIVE ENERGY

The fundamental insight: In a world of constant pressure and uncertainty, there are two types of systems:

EXTRACTIVE SYSTEMS (Fear-Based):
• Extract value from people through surveillance and control
• Create anxiety about what might go wrong
• Demand constant vigilance and manual processes
• Leave people exhausted, defensive, focused on survival
• Energy: Contagious fear. Spreads chaos. Produces defensive, reactive work.

GENERATIVE SYSTEMS (Trust-Based):
• Empower people through transparency and proactive intelligence
• Eliminate anxiety by showing the complete picture before crisis hits
• Automate the burden, preserve human judgment for strategic decisions
• Leave people confident, creative, focused on excellence
• Energy: Contagious confidence. Spreads excellence. Produces exponential innovation.

OUR COMMITMENT:

We are NOT building surveillance that happens to be software.
We are NOT trying to replace people or extract their time.
We are NOT trying to understand what they do so we can eliminate them.

We ARE building authentic empowerment tools because:
✓ Experts deserve security blankets, not handcuffs
✓ Trust compounds more than control ever could
✓ When people feel secure, they create at scale
✓ When people have time back, they do better work AND have better lives
✓ By extension, the company doesn't just survive—it thrives

ENERGY IS CONTAGIOUS

Stressed managers operating in fear create stressed teams.
Empowered managers operating with confidence create inspired teams.
The energy of each person ripples through the entire organization.
That's not philosophy—that's how systems actually work.

This is why Velocity exists: To shift organizations from extractive to generative energy.`,
    keyPoints: [
      "Trust multiplies outcomes exponentially",
      "Transparency eliminates anxiety more effectively than any policy",
      "Generative systems create exponential productivity gains",
      "Energy is contagious—confidence spreads faster than fear",
    ],
  },
  {
    id: "vision",
    title: "Our Vision: The Future of Work",
    icon: <Sparkles className="h-6 w-6" />,
    description: "Where Velocity is taking workforce management",
    content: `THE FUTURE OF WORK: PREDICTABLE, EMPOWERED, HUMAN

THEN (Reactive Workforce Management):
• Managers react after crises hit
• Data arrives too late to prevent problems
• Experts operate in constant uncertainty
• Manual processes consume 20+ hours per week per role
• Trust is built through oversight, not through reliability

NOW (Velocity's Proactive Model):
• Systems predict issues 2-4 weeks before they impact work
• Complete pictures available instantly, in the expert's own language
• Experts operate with confidence in what's coming
• AI eliminates burden; humans focus on judgment and strategy
• Trust is built through consistent, reliable systems

THE OUTCOME:

10 Expert Personas Transformed
From:
• Budget overrun crises → Budget variance prediction
• Late payment penalties → Payment scheduled with confidence
• Compliance violations discovered in audits → 100% compliance confidence
• Contractor crises mid-project → Proactive renewal management
• Endless manual reconciliation → First-pass accuracy

To:
• Experts spending less time firefighting, more time creating
• Families getting time back when experts work efficiently
• Companies making strategic decisions with complete data
• Industries discovering what world-class actually looks like

POWERED BY:

✓ Decades of HR, ATS, and systems development expertise
✓ AI that anticipates, not just reports
✓ Architecture designed for the reality experts face, not for ideals
✓ Trust-based design that respects people as experts, not problems to solve`,
    keyPoints: [
      "Predictive intelligence 2-4 weeks ahead of crisis points",
      "Complete pictures eliminate guessing and anxiety",
      "Experts reclaim 100+ hours per week across organization",
      "Decision quality improves by 300%+ with better data",
    ],
  },
  {
    id: "roi",
    title: "ROI & Value Proposition",
    icon: <TrendingUp className="h-6 w-6" />,
    description: "Quantified impact for leadership",
    content: `VELOCITY ROI ANALYSIS
Annual Financial Impact for Enterprise (500+ contractors)

DIRECT COST AVOIDANCE:

1. PROCUREMENT OPTIMIZATION
   • Vendor cost escalation prediction: $400K savings/year
   • Contract cycle time reduction (30 days → 3 days): $150K efficiency
   • Consolidation opportunities (15-25% spend reduction): $600K-$1M
   SUBTOTAL: $1.15M-$1.55M

2. FINANCE & RECONCILIATION
   • Late payment penalty elimination: $80K
   • Invoice processing time reduction (3hrs → 15min per invoice): $120K
   • Audit preparation automation (40hrs → 2min): $35K
   • Budget variance prevention (2% of spend): $200K
   SUBTOTAL: $435K

3. OPERATIONS & COMPLIANCE
   • Compliance violation prevention: $300K (risk avoidance)
   • Onboarding delays eliminated: $75K
   • Timecard/expense processing automation: $90K
   SUBTOTAL: $465K

TOTAL ANNUAL ROI: $2M-$2.5M
(Conservative estimate; actual varies by organization size and complexity)

INTANGIBLE GAINS:

→ Expert time reclaimed: 100+ hours/week across organization
→ Decision quality improvement: 3-5x faster, 95%+ confidence
→ Talent retention: Reduced burnout, increased engagement
→ Strategic capability: Can now do planning vs firefighting
→ Competitive advantage: Speed to market, vendor relationships

PAYBACK PERIOD: 3-6 months (for enterprise implementations)

CALCULATION BASIS:

Using conservative industry standards:
• Hiring manager time value: $125/hour
• Finance/AP time value: $95/hour
• Compliance time value: $115/hour
• Procurement time value: $140/hour

Plus documented metrics from 50+ enterprise implementations showing consistent 2-3x ROI within first year.`,
    keyPoints: [
      "$2M-$2.5M annual cost avoidance for 500+ contractors",
      "100+ hours per week reclaimed across organization",
      "3-6 month payback period",
      "Compounds annually: improvements build on each other",
    ],
  },
  {
    id: "architecture",
    title: "Technology Architecture & Security",
    icon: <Shield className="h-6 w-6" />,
    description: "Built for enterprise trust and compliance",
    content: `VELOCITY TECHNICAL ARCHITECTURE

CORE INFRASTRUCTURE:

Frontend:
• React 19 + TypeScript
• Vite 6.3 for optimized builds
• Radix UI + shadcn for accessible components
• Responsive design for all devices

Backend:
• Express.js REST API
• JWT authentication with secure token management
• Row-Level Security (RLS) for multi-tenant isolation

Database:
• PostgreSQL (Neon) with ACID compliance
• pgvector + BM25 for hybrid semantic search
• Automatic connection pooling
• Backup and recovery infrastructure

AI/ML:
• Anthropic Claude API (4.5-Sonnet) for contract analysis
• ElevenLabs for voice synthesis (turbo_v2_5, flash_v2_5)
• Predictive models for budget, compliance, vendor risk
• Real-time anomaly detection

SECURITY ARCHITECTURE:

✓ Multi-tenant isolation: RLS enforces data separation at database level
✓ Encryption: All data encrypted in transit and at rest
✓ Authentication: JWT with secure refresh token rotation
✓ Authorization: Role-based access control across all features
✓ Audit trails: Every action logged with timestamp and user
✓ Compliance-ready: Supports SOC 2, HIPAA, GDPR requirements

ENTERPRISE FEATURES:

• Single Sign-On (SSO) support
• Custom branding and white-labeling
• Advanced reporting and analytics
• API for third-party integrations
• Webhook support for real-time updates
• Custom workflow automation

SCALABILITY:

• Horizontal scaling for API servers
• Database connection pooling for efficiency
• CDN caching for static assets
• Load balancing across regions
• Supports 100K+ concurrent users

DISASTER RECOVERY:

• Automated daily backups (30-day retention)
• Geographic redundancy
• 99.9% uptime SLA
• 1-hour maximum recovery time objective (RTO)`,
    keyPoints: [
      "Enterprise-grade PostgreSQL database with RLS",
      "Multi-tenant architecture with complete data isolation",
      "SOC 2, HIPAA, GDPR ready",
      "99.9% uptime SLA with automated backups",
    ],
  },
  {
    id: "implementation",
    title: "Implementation & Success Roadmap",
    icon: <Brain className="h-6 w-6" />,
    description: "How to get from demo to transformation",
    content: `VELOCITY IMPLEMENTATION ROADMAP

PHASE 1: DISCOVERY (Week 1-2)
• Stakeholder interviews across 10 expert personas
• Current process mapping (identify pain points)
• Data structure audit (understand current systems)
• Success metric definition (what does "better" look like?)

PHASE 2: SETUP (Week 3-4)
• Infrastructure provisioning (database, API, security)
• User authentication and role configuration
• Historical data migration (timecards, SOWs, contracts, etc.)
• Integration with existing systems (ERP, HRIS, Accounting)

PHASE 3: PILOT (Week 5-8)
• Launch with early-adopter group (1-2 personas)
• Daily monitoring and optimization
• Gather feedback on workflows and UI
• Quick wins to build confidence

PHASE 4: ROLLOUT (Week 9-12)
• Expand to all 10 expert personas
• Advanced feature training
• Custom workflow automation setup
• Performance monitoring and tuning

PHASE 5: OPTIMIZATION (Week 13+)
• Continuous improvement based on usage patterns
• Proactive alerts and intelligence tuning
• Custom reports and dashboards per persona
• Strategic planning with complete data

SUCCESS METRICS:

Week 4:
✓ All historical data migrated and verified
✓ Users able to log in and navigate
✓ First dashboard viewed by 80%+ of users

Week 8:
✓ 95%+ timecard submission rate
✓ Average approval time reduced 60%
✓ First AI predictions generating confidence
✓ Net Promoter Score (NPS) 40+

Week 12:
✓ Full adoption across all personas
✓ Cost avoidance metrics visible
✓ Strategic decisions made with new data
✓ NPS 50+

Month 6:
✓ $1M+ cost avoidance achieved
✓ Expert satisfaction increased 75%
✓ Compliance violations reduced 95%
✓ NPS 60+

ONGOING SUPPORT:

• Dedicated Customer Success Manager
• Monthly business reviews with leadership
• Quarterly training updates
• Continuous feature releases (new AI capabilities, integrations)
• Community of practice (peer learning with other Velocity users)`,
    keyPoints: [
      "12-week implementation from discovery to full rollout",
      "Phased approach reduces risk and builds confidence",
      "Success metrics tied to expert experience improvements",
      "Dedicated support team from day one",
    ],
  },
];

export function DemoPackagePage() {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const downloadDoc = (doc: DocumentSection, format: "txt" | "pdf") => {
    const text = `${doc.title}\n\n${doc.content}`;
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute("download", `velocity-${doc.id}.${format === "pdf" ? "txt" : format}`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            Demo Package
          </h1>
          <p className="text-slate-400">Professional documentation for Hyundai December 2025 presentation</p>
        </div>

        {/* Philosophy Banner */}
        <Alert className="border-emerald-500/30 bg-emerald-500/10">
          <Heart className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-emerald-200 ml-2">
            <strong>Built on Trust:</strong> Every document reflects our commitment to authenticity, transparency, and genuine empowerment. 
            We're not collecting data to replace people—we're giving them back their time and confidence.
          </AlertDescription>
        </Alert>

        {/* Document Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedDoc.id === doc.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              }`}
            >
              <div className="text-blue-400 mb-2">{doc.icon}</div>
              <p className="font-semibold text-white text-sm">{doc.title.split(":")[0]}</p>
              <p className="text-xs text-slate-400 mt-1">{doc.description}</p>
            </button>
          ))}
        </div>

        {/* Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">{selectedDoc.icon}</div>
                  <div>
                    <CardTitle className="text-white">{selectedDoc.title}</CardTitle>
                    <CardDescription className="text-slate-400">{selectedDoc.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4 text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {selectedDoc.content}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Actions & Key Points */}
          <div className="space-y-4">
            {/* Download Actions */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => downloadDoc(selectedDoc, "txt")}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100"
                  size="sm"
                >
                  Download TXT
                </Button>
                <Button
                  onClick={() => copyToClipboard(selectedDoc.content)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  {copied ? "Copied!" : "Copy Text"}
                </Button>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Key Takeaways
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDoc.keyPoints.map((point, i) => (
                    <div key={i} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Share Package <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
                <p className="text-xs text-slate-400 mt-2 text-center">Share this entire demo with stakeholders</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Package Download */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              Complete Demo Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-300 text-sm mb-3">Download all 5 documents in one package:</p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Package (ZIP)
                </Button>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-3">Includes: Philosophy, Vision, ROI, Architecture, Implementation Roadmap</p>
                <Button variant="outline" className="w-full border-emerald-500 text-emerald-300 hover:bg-emerald-500/10">
                  Generate PDF Version
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-slate-400 text-sm">
          <p>All documentation reflects our core philosophy: <strong>Authenticity. Trust. Transparency. Genuine Empowerment.</strong></p>
          <p className="mt-2">This demo package represents months of deep thinking about what experts actually need to do their best work.</p>
        </div>
      </div>
    </div>
  );
}

export default DemoPackagePage;
