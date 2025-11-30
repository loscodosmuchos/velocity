/**
 * Validation Studio - Business Logic Audit Center
 * 
 * "No work, no credit" - Test and validate every calculation in the platform.
 * Users can input their own values and see step-by-step calculation proofs.
 * 
 * This is the "Ride-Along Mode" made tangible - a place where trust is built.
 */

import { useState } from "react";
import { 
  Calculator, Play, CheckCircle2, XCircle, Download, 
  FileText, RefreshCw, Filter, Sparkles, Shield,
  ChevronDown, ChevronRight, AlertTriangle, Beaker,
  Copy, Eye, ClipboardList, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { 
  FormulaRegistry, 
  executeFormula, 
  validateCalculation,
  getFormulaList,
  exportTraceAsAudit,
  type CalculationTrace,
  type FormulaDefinition 
} from "@/lib/formula-registry";
import { CalculationProof } from "@/components/ride-along-mode";

interface TestResult {
  formulaId: string;
  trace: CalculationTrace;
  expectedResult?: number;
  passed?: boolean;
  tolerance?: number;
}

const categoryLabels: Record<string, { label: string; color: string; icon: typeof Calculator }> = {
  budget: { label: "Budget", color: "text-emerald-400", icon: Calculator },
  contractor: { label: "Contractor", color: "text-blue-400", icon: Calculator },
  timecard: { label: "Timecard", color: "text-amber-400", icon: Calculator },
  invoice: { label: "Invoice", color: "text-purple-400", icon: Calculator },
  compliance: { label: "Compliance", color: "text-cyan-400", icon: Shield },
  performance: { label: "Performance", color: "text-orange-400", icon: Zap },
};

const baselineTestCases: { formulaId: string; inputs: Record<string, number>; expected: number }[] = [
  { formulaId: 'budget-utilization', inputs: { amount_spent: 50000, total_budget: 100000 }, expected: 50 },
  { formulaId: 'budget-utilization', inputs: { amount_spent: 75000, total_budget: 100000 }, expected: 75 },
  { formulaId: 'budget-utilization', inputs: { amount_spent: 140400, total_budget: 140400 }, expected: 100 },
  { formulaId: 'burn-rate', inputs: { amount_spent: 30000, days_elapsed: 30 }, expected: 30000 },
  { formulaId: 'burn-rate', inputs: { amount_spent: 15000, days_elapsed: 15 }, expected: 30000 },
  { formulaId: 'remaining-budget', inputs: { total_budget: 100000, amount_spent: 60000 }, expected: 40000 },
  { formulaId: 'invoice-variance', inputs: { invoice_amount: 5500, expected_amount: 5000 }, expected: 500 },
  { formulaId: 'invoice-variance', inputs: { invoice_amount: 4800, expected_amount: 5000 }, expected: -200 },
  { formulaId: 'contractor-cost', inputs: { hourly_rate: 75, hours_worked: 40, overtime_hours: 0 }, expected: 3000 },
  { formulaId: 'contractor-cost', inputs: { hourly_rate: 75, hours_worked: 48, overtime_hours: 8 }, expected: 3900 },
  { formulaId: 'timecard-total-hours', inputs: { monday: 8, tuesday: 8, wednesday: 8, thursday: 8, friday: 8, saturday: 0, sunday: 0 }, expected: 40 },
  { formulaId: 'compliance-score', inputs: { requirements_met: 8, total_requirements: 10 }, expected: 80 },
];

export default function ValidationStudioPage() {
  const [selectedFormula, setSelectedFormula] = useState<string>('budget-utilization');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [expectedValue, setExpectedValue] = useState<string>('');
  const [currentTrace, setCurrentTrace] = useState<CalculationTrace | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isRunningBaseline, setIsRunningBaseline] = useState(false);

  const formulas = getFormulaList();
  const currentFormulaDef = FormulaRegistry[selectedFormula];

  const filteredFormulas = filterCategory === 'all' 
    ? formulas 
    : formulas.filter(f => f.category === filterCategory);

  const handleFormulaChange = (formulaId: string) => {
    setSelectedFormula(formulaId);
    setInputValues({});
    setExpectedValue('');
    setCurrentTrace(null);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const executeCurrentFormula = () => {
    const inputs: Record<string, number> = {};
    currentFormulaDef.inputSchema.forEach(schema => {
      const value = inputValues[schema.name];
      inputs[schema.name] = value ? parseFloat(value) : 0;
    });

    if (expectedValue) {
      const result = validateCalculation(selectedFormula, inputs, parseFloat(expectedValue));
      setCurrentTrace(result);
      setTestResults(prev => [{
        formulaId: selectedFormula,
        trace: result,
        expectedResult: parseFloat(expectedValue),
        passed: result.passed,
        tolerance: result.tolerance,
      }, ...prev]);
    } else {
      const trace = executeFormula(selectedFormula, inputs);
      if (trace) {
        setCurrentTrace(trace);
        setTestResults(prev => [{
          formulaId: selectedFormula,
          trace,
        }, ...prev]);
      }
    }
  };

  const runBaselineTests = async () => {
    setIsRunningBaseline(true);
    const results: TestResult[] = [];

    for (const testCase of baselineTestCases) {
      const result = validateCalculation(
        testCase.formulaId, 
        testCase.inputs, 
        testCase.expected,
        0.01
      );
      results.push({
        formulaId: testCase.formulaId,
        trace: result,
        expectedResult: testCase.expected,
        passed: result.passed,
        tolerance: 0.01,
      });
      await new Promise(r => setTimeout(r, 100));
    }

    setTestResults(results);
    setIsRunningBaseline(false);
  };

  const exportAllResults = () => {
    const lines: string[] = [
      '═══════════════════════════════════════════════════════════════',
      'VELOCITY PLATFORM - BUSINESS LOGIC AUDIT REPORT',
      `Generated: ${new Date().toISOString()}`,
      '═══════════════════════════════════════════════════════════════',
      '',
    ];

    const passed = testResults.filter(r => r.passed === true).length;
    const failed = testResults.filter(r => r.passed === false).length;
    const total = testResults.length;

    lines.push(`SUMMARY: ${passed} passed, ${failed} failed, ${total} total`);
    lines.push('');

    testResults.forEach((result, idx) => {
      lines.push(`───────────────────────────────────────────────────────────────`);
      lines.push(`TEST ${idx + 1}: ${result.trace.formulaName}`);
      lines.push(`Status: ${result.passed === undefined ? 'EXECUTED' : result.passed ? 'PASSED' : 'FAILED'}`);
      if (result.expectedResult !== undefined) {
        lines.push(`Expected: ${result.expectedResult}, Actual: ${result.trace.finalResult}`);
      }
      lines.push('');
      lines.push(exportTraceAsAudit(result.trace));
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logic-audit-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const passedCount = testResults.filter(r => r.passed === true).length;
  const failedCount = testResults.filter(r => r.passed === false).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Beaker className="h-6 w-6 text-blue-400" />
            </div>
            Validation Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            "No work, no credit" - Test and validate every calculation with full chain of custody
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={runBaselineTests}
            disabled={isRunningBaseline}
            className="bg-slate-800 border-slate-700 hover:bg-slate-700"
          >
            {isRunningBaseline ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Baseline Tests
          </Button>
          <Button
            variant="outline"
            onClick={exportAllResults}
            disabled={testResults.length === 0}
            className="bg-slate-800 border-slate-700 hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-white">{testResults.length}</div>
              <div className="text-xs text-slate-400">Tests Run</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-400">{passedCount}</div>
              <div className="text-xs text-emerald-400/70">Passed</div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-400">{failedCount}</div>
              <div className="text-xs text-red-400/70">Failed</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-400">
                {testResults.length > 0 ? Math.round((passedCount / testResults.length) * 100) : 0}%
              </div>
              <div className="text-xs text-blue-400/70">Pass Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="worksheet" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="worksheet" className="data-[state=active]:bg-slate-700">
            <ClipboardList className="h-4 w-4 mr-2" />
            Worksheet
          </TabsTrigger>
          <TabsTrigger value="formulas" className="data-[state=active]:bg-slate-700">
            <Calculator className="h-4 w-4 mr-2" />
            Formula Catalog
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-slate-700">
            <FileText className="h-4 w-4 mr-2" />
            Test Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="worksheet">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  Test a Calculation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter your own values to validate the formula
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Select Formula</Label>
                  <Select value={selectedFormula} onValueChange={handleFormulaChange}>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {formulas.map(formula => (
                        <SelectItem key={formula.id} value={formula.id}>
                          <div className="flex items-center gap-2">
                            <span className={categoryLabels[formula.category]?.color}>
                              {categoryLabels[formula.category]?.label}
                            </span>
                            <span className="text-slate-300">-</span>
                            <span>{formula.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentFormulaDef && (
                  <>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Formula:</div>
                      <div className="text-sm font-mono text-blue-400">{currentFormulaDef.formula}</div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-300">Input Values</Label>
                      {currentFormulaDef.inputSchema.map(schema => (
                        <div key={schema.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-slate-400">{schema.description}</Label>
                            <Badge variant="outline" className="text-[10px]">{schema.type}</Badge>
                          </div>
                          <Input
                            type="number"
                            placeholder={schema.name}
                            value={inputValues[schema.name] || ''}
                            onChange={e => handleInputChange(schema.name, e.target.value)}
                            className="bg-slate-800 border-slate-600"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Expected Result (Optional - for validation)</Label>
                      <Input
                        type="number"
                        placeholder="Enter expected value to validate"
                        value={expectedValue}
                        onChange={e => setExpectedValue(e.target.value)}
                        className="bg-slate-800 border-slate-600"
                      />
                      <p className="text-xs text-slate-500">
                        If provided, the system will verify the calculation matches (±1% tolerance)
                      </p>
                    </div>

                    <Button 
                      onClick={executeCurrentFormula}
                      className="w-full bg-blue-600 hover:bg-blue-500"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Execute & Show Work
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-emerald-400" />
                  Calculation Proof
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Chain of custody - every step shown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTrace ? (
                  <CalculationProof trace={currentTrace} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <Sparkles className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-center">
                      Execute a calculation to see<br />
                      the step-by-step proof here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="formulas">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Formula Catalog</CardTitle>
                  <CardDescription className="text-slate-400">
                    All registered calculations in the platform
                  </CardDescription>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categoryLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFormulas.map(formula => (
                  <AccordionItem 
                    key={formula.id} 
                    value={formula.id}
                    className="border border-slate-700 rounded-lg px-4 bg-slate-800/30"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge className={cn(
                          "text-xs",
                          categoryLabels[formula.category]?.color,
                          "bg-slate-800"
                        )}>
                          {categoryLabels[formula.category]?.label}
                        </Badge>
                        <span className="text-slate-200">{formula.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-slate-400">{formula.description}</p>
                        
                        <div className="p-3 rounded bg-slate-900/50 font-mono text-sm">
                          <div className="text-xs text-slate-500 mb-1">Formula:</div>
                          <div className="text-blue-400">{formula.formula}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-2">Inputs:</div>
                          <div className="grid gap-2">
                            {formula.inputSchema.map(input => (
                              <div 
                                key={input.name}
                                className="flex items-center justify-between p-2 rounded bg-slate-900/30"
                              >
                                <span className="text-sm text-slate-300">{input.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[10px]">{input.type}</Badge>
                                  {input.required && (
                                    <Badge className="text-[10px] bg-amber-500/20 text-amber-400">required</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFormulaChange(formula.id)}
                          className="bg-slate-800 border-slate-600"
                        >
                          <Beaker className="h-4 w-4 mr-2" />
                          Test This Formula
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Test Results History</CardTitle>
                  <CardDescription className="text-slate-400">
                    Audit trail of all executed calculations
                  </CardDescription>
                </div>
                {testResults.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestResults([])}
                    className="bg-slate-800 border-slate-600"
                  >
                    Clear Results
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <FileText className="h-12 w-12 mb-4 opacity-30" />
                  <p>No test results yet</p>
                  <p className="text-xs mt-1">Run calculations to see results here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "p-4 rounded-lg border",
                        result.passed === true 
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : result.passed === false
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-slate-800/50 border-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.passed === true ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : result.passed === false ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <Calculator className="h-5 w-5 text-blue-400" />
                          )}
                          <span className="font-medium text-white">{result.trace.formulaName}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(result.trace.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-xs text-slate-500">Result</span>
                          <div className="font-mono text-white">
                            {result.trace.finalResult.toLocaleString()} {result.trace.unit}
                          </div>
                        </div>
                        {result.expectedResult !== undefined && (
                          <div>
                            <span className="text-xs text-slate-500">Expected</span>
                            <div className="font-mono text-slate-400">
                              {result.expectedResult.toLocaleString()}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-xs text-slate-500">Steps</span>
                          <div className="text-slate-300">{result.trace.steps.length}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(exportTraceAsAudit(result.trace));
                          }}
                          className="text-xs"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Proof
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentTrace(result.trace)}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
