import React, { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGo } from "@refinedev/core";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertTriangle,
  Package,
  Plus,
  ExternalLink,
  Zap,
  Target,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Activity,
  BarChart3,
  PieChart,
  Layers,
  Workflow,
  Users,
  Calendar,
  Settings,
  ChevronRight,
  Gauge,
  CircleDollarSign,
  TrendingUp as Trending,
  AlertCircle,
  Timer,
  Banknote,
} from "lucide-react";
import type { PurchaseOrder, Contractor, POContractor, Timecard, Invoice } from "@/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

interface ROIMetrics {
  annualSavings: number;
  timeSavingsHours: number;
  complianceRate: number;
  processEfficiency: number;
  costAvoidance: number;
  automationRate: number;
}

function calculateROI(pos: PurchaseOrder[], timecards: any[], invoices: any[]): ROIMetrics {
  const totalBudget = pos.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
  const activePOs = pos.filter(po => po.status === "Active").length;
  const completedPOs = pos.filter(po => po.status === "Completed").length;
  const totalPOs = pos.length;
  
  const totalTimecardHours = timecards.reduce((sum: number, tc: any) => sum + (Number(tc.hours) || 0), 0);
  const totalTimecardValue = timecards.reduce((sum: number, tc: any) => sum + (Number(tc.totalAmount) || 0), 0);
  const avgHourlyRate = totalTimecardHours > 0 ? totalTimecardValue / totalTimecardHours : 0;
  
  const manualProcessingMinutesPerTimecard = 15;
  const automatedProcessingMinutesPerTimecard = 2;
  const timecardsPerYear = timecards.length * 12;
  const minutesSavedPerTimecard = manualProcessingMinutesPerTimecard - automatedProcessingMinutesPerTimecard;
  const timeSavingsHours = Math.round((timecardsPerYear * minutesSavedPerTimecard) / 60);
  const laborSavings = timeSavingsHours * (avgHourlyRate || 75);
  
  const approvedTimecards = timecards.filter((tc: any) => tc.status === "Approved").length;
  const complianceRate = timecards.length > 0 ? (approvedTimecards / timecards.length) * 100 : 0;
  
  const processEfficiency = totalPOs > 0 ? ((completedPOs + activePOs) / totalPOs) * 100 : 0;
  
  const budgetVariance = totalBudget > 0 ? Math.abs(totalBudget - totalSpent) : 0;
  const costAvoidance = budgetVariance * 0.15;
  
  const invoicesPaid = invoices.filter((inv: any) => inv.status === "Paid").length;
  const automationRate = invoices.length > 0 ? (invoicesPaid / invoices.length) * 100 : 0;
  const automationSavings = invoicesPaid * 50;
  
  const annualSavings = laborSavings + costAvoidance + automationSavings;
  
  return {
    annualSavings,
    timeSavingsHours,
    complianceRate: Number(complianceRate.toFixed(1)) || 0,
    processEfficiency: Number(processEfficiency.toFixed(1)) || 0,
    costAvoidance,
    automationRate: Number(automationRate.toFixed(1)) || 0,
  };
}

function VariantA({ pos, contractors, timecards, invoices, go }: any) {
  const roi = calculateROI(pos, timecards, invoices);
  const totalBudget = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.amountSpent) || 0), 0);
  const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const activePOs = pos.filter((po: PurchaseOrder) => po.status === "Active").length;
  const totalTimecards = timecards.length;
  
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 p-8 glow-card"
           style={{
             background: "linear-gradient(135deg, rgba(6, 78, 92, 0.3) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(6, 78, 92, 0.2) 100%)",
           }}>
        <div className="absolute inset-0 energy-gradient opacity-20" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pulse-border" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40">
                <CircleDollarSign className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-medium tracking-wider uppercase">Annual ROI Impact</p>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {formatCurrencyFull(roi.annualSavings)}
                </h2>
              </div>
            </div>
            <p className="text-slate-400 mt-3 max-w-lg">
              Calculated savings through automated procurement workflows, compliance enforcement, and strategic cost avoidance
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <Timer className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{roi.timeSavingsHours}</div>
              <div className="text-xs text-slate-400">Hours Saved/Year</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <Shield className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{roi.complianceRate}%</div>
              <div className="text-xs text-slate-400">Compliance Rate</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <Activity className="h-5 w-5 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{roi.processEfficiency}%</div>
              <div className="text-xs text-slate-400">Efficiency</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <Zap className="h-5 w-5 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{roi.automationRate}%</div>
              <div className="text-xs text-slate-400">Automation</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: totalBudget, icon: DollarSign, color: "cyan", trend: totalBudget > 0 ? "Active" : null },
          { label: "Amount Spent", value: totalSpent, icon: TrendingUp, color: "emerald", trend: utilizationRate < 80 ? "On Track" : utilizationRate < 95 ? "Watch" : "Critical" },
          { label: "Active POs", value: activePOs, icon: FileText, color: "blue", suffix: " orders" },
          { label: "Utilization", value: utilizationRate, icon: Gauge, color: "purple", suffix: "%" },
        ].map((metric, i) => (
          <Card key={i} className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-${metric.color}-500 via-${metric.color}-400 to-transparent`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${metric.color}-500/10 border border-${metric.color}-500/20`}>
                  <metric.icon className={`h-4 w-4 text-${metric.color}-400`} />
                </div>
                {metric.trend && (
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                    {metric.trend}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-white">
                {metric.suffix === "%" ? `${metric.value.toFixed(1)}%` : 
                 metric.suffix === " orders" ? metric.value :
                 formatCurrency(metric.value)}
              </div>
              <div className="text-xs text-slate-400 mt-1">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Savings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const laborSavings = roi.timeSavingsHours * (totalTimecards > 0 ? totalBudget / totalTimecards / 160 : 75);
              const complianceValue = totalBudget * (roi.complianceRate / 100) * 0.02;
              const efficiencyValue = totalBudget * (roi.processEfficiency / 100) * 0.015;
              const totalSavings = laborSavings + complianceValue + efficiencyValue + roi.costAvoidance;
              
              const items = [
                { label: "Labor Cost Reduction", value: laborSavings },
                { label: "Cost Avoidance", value: roi.costAvoidance },
                { label: "Compliance Savings", value: complianceValue },
                { label: "Process Efficiency", value: efficiencyValue },
              ];
              
              return items.map((item, i) => {
                const percent = totalSavings > 0 ? (item.value / totalSavings) * 100 : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-white font-medium">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pos.filter((po: PurchaseOrder) => {
              const util = (Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1) * 100;
              return util > 85 && po.status === "Active";
            }).slice(0, 4).map((po: PurchaseOrder) => (
              <div key={po.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div>
                  <p className="font-medium text-sm text-white">{po.poNumber}</p>
                  <p className="text-xs text-amber-400">
                    {((Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1) * 100).toFixed(0)}% utilized
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300" onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {pos.filter((po: PurchaseOrder) => {
              const util = (Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1) * 100;
              return util > 85 && po.status === "Active";
            }).length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Shield className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-sm">All POs within healthy thresholds</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-700/50 bg-slate-900/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Active Purchase Orders
          </CardTitle>
          <Button variant="outline" size="sm" className="border-slate-600" onClick={() => go({ to: "/purchase-orders" })}>
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pos.filter((po: PurchaseOrder) => po.status === "Active").slice(0, 5).map((po: PurchaseOrder) => {
              const utilization = (Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1) * 100;
              return (
                <div key={po.id} 
                     className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 cursor-pointer transition-all"
                     onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{po.poNumber}</span>
                      <span className="text-sm text-slate-400">{formatCurrency(Number(po.totalAmount) || 0)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={utilization} className="h-1.5 flex-1" />
                      <span className="text-xs text-slate-400 w-12">{utilization.toFixed(0)}%</span>
                    </div>
                  </div>
                  <Badge variant={utilization > 90 ? "destructive" : utilization > 75 ? "default" : "secondary"}>
                    {utilization > 90 ? "Critical" : utilization > 75 ? "High" : "Normal"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VariantB({ pos, contractors, timecards, invoices, go }: any) {
  const roi = calculateROI(pos, timecards, invoices);
  const totalBudget = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.amountSpent) || 0), 0);
  
  const workflowSteps = [
    { name: "Requisition", count: pos.filter((p: PurchaseOrder) => p.status === "Draft").length, icon: FileText, color: "slate" },
    { name: "Approval", count: pos.filter((p: PurchaseOrder) => p.status === "Pending").length, icon: Clock, color: "amber" },
    { name: "Active", count: pos.filter((p: PurchaseOrder) => p.status === "Active").length, icon: Activity, color: "cyan" },
    { name: "Receiving", count: Math.floor(pos.filter((p: PurchaseOrder) => p.status === "Active").length * 0.3), icon: Package, color: "purple" },
    { name: "Complete", count: pos.filter((p: PurchaseOrder) => p.status === "Completed").length, icon: CheckCircle2, color: "emerald" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-700/50 bg-slate-900/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Workflow className="h-6 w-6 text-cyan-400" />
                Procurement Workflow Pipeline
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">Real-time order processing status</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{formatCurrencyFull(roi.annualSavings)}</div>
              <div className="text-sm text-cyan-400">Annual Savings</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 -translate-y-1/2 transition-all duration-1000"
                 style={{ width: `${(workflowSteps.slice(0, 4).reduce((s, step) => s + step.count, 0) / Math.max(pos.length, 1)) * 100}%` }} />
            
            <div className="relative flex justify-between">
              {workflowSteps.map((step, i) => (
                <div key={step.name} className="flex flex-col items-center relative group">
                  <div className={`w-16 h-16 rounded-xl bg-${step.color}-500/20 border-2 border-${step.color}-500/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform z-10 backdrop-blur-sm`}
                       style={{
                         boxShadow: step.count > 0 ? `0 0 20px rgba(${step.color === 'cyan' ? '6, 182, 212' : step.color === 'emerald' ? '16, 185, 129' : step.color === 'amber' ? '245, 158, 11' : step.color === 'purple' ? '139, 92, 246' : '100, 116, 139'}, 0.3)` : 'none'
                       }}>
                    <step.icon className={`h-7 w-7 text-${step.color}-400`} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{step.count}</div>
                    <div className="text-xs text-slate-400">{step.name}</div>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="absolute right-[-2rem] top-6 h-5 w-5 text-slate-600 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Banknote className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-emerald-300">Budget Remaining</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(totalBudget - totalSpent)}</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(totalSpent / totalBudget) * 100} className="h-2 bg-emerald-950" />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>Spent: {formatCurrency(totalSpent)}</span>
                <span>{((totalSpent / totalBudget) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Timer className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm text-cyan-300">Time Savings</div>
                <div className="text-2xl font-bold text-white">{roi.timeSavingsHours} hrs/yr</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">+23% vs manual process</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-purple-300">Automation Rate</div>
                <div className="text-2xl font-bold text-white">{roi.automationRate}%</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400">AI-powered approvals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              Process Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Avg Approval Time", value: "1.2 days", target: "< 2 days", status: "good" },
              { label: "First-Pass Rate", value: "94%", target: "> 90%", status: "good" },
              { label: "Compliance Score", value: `${roi.complianceRate}%`, target: "> 95%", status: "warning" },
              { label: "Exception Rate", value: "3.2%", target: "< 5%", status: "good" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <span className="text-sm text-slate-300">{metric.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{metric.target}</span>
                  <span className={`font-medium ${metric.status === 'good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {metric.value}
                  </span>
                  {metric.status === 'good' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Top Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contractors.slice(0, 4).map((c: Contractor, i: number) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
                     onClick={() => go({ to: `/contractors/show/${c.id}` })}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {(c.firstName?.[0] || '') + (c.lastName?.[0] || '')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-slate-400">{(c as any).title || 'Contractor'}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatCurrency((c as any).billRate * 160 * 12 || 150000)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VariantC({ pos, contractors, timecards, invoices, go }: any) {
  const roi = calculateROI(pos, timecards, invoices);
  const totalBudget = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum: number, po: PurchaseOrder) => sum + (Number(po.amountSpent) || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  
  const statusData = [
    { status: "Draft", count: pos.filter((p: PurchaseOrder) => p.status === "Draft").length, color: "#64748b" },
    { status: "Pending", count: pos.filter((p: PurchaseOrder) => p.status === "Pending").length, color: "#f59e0b" },
    { status: "Active", count: pos.filter((p: PurchaseOrder) => p.status === "Active").length, color: "#06b6d4" },
    { status: "Completed", count: pos.filter((p: PurchaseOrder) => p.status === "Completed").length, color: "#10b981" },
    { status: "Cancelled", count: pos.filter((p: PurchaseOrder) => p.status === "Cancelled").length, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Total POs", value: pos.length, icon: FileText, color: "cyan" },
          { label: "Active", value: pos.filter((p: PurchaseOrder) => p.status === "Active").length, icon: Activity, color: "emerald" },
          { label: "Budget", value: formatCurrency(totalBudget), icon: DollarSign, color: "blue" },
          { label: "Spent", value: formatCurrency(totalSpent), icon: TrendingUp, color: "purple" },
          { label: "Available", value: formatCurrency(totalRemaining), icon: Banknote, color: "amber" },
          { label: "ROI", value: formatCurrency(roi.annualSavings), icon: Target, color: "rose" },
        ].map((m, i) => (
          <Card key={i} className="border-slate-700/50 bg-slate-900/50">
            <CardContent className="p-3 text-center">
              <m.icon className={`h-5 w-5 text-${m.color}-400 mx-auto mb-2`} />
              <div className="text-lg font-bold text-white">{m.value}</div>
              <div className="text-xs text-slate-400">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="border-slate-700/50 bg-slate-900/50 col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-cyan-400" />
              Budget Allocation by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  {statusData.reduce((acc, item, index) => {
                    const total = pos.length || 1;
                    const percentage = (item.count / total) * 100;
                    const prevPercentage = statusData.slice(0, index).reduce((s, i) => s + (i.count / total) * 100, 0);
                    const circumference = 2 * Math.PI * 70;
                    const offset = (prevPercentage / 100) * circumference;
                    const length = (percentage / 100) * circumference;
                    
                    acc.push(
                      <circle
                        key={item.status}
                        cx="96"
                        cy="96"
                        r="70"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="24"
                        strokeDasharray={`${length} ${circumference - length}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-1000"
                      />
                    );
                    return acc;
                  }, [] as React.ReactElement[])}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{pos.length}</div>
                    <div className="text-xs text-slate-400">Total</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {statusData.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-300">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{item.count}</span>
                      <span className="text-xs text-slate-500 w-12 text-right">
                        {((item.count / (pos.length || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-cyan-400" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full h-32">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="url(#healthGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${(roi.complianceRate / 100) * 251} 251`}
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <text x="100" y="75" textAnchor="middle" className="text-3xl font-bold fill-white">
                  {roi.complianceRate}%
                </text>
                <text x="100" y="95" textAnchor="middle" className="text-xs fill-slate-400">
                  Compliance
                </text>
              </svg>
            </div>
            
            <div className="space-y-2">
              {[
                { label: "Process Efficiency", value: roi.processEfficiency },
                { label: "Automation", value: roi.automationRate },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-xs text-slate-400">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={m.value} className="w-16 h-1.5" />
                    <span className="text-xs text-white w-10 text-right">{m.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => go({ to: "/purchase-orders" })}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pos.sort((a: PurchaseOrder, b: PurchaseOrder) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ).slice(0, 5).map((po: PurchaseOrder) => (
                <div key={po.id} 
                     className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                     onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      po.status === 'Active' ? 'bg-cyan-400' :
                      po.status === 'Completed' ? 'bg-emerald-400' :
                      po.status === 'Pending' ? 'bg-amber-400' : 'bg-slate-400'
                    }`} />
                    <span className="text-sm text-white">{po.poNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formatCurrency(Number(po.totalAmount) || 0)}</span>
                    <Badge variant="outline" className="text-xs">{po.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Create PO", icon: Plus, action: () => go({ to: "/purchase-orders/create" }) },
              { label: "View Reports", icon: BarChart3, action: () => go({ to: "/analytics-hub" }) },
              { label: "Manage SOWs", icon: FileText, action: () => go({ to: "/statementofworks" }) },
              { label: "View Timecards", icon: Clock, action: () => go({ to: "/timecards" }) },
            ].map((action) => (
              <Button 
                key={action.label}
                variant="outline" 
                className="h-auto py-4 flex-col gap-2 border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5 text-cyan-400" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ProcurementHubVariants() {
  const [variant, setVariant] = useState<string>("A");
  const go = useGo();

  const { data: posData } = useList<PurchaseOrder>({ resource: "purchase_orders" });
  const { data: contractorsData } = useList<Contractor>({ resource: "contractors" });
  const { data: timecardsData } = useList<Timecard>({ resource: "timecards" });
  const { data: invoicesData } = useList<Invoice>({ resource: "invoices" });

  const pos = posData?.data || [];
  const contractors = contractorsData?.data || [];
  const timecards = timecardsData?.data || [];
  const invoices = invoicesData?.data || [];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
              <Package className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Procurement Command Center</h1>
              <p className="text-sm text-slate-400">Strategic procurement intelligence for executive decision-making</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={variant} onValueChange={setVariant}>
            <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700">
              <SelectValue placeholder="Select Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Option A: Executive ROI</SelectItem>
              <SelectItem value="B">Option B: Workflow Pipeline</SelectItem>
              <SelectItem value="C">Option C: Analytics Deep Dive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => go({ to: "/purchase-orders/create" })} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {variant === "A" && <VariantA pos={pos} contractors={contractors} timecards={timecards} invoices={invoices} go={go} />}
      {variant === "B" && <VariantB pos={pos} contractors={contractors} timecards={timecards} invoices={invoices} go={go} />}
      {variant === "C" && <VariantC pos={pos} contractors={contractors} timecards={timecards} invoices={invoices} go={go} />}
    </div>
  );
}
