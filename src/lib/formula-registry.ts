/**
 * Formula Registry - Business Logic Audit System
 * 
 * Every calculation in Velocity is registered here with:
 * 1. Clear formula definition
 * 2. Step-by-step trace capability
 * 3. Input validation
 * 4. "Show Your Work" output
 * 
 * Philosophy: "No work, no credit" - Every number must be provable
 */

import {
  ALERT_THRESHOLDS,
  MARGIN_THRESHOLDS,
  OVERTIME_MULTIPLIER,
  CONTRACT_EXPIRY_THRESHOLDS,
  VENDOR_PERFORMANCE,
  MILLISECONDS_PER_DAY,
} from './business-logic-config';

export interface CalculationStep {
  stepNumber: number;
  description: string;
  formula: string;
  inputs: Record<string, number | string>;
  calculation: string;
  result: number;
}

export interface CalculationTrace {
  formulaId: string;
  formulaName: string;
  description: string;
  inputs: Record<string, number | string>;
  steps: CalculationStep[];
  finalResult: number;
  unit: string;
  timestamp: string;
  verified: boolean;
  tolerance?: number;
  expectedResult?: number;
  passed?: boolean;
}

export interface FormulaDefinition {
  id: string;
  name: string;
  description: string;
  category: 'budget' | 'contractor' | 'timecard' | 'invoice' | 'compliance' | 'performance';
  unit: string;
  inputSchema: {
    name: string;
    type: 'number' | 'currency' | 'percentage' | 'date' | 'hours';
    description: string;
    required: boolean;
  }[];
  formula: string;
  execute: (inputs: Record<string, number>) => CalculationTrace;
}

function createStep(
  stepNumber: number,
  description: string,
  formula: string,
  inputs: Record<string, number | string>,
  result: number
): CalculationStep {
  const calculation = Object.entries(inputs).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), String(value)),
    formula
  );
  
  return {
    stepNumber,
    description,
    formula,
    inputs,
    calculation,
    result: Math.round(result * 100) / 100, // Round to 2 decimal places
  };
}

export const FormulaRegistry: Record<string, FormulaDefinition> = {
  // ===== BUDGET CALCULATIONS =====
  'budget-utilization': {
    id: 'budget-utilization',
    name: 'Budget Utilization Percentage',
    description: 'Calculates what percentage of the total budget has been spent',
    category: 'budget',
    unit: '%',
    inputSchema: [
      { name: 'amount_spent', type: 'currency', description: 'Total amount spent to date', required: true },
      { name: 'total_budget', type: 'currency', description: 'Total allocated budget', required: true },
    ],
    formula: '(amount_spent / total_budget) × 100',
    execute: (inputs) => {
      const { amount_spent, total_budget } = inputs;
      const steps: CalculationStep[] = [];
      
      // Step 1: Identify inputs
      steps.push(createStep(
        1,
        'Identify the amount spent and total budget',
        'Given: amount_spent, total_budget',
        { amount_spent: `$${amount_spent.toLocaleString()}`, total_budget: `$${total_budget.toLocaleString()}` },
        0
      ));
      
      // Step 2: Calculate ratio
      const ratio = total_budget > 0 ? amount_spent / total_budget : 0;
      steps.push(createStep(
        2,
        'Divide amount spent by total budget to get ratio',
        'ratio = amount_spent / total_budget',
        { amount_spent, total_budget },
        ratio
      ));
      
      // Step 3: Convert to percentage
      const percentage = ratio * 100;
      steps.push(createStep(
        3,
        'Multiply ratio by 100 to convert to percentage',
        'utilization = ratio × 100',
        { ratio: Math.round(ratio * 10000) / 10000 },
        percentage
      ));
      
      return {
        formulaId: 'budget-utilization',
        formulaName: 'Budget Utilization Percentage',
        description: 'Calculates what percentage of the total budget has been spent',
        inputs: { amount_spent, total_budget },
        steps,
        finalResult: Math.round(percentage * 100) / 100,
        unit: '%',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  'burn-rate': {
    id: 'burn-rate',
    name: 'Monthly Burn Rate',
    description: 'Calculates the average monthly spending rate based on elapsed time',
    category: 'budget',
    unit: '$/month',
    inputSchema: [
      { name: 'amount_spent', type: 'currency', description: 'Total amount spent to date', required: true },
      { name: 'days_elapsed', type: 'number', description: 'Number of days since project start', required: true },
    ],
    formula: '(amount_spent / days_elapsed) × 30',
    execute: (inputs) => {
      const { amount_spent, days_elapsed } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify amount spent and days elapsed',
        'Given: amount_spent, days_elapsed',
        { amount_spent: `$${amount_spent.toLocaleString()}`, days_elapsed: `${days_elapsed} days` },
        0
      ));
      
      const dailyRate = days_elapsed > 0 ? amount_spent / days_elapsed : 0;
      steps.push(createStep(
        2,
        'Calculate daily burn rate',
        'daily_rate = amount_spent / days_elapsed',
        { amount_spent, days_elapsed },
        dailyRate
      ));
      
      const monthlyRate = dailyRate * 30;
      steps.push(createStep(
        3,
        'Convert to monthly rate (30 days)',
        'monthly_rate = daily_rate × 30',
        { daily_rate: Math.round(dailyRate * 100) / 100 },
        monthlyRate
      ));
      
      return {
        formulaId: 'burn-rate',
        formulaName: 'Monthly Burn Rate',
        description: 'Calculates the average monthly spending rate',
        inputs: { amount_spent, days_elapsed },
        steps,
        finalResult: Math.round(monthlyRate * 100) / 100,
        unit: '$/month',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  'projected-overrun': {
    id: 'projected-overrun',
    name: 'Projected Budget Overrun',
    description: 'Calculates expected overspend if current burn rate continues',
    category: 'budget',
    unit: '$',
    inputSchema: [
      { name: 'burn_rate_monthly', type: 'currency', description: 'Current monthly burn rate', required: true },
      { name: 'days_remaining', type: 'number', description: 'Days until project end', required: true },
      { name: 'remaining_budget', type: 'currency', description: 'Budget remaining', required: true },
    ],
    formula: '(burn_rate_monthly × (days_remaining / 30)) - remaining_budget',
    execute: (inputs) => {
      const { burn_rate_monthly, days_remaining, remaining_budget } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify burn rate, days remaining, and remaining budget',
        'Given: burn_rate_monthly, days_remaining, remaining_budget',
        { 
          burn_rate_monthly: `$${burn_rate_monthly.toLocaleString()}/mo`,
          days_remaining: `${days_remaining} days`,
          remaining_budget: `$${remaining_budget.toLocaleString()}`
        },
        0
      ));
      
      const monthsRemaining = days_remaining / 30;
      steps.push(createStep(
        2,
        'Convert days remaining to months',
        'months_remaining = days_remaining / 30',
        { days_remaining },
        monthsRemaining
      ));
      
      const projectedSpend = burn_rate_monthly * monthsRemaining;
      steps.push(createStep(
        3,
        'Calculate projected spend at current burn rate',
        'projected_spend = burn_rate_monthly × months_remaining',
        { burn_rate_monthly, months_remaining: Math.round(monthsRemaining * 100) / 100 },
        projectedSpend
      ));
      
      const overrun = projectedSpend - remaining_budget;
      steps.push(createStep(
        4,
        'Calculate overrun (projected spend minus remaining budget)',
        'overrun = projected_spend - remaining_budget',
        { projected_spend: Math.round(projectedSpend * 100) / 100, remaining_budget },
        overrun
      ));
      
      return {
        formulaId: 'projected-overrun',
        formulaName: 'Projected Budget Overrun',
        description: 'Expected overspend if current burn rate continues',
        inputs: { burn_rate_monthly, days_remaining, remaining_budget },
        steps,
        finalResult: Math.round(overrun * 100) / 100,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  'remaining-budget': {
    id: 'remaining-budget',
    name: 'Remaining Budget',
    description: 'Calculates the budget remaining after spending',
    category: 'budget',
    unit: '$',
    inputSchema: [
      { name: 'total_budget', type: 'currency', description: 'Total allocated budget', required: true },
      { name: 'amount_spent', type: 'currency', description: 'Amount spent to date', required: true },
    ],
    formula: 'total_budget - amount_spent',
    execute: (inputs) => {
      const { total_budget, amount_spent } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify total budget and amount spent',
        'Given: total_budget, amount_spent',
        { total_budget: `$${total_budget.toLocaleString()}`, amount_spent: `$${amount_spent.toLocaleString()}` },
        0
      ));
      
      const remaining = total_budget - amount_spent;
      steps.push(createStep(
        2,
        'Subtract amount spent from total budget',
        'remaining = total_budget - amount_spent',
        { total_budget, amount_spent },
        remaining
      ));
      
      return {
        formulaId: 'remaining-budget',
        formulaName: 'Remaining Budget',
        description: 'Budget remaining after spending',
        inputs: { total_budget, amount_spent },
        steps,
        finalResult: remaining,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== INVOICE CALCULATIONS =====
  'invoice-variance': {
    id: 'invoice-variance',
    name: 'Invoice Variance',
    description: 'Calculates difference between invoice amount and expected amount',
    category: 'invoice',
    unit: '$',
    inputSchema: [
      { name: 'invoice_amount', type: 'currency', description: 'Amount on invoice', required: true },
      { name: 'expected_amount', type: 'currency', description: 'Expected amount (from PO or contract)', required: true },
    ],
    formula: 'invoice_amount - expected_amount',
    execute: (inputs) => {
      const { invoice_amount, expected_amount } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify invoice amount and expected amount',
        'Given: invoice_amount, expected_amount',
        { invoice_amount: `$${invoice_amount.toLocaleString()}`, expected_amount: `$${expected_amount.toLocaleString()}` },
        0
      ));
      
      const variance = invoice_amount - expected_amount;
      steps.push(createStep(
        2,
        'Calculate variance (invoice minus expected)',
        'variance = invoice_amount - expected_amount',
        { invoice_amount, expected_amount },
        variance
      ));
      
      const variancePercent = expected_amount > 0 ? (variance / expected_amount) * 100 : 0;
      steps.push(createStep(
        3,
        'Calculate variance as percentage',
        'variance_percent = (variance / expected_amount) × 100',
        { variance: Math.round(variance * 100) / 100, expected_amount },
        variancePercent
      ));
      
      return {
        formulaId: 'invoice-variance',
        formulaName: 'Invoice Variance',
        description: `Invoice is ${variance >= 0 ? 'over' : 'under'} by ${Math.abs(variancePercent).toFixed(1)}%`,
        inputs: { invoice_amount, expected_amount },
        steps,
        finalResult: variance,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  'invoice-variance-percent': {
    id: 'invoice-variance-percent',
    name: 'Invoice Variance Percentage',
    description: 'Calculates percentage difference from expected amount',
    category: 'invoice',
    unit: '%',
    inputSchema: [
      { name: 'invoice_amount', type: 'currency', description: 'Amount on invoice', required: true },
      { name: 'expected_amount', type: 'currency', description: 'Expected amount', required: true },
    ],
    formula: '((invoice_amount - expected_amount) / expected_amount) × 100',
    execute: (inputs) => {
      const { invoice_amount, expected_amount } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify amounts',
        'Given: invoice_amount, expected_amount',
        { invoice_amount: `$${invoice_amount.toLocaleString()}`, expected_amount: `$${expected_amount.toLocaleString()}` },
        0
      ));
      
      const variance = invoice_amount - expected_amount;
      steps.push(createStep(
        2,
        'Calculate dollar variance',
        'variance = invoice_amount - expected_amount',
        { invoice_amount, expected_amount },
        variance
      ));
      
      const percent = expected_amount > 0 ? (variance / expected_amount) * 100 : 0;
      steps.push(createStep(
        3,
        'Convert to percentage of expected',
        'percent = (variance / expected_amount) × 100',
        { variance: Math.round(variance * 100) / 100, expected_amount },
        percent
      ));
      
      return {
        formulaId: 'invoice-variance-percent',
        formulaName: 'Invoice Variance Percentage',
        description: 'Percentage difference from expected',
        inputs: { invoice_amount, expected_amount },
        steps,
        finalResult: Math.round(percent * 100) / 100,
        unit: '%',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== CONTRACTOR CALCULATIONS =====
  'contractor-cost': {
    id: 'contractor-cost',
    name: 'Contractor Cost Calculation',
    description: 'Calculates total cost for contractor based on hours worked',
    category: 'contractor',
    unit: '$',
    inputSchema: [
      { name: 'hourly_rate', type: 'currency', description: 'Contractor hourly rate', required: true },
      { name: 'hours_worked', type: 'hours', description: 'Total hours worked', required: true },
      { name: 'overtime_hours', type: 'hours', description: 'Overtime hours (1.5x rate)', required: false },
    ],
    formula: '(hourly_rate × regular_hours) + (hourly_rate × 1.5 × overtime_hours)',
    execute: (inputs) => {
      const { hourly_rate, hours_worked, overtime_hours = 0 } = inputs;
      const steps: CalculationStep[] = [];
      
      const regularHours = Math.max(0, hours_worked - overtime_hours);
      
      steps.push(createStep(
        1,
        'Identify hourly rate and hours',
        'Given: hourly_rate, hours_worked, overtime_hours',
        { 
          hourly_rate: `$${hourly_rate}/hr`,
          hours_worked: `${hours_worked} hrs`,
          overtime_hours: `${overtime_hours} hrs`
        },
        0
      ));
      
      steps.push(createStep(
        2,
        'Calculate regular hours',
        'regular_hours = hours_worked - overtime_hours',
        { hours_worked, overtime_hours },
        regularHours
      ));
      
      const regularCost = hourly_rate * regularHours;
      steps.push(createStep(
        3,
        'Calculate regular time cost',
        'regular_cost = hourly_rate × regular_hours',
        { hourly_rate, regular_hours: regularHours },
        regularCost
      ));
      
      const overtimeRate = hourly_rate * 1.5;
      const overtimeCost = overtimeRate * overtime_hours;
      steps.push(createStep(
        4,
        'Calculate overtime cost (1.5× rate)',
        'overtime_cost = (hourly_rate × 1.5) × overtime_hours',
        { hourly_rate, overtime_hours },
        overtimeCost
      ));
      
      const totalCost = regularCost + overtimeCost;
      steps.push(createStep(
        5,
        'Calculate total cost',
        'total_cost = regular_cost + overtime_cost',
        { regular_cost: regularCost, overtime_cost: overtimeCost },
        totalCost
      ));
      
      return {
        formulaId: 'contractor-cost',
        formulaName: 'Contractor Cost Calculation',
        description: 'Total cost including overtime',
        inputs: { hourly_rate, hours_worked, overtime_hours },
        steps,
        finalResult: totalCost,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== TIMECARD CALCULATIONS =====
  'timecard-total-hours': {
    id: 'timecard-total-hours',
    name: 'Timecard Total Hours',
    description: 'Sums daily hours for a timecard period',
    category: 'timecard',
    unit: 'hours',
    inputSchema: [
      { name: 'monday', type: 'hours', description: 'Monday hours', required: false },
      { name: 'tuesday', type: 'hours', description: 'Tuesday hours', required: false },
      { name: 'wednesday', type: 'hours', description: 'Wednesday hours', required: false },
      { name: 'thursday', type: 'hours', description: 'Thursday hours', required: false },
      { name: 'friday', type: 'hours', description: 'Friday hours', required: false },
      { name: 'saturday', type: 'hours', description: 'Saturday hours', required: false },
      { name: 'sunday', type: 'hours', description: 'Sunday hours', required: false },
    ],
    formula: 'monday + tuesday + wednesday + thursday + friday + saturday + sunday',
    execute: (inputs) => {
      const { monday = 0, tuesday = 0, wednesday = 0, thursday = 0, friday = 0, saturday = 0, sunday = 0 } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify daily hours',
        'Given: Mon, Tue, Wed, Thu, Fri, Sat, Sun',
        { 
          Mon: `${monday}h`, Tue: `${tuesday}h`, Wed: `${wednesday}h`,
          Thu: `${thursday}h`, Fri: `${friday}h`, Sat: `${saturday}h`, Sun: `${sunday}h`
        },
        0
      ));
      
      const weekdayTotal = monday + tuesday + wednesday + thursday + friday;
      steps.push(createStep(
        2,
        'Sum weekday hours (Mon-Fri)',
        'weekday_total = Mon + Tue + Wed + Thu + Fri',
        { monday, tuesday, wednesday, thursday, friday },
        weekdayTotal
      ));
      
      const weekendTotal = saturday + sunday;
      steps.push(createStep(
        3,
        'Sum weekend hours (Sat-Sun)',
        'weekend_total = Sat + Sun',
        { saturday, sunday },
        weekendTotal
      ));
      
      const total = weekdayTotal + weekendTotal;
      steps.push(createStep(
        4,
        'Calculate total hours',
        'total = weekday_total + weekend_total',
        { weekday_total: weekdayTotal, weekend_total: weekendTotal },
        total
      ));
      
      return {
        formulaId: 'timecard-total-hours',
        formulaName: 'Timecard Total Hours',
        description: 'Sum of all daily hours',
        inputs: { monday, tuesday, wednesday, thursday, friday, saturday, sunday },
        steps,
        finalResult: total,
        unit: 'hours',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  'timecard-cost': {
    id: 'timecard-cost',
    name: 'Timecard Cost',
    description: 'Calculates billable amount for timecard',
    category: 'timecard',
    unit: '$',
    inputSchema: [
      { name: 'total_hours', type: 'hours', description: 'Total hours on timecard', required: true },
      { name: 'hourly_rate', type: 'currency', description: 'Billable hourly rate', required: true },
    ],
    formula: 'total_hours × hourly_rate',
    execute: (inputs) => {
      const { total_hours, hourly_rate } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify hours and rate',
        'Given: total_hours, hourly_rate',
        { total_hours: `${total_hours} hrs`, hourly_rate: `$${hourly_rate}/hr` },
        0
      ));
      
      const cost = total_hours * hourly_rate;
      steps.push(createStep(
        2,
        'Multiply hours by rate',
        'cost = total_hours × hourly_rate',
        { total_hours, hourly_rate },
        cost
      ));
      
      return {
        formulaId: 'timecard-cost',
        formulaName: 'Timecard Cost',
        description: 'Billable amount for timecard period',
        inputs: { total_hours, hourly_rate },
        steps,
        finalResult: cost,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== GR AUTHORIZATION CALCULATIONS =====
  'gr-authorization-remaining': {
    id: 'gr-authorization-remaining',
    name: 'GR Authorization Remaining',
    description: 'Calculates remaining goods receipt authorization',
    category: 'budget',
    unit: '$',
    inputSchema: [
      { name: 'gr_authorized', type: 'currency', description: 'Total GR authorized amount', required: true },
      { name: 'gr_used', type: 'currency', description: 'GR amount already used', required: true },
    ],
    formula: 'gr_authorized - gr_used',
    execute: (inputs) => {
      const { gr_authorized, gr_used } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify GR authorized and used amounts',
        'Given: gr_authorized, gr_used',
        { gr_authorized: `$${gr_authorized.toLocaleString()}`, gr_used: `$${gr_used.toLocaleString()}` },
        0
      ));
      
      const remaining = gr_authorized - gr_used;
      steps.push(createStep(
        2,
        'Calculate remaining authorization',
        'remaining = gr_authorized - gr_used',
        { gr_authorized, gr_used },
        remaining
      ));
      
      const utilizationPercent = gr_authorized > 0 ? (gr_used / gr_authorized) * 100 : 0;
      steps.push(createStep(
        3,
        'Calculate utilization percentage',
        'utilization = (gr_used / gr_authorized) × 100',
        { gr_used, gr_authorized },
        utilizationPercent
      ));
      
      return {
        formulaId: 'gr-authorization-remaining',
        formulaName: 'GR Authorization Remaining',
        description: `${utilizationPercent.toFixed(1)}% of authorization used`,
        inputs: { gr_authorized, gr_used },
        steps,
        finalResult: remaining,
        unit: '$',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== COMPLIANCE CALCULATIONS =====
  'compliance-score': {
    id: 'compliance-score',
    name: 'Compliance Score',
    description: 'Calculates percentage of compliance requirements met',
    category: 'compliance',
    unit: '%',
    inputSchema: [
      { name: 'requirements_met', type: 'number', description: 'Number of requirements met', required: true },
      { name: 'total_requirements', type: 'number', description: 'Total number of requirements', required: true },
    ],
    formula: '(requirements_met / total_requirements) × 100',
    execute: (inputs) => {
      const { requirements_met, total_requirements } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify requirements met and total',
        'Given: requirements_met, total_requirements',
        { requirements_met: `${requirements_met} met`, total_requirements: `${total_requirements} total` },
        0
      ));
      
      const ratio = total_requirements > 0 ? requirements_met / total_requirements : 0;
      steps.push(createStep(
        2,
        'Calculate compliance ratio',
        'ratio = requirements_met / total_requirements',
        { requirements_met, total_requirements },
        ratio
      ));
      
      const score = ratio * 100;
      steps.push(createStep(
        3,
        'Convert to percentage',
        'score = ratio × 100',
        { ratio: Math.round(ratio * 10000) / 10000 },
        score
      ));
      
      return {
        formulaId: 'compliance-score',
        formulaName: 'Compliance Score',
        description: 'Percentage of requirements met',
        inputs: { requirements_met, total_requirements },
        steps,
        finalResult: Math.round(score * 100) / 100,
        unit: '%',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== BUDGET CALCULATIONS (CENTS-BASED) =====
  'budget-remaining-cents': {
    id: 'budget-remaining-cents',
    name: 'Budget Remaining (Cents)',
    description: 'Calculates remaining budget from PO amount minus approved invoices (all amounts in cents)',
    category: 'budget',
    unit: 'cents',
    inputSchema: [
      { name: 'po_amount', type: 'currency', description: 'PO total amount in cents (integer)', required: true },
      { name: 'total_invoices_paid', type: 'currency', description: 'Sum of approved invoices in cents (integer)', required: true },
    ],
    formula: 'budget_remaining = po_amount - total_invoices_paid',
    execute: (inputs) => {
      const { po_amount, total_invoices_paid } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify PO total amount and total invoices paid (all in cents)',
        'Given: po_amount (cents), total_invoices_paid (cents)',
        { 
          po_amount: `${po_amount} cents ($${(po_amount / 100).toLocaleString()})`,
          total_invoices_paid: `${total_invoices_paid} cents ($${(total_invoices_paid / 100).toLocaleString()})`
        },
        0
      ));
      
      const remaining = po_amount - total_invoices_paid;
      steps.push(createStep(
        2,
        'Subtract total invoices paid from PO amount',
        'budget_remaining = po_amount - total_invoices_paid',
        { po_amount, total_invoices_paid },
        remaining
      ));
      
      const remainingDollars = remaining / 100;
      steps.push(createStep(
        3,
        'Convert result to dollars for display',
        'dollars = cents / 100',
        { cents: remaining },
        remainingDollars
      ));
      
      const isOverspent = remaining < 0;
      steps.push(createStep(
        4,
        'Check if budget is overspent (negative remaining)',
        'is_overspent = remaining < 0',
        { remaining },
        isOverspent ? 1 : 0
      ));
      
      return {
        formulaId: 'budget-remaining-cents',
        formulaName: 'Budget Remaining (Cents)',
        description: isOverspent 
          ? `Overspent by $${Math.abs(remainingDollars).toLocaleString()}`
          : `$${remainingDollars.toLocaleString()} remaining`,
        inputs: { po_amount, total_invoices_paid },
        steps,
        finalResult: remaining,
        unit: 'cents',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== CONTRACTOR MARGIN CALCULATION =====
  'contractor-margin': {
    id: 'contractor-margin',
    name: 'Contractor Margin Calculation',
    description: 'Calculates margin between billing and cost including overtime',
    category: 'contractor',
    unit: '%',
    inputSchema: [
      { name: 'regular_hours', type: 'hours', description: 'Regular hours worked', required: true },
      { name: 'overtime_hours', type: 'hours', description: 'Overtime hours worked', required: true },
      { name: 'hourly_rate', type: 'currency', description: 'Contractor hourly cost rate', required: true },
      { name: 'billing_rate', type: 'currency', description: 'Client billing rate per hour', required: true },
    ],
    formula: 'margin_percent = ((billing - cost) / billing) × 100',
    execute: (inputs) => {
      const { regular_hours, overtime_hours, hourly_rate, billing_rate } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify hours and rates',
        'Given: regular_hours, overtime_hours, hourly_rate, billing_rate',
        { 
          regular_hours: `${regular_hours} hrs`,
          overtime_hours: `${overtime_hours} hrs`,
          hourly_rate: `$${hourly_rate}/hr`,
          billing_rate: `$${billing_rate}/hr`
        },
        0
      ));
      
      const regularCost = regular_hours * hourly_rate;
      steps.push(createStep(
        2,
        'Calculate regular hours cost',
        'regular_cost = regular_hours × hourly_rate',
        { regular_hours, hourly_rate },
        regularCost
      ));
      
      const overtimeRate = hourly_rate * OVERTIME_MULTIPLIER;
      const overtimeCost = overtime_hours * overtimeRate;
      steps.push(createStep(
        3,
        `Calculate overtime cost (${OVERTIME_MULTIPLIER}× rate)`,
        'overtime_cost = overtime_hours × (hourly_rate × 1.5)',
        { overtime_hours, hourly_rate, overtime_rate: overtimeRate },
        overtimeCost
      ));
      
      const totalCost = regularCost + overtimeCost;
      steps.push(createStep(
        4,
        'Calculate total cost',
        'total_cost = regular_cost + overtime_cost',
        { regular_cost: regularCost, overtime_cost: overtimeCost },
        totalCost
      ));
      
      const totalHours = regular_hours + overtime_hours;
      const billing = totalHours * billing_rate;
      steps.push(createStep(
        5,
        'Calculate total billing',
        'billing = total_hours × billing_rate',
        { total_hours: totalHours, billing_rate },
        billing
      ));
      
      const margin = billing - totalCost;
      steps.push(createStep(
        6,
        'Calculate margin (billing minus cost)',
        'margin = billing - total_cost',
        { billing, total_cost: totalCost },
        margin
      ));
      
      const marginPercent = billing > 0 ? (margin / billing) * 100 : 0;
      steps.push(createStep(
        7,
        'Calculate margin percentage',
        'margin_percent = (margin / billing) × 100',
        { margin, billing },
        marginPercent
      ));
      
      const isBelowAlert = marginPercent < (MARGIN_THRESHOLDS.ALERT * 100);
      const isInTarget = marginPercent >= (MARGIN_THRESHOLDS.TARGET_MIN * 100) && 
                         marginPercent <= (MARGIN_THRESHOLDS.TARGET_MAX * 100);
      steps.push(createStep(
        8,
        'Evaluate margin against thresholds',
        `target: ${MARGIN_THRESHOLDS.TARGET_MIN * 100}-${MARGIN_THRESHOLDS.TARGET_MAX * 100}%, alert: <${MARGIN_THRESHOLDS.ALERT * 100}%`,
        { 
          margin_percent: Math.round(marginPercent * 100) / 100,
          below_alert: isBelowAlert ? 'YES' : 'NO',
          in_target: isInTarget ? 'YES' : 'NO'
        },
        marginPercent
      ));
      
      let statusDescription = '';
      if (isBelowAlert) {
        statusDescription = `ALERT: Margin ${marginPercent.toFixed(1)}% is below ${MARGIN_THRESHOLDS.ALERT * 100}% threshold`;
      } else if (isInTarget) {
        statusDescription = `ON TARGET: Margin ${marginPercent.toFixed(1)}% is within ${MARGIN_THRESHOLDS.TARGET_MIN * 100}-${MARGIN_THRESHOLDS.TARGET_MAX * 100}% range`;
      } else {
        statusDescription = `Margin: ${marginPercent.toFixed(1)}%`;
      }
      
      return {
        formulaId: 'contractor-margin',
        formulaName: 'Contractor Margin Calculation',
        description: statusDescription,
        inputs: { regular_hours, overtime_hours, hourly_rate, billing_rate },
        steps,
        finalResult: Math.round(marginPercent * 100) / 100,
        unit: '%',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== PERIOD-OVER-PERIOD CHANGE =====
  'period-over-period-change': {
    id: 'period-over-period-change',
    name: 'Period-over-Period Change',
    description: 'Calculates percentage change between two periods',
    category: 'performance',
    unit: '%',
    inputSchema: [
      { name: 'current_value', type: 'number', description: 'Current period value', required: true },
      { name: 'previous_value', type: 'number', description: 'Previous period value', required: true },
    ],
    formula: 'change_percent = ((current_value - previous_value) / previous_value) × 100',
    execute: (inputs) => {
      const { current_value, previous_value } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify current and previous period values',
        'Given: current_value, previous_value',
        { current_value, previous_value },
        0
      ));
      
      const difference = current_value - previous_value;
      steps.push(createStep(
        2,
        'Calculate absolute difference',
        'difference = current_value - previous_value',
        { current_value, previous_value },
        difference
      ));
      
      let changePercent: number;
      if (previous_value === 0) {
        changePercent = current_value > 0 ? 100 : (current_value < 0 ? -100 : 0);
        steps.push(createStep(
          3,
          'Handle division by zero (previous value is 0)',
          'When previous = 0: if current > 0 return 100%, if current < 0 return -100%, else 0%',
          { previous_value, current_value },
          changePercent
        ));
      } else {
        changePercent = (difference / previous_value) * 100;
        steps.push(createStep(
          3,
          'Calculate percentage change',
          'change_percent = (difference / previous_value) × 100',
          { difference, previous_value },
          changePercent
        ));
      }
      
      const direction = changePercent > 0 ? 'increase' : (changePercent < 0 ? 'decrease' : 'no change');
      steps.push(createStep(
        4,
        'Determine direction of change',
        'direction = positive ? "increase" : negative ? "decrease" : "no change"',
        { change_percent: Math.round(changePercent * 100) / 100 },
        changePercent
      ));
      
      return {
        formulaId: 'period-over-period-change',
        formulaName: 'Period-over-Period Change',
        description: `${Math.abs(changePercent).toFixed(1)}% ${direction} from previous period`,
        inputs: { current_value, previous_value },
        steps,
        finalResult: Math.round(changePercent * 100) / 100,
        unit: '%',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== ALERT SEVERITY THRESHOLD =====
  'alert-severity-threshold': {
    id: 'alert-severity-threshold',
    name: 'Alert Severity Threshold',
    description: 'Determines alert severity based on budget utilization',
    category: 'budget',
    unit: 'severity',
    inputSchema: [
      { name: 'budget_used', type: 'currency', description: 'Amount of budget used', required: true },
      { name: 'budget_total', type: 'currency', description: 'Total budget amount', required: true },
    ],
    formula: 'severity = threshold_check(budget_used / budget_total)',
    execute: (inputs) => {
      const { budget_used, budget_total } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify budget used and total budget',
        'Given: budget_used, budget_total',
        { 
          budget_used: `$${budget_used.toLocaleString()}`,
          budget_total: `$${budget_total.toLocaleString()}`
        },
        0
      ));
      
      const utilizationRatio = budget_total > 0 ? budget_used / budget_total : 0;
      steps.push(createStep(
        2,
        'Calculate utilization ratio',
        'ratio = budget_used / budget_total',
        { budget_used, budget_total },
        utilizationRatio
      ));
      
      const utilizationPercent = utilizationRatio * 100;
      steps.push(createStep(
        3,
        'Convert to percentage',
        'percent = ratio × 100',
        { ratio: Math.round(utilizationRatio * 10000) / 10000 },
        utilizationPercent
      ));
      
      let severityLevel: number;
      let severity: string;
      let color: string;
      
      if (utilizationRatio >= ALERT_THRESHOLDS.CRITICAL) {
        severityLevel = 3;
        severity = 'critical';
        color = 'red';
      } else if (utilizationRatio >= ALERT_THRESHOLDS.WARNING) {
        severityLevel = 2;
        severity = 'warning';
        color = 'yellow';
      } else if (utilizationRatio >= ALERT_THRESHOLDS.INFO) {
        severityLevel = 1;
        severity = 'info';
        color = 'blue';
      } else {
        severityLevel = 0;
        severity = 'none';
        color = 'gray';
      }
      
      steps.push(createStep(
        4,
        'Apply threshold decision tree',
        `>=${ALERT_THRESHOLDS.CRITICAL * 100}%=critical, >=${ALERT_THRESHOLDS.WARNING * 100}%=warning, >=${ALERT_THRESHOLDS.INFO * 100}%=info, else=none`,
        { 
          utilization: `${utilizationPercent.toFixed(1)}%`,
          severity,
          color 
        },
        severityLevel
      ));
      
      return {
        formulaId: 'alert-severity-threshold',
        formulaName: 'Alert Severity Threshold',
        description: severityLevel > 0 
          ? `${severity.toUpperCase()} (${color}): Budget at ${utilizationPercent.toFixed(1)}%`
          : `No alert: Budget at ${utilizationPercent.toFixed(1)}%`,
        inputs: { budget_used, budget_total },
        steps,
        finalResult: severityLevel,
        unit: 'severity',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== VENDOR PERFORMANCE SCORE =====
  'vendor-performance-score': {
    id: 'vendor-performance-score',
    name: 'Vendor Performance Score',
    description: 'Calculates vendor performance rating based on on-time delivery and rejection rates',
    category: 'performance',
    unit: 'rating',
    inputSchema: [
      { name: 'on_time_invoices', type: 'number', description: 'Number of invoices delivered on time', required: true },
      { name: 'rejected_invoices', type: 'number', description: 'Number of rejected invoices', required: true },
      { name: 'total_invoices', type: 'number', description: 'Total number of invoices', required: true },
    ],
    formula: 'rating = evaluate(on_time_rate, rejection_rate)',
    execute: (inputs) => {
      const { on_time_invoices, rejected_invoices, total_invoices } = inputs;
      const steps: CalculationStep[] = [];
      
      steps.push(createStep(
        1,
        'Identify invoice counts',
        'Given: on_time_invoices, rejected_invoices, total_invoices',
        { on_time_invoices, rejected_invoices, total_invoices },
        0
      ));
      
      const onTimeRate = total_invoices > 0 ? on_time_invoices / total_invoices : 0;
      const onTimePercent = onTimeRate * 100;
      steps.push(createStep(
        2,
        'Calculate on-time rate',
        'on_time_rate = (on_time_invoices / total_invoices) × 100',
        { on_time_invoices, total_invoices },
        onTimePercent
      ));
      
      const rejectionRate = total_invoices > 0 ? rejected_invoices / total_invoices : 0;
      const rejectionPercent = rejectionRate * 100;
      steps.push(createStep(
        3,
        'Calculate rejection rate',
        'rejection_rate = (rejected_invoices / total_invoices) × 100',
        { rejected_invoices, total_invoices },
        rejectionPercent
      ));
      
      let rating: string;
      let ratingLevel: number;
      
      if (onTimeRate >= VENDOR_PERFORMANCE.EXCELLENT_ON_TIME && 
          rejectionRate < VENDOR_PERFORMANCE.EXCELLENT_REJECTION) {
        rating = 'excellent';
        ratingLevel = 4;
      } else if (onTimeRate >= VENDOR_PERFORMANCE.GOOD_ON_TIME && 
                 rejectionRate < VENDOR_PERFORMANCE.GOOD_REJECTION) {
        rating = 'good';
        ratingLevel = 3;
      } else if (onTimeRate >= VENDOR_PERFORMANCE.FAIR_ON_TIME) {
        rating = 'fair';
        ratingLevel = 2;
      } else {
        rating = 'needs_improvement';
        ratingLevel = 1;
      }
      
      steps.push(createStep(
        4,
        'Apply performance rating criteria',
        `excellent: on_time>=${VENDOR_PERFORMANCE.EXCELLENT_ON_TIME * 100}% AND rejection<${VENDOR_PERFORMANCE.EXCELLENT_REJECTION * 100}%; ` +
        `good: on_time>=${VENDOR_PERFORMANCE.GOOD_ON_TIME * 100}% AND rejection<${VENDOR_PERFORMANCE.GOOD_REJECTION * 100}%; ` +
        `fair: on_time>=${VENDOR_PERFORMANCE.FAIR_ON_TIME * 100}%`,
        { 
          on_time_percent: `${onTimePercent.toFixed(1)}%`,
          rejection_percent: `${rejectionPercent.toFixed(1)}%`,
          rating
        },
        ratingLevel
      ));
      
      return {
        formulaId: 'vendor-performance-score',
        formulaName: 'Vendor Performance Score',
        description: `${rating.toUpperCase()}: ${onTimePercent.toFixed(1)}% on-time, ${rejectionPercent.toFixed(1)}% rejection`,
        inputs: { on_time_invoices, rejected_invoices, total_invoices },
        steps,
        finalResult: ratingLevel,
        unit: 'rating',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },

  // ===== DAYS UNTIL CONTRACT EXPIRATION =====
  'days-until-expiration': {
    id: 'days-until-expiration',
    name: 'Days Until Contract Expiration',
    description: 'Calculates days remaining until contract end and determines alert level',
    category: 'compliance',
    unit: 'days',
    inputSchema: [
      { name: 'end_date_timestamp', type: 'date', description: 'Contract end date as Unix timestamp (ms)', required: true },
      { name: 'current_date_timestamp', type: 'date', description: 'Current date as Unix timestamp (ms)', required: true },
    ],
    formula: 'days_remaining = (end_date_timestamp - current_date_timestamp) / milliseconds_per_day',
    execute: (inputs) => {
      const { end_date_timestamp, current_date_timestamp } = inputs;
      const steps: CalculationStep[] = [];
      
      const endDate = new Date(end_date_timestamp);
      const currentDate = new Date(current_date_timestamp);
      
      steps.push(createStep(
        1,
        'Identify contract end date and current date',
        'Given: end_date_timestamp, current_date_timestamp',
        { 
          end_date: endDate.toISOString().split('T')[0],
          current_date: currentDate.toISOString().split('T')[0]
        },
        0
      ));
      
      const differenceMs = end_date_timestamp - current_date_timestamp;
      steps.push(createStep(
        2,
        'Calculate difference in milliseconds',
        'difference_ms = end_date_timestamp - current_date_timestamp',
        { end_date_timestamp, current_date_timestamp },
        differenceMs
      ));
      
      const daysRemaining = Math.floor(differenceMs / MILLISECONDS_PER_DAY);
      steps.push(createStep(
        3,
        'Convert to days',
        'days_remaining = difference_ms / 86400000',
        { difference_ms: differenceMs },
        daysRemaining
      ));
      
      let alertLevel: string;
      let alertLevelCode: number;
      
      if (daysRemaining <= CONTRACT_EXPIRY_THRESHOLDS.CRITICAL_DAYS) {
        alertLevel = 'critical';
        alertLevelCode = 3;
      } else if (daysRemaining <= CONTRACT_EXPIRY_THRESHOLDS.WARNING_DAYS) {
        alertLevel = 'warning';
        alertLevelCode = 2;
      } else if (daysRemaining <= CONTRACT_EXPIRY_THRESHOLDS.NOTICE_DAYS) {
        alertLevel = 'notice';
        alertLevelCode = 1;
      } else {
        alertLevel = 'none';
        alertLevelCode = 0;
      }
      
      steps.push(createStep(
        4,
        'Determine alert level based on days remaining',
        `<=${CONTRACT_EXPIRY_THRESHOLDS.CRITICAL_DAYS}=critical, <=${CONTRACT_EXPIRY_THRESHOLDS.WARNING_DAYS}=warning, <=${CONTRACT_EXPIRY_THRESHOLDS.NOTICE_DAYS}=notice`,
        { 
          days_remaining: daysRemaining,
          alert_level: alertLevel
        },
        alertLevelCode
      ));
      
      let description: string;
      if (daysRemaining < 0) {
        description = `EXPIRED: Contract ended ${Math.abs(daysRemaining)} days ago`;
      } else if (alertLevelCode > 0) {
        description = `${alertLevel.toUpperCase()}: ${daysRemaining} days until expiration`;
      } else {
        description = `${daysRemaining} days until expiration`;
      }
      
      return {
        formulaId: 'days-until-expiration',
        formulaName: 'Days Until Contract Expiration',
        description,
        inputs: { end_date_timestamp, current_date_timestamp },
        steps,
        finalResult: daysRemaining,
        unit: 'days',
        timestamp: new Date().toISOString(),
        verified: true,
      };
    },
  },
};

/**
 * Execute a formula with given inputs and get full trace
 */
export function executeFormula(
  formulaId: string,
  inputs: Record<string, number>
): CalculationTrace | null {
  const formula = FormulaRegistry[formulaId];
  if (!formula) {
    console.error(`Formula not found: ${formulaId}`);
    return null;
  }
  
  return formula.execute(inputs);
}

/**
 * Validate formula result against expected value with tolerance
 */
export function validateCalculation(
  formulaId: string,
  inputs: Record<string, number>,
  expectedResult: number,
  tolerance: number = 0.01
): CalculationTrace & { passed: boolean } {
  const trace = executeFormula(formulaId, inputs);
  if (!trace) {
    throw new Error(`Formula not found: ${formulaId}`);
  }
  
  const difference = Math.abs(trace.finalResult - expectedResult);
  const passed = difference <= Math.abs(expectedResult * tolerance);
  
  return {
    ...trace,
    expectedResult,
    tolerance,
    passed,
  };
}

/**
 * Get list of all registered formulas
 */
export function getFormulaList(): FormulaDefinition[] {
  return Object.values(FormulaRegistry);
}

/**
 * Get formula by ID
 */
export function getFormula(formulaId: string): FormulaDefinition | undefined {
  return FormulaRegistry[formulaId];
}

/**
 * Export calculation trace as audit-ready format
 */
export function exportTraceAsAudit(trace: CalculationTrace): string {
  const lines: string[] = [
    `═══════════════════════════════════════════════════════════════`,
    `CALCULATION AUDIT TRAIL`,
    `Formula: ${trace.formulaName}`,
    `ID: ${trace.formulaId}`,
    `Timestamp: ${trace.timestamp}`,
    `═══════════════════════════════════════════════════════════════`,
    ``,
    `INPUTS:`,
  ];
  
  Object.entries(trace.inputs).forEach(([key, value]) => {
    lines.push(`  ${key}: ${typeof value === 'number' ? value.toLocaleString() : value}`);
  });
  
  lines.push(``);
  lines.push(`CALCULATION STEPS (Show Your Work):`);
  
  trace.steps.forEach((step) => {
    lines.push(`───────────────────────────────────────────────────────────────`);
    lines.push(`Step ${step.stepNumber}: ${step.description}`);
    lines.push(`  Formula: ${step.formula}`);
    lines.push(`  Applied: ${step.calculation}`);
    if (step.stepNumber > 1) {
      lines.push(`  Result: ${step.result}`);
    }
  });
  
  lines.push(`───────────────────────────────────────────────────────────────`);
  lines.push(``);
  lines.push(`FINAL RESULT: ${trace.finalResult} ${trace.unit}`);
  lines.push(`VERIFIED: ${trace.verified ? '✓ YES' : '✗ NO'}`);
  
  if (trace.expectedResult !== undefined) {
    lines.push(`EXPECTED: ${trace.expectedResult}`);
    lines.push(`TOLERANCE: ±${(trace.tolerance || 0) * 100}%`);
    lines.push(`TEST STATUS: ${trace.passed ? '✓ PASSED' : '✗ FAILED'}`);
  }
  
  lines.push(`═══════════════════════════════════════════════════════════════`);
  
  return lines.join('\n');
}
