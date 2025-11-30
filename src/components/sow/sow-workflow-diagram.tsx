import { useMemo, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import type { StatementOfWork, SOWTranche } from "@/types";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#1e293b",
    primaryColor: "#06b6d4",
    primaryTextColor: "#fff",
    primaryBorderColor: "#3b82f6",
    lineColor: "#64748b",
    secondaryColor: "#1e293b",
    tertiaryColor: "#1e293b",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
});

interface SOWWorkflowDiagramProps {
  sow: StatementOfWork;
  tranches: SOWTranche[];
}

export function SOWWorkflowDiagram({ sow, tranches }: SOWWorkflowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  const mermaidChart = useMemo(() => {
    const statusMap: Record<string, string> = {
      Draft: "🔵 DRAFT",
      "Pending Approval": "🟡 REVIEW",
      Active: "🟢 ACTIVE",
      Invoiced: "💰 INVOICED",
      Paid: "✅ PAID",
      Completed: "🏁 COMPLETED",
    };

    const currentStatus = statusMap[sow.status] || "🔵 DRAFT";
    const paidTranches = tranches.filter((t) => t.status === "paid").length;
    const totalTranches = tranches.length;
    const utilizationPercent = totalTranches > 0 
      ? ((paidTranches / totalTranches) * 100).toFixed(0) 
      : "0";

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const daysRemaining = Math.ceil(
      (new Date(sow.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return `
graph LR
    Start["🚀 SOW INITIATED<br/><strong>${sow.sowNumber}</strong><br/>${formatCurrency(sow.totalValue)}"]
    
    Draft["🔵 DRAFT<br/>Preparation<br/>📝 Terms defined"]
    Review["🟡 REVIEW<br/>Stakeholder Sign-Off<br/>⏳ Awaiting approval"]
    Active["🟢 ACTIVE<br/>Work in Progress<br/>📊 ${paidTranches}/${totalTranches} tranches"]
    Invoice["💰 INVOICING<br/>Payment Submitted<br/>💸 Processing claims"]
    Paid["✅ PAID<br/>Funds Received<br/>🎯 ${utilizationPercent}% complete"]
    Complete["🏁 COMPLETED<br/>Project Closure<br/>✨ Archive & Review"]

    Start --> Draft
    Draft --> Review
    Review --> Active
    Active --> Invoice
    Invoice --> Paid
    Paid --> Complete

    classDef stageDraft fill:#1e293b,stroke:#3b82f6,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stageReview fill:#1e293b,stroke:#f59e0b,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stageActive fill:#1e293b,stroke:#10b981,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stageInvoice fill:#1e293b,stroke:#06b6d4,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stagePaid fill:#1e293b,stroke:#8b5cf6,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stageComplete fill:#1e293b,stroke:#ec4899,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    classDef stageCurrent fill:#1e293b,stroke:#06b6d4,stroke-width:4px,color:#fff,font-size:13px,font-weight:bold
    classDef stageStart fill:#1e293b,stroke:#14b8a6,stroke-width:3px,color:#fff,font-size:13px,font-weight:bold
    
    class Start stageStart
    class Draft stageDraft
    class Review stageReview
    class Active stageCurrent
    class Invoice stageInvoice
    class Paid stagePaid
    class Complete stageComplete

    ${
      sow.status === "Draft"
        ? 'class Draft stageCurrent'
        : sow.status === "Pending Approval"
          ? "class Review stageCurrent"
          : sow.status === "Active"
            ? "class Active stageCurrent"
            : sow.status === "Invoiced"
              ? "class Invoice stageCurrent"
              : sow.status === "Paid"
                ? "class Paid stageCurrent"
                : "class Complete stageCurrent"
    }
    `;
  }, [sow, tranches]);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, mermaidChart);
        setSvgContent(svg);
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setSvgContent("");
      }
    };

    renderDiagram();
  }, [mermaidChart]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 p-6">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
            <span className="text-lg">🚀</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">SOW Workflow Journey</h3>
            <p className="text-xs text-slate-400">Real-time process tracking & milestone visualization</p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 overflow-x-auto">
          <div 
            ref={containerRef}
            className="mermaid-container"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3">
            <div className="text-xs text-slate-400 mb-1">Current Stage</div>
            <div className="text-sm font-bold text-cyan-300">{sow.status}</div>
          </div>
          <div className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3">
            <div className="text-xs text-slate-400 mb-1">Timeline Status</div>
            <div className="text-sm font-bold text-emerald-300">
              {Math.ceil(
                (new Date(sow.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </div>
          </div>
          <div className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3">
            <div className="text-xs text-slate-400 mb-1">Payment Progress</div>
            <div className="text-sm font-bold text-purple-300">
              {tranches.length > 0 
                ? ((tranches.filter((t) => t.status === "paid").length / tranches.length) * 100).toFixed(0)
                : "0"}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
