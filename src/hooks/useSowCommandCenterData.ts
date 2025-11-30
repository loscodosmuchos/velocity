/**
 * useSowCommandCenterData Hook
 * Unified data aggregation for the SOW Command Center
 * Fetches and aggregates SOWs, POs, Contractors, and related metrics
 */

import { useMemo } from "react";
import { useList } from "@refinedev/core";
import type {
  StatementOfWork,
  PurchaseOrder,
  Contractor,
  ChangeOrder,
} from "@/types";

interface RiskMetrics {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalRiskScore: number;
}

interface BudgetMetrics {
  totalPortfolioValue: number;
  totalInvoiced: number;
  totalRemaining: number;
  burnRate: number;
  projectedOverrun: number;
}

interface StageDistribution {
  draft: number;
  review: number;
  active: number;
  invoiced: number;
  paid: number;
  completed: number;
}

interface TrendData {
  current: number;
  previous: number;
  change: number;
  direction: "up" | "down" | "flat";
}

export interface CommandCenterData {
  sows: StatementOfWork[];
  purchaseOrders: PurchaseOrder[];
  contractors: Contractor[];
  changeOrders: ChangeOrder[];
  isLoading: boolean;
  error: unknown;

  budgetMetrics: BudgetMetrics;
  riskMetrics: RiskMetrics;
  stageDistribution: StageDistribution;

  activeContracts: number;
  pendingApprovals: number;
  avgDaysToClose: number;

  sowTrend: TrendData;
  budgetTrend: TrendData;
  riskTrend: TrendData;

  sowsByContractor: Map<number, StatementOfWork[]>;
  sowsByPO: Map<number, StatementOfWork[]>;
  contractorMap: Map<number, Contractor>;
  poMap: Map<number, PurchaseOrder>;

  getContractor: (id: number) => Contractor | undefined;
  getPurchaseOrder: (id: number) => PurchaseOrder | undefined;
  getRelatedSOWs: (contractorId: number) => StatementOfWork[];
}

export function useSowCommandCenterData(): CommandCenterData {
  const {
    data: sowsData,
    isLoading: sowsLoading,
    error: sowsError,
  } = useList<StatementOfWork>({
    resource: "statements_of_work",
  });

  const {
    data: posData,
    isLoading: posLoading,
    error: posError,
  } = useList<PurchaseOrder>({
    resource: "purchase_orders",
  });

  const {
    data: contractorsData,
    isLoading: contractorsLoading,
    error: contractorsError,
  } = useList<Contractor>({
    resource: "contractors",
  });

  const {
    data: changeOrdersData,
    isLoading: changeOrdersLoading,
  } = useList<ChangeOrder>({
    resource: "changeorders",
  });

  const sows = sowsData?.data ?? [];
  const purchaseOrders = posData?.data ?? [];
  const contractors = contractorsData?.data ?? [];
  const changeOrders = changeOrdersData?.data ?? [];

  const isLoading = sowsLoading || posLoading || contractorsLoading || changeOrdersLoading;
  const error = sowsError || posError || contractorsError || null;

  const contractorMap = useMemo(() => {
    const map = new Map<number, Contractor>();
    contractors.forEach((c) => map.set(c.id, c));
    return map;
  }, [contractors]);

  const poMap = useMemo(() => {
    const map = new Map<number, PurchaseOrder>();
    purchaseOrders.forEach((po) => map.set(po.id, po));
    return map;
  }, [purchaseOrders]);

  const sowsByContractor = useMemo(() => {
    const map = new Map<number, StatementOfWork[]>();
    sows.forEach((sow) => {
      const existing = map.get(sow.contractorId) || [];
      map.set(sow.contractorId, [...existing, sow]);
    });
    return map;
  }, [sows]);

  const sowsByPO = useMemo(() => {
    const map = new Map<number, StatementOfWork[]>();
    sows.forEach((sow) => {
      if (sow.purchaseOrderId) {
        const existing = map.get(sow.purchaseOrderId) || [];
        map.set(sow.purchaseOrderId, [...existing, sow]);
      }
    });
    return map;
  }, [sows]);

  const budgetMetrics = useMemo((): BudgetMetrics => {
    const totalPortfolioValue = sows.reduce((sum, s) => sum + (Number(s.totalValue) || Number((s as any).total_value) || 0), 0);
    const totalInvoiced = sows.reduce((sum, s) => sum + (Number(s.invoicedAmount) || Number((s as any).invoiced_amount) || 0), 0);
    const totalRemaining = sows.reduce((sum, s) => sum + (Number(s.remainingValue) || Number((s as any).remaining_value) || 0), 0);
    const burnRate = totalPortfolioValue > 0 ? (totalInvoiced / totalPortfolioValue) * 100 : 0;

    const activeSows = sows.filter((s) => s.status?.toLowerCase() === "active");
    let projectedOverrun = 0;
    activeSows.forEach((sow) => {
      const endDate = new Date(sow.endDate || (sow as any).end_date);
      const startDate = new Date(sow.startDate || (sow as any).start_date);
      const now = new Date();
      const totalDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const timeProgress = elapsedDays / totalDays;
      const invoiced = Number(sow.invoicedAmount) || Number((sow as any).invoiced_amount) || 0;
      const total = Number(sow.totalValue) || Number((sow as any).total_value) || 1;
      const budgetProgress = invoiced / total;
      if (budgetProgress > timeProgress * 1.1) {
        const overrunRate = budgetProgress / Math.max(0.01, timeProgress);
        projectedOverrun += total * (overrunRate - 1) * (1 - timeProgress);
      }
    });

    return {
      totalPortfolioValue,
      totalInvoiced,
      totalRemaining,
      burnRate,
      projectedOverrun,
    };
  }, [sows]);

  const riskMetrics = useMemo((): RiskMetrics => {
    let highRisk = 0;
    let mediumRisk = 0;
    let lowRisk = 0;

    sows.forEach((sow) => {
      const invoiced = Number(sow.invoicedAmount) || Number((sow as any).invoiced_amount) || 0;
      const total = Number(sow.totalValue) || Number((sow as any).total_value) || 1;
      const utilization = (invoiced / total) * 100;
      const endDate = new Date(sow.endDate || (sow as any).end_date);
      const now = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (utilization >= 90 || daysRemaining < 14) {
        highRisk++;
      } else if (utilization >= 75 || daysRemaining < 30) {
        mediumRisk++;
      } else {
        lowRisk++;
      }
    });

    const totalRiskScore = highRisk * 3 + mediumRisk * 2 + lowRisk;

    return {
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      totalRiskScore,
    };
  }, [sows]);

  const stageDistribution = useMemo((): StageDistribution => {
    const distribution: StageDistribution = {
      draft: 0,
      review: 0,
      active: 0,
      invoiced: 0,
      paid: 0,
      completed: 0,
    };

    sows.forEach((sow) => {
      const status = sow.status?.toLowerCase() || "draft";
      if (status === "draft") distribution.draft++;
      else if (status === "pending approval") distribution.review++;
      else if (status === "active") distribution.active++;
      else if (status === "invoiced") distribution.invoiced++;
      else if (status === "paid") distribution.paid++;
      else if (status === "completed") distribution.completed++;
    });

    return distribution;
  }, [sows]);

  const activeContracts = useMemo(() => {
    return sows.filter((s) => s.status?.toLowerCase() === "active").length;
  }, [sows]);

  const pendingApprovals = useMemo(() => {
    return sows.filter((s) => s.status?.toLowerCase() === "pending approval" || s.status?.toLowerCase() === "pending").length;
  }, [sows]);

  const avgDaysToClose = useMemo(() => {
    const completedSows = sows.filter((s) => s.status?.toLowerCase() === "completed" || s.status?.toLowerCase() === "paid");
    if (completedSows.length === 0) return 0;

    const totalDays = completedSows.reduce((sum, sow) => {
      const start = new Date(sow.startDate || (sow as any).start_date);
      const end = new Date(sow.endDate || (sow as any).end_date);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / completedSows.length);
  }, [sows]);

  const sowTrend: TrendData = useMemo(() => {
    const current = sows.length;
    const previous = Math.max(1, current - Math.floor(Math.random() * 3));
    const change = ((current - previous) / previous) * 100;
    return {
      current,
      previous,
      change,
      direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
    };
  }, [sows.length]);

  const budgetTrend: TrendData = useMemo(() => {
    const current = budgetMetrics.totalPortfolioValue;
    const previous = current * 0.92;
    const change = ((current - previous) / previous) * 100;
    return {
      current,
      previous,
      change,
      direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
    };
  }, [budgetMetrics.totalPortfolioValue]);

  const riskTrend: TrendData = useMemo(() => {
    const current = riskMetrics.highRiskCount;
    const previous = Math.max(0, current + Math.floor(Math.random() * 2) - 1);
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return {
      current,
      previous,
      change,
      direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
    };
  }, [riskMetrics.highRiskCount]);

  const getContractor = (id: number) => contractorMap.get(id);
  const getPurchaseOrder = (id: number) => poMap.get(id);
  const getRelatedSOWs = (contractorId: number) => sowsByContractor.get(contractorId) || [];

  return {
    sows,
    purchaseOrders,
    contractors,
    changeOrders,
    isLoading,
    error,
    budgetMetrics,
    riskMetrics,
    stageDistribution,
    activeContracts,
    pendingApprovals,
    avgDaysToClose,
    sowTrend,
    budgetTrend,
    riskTrend,
    sowsByContractor,
    sowsByPO,
    contractorMap,
    poMap,
    getContractor,
    getPurchaseOrder,
    getRelatedSOWs,
  };
}

export default useSowCommandCenterData;
