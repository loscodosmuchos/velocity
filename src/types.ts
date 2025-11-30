export interface Employee {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  jobTitle: string;
  role: string;
  email: string;
  address: string;
  phone: string;
  birthdate: string;
  links: string[];
  customFields: {
    key: string;
    value: string;
  }[];
  availableAnnualLeaveDays: number;
}

export interface Expense {
  id: number;
  createdAt: string;
  updatedAt: string;
  employeeId: number;
  expenseType: "Travel" | "Meals" | "Software" | "Training";
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  status: "Pending" | "Approved" | "Declined";
  attachments: Array<{
    name: string;
    URL: string;
  }>;
}

export interface Contractor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  payRate: number;
  location: string;
  jobDescription: string;
  hiringManagerId: number;
  assignedManagerId: number;
  departmentId: number;
  status: "Active" | "Inactive" | "On Leave";
  startDate: string;
  poFundsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  division: string;
  budget: number;
}

export interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
}

export interface Buyer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  phone: string;
}

export interface Equipment {
  id: number;
  contractorId: number;
  type: "Laptop" | "Monitor" | "Phone" | "Keyboard" | "Mouse" | "Headset";
  model: string;
  serialNumber: string;
  assignedDate: string;
  status: "Active" | "Returned" | "Damaged" | "In Repair";
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  totalAmount: number;
  amountSpent: number;
  amountRemaining: number;
  spentAmount?: number;
  remainingFunds?: number;
  percentUsed: number;
  department: string;
  startDate: string;
  endDate: string;
  status: "Draft" | "Pending" | "Active" | "Completed" | "Cancelled";
  type: "Time and Materials" | "Fixed Fee";
  departmentId?: number;
  contractorId?: number;
  buyerId?: number;
  tpscStatus: "Not Started" | "In Progress" | "Completed";
  fiscalYear: string;
  fiscalPeriod: string;
  description: string;
  projectName?: string;
  notes?: string;
  isMaverickSpend?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface POContractor {
  id: number;
  purchaseOrderId: number;
  contractorId: number;
  allocatedAmount: number;
  createdAt: string;
}

export interface Timecard {
  id: number;
  contractorId: number;
  purchaseOrderId: number;
  date: string;
  hours: number;
  taskDescription: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedDate: string;
  approvedBy?: number; // Manager ID
  approvedDate?: string;
  rejectionReason?: string;
  hourlyRate: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  contractorId: number;
  purchaseOrderId: number;
  status: "Draft" | "Submitted" | "GR Approved" | "Paid" | "Disputed";
  requestedAmount: number;
  actualAmount: number;
  grAmount: number;
  grBalance: number;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  timecardIds: number[];
  varianceAmount: number; // actualAmount - requestedAmount
  hasVariance: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatementOfWork {
  id: number;
  sowNumber: string;
  contractorId: number;
  purchaseOrderId?: number;
  type: "Fixed Fee" | "Deliverables Based";
  totalValue: number;
  invoicedAmount: number;
  remainingValue: number;
  status: "Draft" | "Pending Approval" | "Active" | "Invoiced" | "Paid" | "Completed" | "Cancelled";
  startDate: string;
  endDate: string;
  terms: string;
  deliverables?: string;
  paymentSchedule?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeOrder {
  id: number;
  sowId: number;
  changeOrderNumber: string;
  requestedBy: number; // Manager ID
  requestedDate: string;
  justification: string;
  originalValue: number;
  requestedChange: number;
  newTotalValue: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: number; // Manager ID
  approvedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  entityType: "Contractor" | "PurchaseOrder" | "Timecard" | "Invoice" | "SOW" | "ChangeOrder" | "Equipment";
  entityId: number;
  action: "Created" | "Updated" | "Deleted" | "Approved" | "Rejected" | "Submitted";
  performedBy: number; // Manager/User ID
  performedByName: string;
  changedFields?: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemException {
  id: number;
  exceptionType:
    | "Budget Overrun"
    | "Missing Data"
    | "Timecard Exceeds PO"
    | "Incomplete Profile"
    | "Invoice Variance"
    | "Data Validation"
    | "Failed Transaction";
  severity: "Critical" | "High" | "Medium" | "Low";
  entityType: "Contractor" | "PurchaseOrder" | "Timecard" | "Invoice" | "SOW" | "Equipment";
  entityId: number;
  entityName: string;
  description: string;
  status: "Open" | "Acknowledged" | "Resolved" | "Ignored";
  detectedAt: string;
  acknowledgedBy?: number;
  acknowledgedAt?: string;
  resolvedBy?: number;
  resolvedAt?: string;
  resolutionNotes?: string;
  autoFixAvailable: boolean;
  autoFixSuggestion?: string;
}

export interface DataQualityMetric {
  id: number;
  metricName: string;
  category: "Completeness" | "Accuracy" | "Consistency" | "Timeliness";
  entityType: "Contractor" | "PurchaseOrder" | "Timecard" | "Invoice" | "SOW";
  currentValue: number;
  targetValue: number;
  unit: "Percentage" | "Count";
  status: "Good" | "Warning" | "Critical";
  lastCalculated: string;
  trend: "Improving" | "Stable" | "Declining";
}

export interface Notification {
  id: number;
  type: "approval_request" | "alert" | "exception" | "info";
  title: string;
  message: string;
  entityType?: "Contractor" | "PurchaseOrder" | "Timecard" | "Invoice" | "SOW" | "ChangeOrder";
  entityId?: number;
  actionUrl?: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
  readAt?: string;
}

export interface BudgetForecast {
  id: number;
  departmentId: number;
  fiscalYear: string;
  fiscalPeriod: string;
  budgetAllocated: number;
  budgetSpent: number;
  budgetCommitted: number;
  budgetAvailable: number;
  projectedSpend: number;
  variance: number;
  lastUpdated: string;
}

export interface FilterPreset {
  id: number;
  userId: number;
  resource: string;
  name: string;
  description?: string;
  filters: any[];
  sorters?: any[];
  isPublic: boolean;
  createdAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "Manager" | "Contractor" | "Viewer";
  departmentId?: number;
  permissions: string[];
  createdAt: string;
}

export interface ContractorDocument {
  id: number;
  contractorId: number;
  documentType: "Certification" | "Contract" | "W9" | "Insurance" | "Background Check" | "Other";
  fileName: string;
  fileUrl: string;
  expirationDate?: string;
  status: "Valid" | "Expired" | "Pending Review";
  uploadedDate: string;
  uploadedBy: number;
  notes?: string;
}

export interface ContractorMessage {
  id: number;
  contractorId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  subject: string;
  message: string;
  relatedEntityType?: "Timecard" | "Invoice" | "Expense";
  relatedEntityId?: number;
  status: "Unread" | "Read";
  sentAt: string;
  readAt?: string;
}

export interface ApprovalRule {
  id: number;
  name: string;
  entityType: "PurchaseOrder" | "ChangeOrder" | "Expense" | "Timecard";
  departmentId?: number;
  condition: "amount_threshold" | "always" | "department_specific";
  thresholdAmount?: number;
  approvalChain: Array<{
    order: number;
    roleOrUserId: string;
    roleName: string;
    slaHours: number;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: number;
  entityType: "PurchaseOrder" | "ChangeOrder" | "Expense" | "Timecard";
  entityId: number;
  entityName: string;
  requestedBy: number;
  requestedByName: string;
  currentApproverId: number;
  currentApproverName: string;
  approvalChainStep: number;
  totalChainSteps: number;
  status: "Pending" | "Approved" | "Rejected" | "Escalated";
  requestedDate: string;
  dueDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  escalatedDate?: string;
  approvalNotes?: string;
  rejectionReason?: string;
  slaStatus: "On Time" | "At Risk" | "Overdue";
  emailSent: boolean;
  remindersSent: number;
}

export interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  templateType:
    | "approval_request"
    | "approval_reminder"
    | "approval_approved"
    | "approval_rejected"
    | "invoice_status"
    | "expense_status"
    | "daily_digest";
  entityType?: string;
  entityId?: number;
  status: "Sent" | "Failed" | "Pending";
  sentAt?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface ContractorExpense {
  id: number;
  contractorId: number;
  purchaseOrderId: number;
  expenseType: "Travel" | "Materials" | "Equipment" | "Meals" | "Lodging" | "Other";
  description: string;
  amount: number;
  expenseDate: string;
  status: "Submitted" | "Approved" | "Rejected" | "Paid";
  submittedDate: string;
  approvedBy?: number;
  approvedDate?: string;
  rejectedBy?: number;
  rejectedDate?: string;
  rejectionReason?: string;
  paidDate?: string;
  receiptUrl?: string;
  receiptFileName?: string;
  notes?: string;
  currency: "USD" | "CAD" | "EUR" | "GBP";
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReport {
  id: number;
  contractorId?: number;
  purchaseOrderId?: number;
  departmentId?: number;
  reportName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  expenseCount: number;
  status: "Draft" | "Submitted" | "Approved";
  createdAt: string;
  expenseIds: number[];
}

export interface Asset {
  id: number;
  name: string;
  barcode: string;
  serialNumber: string;
  category: "Laptop" | "Phone" | "Monitor" | "Tablet" | "Headset" | "Docking Station";
  value: number;
  purchaseDate: string;
  warranty: string;
  status: "Available" | "Assigned" | "Maintenance" | "Retired";
  condition: "New" | "Good" | "Fair" | "Poor";
  assignedToContractorId?: number;
  assignedToManagerId?: number;
  assignedDate?: string;
  // Enhanced assignment model
  assignmentType?: "employee" | "room"; // NEW: Dual assignment model
  assignedEmployeeId?: number; // NEW: When assigned to employee
  assignedRoomId?: number; // NEW: When assigned to room/location
  maintenanceManagerId?: number; // NEW: Optional maintenance manager for room assets
  returnDate?: string; // NEW: Track asset returns
  locationId: number;
  notes: string;
  imageUrl?: string;
  maintenanceCost: number;
  depreciationRate: number;
  lastMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

// NEW: Room/Location type for shared assets
export interface Room {
  id: number;
  name: string;
  roomNumber: string;
  building: string;
  floor: number;
  roomType: "Conference Room" | "Office" | "Lab" | "Equipment Pool" | "Storage";
  capacity?: number;
  departmentId?: number;
  status: "Active" | "Inactive" | "Under Renovation";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// NEW: Equipment Kit for new hire onboarding
export interface EquipmentKit {
  id: number;
  name: string;
  description: string;
  roleType: "Engineer" | "Sales" | "Manager" | "Contractor" | "Executive";
  assetIds: number[];
  totalValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// NEW: Assignment History for audit trail
export interface AssetAssignment {
  id: number;
  assetId: number;
  assignmentType: "employee" | "room";
  assignedEmployeeId?: number;
  assignedRoomId?: number;
  maintenanceManagerId?: number;
  effectiveDate: string;
  returnDate?: string;
  status: "Active" | "Returned" | "Transferred";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chatbot {
  id: number;
  name: string;
  elevenLabsId: string;
  voiceId: string;
  status: "Active" | "Paused" | "Training";
  knowledgeSources: string[];
  conversationCount: number;
  avgResponseTime: number;
  satisfactionScore: number;
  lastSyncDate: string;
  createdDate: string;
  description: string;
  capabilities: string[];
}

export interface ChatbotConversation {
  id: number;
  chatbotId: number;
  userId: number;
  userName: string;
  startTime: string;
  endTime?: string;
  messageCount: number;
  resolved: boolean;
  rating?: number;
  feedback?: string;
  context: Record<string, any>;
}

export interface ChatbotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatbotWidget {
  id: number;
  name: string;
  elevenLabsWidgetUrl: string;
  description: string;
  isActive: boolean;
  visibleToRoles: string[];
  visibleToDepartments: number[];
  createdAt: string;
  updatedAt: string;
}

// NEW: Voice Command types
export interface VoiceCommand {
  id: string;
  phrase: string;
  category: "navigation" | "workflow" | "query" | "action";
  description: string;
  enabled: boolean;
}

// NEW: Import Job types
export interface ImportJob {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "validating" | "importing" | "completed" | "failed" | "rolled_back";
  sheets: ImportSheet[];
  totalRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  canRollback: boolean;
  rollbackExpiresAt?: string;
  importedBy: number;
  importedByName: string;
}

export interface ImportSheet {
  sheetName: string;
  entityType: "contractors" | "purchaseorders" | "assets" | "employees";
  totalRows: number;
  validRows: number;
  errors: ImportError[];
  warnings: ImportError[];
  preview: any[];
  mappings: ColumnMapping[];
}

export interface ColumnMapping {
  excelColumn: string;
  fieldName: string;
  fieldType: string;
  required: boolean;
}

export interface ImportError {
  row: number;
  column: string;
  value: any;
  error: string;
  severity: "error" | "warning";
}

export interface SOWTranche {
  id: number;
  sowId: number;
  name: string;
  description?: string;
  amount: number;
  percentage?: number;
  dueDate?: string;
  sequenceOrder: number;
  status: "pending" | "invoiced" | "paid" | "cancelled";
  invoiceId?: number;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: number;
  name: string;
  category: "approval_reminder" | "payment_notification" | "status_update" | "document_request" | "escalation" | "general";
  subject: string;
  body: string;
  variables?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  subject: string;
  body: string;
  senderId: number;
  receiverId?: number;
  receiverType?: string;
  relatedSowId?: number;
  relatedInvoiceId?: number;
  relatedPoId?: number;
  templateId?: number;
  status: "draft" | "sent" | "read";
  readAt?: string;
  createdAt: string;
  relatedSow?: {
    id: number;
    sowNumber: string;
    title?: string;
  };
  relatedInvoice?: {
    id: number;
    invoiceNumber: string;
  };
  relatedPo?: {
    id: number;
    poNumber: string;
  };
  template?: MessageTemplate;
}
