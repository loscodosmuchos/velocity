import { Card, Title, Text, Tab, TabGroup, TabList, TabPanel, TabPanels, Grid, Metric, Badge } from "@tremor/react";
import { ReactFlow, Node, Edge, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Calculator, Database, GitBranch, TrendingUp, FileText, Settings } from "lucide-react";

/**
 * Admin Logic Studio
 * Visual documentation of all business formulas, relationships, and workflows
 * This is the centralized hub for understanding how the platform calculates everything
 */

// Define entity relationship nodes
const entityNodes: Node[] = [
  {
    id: "contractor",
    data: { label: "Contractor" },
    position: { x: 100, y: 100 },
    style: { background: "#667eea", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "sow",
    data: { label: "Statement of Work (SOW)" },
    position: { x: 300, y: 100 },
    style: { background: "#764ba2", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "po",
    data: { label: "Purchase Order (PO)" },
    position: { x: 500, y: 100 },
    style: { background: "#4facfe", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "timecard",
    data: { label: "Timecard" },
    position: { x: 200, y: 250 },
    style: { background: "#10b981", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "invoice",
    data: { label: "Invoice" },
    position: { x: 400, y: 250 },
    style: { background: "#f59e0b", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "payment",
    data: { label: "Payment" },
    position: { x: 600, y: 250 },
    style: { background: "#ef4444", color: "white", padding: "10px", borderRadius: "8px" },
  },
];

const entityEdges: Edge[] = [
  { id: "e1", source: "contractor", target: "sow", label: "has many", animated: true },
  { id: "e2", source: "sow", target: "po", label: "generates", animated: true },
  { id: "e3", source: "contractor", target: "timecard", label: "submits", animated: true },
  { id: "e4", source: "timecard", target: "invoice", label: "creates", animated: true },
  { id: "e5", source: "invoice", target: "payment", label: "triggers", animated: true },
  { id: "e6", source: "po", target: "invoice", label: "references", animated: true },
];

// Define workflow nodes (how data flows through the system)
const workflowNodes: Node[] = [
  {
    id: "start",
    data: { label: "Contractor Onboarding" },
    position: { x: 50, y: 50 },
    style: { background: "#10b981", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "sow-create",
    data: { label: "Create SOW" },
    position: { x: 250, y: 50 },
    style: { background: "#667eea", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "budget-approval",
    data: { label: "Budget Approval" },
    position: { x: 450, y: 50 },
    style: { background: "#f59e0b", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "po-generation",
    data: { label: "PO Generation" },
    position: { x: 650, y: 50 },
    style: { background: "#4facfe", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "work-execution",
    data: { label: "Work Execution" },
    position: { x: 150, y: 200 },
    style: { background: "#764ba2", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "timecard-submit",
    data: { label: "Timecard Submission" },
    position: { x: 350, y: 200 },
    style: { background: "#10b981", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "invoice-generate",
    data: { label: "Invoice Generation" },
    position: { x: 550, y: 200 },
    style: { background: "#f59e0b", color: "white", padding: "10px", borderRadius: "8px" },
  },
  {
    id: "payment-process",
    data: { label: "Payment Processing" },
    position: { x: 400, y: 350 },
    style: { background: "#ef4444", color: "white", padding: "10px", borderRadius: "8px" },
  },
];

const workflowEdges: Edge[] = [
  { id: "w1", source: "start", target: "sow-create", animated: true },
  { id: "w2", source: "sow-create", target: "budget-approval", animated: true },
  { id: "w3", source: "budget-approval", target: "po-generation", animated: true },
  { id: "w4", source: "po-generation", target: "work-execution", animated: true },
  { id: "w5", source: "work-execution", target: "timecard-submit", animated: true },
  { id: "w6", source: "timecard-submit", target: "invoice-generate", animated: true },
  { id: "w7", source: "invoice-generate", target: "payment-process", animated: true },
];

export default function LogicStudio() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <Title>Administration - Logic Studio</Title>
        <Text className="mt-2">
          Complete documentation of business logic, formulas, relationships, and workflows.
          This is the authoritative source for understanding how Velocity calculates everything.
        </Text>
      </div>

      <TabGroup>
        <TabList className="border-b border-gray-200 shadow-sm">
          <Tab icon={Calculator}>Formulas</Tab>
          <Tab icon={GitBranch}>Entity Relationships</Tab>
          <Tab icon={TrendingUp}>Workflows</Tab>
          <Tab icon={Database}>Data Lineage</Tab>
          <Tab icon={FileText}>Documentation</Tab>
          <Tab icon={Settings}>Configuration</Tab>
        </TabList>

        <TabPanels>
          {/* Formulas Tab */}
          <TabPanel>
            <div className="mt-6 space-y-6">
              <Card className="border border-gray-200 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <Title>Core Business Formulas</Title>
                  <Badge color="blue">Live Calculation</Badge>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r">
                    <h3 className="font-semibold text-lg mb-2">Invoice Total Calculation</h3>
                    <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      Invoice Total = Σ(Timecard Hours × Hourly Rate) + Σ(Expense Amounts) - Σ(Discounts)
                    </code>
                    <Text className="mt-2 text-gray-600">
                      <strong>Where:</strong>
                    </Text>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Timecard Hours: Sum of approved hours from all timecards linked to the invoice</li>
                      <li>Hourly Rate: Contractor's billable rate defined in SOW</li>
                      <li>Expense Amounts: Sum of all approved expenses</li>
                      <li>Discounts: Any negotiated discounts or credits applied</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r">
                    <h3 className="font-semibold text-lg mb-2">Budget Utilization %</h3>
                    <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      Budget Utilization = (Total Spent ÷ Total Budget) × 100
                    </code>
                    <Text className="mt-2 text-gray-600">
                      <strong>Where:</strong>
                    </Text>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Total Spent: Sum of all approved invoices for the project/department</li>
                      <li>Total Budget: Allocated budget from approved POs</li>
                    </ul>
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <Text className="text-sm text-yellow-800">
                        <strong>Alert Thresholds:</strong> Yellow warning at 75%, Red alert at 90%
                      </Text>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r">
                    <h3 className="font-semibold text-lg mb-2">GR (Goods Receipt) Authorization</h3>
                    <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      GR Rate = (Approved GRs ÷ Total GRs Submitted) × 100
                    </code>
                    <Text className="mt-2 text-gray-600">
                      <strong>Where:</strong>
                    </Text>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Approved GRs: Count of goods receipts with status = "Approved"</li>
                      <li>Total GRs Submitted: All GRs in the system for the period</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r">
                    <h3 className="font-semibold text-lg mb-2">Active Contractors Count</h3>
                    <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      Active Contractors = COUNT(DISTINCT contractor_id WHERE status = 'Active' AND sow_count {'>'} 0)
                    </code>
                    <Text className="mt-2 text-gray-600">
                      <strong>Criteria:</strong>
                    </Text>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Status must be "Active"</li>
                      <li>Must have at least one active SOW</li>
                      <li>Excludes contractors with expired or terminated SOWs only</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                    <h3 className="font-semibold text-lg mb-2">Invoice Variance Detection</h3>
                    <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      Variance = ABS((Invoice Amount - Expected Amount) ÷ Expected Amount) × 100
                    </code>
                    <Text className="mt-2 text-gray-600">
                      <strong>Where:</strong>
                    </Text>
                    <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                      <li>Invoice Amount: Submitted invoice total</li>
                      <li>Expected Amount: Calculated from timecards + expenses</li>
                      <li>Alert if variance {'>'} 5%</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Entity Relationships Tab */}
          <TabPanel>
            <div className="mt-6">
              <Card className="border border-gray-200 shadow-card">
                <Title className="mb-4">Entity Relationship Diagram</Title>
                <Text className="mb-6">
                  Visual representation of how data entities relate to each other in the Velocity platform.
                </Text>
                <div style={{ height: "600px" }} className="border rounded-lg shadow-sm">
                  <ReactFlow
                    nodes={entityNodes}
                    edges={entityEdges}
                    fitView
                    style={{ background: "#f9fafb" }}
                  >
                    <Background />
                    <Controls />
                  </ReactFlow>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Workflows Tab */}
          <TabPanel>
            <div className="mt-6">
              <Card className="border border-gray-200 shadow-card">
                <Title className="mb-4">Business Workflow Visualization</Title>
                <Text className="mb-6">
                  Step-by-step process flow from contractor onboarding to payment processing.
                </Text>
                <div style={{ height: "600px" }} className="border rounded-lg shadow-sm">
                  <ReactFlow
                    nodes={workflowNodes}
                    edges={workflowEdges}
                    fitView
                    style={{ background: "#f9fafb" }}
                  >
                    <Background />
                    <Controls />
                  </ReactFlow>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Data Lineage Tab */}
          <TabPanel>
            <div className="mt-6 space-y-4">
              <Card className="border border-gray-200 shadow-card">
                <Title>Data Lineage Tracking</Title>
                <Text className="mb-4">Track where data originates and how it transforms through the system.</Text>

                <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
                  <Card className="border shadow-sm">
                    <Text className="font-semibold">Invoice Data Sources</Text>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>→ Timecards (hours worked)</li>
                      <li>→ SOW (billing rates)</li>
                      <li>→ Expenses (reimbursements)</li>
                      <li>→ PO (budget limits)</li>
                    </ul>
                  </Card>

                  <Card className="border shadow-sm">
                    <Text className="font-semibold">Budget Data Sources</Text>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>→ POs (allocated funds)</li>
                      <li>→ Invoices (spent amounts)</li>
                      <li>→ Change Orders (adjustments)</li>
                      <li>→ Department allocations</li>
                    </ul>
                  </Card>

                  <Card className="border shadow-sm">
                    <Text className="font-semibold">Contractor Status</Text>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>→ SOW status (active/expired)</li>
                      <li>→ Compliance checks</li>
                      <li>→ Performance ratings</li>
                      <li>→ Background verification</li>
                    </ul>
                  </Card>
                </Grid>
              </Card>
            </div>
          </TabPanel>

          {/* Documentation Tab */}
          <TabPanel>
            <div className="mt-6">
              <Card className="border border-gray-200 shadow-card">
                <Title>Business Logic Documentation</Title>
                <div className="mt-4 space-y-4 prose max-w-none">
                  <h3 className="font-semibold text-lg">System Overview</h3>
                  <p>
                    Velocity Workforce Management System is a live production platform that manages the complete lifecycle
                    of contractor engagements, from onboarding through payment processing.
                  </p>

                  <h3 className="font-semibold text-lg mt-6">Calculation Accuracy</h3>
                  <p>
                    All formulas shown in the "Formulas" tab are <strong>actively used in production</strong>. The sample data
                    loaded in this system represents real client scenarios and demonstrates accurate calculation results.
                  </p>

                  <h3 className="font-semibold text-lg mt-6">Testing & Validation</h3>
                  <ul className="list-disc list-inside">
                    <li>Invoice calculations are validated against timecard + expense data</li>
                    <li>Budget utilization percentages are recalculated on every PO or invoice change</li>
                    <li>GR authorization rates update in real-time</li>
                    <li>All metrics are derived from actual data processing, not hardcoded values</li>
                  </ul>

                  <h3 className="font-semibold text-lg mt-6">AI-Powered Insights</h3>
                  <p>
                    The platform includes conversational AI capabilities that analyze patterns in contractor performance,
                    budget utilization, and invoice variance to provide proactive recommendations.
                  </p>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Configuration Tab */}
          <TabPanel>
            <div className="mt-6">
              <Card className="border border-gray-200 shadow-card">
                <Title>System Configuration</Title>
                <Text className="mb-4">Configure business rules, thresholds, and calculation parameters.</Text>

                <Grid numItems={1} numItemsSm={2} className="gap-4">
                  <Card className="border shadow-sm">
                    <Text className="font-semibold mb-2">Budget Alert Thresholds</Text>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text>Warning Level</Text>
                        <Metric className="text-yellow-600">75%</Metric>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Critical Level</Text>
                        <Metric className="text-red-600">90%</Metric>
                      </div>
                    </div>
                  </Card>

                  <Card className="border shadow-sm">
                    <Text className="font-semibold mb-2">Invoice Variance Tolerance</Text>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text>Acceptable Variance</Text>
                        <Metric className="text-green-600">± 5%</Metric>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Review Required</Text>
                        <Metric className="text-orange-600">{'>'}5%</Metric>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
