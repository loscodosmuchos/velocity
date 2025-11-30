import type { Invoice, Contractor, PurchaseOrder } from "@/types";

export interface InvoiceExportData extends Invoice {
  contractorName?: string;
  poNumber?: string;
}

/**
 * Export invoices to CSV format
 */
export function exportInvoicesToCSV(invoices: InvoiceExportData[], filename: string = "invoices-export.csv"): void {
  // Define CSV headers
  const headers = [
    "Invoice Number",
    "Contractor",
    "PO Number",
    "Status",
    "Invoice Date",
    "Due Date",
    "Requested Amount",
    "Actual Amount",
    "Variance",
    "GR Amount",
    "GR Balance",
    "Paid Date",
    "Notes",
  ];

  // Convert data to CSV rows
  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.contractorName || `Contractor #${invoice.contractorId}`,
    invoice.poNumber || `PO #${invoice.purchaseOrderId}`,
    invoice.status,
    invoice.invoiceDate,
    invoice.dueDate,
    invoice.requestedAmount.toFixed(2),
    invoice.actualAmount.toFixed(2),
    invoice.varianceAmount.toFixed(2),
    invoice.grAmount.toFixed(2),
    invoice.grBalance.toFixed(2),
    invoice.paidDate || "",
    `"${(invoice.notes || "").replace(/"/g, '""')}"`, // Escape quotes in notes
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export invoices for Balance Staffing API format
 */
export function exportInvoicesForBalanceStaffing(
  invoices: InvoiceExportData[],
  filename: string = "balance-staffing-export.csv",
): void {
  // Balance Staffing specific format
  const headers = [
    "InvoiceID",
    "ContractorID",
    "PONumber",
    "InvoiceDate",
    "Amount",
    "Status",
    "DueDate",
    "TimecardCount",
  ];

  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.contractorId,
    invoice.poNumber || invoice.purchaseOrderId,
    invoice.invoiceDate,
    invoice.actualAmount.toFixed(2),
    invoice.status,
    invoice.dueDate,
    invoice.timecardIds.length,
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export single invoice with detailed breakdown
 */
export function exportInvoiceDetailed(
  invoice: Invoice,
  timecards: any[],
  contractor: Contractor,
  purchaseOrder: PurchaseOrder,
  filename?: string,
): void {
  const exportFilename = filename || `invoice-${invoice.invoiceNumber}.csv`;

  // Invoice header section
  const headerSection = [
    ["Invoice Details"],
    ["Invoice Number", invoice.invoiceNumber],
    ["Contractor", `${contractor.firstName} ${contractor.lastName}`],
    ["Purchase Order", purchaseOrder.poNumber],
    ["Status", invoice.status],
    ["Invoice Date", invoice.invoiceDate],
    ["Due Date", invoice.dueDate],
    [""],
    ["Amount Summary"],
    ["Requested Amount", `$${invoice.requestedAmount.toFixed(2)}`],
    ["Actual Amount", `$${invoice.actualAmount.toFixed(2)}`],
    ["Variance", `$${invoice.varianceAmount.toFixed(2)}`],
    ["GR Amount", `$${invoice.grAmount.toFixed(2)}`],
    ["GR Balance", `$${invoice.grBalance.toFixed(2)}`],
    [""],
    ["Timecards"],
    ["ID", "Date", "Hours", "Rate", "Amount", "Description"],
  ];

  // Timecard rows
  const timecardRows = timecards.map((tc) => [
    tc.id,
    tc.date,
    tc.hours,
    `$${tc.hourlyRate.toFixed(2)}`,
    `$${tc.totalAmount.toFixed(2)}`,
    `"${tc.taskDescription.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [...headerSection, ...timecardRows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", exportFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
