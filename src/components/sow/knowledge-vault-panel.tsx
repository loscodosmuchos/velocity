import React, { useState, useMemo } from "react";
import {
  BookOpen,
  FileText,
  Users,
  Building2,
  Scale,
  DollarSign,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Search,
  Copy,
  Check,
  ChevronRight,
  Clock,
  FileCheck,
  Zap,
  CreditCard,
  Trophy,
  Target,
  Layers,
  Settings,
  ClipboardList,
  Lightbulb,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MethodologyCard {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  stages?: { name: string; timeline: string; description: string }[];
  guidelines?: { rule: string; importance: "critical" | "high" | "medium" }[];
  decisionGuide?: { scenario: string; recommendation: string; reason: string }[];
}

interface PolicyCard {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  thresholds?: { amount: string; approvers: string[]; sla: string }[];
  stakeholders?: { contractType: string; required: string[] }[];
  checklist?: { item: string; category: string; mandatory: boolean }[];
}

interface StageChecklist {
  stageId: string;
  stageName: string;
  icon: React.ElementType;
  color: string;
  verifications: { item: string; critical: boolean }[];
  pitfalls: { issue: string; solution: string }[];
}

const METHODOLOGY_CARDS: MethodologyCard[] = [
  {
    id: "rfp",
    title: "RFP Process",
    icon: FileText,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    stages: [
      { name: "Requirements Gathering", timeline: "Week 1-2", description: "Define scope, objectives, and success criteria" },
      { name: "RFP Development", timeline: "Week 3-4", description: "Create solicitation document with evaluation criteria" },
      { name: "Vendor Solicitation", timeline: "Week 5-6", description: "Distribute RFP, manage Q&A period" },
      { name: "Proposal Evaluation", timeline: "Week 7-8", description: "Score responses, conduct presentations" },
      { name: "Vendor Selection", timeline: "Week 9", description: "Final selection, notify winners/losers" },
      { name: "Contract Negotiation", timeline: "Week 10-12", description: "Terms, pricing, SLAs finalization" },
    ],
  },
  {
    id: "vms",
    title: "VMS Guidelines",
    icon: Building2,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    guidelines: [
      { rule: "All contractor engagements must be processed through VMS", importance: "critical" },
      { rule: "Worker classification compliance check required before onboarding", importance: "critical" },
      { rule: "Rate card adherence - no exceptions without VP approval", importance: "high" },
      { rule: "Time entry must be submitted weekly by Friday EOD", importance: "high" },
      { rule: "Background check must be completed before start date", importance: "critical" },
      { rule: "SOW must reference master services agreement", importance: "medium" },
      { rule: "Invoice reconciliation required within 5 business days", importance: "high" },
    ],
  },
  {
    id: "msp",
    title: "MSP Framework",
    icon: Layers,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    guidelines: [
      { rule: "Single point of contact for all supplier management", importance: "critical" },
      { rule: "Consolidated billing through MSP provider", importance: "high" },
      { rule: "Tier 1 suppliers: preferred rate + 2% markup max", importance: "high" },
      { rule: "Tier 2 suppliers: standard rate + 5% markup max", importance: "medium" },
      { rule: "Monthly performance scorecard review required", importance: "high" },
      { rule: "SLA violations escalate to account manager within 24hrs", importance: "critical" },
      { rule: "Annual rate negotiations in Q4", importance: "medium" },
    ],
  },
  {
    id: "contract-types",
    title: "Contract Types",
    icon: Scale,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    decisionGuide: [
      { scenario: "Well-defined scope, clear deliverables", recommendation: "Fixed Fee", reason: "Predictable cost, vendor assumes risk" },
      { scenario: "Evolving requirements, R&D work", recommendation: "T&M", reason: "Flexibility to pivot, client assumes risk" },
      { scenario: "Long-term staff augmentation", recommendation: "T&M with cap", reason: "Flexibility with budget protection" },
      { scenario: "Milestone-based project", recommendation: "Fixed Fee phases", reason: "Payment tied to deliverables, shared risk" },
      { scenario: "Ongoing support/maintenance", recommendation: "T&M with retainer", reason: "Guaranteed availability, pay for usage" },
      { scenario: "Complex integration work", recommendation: "Hybrid", reason: "Fixed for known scope, T&M for unknowns" },
    ],
  },
];

const POLICY_CARDS: PolicyCard[] = [
  {
    id: "thresholds",
    title: "Approval Thresholds",
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    thresholds: [
      { amount: "$0 - $50K", approvers: ["Hiring Manager", "Department Head"], sla: "3 business days" },
      { amount: "$50K - $100K", approvers: ["Hiring Manager", "Department Head", "Finance Director"], sla: "5 business days" },
      { amount: "$100K - $500K", approvers: ["Hiring Manager", "VP", "Finance Director", "Legal"], sla: "7 business days" },
      { amount: "$500K+", approvers: ["VP", "CFO", "Legal", "Procurement Director", "CEO (if >$1M)"], sla: "10 business days" },
    ],
  },
  {
    id: "stakeholders",
    title: "Required Stakeholders",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    stakeholders: [
      { contractType: "Fixed Fee SOW", required: ["Project Manager", "Finance Rep", "Legal (>$100K)", "Procurement"] },
      { contractType: "T&M Contract", required: ["Hiring Manager", "Budget Owner", "HR/Compliance", "Procurement"] },
      { contractType: "MSP Engagement", required: ["MSP Account Manager", "Internal Sponsor", "Procurement", "IT Security"] },
      { contractType: "Change Order", required: ["Original Approvers", "Budget Owner", "Project Manager"] },
    ],
  },
  {
    id: "compliance",
    title: "Compliance Checklist",
    icon: ShieldCheck,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    checklist: [
      { item: "Worker classification (W2 vs 1099) verified", category: "Legal", mandatory: true },
      { item: "Background check completed", category: "HR", mandatory: true },
      { item: "NDA/Confidentiality agreement signed", category: "Legal", mandatory: true },
      { item: "Insurance certificates on file", category: "Risk", mandatory: true },
      { item: "Data security training completed", category: "IT", mandatory: true },
      { item: "Rate card compliance verified", category: "Finance", mandatory: false },
      { item: "Diversity supplier status documented", category: "Procurement", mandatory: false },
      { item: "IP assignment clause reviewed", category: "Legal", mandatory: true },
    ],
  },
];

const STAGE_CHECKLISTS: StageChecklist[] = [
  {
    stageId: "draft",
    stageName: "Draft Stage",
    icon: FileText,
    color: "text-slate-400",
    verifications: [
      { item: "Scope and deliverables clearly defined", critical: true },
      { item: "Budget allocated and approved", critical: true },
      { item: "Timeline is realistic and agreed upon", critical: true },
      { item: "Success metrics documented", critical: false },
      { item: "Resource requirements identified", critical: false },
    ],
    pitfalls: [
      { issue: "Vague scope leading to scope creep", solution: "Use SMART criteria for all deliverables" },
      { issue: "Underestimated timeline", solution: "Add 20% buffer for unknowns" },
    ],
  },
  {
    stageId: "review",
    stageName: "Review Stage",
    icon: CheckSquare,
    color: "text-amber-400",
    verifications: [
      { item: "All required approvers identified", critical: true },
      { item: "Legal has reviewed terms and conditions", critical: true },
      { item: "Finance has validated budget allocation", critical: true },
      { item: "Compliance requirements documented", critical: true },
      { item: "Risk assessment completed", critical: false },
    ],
    pitfalls: [
      { issue: "Missing approver delays", solution: "Identify backup approvers upfront" },
      { issue: "Late legal objections", solution: "Engage legal early in draft phase" },
    ],
  },
  {
    stageId: "active",
    stageName: "Active Stage",
    icon: Zap,
    color: "text-emerald-400",
    verifications: [
      { item: "Kick-off meeting completed", critical: true },
      { item: "Time tracking system access granted", critical: true },
      { item: "Regular status meetings scheduled", critical: false },
      { item: "Invoice submission process communicated", critical: true },
      { item: "Escalation path defined", critical: false },
    ],
    pitfalls: [
      { issue: "Burn rate exceeding plan", solution: "Weekly budget reviews, set 75% alerts" },
      { issue: "Scope creep during execution", solution: "Change order process for any additions" },
    ],
  },
  {
    stageId: "invoiced",
    stageName: "Invoiced Stage",
    icon: DollarSign,
    color: "text-blue-400",
    verifications: [
      { item: "Invoice matches approved timecard hours", critical: true },
      { item: "Rates match contract terms", critical: true },
      { item: "All deliverables for milestone verified", critical: true },
      { item: "GR (Goods Receipt) submitted", critical: true },
      { item: "Variance within acceptable threshold (<5%)", critical: false },
    ],
    pitfalls: [
      { issue: "Invoice/timecard mismatch", solution: "Automated reconciliation before submission" },
      { issue: "Missing GR causing payment delays", solution: "GR reminder 3 days after invoice" },
    ],
  },
  {
    stageId: "paid",
    stageName: "Paid Stage",
    icon: CreditCard,
    color: "text-cyan-400",
    verifications: [
      { item: "Payment confirmation received", critical: true },
      { item: "Ledger entries reconciled", critical: true },
      { item: "PO balance updated correctly", critical: true },
      { item: "Contractor notified of payment", critical: false },
    ],
    pitfalls: [
      { issue: "Duplicate payments", solution: "Unique invoice number validation" },
      { issue: "Wrong account credited", solution: "Verify banking details on file annually" },
    ],
  },
  {
    stageId: "completed",
    stageName: "Completed Stage",
    icon: Trophy,
    color: "text-purple-400",
    verifications: [
      { item: "All deliverables accepted and signed off", critical: true },
      { item: "Final invoice processed", critical: true },
      { item: "Knowledge transfer completed", critical: false },
      { item: "Performance evaluation documented", critical: false },
      { item: "Contract archived properly", critical: true },
    ],
    pitfalls: [
      { issue: "Incomplete documentation", solution: "Closure checklist before final sign-off" },
      { issue: "Lessons learned not captured", solution: "Mandatory retrospective for >$100K projects" },
    ],
  },
];

interface KnowledgeVaultPanelProps {
  currentStage?: string;
  searchable?: boolean;
  className?: string;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-700/50 transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-slate-500 hover:text-slate-300" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-800 border-slate-700">
          <p className="text-xs">{copied ? "Copied!" : label || "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ImportanceBadge({ importance }: { importance: "critical" | "high" | "medium" }) {
  const config = {
    critical: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    high: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
    medium: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" },
  };
  const c = config[importance];
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase", c.bg, c.text, c.border)}>
      {importance}
    </span>
  );
}

function MethodologyCardContent({ card }: { card: MethodologyCard }) {
  const Icon = card.icon;

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", card.borderColor, card.bgColor)}>
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-lg bg-slate-800/80 border border-slate-700")}>
          <Icon className={cn("h-4 w-4", card.color)} />
        </div>
        <h4 className="font-semibold text-white">{card.title}</h4>
      </div>

      {card.stages && (
        <div className="space-y-2">
          {card.stages.map((stage, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 rounded bg-slate-800/40">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-cyan-400">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{stage.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400">{stage.timeline}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {card.guidelines && (
        <div className="space-y-2">
          {card.guidelines.map((guideline, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-800/40">
              <ChevronRight className={cn("h-4 w-4 mt-0.5 flex-shrink-0", card.color)} />
              <div className="flex-1">
                <p className="text-sm text-slate-300">{guideline.rule}</p>
              </div>
              <ImportanceBadge importance={guideline.importance} />
            </div>
          ))}
        </div>
      )}

      {card.decisionGuide && (
        <div className="space-y-2">
          {card.decisionGuide.map((guide, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-800/40 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-sm text-slate-300">{guide.scenario}</span>
                </div>
                <Badge className={cn("text-[10px] font-bold", card.bgColor, card.color, "border-0")}>
                  {guide.recommendation}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 pl-5">
                <Lightbulb className="h-3 w-3 inline mr-1 text-amber-400" />
                {guide.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PolicyCardContent({ card }: { card: PolicyCard }) {
  const Icon = card.icon;

  return (
    <div className={cn("rounded-lg border p-4 space-y-3", `border-${card.color.split('-')[1]}-500/30`, card.bgColor)}>
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-lg bg-slate-800/80 border border-slate-700")}>
          <Icon className={cn("h-4 w-4", card.color)} />
        </div>
        <h4 className="font-semibold text-white">{card.title}</h4>
      </div>

      {card.thresholds && (
        <div className="space-y-2">
          {card.thresholds.map((threshold, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-400">{threshold.amount}</span>
                  <CopyButton text={threshold.amount} label="Copy threshold" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SLA: {threshold.sla}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {threshold.approvers.map((approver, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {approver}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {card.stakeholders && (
        <div className="space-y-2">
          {card.stakeholders.map((item, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-800/40">
              <p className="text-sm font-medium text-blue-300 mb-2">{item.contractType}</p>
              <div className="flex flex-wrap gap-1">
                {item.required.map((stakeholder, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {card.checklist && (
        <div className="space-y-1.5">
          {card.checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
              {item.mandatory ? (
                <CheckSquare className="h-4 w-4 text-red-400 flex-shrink-0" />
              ) : (
                <CheckSquare className="h-4 w-4 text-slate-500 flex-shrink-0" />
              )}
              <span className={cn("text-sm flex-1", item.mandatory ? "text-slate-200" : "text-slate-400")}>
                {item.item}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-500">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StageChecklistContent({ checklist, isHighlighted }: { checklist: StageChecklist; isHighlighted: boolean }) {
  const Icon = checklist.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-4 transition-all",
        isHighlighted
          ? "border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20"
          : "border-slate-700/50 bg-slate-800/30"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "p-2 rounded-lg border",
            isHighlighted ? "bg-cyan-500/20 border-cyan-500/30" : "bg-slate-800/80 border-slate-700"
          )}
        >
          <Icon className={cn("h-4 w-4", checklist.color)} />
        </div>
        <h4 className="font-semibold text-white">{checklist.stageName}</h4>
        {isHighlighted && (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">Current Stage</Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <ClipboardList className="h-3 w-3" /> Verification Checklist
          </h5>
          <div className="space-y-1.5">
            {checklist.verifications.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-800/40">
                <CheckSquare
                  className={cn("h-4 w-4 flex-shrink-0", v.critical ? "text-red-400" : "text-slate-500")}
                />
                <span className="text-sm text-slate-300 flex-1">{v.item}</span>
                {v.critical && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-medium">
                    CRITICAL
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Common Pitfalls
          </h5>
          <div className="space-y-2">
            {checklist.pitfalls.map((p, idx) => (
              <div key={idx} className="p-2 rounded bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-300">{p.issue}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Solution:</span> {p.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeVaultPanel({
  currentStage,
  searchable = true,
  className,
}: KnowledgeVaultPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["methodology"]);

  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        methodologyCards: METHODOLOGY_CARDS,
        policyCards: POLICY_CARDS,
        stageChecklists: STAGE_CHECKLISTS,
      };
    }

    const query = searchQuery.toLowerCase();

    const methodologyCards = METHODOLOGY_CARDS.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.stages?.some((s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)) ||
        card.guidelines?.some((g) => g.rule.toLowerCase().includes(query)) ||
        card.decisionGuide?.some((d) => d.scenario.toLowerCase().includes(query) || d.recommendation.toLowerCase().includes(query))
    );

    const policyCards = POLICY_CARDS.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.thresholds?.some((t) => t.amount.toLowerCase().includes(query) || t.approvers.some((a) => a.toLowerCase().includes(query))) ||
        card.stakeholders?.some((s) => s.contractType.toLowerCase().includes(query) || s.required.some((r) => r.toLowerCase().includes(query))) ||
        card.checklist?.some((c) => c.item.toLowerCase().includes(query))
    );

    const stageChecklists = STAGE_CHECKLISTS.filter(
      (checklist) =>
        checklist.stageName.toLowerCase().includes(query) ||
        checklist.verifications.some((v) => v.item.toLowerCase().includes(query)) ||
        checklist.pitfalls.some((p) => p.issue.toLowerCase().includes(query) || p.solution.toLowerCase().includes(query))
    );

    return { methodologyCards, policyCards, stageChecklists };
  }, [searchQuery]);

  const totalResults =
    filteredContent.methodologyCards.length +
    filteredContent.policyCards.length +
    filteredContent.stageChecklists.length;

  return (
    <Card className={cn("border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-900/30 overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Knowledge Vault</h2>
              <p className="text-xs text-slate-500">Procurement best practices & policy quick reference</p>
            </div>
          </div>
        </div>

        {searchable && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {totalResults} result{totalResults !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-3"
        >
          {filteredContent.methodologyCards.length > 0 && (
            <AccordionItem value="methodology" className="border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/20">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Procurement Methodology</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-[10px]">
                    {filteredContent.methodologyCards.length} cards
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredContent.methodologyCards.map((card) => (
                    <MethodologyCardContent key={card.id} card={card} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {filteredContent.policyCards.length > 0 && (
            <AccordionItem value="policy" className="border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/20">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Policy Quick Cards</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">
                    {filteredContent.policyCards.length} cards
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {filteredContent.policyCards.map((card) => (
                    <PolicyCardContent key={card.id} card={card} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {filteredContent.stageChecklists.length > 0 && (
            <AccordionItem value="stages" className="border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/20">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">Stage-Specific Checklists</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-0 text-[10px]">
                    {filteredContent.stageChecklists.length} stages
                  </Badge>
                  {currentStage && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px]">
                      Current: {currentStage}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredContent.stageChecklists.map((checklist) => (
                    <StageChecklistContent
                      key={checklist.stageId}
                      checklist={checklist}
                      isHighlighted={currentStage === checklist.stageId}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {totalResults === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No results found for "{searchQuery}"</p>
            <p className="text-sm text-slate-500 mt-1">Try different keywords or browse all sections</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default KnowledgeVaultPanel;
