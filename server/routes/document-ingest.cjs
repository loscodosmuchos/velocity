const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createMessage, parseJsonResponse, DEFAULT_MODEL } = require("../services/anthropic-client.cjs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "documents");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: PDF, DOC, DOCX, TXT, PNG, JPG"));
    }
  },
});

const AI_PROMPTS = {
  sow: `You are a document analysis expert. Extract the following fields from this Statement of Work document:
- title: The project or engagement title
- sowNumber: The SOW identifier (e.g., SOW-2024-001)
- contractorName: The vendor/contractor company name  
- clientName: The client company name
- department: The business department (IT Operations, Engineering, etc.)
- totalValue: The total contract value in USD (number only, no $ or commas)
- startDate: Project start date (YYYY-MM-DD format)
- endDate: Project end date (YYYY-MM-DD format)
- services: Array of main services/deliverables (strings)
- personnel: Array of objects with {role: string, count: number}
- milestones: Array of key milestones (strings)
- paymentTerms: Payment schedule/terms

Respond with ONLY valid JSON. Use null for missing fields. Numbers should be numbers, not strings.`,

  timecard: `You are a document analysis expert. Extract the following fields from this timecard/timesheet:
- contractorName: The worker's name
- weekEnding: The week ending date (YYYY-MM-DD format)
- projectName: The project or engagement name
- hoursWorked: Total hours (number)
- hourlyRate: Rate per hour in USD (number only)
- totalAmount: Total amount due (number only)
- tasks: Array of tasks/work descriptions (strings)
- approver: Manager/approver name

Respond with ONLY valid JSON. Use null for missing fields.`,

  invoice: `You are a document analysis expert. Extract the following fields from this invoice:
- invoiceNumber: The invoice ID/number
- vendorName: The vendor/supplier name
- invoiceDate: Invoice date (YYYY-MM-DD format)
- dueDate: Payment due date (YYYY-MM-DD format)
- amount: Total amount due (number only)
- lineItems: Array of {description: string, amount: number}
- paymentTerms: Payment terms (Net 30, etc.)

Respond with ONLY valid JSON. Use null for missing fields.`,

  contract: `You are a document analysis expert. Extract the following fields from this contract:
- title: The contract title
- contractNumber: The contract identifier
- parties: Array of party names involved
- effectiveDate: Contract effective date (YYYY-MM-DD)
- expirationDate: Contract expiration date (YYYY-MM-DD)
- totalValue: Total contract value (number only)
- terms: Key terms and conditions (array of strings)
- responsibilities: Object with {provider: string[], client: string[]}

Respond with ONLY valid JSON. Use null for missing fields.`,

  generic: `You are a document analysis expert. Analyze this document and extract:
- documentType: Best classification (sow, timecard, invoice, contract, expense, other)
- title: Document title or subject
- keyDates: Array of important dates found (YYYY-MM-DD format where possible)
- amounts: Array of monetary amounts found (numbers only)
- parties: Names of companies/people mentioned
- summary: Brief 2-3 sentence summary

Respond with ONLY valid JSON.`,
};

function detectDocumentType(text) {
  const lowerText = text.toLowerCase();

  const patterns = {
    sow: ["statement of work", "sow", "scope of work", "deliverables", "milestones", "project scope"],
    timecard: ["timecard", "time card", "hours worked", "week ending", "timesheet", "time sheet", "billable hours"],
    invoice: ["invoice", "bill to", "payment due", "amount due", "remit to", "invoice number", "inv#"],
    expense: ["expense report", "reimbursement", "receipt", "travel expense", "mileage"],
    contract: ["agreement", "contract", "terms and conditions", "parties agree", "effective date", "hereby agree"],
  };

  const scores = { sow: 0, timecard: 0, invoice: 0, expense: 0, contract: 0 };

  for (const [type, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        scores[type] += 2;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore < 2) return "generic";

  return Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || "generic";
}

function extractWithPatterns(text, docType) {
  const patterns = {
    sowNumber: /\b(SOW[-\s]?\d{4}[-\s]?\d{3,4}|SOW[A-Z]{2,4}[-\s]?\d+)\b/i,
    invoiceNumber: /(?:invoice|inv)[\s#:]*([A-Z0-9\-]+)/i,
    amounts: /\$[\d,]+(?:\.\d{2})?/g,
    dates: /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})\b/g,
    hours: /\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/gi,
  };

  const extracted = {};

  if (docType === "sow" || docType === "contract") {
    const sowMatch = text.match(patterns.sowNumber);
    if (sowMatch) extracted.sowNumber = sowMatch[0];
  }

  if (docType === "invoice") {
    const invMatch = text.match(patterns.invoiceNumber);
    if (invMatch) extracted.invoiceNumber = invMatch[1];
  }

  const amounts = text.match(patterns.amounts) || [];
  if (amounts.length > 0) {
    extracted.detectedAmounts = amounts.map((a) => parseFloat(a.replace(/[$,]/g, "")));
  }

  const dates = text.match(patterns.dates) || [];
  if (dates.length > 0) {
    extracted.detectedDates = dates.slice(0, 5);
  }

  if (docType === "timecard") {
    const hoursMatch = text.match(patterns.hours);
    if (hoursMatch) {
      extracted.detectedHours = parseFloat(hoursMatch[1]);
    }
  }

  return extracted;
}

router.post("/analyze", upload.single("file"), async (req, res) => {
  const startTime = Date.now();

  try {
    const { documentType: requestedType, extractedText } = req.body;

    let textContent = extractedText || "";
    let filename = "direct-text-input";

    if (req.file) {
      filename = req.file.originalname;
      const filePath = req.file.path;

      if (req.file.mimetype === "text/plain") {
        textContent = fs.readFileSync(filePath, "utf-8");
      } else if (req.file.mimetype.startsWith("image/")) {
        return res.json({
          success: true,
          requiresOCR: true,
          filePath: req.file.path,
          filename: req.file.originalname,
          message: "Image uploaded. Use client-side OCR (Tesseract.js) to extract text, then call /analyze again with extractedText.",
        });
      } else {
        return res.json({
          success: true,
          requiresPDFExtraction: true,
          filePath: req.file.path,
          filename: req.file.originalname,
          message: "PDF/DOC uploaded. Use pdf.js or similar to extract text, then call /analyze again with extractedText.",
        });
      }
    }

    if (!textContent || textContent.trim().length < 50) {
      return res.status(400).json({
        error: "Insufficient text content",
        message: "Document must contain at least 50 characters of text for analysis.",
      });
    }

    const detectedType = requestedType || detectDocumentType(textContent);
    const patternResults = extractWithPatterns(textContent, detectedType);

    let aiResult = null;
    let analysisMethod = "pattern";

    // Use Replit AI Integrations (no API key needed - billed to credits)
    try {
      const systemPrompt = AI_PROMPTS[detectedType] || AI_PROMPTS.generic;
      
      console.log(`🔵 AI Document Analysis starting for type: ${detectedType}`);
      
      const responseText = await createMessage({
        prompt: `Analyze this document and extract the requested fields:\n\n${textContent.slice(0, 8000)}`,
        system: systemPrompt,
        model: DEFAULT_MODEL,
        maxTokens: 2048,
        temperature: 0.2,
      });

      try {
        aiResult = parseJsonResponse(responseText);
        analysisMethod = "ai";
        console.log(`✅ AI extraction successful for ${detectedType}:`, Object.keys(aiResult));
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError.message);
        console.error("Raw response preview:", responseText.substring(0, 500));
      }
    } catch (aiError) {
      console.error("AI analysis failed, falling back to pattern matching:", aiError.message);
    }

    const processingTime = Date.now() - startTime;

    const result = {
      success: true,
      documentType: detectedType,
      filename,
      analysisMethod,
      aiGenerated: analysisMethod === "ai",
      processingTime,
      extractedData: aiResult || patternResults,
      patternMatches: patternResults,
      confidence: analysisMethod === "ai" ? 85 : 60,
      textPreview: textContent.slice(0, 500) + (textContent.length > 500 ? "..." : ""),
    };

    res.json(result);
  } catch (error) {
    console.error("Document analysis error:", error);
    res.status(500).json({
      error: "Analysis failed",
      message: error.message,
    });
  }
});

router.post("/analyze-text", async (req, res) => {
  const startTime = Date.now();

  try {
    const { text, documentType: requestedType } = req.body;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        error: "Insufficient text",
        message: "Please provide at least 20 characters of text.",
      });
    }

    const detectedType = requestedType || detectDocumentType(text);
    const patternResults = extractWithPatterns(text, detectedType);

    let aiResult = null;
    let analysisMethod = "pattern";

    // Use Replit AI Integrations (no API key needed - billed to credits)
    try {
      const systemPrompt = AI_PROMPTS[detectedType] || AI_PROMPTS.generic;
      
      console.log(`🔵 AI Text Analysis starting for type: ${detectedType}`);
      
      const responseText = await createMessage({
        prompt: `Analyze this document and extract the requested fields:\n\n${text.slice(0, 8000)}`,
        system: systemPrompt,
        model: DEFAULT_MODEL,
        maxTokens: 2048,
        temperature: 0.2,
      });

      try {
        aiResult = parseJsonResponse(responseText);
        analysisMethod = "ai";
        console.log(`✅ AI text extraction successful for ${detectedType}:`, Object.keys(aiResult));
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError.message);
      }
    } catch (aiError) {
      console.error("AI analysis failed:", aiError.message);
    }

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      documentType: detectedType,
      analysisMethod,
      aiGenerated: analysisMethod === "ai",
      processingTime,
      extractedData: aiResult || patternResults,
      patternMatches: patternResults,
      confidence: analysisMethod === "ai" ? 85 : 60,
    });
  } catch (error) {
    console.error("Text analysis error:", error);
    res.status(500).json({
      error: "Analysis failed",
      message: error.message,
    });
  }
});

router.get("/schemas/:type", (req, res) => {
  const { type } = req.params;

  const schemas = {
    sow: {
      fields: [
        { name: "title", type: "string", required: true, label: "Project Title" },
        { name: "sowNumber", type: "string", required: false, label: "SOW Number" },
        { name: "contractorName", type: "string", required: false, label: "Contractor Name" },
        { name: "clientName", type: "string", required: false, label: "Client Name" },
        { name: "department", type: "select", required: true, label: "Department", options: ["IT Operations", "Data Science", "Cloud Infrastructure", "Security", "QA", "Engineering", "Operations", "Finance", "HR"] },
        { name: "totalValue", type: "number", required: true, label: "Total Value (USD)" },
        { name: "startDate", type: "date", required: true, label: "Start Date" },
        { name: "endDate", type: "date", required: true, label: "End Date" },
        { name: "services", type: "array", required: false, label: "Services" },
        { name: "milestones", type: "array", required: false, label: "Milestones" },
      ],
    },
    timecard: {
      fields: [
        { name: "contractorName", type: "string", required: true, label: "Contractor Name" },
        { name: "weekEnding", type: "date", required: true, label: "Week Ending" },
        { name: "projectName", type: "string", required: false, label: "Project Name" },
        { name: "hoursWorked", type: "number", required: true, label: "Hours Worked" },
        { name: "hourlyRate", type: "number", required: false, label: "Hourly Rate" },
        { name: "totalAmount", type: "number", required: false, label: "Total Amount" },
        { name: "tasks", type: "array", required: false, label: "Tasks" },
        { name: "approver", type: "string", required: false, label: "Approver" },
      ],
    },
    invoice: {
      fields: [
        { name: "invoiceNumber", type: "string", required: true, label: "Invoice Number" },
        { name: "vendorName", type: "string", required: true, label: "Vendor Name" },
        { name: "invoiceDate", type: "date", required: true, label: "Invoice Date" },
        { name: "dueDate", type: "date", required: false, label: "Due Date" },
        { name: "amount", type: "number", required: true, label: "Amount" },
        { name: "paymentTerms", type: "string", required: false, label: "Payment Terms" },
      ],
    },
  };

  res.json(schemas[type] || schemas.sow);
});

module.exports = router;
