/**
 * Test Contracts for Multi-Lens Analysis
 * Sample contracts with known characteristics for testing
 */

export const TEST_CONTRACTS = {
  // HIGH RISK: Missing critical clauses
  "SOW-0005": {
    id: "SOW-0005",
    name: "Software Development Services - Acme Corp",
    type: "SOW" as const,
    content: `
STATEMENT OF WORK
Project: Custom Software Development
Vendor: Acme Development Corp
Total Value: $185,000
Duration: January 15, 2024 - December 31, 2024

SCOPE OF WORK:
The contractor will provide custom software development services including:
- Backend API development
- Frontend web application
- Database design and implementation
- Integration with existing systems

DELIVERABLES:
- Phase 1: Requirements and Architecture (Due: March 31, 2024)
- Phase 2: Development and Testing (Due: June 30, 2024)
- Phase 3: Deployment and Documentation (Due: December 31, 2024)

PAYMENT TERMS:
Payment will be made in three installments upon completion of each phase.

GENERAL TERMS:
The contractor agrees to perform services in accordance with industry standards.
All work product shall be delivered to the client upon completion.
`,
  },

  // MEDIUM RISK: Some gaps, but acceptable
  "SOW-SAMPLE-GOOD": {
    id: "SOW-SAMPLE-GOOD",
    name: "Consulting Services - Tech Solutions Inc",
    type: "SOW" as const,
    content: `
STATEMENT OF WORK
Project: IT Consulting Services
Vendor: Tech Solutions Inc
Total Value: $75,000
Duration: March 1, 2024 - August 31, 2024

SCOPE OF WORK:
The contractor will provide IT consulting services including system architecture review,
security assessment, and recommendations for infrastructure improvements.

DELIVERABLES:
- Security Assessment Report (Due: April 15, 2024)
- Architecture Recommendations (Due: June 30, 2024)
- Implementation Roadmap (Due: August 31, 2024)

PAYMENT TERMS:
Payment will be made Net 30 days from invoice date. Invoices will be submitted monthly
based on work completed.

INSURANCE REQUIREMENTS:
Contractor shall maintain general liability insurance with minimum coverage of $1,000,000.

TERMINATION:
Either party may terminate this agreement with 30 days written notice.

CONFIDENTIALITY:
All information shared during this engagement shall be kept confidential and not disclosed
to third parties without written consent.

INTELLECTUAL PROPERTY:
All work product created under this agreement shall be the exclusive property of the client.
Contractor agrees to assign all rights, title, and interest to the client.

COMPLIANCE:
Contractor agrees to comply with all applicable federal, state, and local laws and regulations,
including GDPR and SOX requirements where applicable.
`,
  },

  // LOW RISK: Well-structured contract
  "SOW-SAMPLE-EXCELLENT": {
    id: "SOW-SAMPLE-EXCELLENT",
    name: "Professional Services - Enterprise Partners LLC",
    type: "SOW" as const,
    content: `
STATEMENT OF WORK
Project: Enterprise System Integration
Vendor: Enterprise Partners LLC
Total Value: $50,000
Duration: April 1, 2024 - July 31, 2024

SCOPE OF WORK:
The contractor will provide professional services for enterprise system integration,
including data migration, API development, and user training.

DELIVERABLES:
- System Integration Plan (Due: April 30, 2024)
- Data Migration Completion (Due: June 15, 2024)
- User Training and Documentation (Due: July 31, 2024)

PAYMENT TERMS:
Payment shall be made Net 30 days from invoice date. Invoices will be submitted upon
completion of each deliverable milestone.

INSURANCE REQUIREMENTS:
Contractor shall maintain:
- General liability insurance: $2,000,000 minimum coverage
- Professional liability insurance: $1,000,000 minimum coverage
- Workers' compensation insurance as required by law

TERMINATION:
Either party may terminate this agreement with 30 days written notice. In the event of
termination, contractor shall be paid for all work completed through the termination date.

CONFIDENTIALITY:
All information, documents, and materials shared during this engagement are confidential
and proprietary. Neither party shall disclose such information to third parties without
prior written consent.

INTELLECTUAL PROPERTY:
All work product, including but not limited to software code, documentation, and designs,
created under this agreement shall be considered "work for hire" and shall be the exclusive
property of the client. Contractor hereby assigns all rights, title, and interest.

INDEMNIFICATION:
Contractor agrees to indemnify, defend, and hold harmless the client from any claims,
damages, or liabilities arising from contractor's performance or breach of this agreement.

LIABILITY LIMITATION:
Contractor's total liability shall not exceed the total value of this agreement.

COMPLIANCE AND REGULATORY:
Contractor agrees to comply with:
- GDPR (General Data Protection Regulation)
- SOX (Sarbanes-Oxley Act)
- ISO 27001 information security standards
- All applicable federal, state, and local laws

AUDIT RIGHTS:
Client reserves the right to audit contractor's work and records related to this agreement
with 5 business days notice.

DISPUTE RESOLUTION:
Any disputes arising from this agreement shall be resolved through binding arbitration
in accordance with the rules of the American Arbitration Association.

FORCE MAJEURE:
Neither party shall be liable for delays or failures in performance resulting from acts
beyond their reasonable control, including but not limited to natural disasters, war,
terrorism, or government actions.
`,
  },

  // CRITICAL RISK: Major financial and timeline issues
  "SOW-HIGH-RISK": {
    id: "SOW-HIGH-RISK",
    name: "Urgent Project - Quick Solutions Inc",
    type: "SOW" as const,
    content: `
STATEMENT OF WORK
Project: Emergency System Upgrade
Vendor: Quick Solutions Inc
Total Value: $350,000
Duration: January 1, 2024 - January 31, 2024

SCOPE OF WORK:
Complete system overhaul and data migration required urgently.
Contractor will work around the clock to complete project.

DELIVERABLES:
Everything must be completed by January 31, 2024.

PAYMENT TERMS:
50% upfront payment required. Remaining 50% due upon completion.

GENERAL TERMS:
Contractor will do their best to complete the work on time.
`,
  },
};

export function getTestContract(key: keyof typeof TEST_CONTRACTS) {
  return TEST_CONTRACTS[key];
}

export function getAllTestContracts() {
  return Object.entries(TEST_CONTRACTS).map(([key, contract]) => ({
    key,
    ...contract,
  }));
}
