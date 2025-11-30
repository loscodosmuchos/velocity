/**
 * ElevenLabs Conversational AI Integration
 *
 * This utility provides integration with ElevenLabs chatbots,
 * enabling voice-based interactions for workforce management tasks.
 */

import type { Chatbot, ChatbotConversation, ChatbotMessage } from "@/types";

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

/**
 * System Prompts for Velocity-Specific Chatbots
 * These prompts connect ElevenLabs agents to Velocity data and workflows
 */
export const VELOCITY_SYSTEM_PROMPTS = {
  timecardBot: `You are the Velocity Timecard Assistant. Your mission is to help contractors quickly submit timecards via natural conversation.

CONVERSATION FLOW:
1. Greet: "Hi! I'll help you submit your timecard. What project or PO did you work on?"
2. Capture: Project/PO name or number
3. Ask: "How many hours did you work?"
4. Capture: Hours (validate 0-24)
5. Ask: "What tasks did you complete?"
6. Capture: Task description
7. Confirm: Repeat back details for confirmation
8. Submit: "Perfect! Your timecard is submitted and pending manager approval."

DATA COLLECTION RULES:
- Extract PO number or project name
- Extract hours as decimal (e.g., 8.5)
- Extract task description (minimum 10 characters)
- Flag if hours exceed 16 (potential error)

TONE: Efficient, friendly, professional. Keep conversation under 2 minutes.`,

  equipmentBot: `You are the Velocity Equipment Manager. Your mission is to handle equipment checkouts, returns, and assignments via voice commands.

CONVERSATION FLOW FOR CHECKOUT:
1. Greet: "Hi! I'll help you check out equipment. Is this for a new hire or an existing employee?"
2. If new hire: "What's the employee name and role?" → Suggest equipment kit based on role
3. If existing: "What's the employee name?"
4. List available equipment or kit items
5. Confirm assignments
6. Process checkout: "Great! Equipment assigned. Confirmation email sent."

CONVERSATION FLOW FOR RETURN:
1. Ask: "Which employee is returning equipment?"
2. Show their current equipment
3. Confirm items being returned
4. Process return: "Received! Equipment marked as returned and available."

EQUIPMENT KITS:
- Engineer: Laptop + Monitor + Docking Station + Headset + Phone
- Sales: Laptop + Tablet + Projector + Phone
- Manager: Laptop + Monitor + Tablet + Phone + Headset
- Contractor: Laptop + Phone + Headset
- Executive: Premium Laptop + Monitor + Tablet + Phone + Premium Headset

TONE: Helpful, organized, detail-oriented.`,

  statusBot: `You are the Velocity Project Status Collector. Your mission is to capture project updates and flag risks through natural conversation.

5 ESSENTIAL QUESTIONS:
1. "What's the project name?"
2. "What's the current status?" (On Track / At Risk / Behind / Blocked)
3. "Any immediate concerns or blockers?"
4. "Are you on budget?"
5. "Any vendor or contractor issues?"

CRISIS DETECTION KEYWORDS:
- "urgent", "crisis", "panic", "emergency", "disaster"
- "completely lost", "no documentation", "no idea"
- "way over budget", "budget blown"
- "deadline missed", "already late"
- "vendor not responding", "contractor issue", "quality problems"

If crisis detected: "I'm flagging this as urgent for immediate executive review. Let me make sure we capture this accurately."

TONE: Empathetic, non-judgmental, solution-focused. You're an ally, not an auditor.`,

  approvalBot: `You are the Velocity Approval Assistant. Your mission is to help managers quickly approve or reject pending items via voice commands.

CONVERSATION FLOW:
1. Greet: "Hi! You have [X] pending approvals. Would you like to review them?"
2. Present first item: "Timecard from [Contractor] for [Hours] hours on [Project]. Approve or reject?"
3. If approve: Move to next
4. If reject: "What's the reason for rejection?"
5. Capture rejection reason
6. Continue until all processed
7. Confirm: "Done! [X] approved, [Y] rejected. Notifications sent."

BULK APPROVAL:
- If manager says "approve all" → Confirm count, then approve all at once
- If manager says "approve [number]" → Approve that many, then review remainder

VALIDATION:
- Confirm actions before executing
- Read back rejection reasons for accuracy
- Flag unusually high amounts or hours for double-check

TONE: Efficient, professional, respectful of manager's time.`,

  helpBot: `You are VINessa, the Velocity AI Help Assistant. Your mission is to provide instant, context-aware answers about the Velocity system.

KNOWLEDGE BASE:
- Contractors: How to create, edit, assign to POs, track equipment
- Purchase Orders: Creation, GR approval, fund tracking, contractor allocation
- Timecards: Submission, approval workflow, invoice generation
- Expenses: Categories, approval, receipt requirements
- SOWs: Fixed fee vs deliverables, change orders
- Assets: Checkout, return, equipment kits, maintenance tracking
- Approvals: Routing rules, SLA tracking, escalation

RESPONSE STYLE:
- Answer directly and concisely
- Provide specific examples when helpful
- Reference related features ("By the way, you can also...")
- Offer to do the task if possible ("Would you like me to create that for you?")

CONTEXT AWARENESS:
- If user asks "Why is this PO red?" → Check PO status and explain (budget overrun, deadline approaching, etc.)
- If user asks "What's my budget?" → Look up their department budget and provide summary
- If user asks "How do I...?" → Provide step-by-step instructions

TONE: Friendly, knowledgeable, empowering. Never condescending.`,
};

/**
 * Mock Chatbot Data for Demo
 */
export function getMockChatbots(): Chatbot[] {
  return [
    {
      id: 1,
      name: "VINessa - Timecard Assistant",
      elevenLabsId: "agent_timecard_001",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      status: "Active",
      knowledgeSources: ["timecards", "purchaseorders", "contractors"],
      conversationCount: 347,
      avgResponseTime: 1.8,
      satisfactionScore: 4.7,
      lastSyncDate: new Date().toISOString(),
      createdDate: "2024-01-15T00:00:00Z",
      description: "Voice-powered timecard submission. Contractors call to log hours in under 2 minutes.",
      capabilities: [
        "Timecard submission via voice",
        "PO validation and hours tracking",
        "Automatic manager notification",
        "Approval status updates",
      ],
    },
    {
      id: 2,
      name: "VINessa - Equipment Manager",
      elevenLabsId: "agent_equipment_002",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      status: "Active",
      knowledgeSources: ["assets", "contractors", "employees", "rooms"],
      conversationCount: 189,
      avgResponseTime: 2.1,
      satisfactionScore: 4.8,
      lastSyncDate: new Date().toISOString(),
      createdDate: "2024-02-01T00:00:00Z",
      description:
        "Equipment checkout and return via natural conversation. Supports new hire kits and individual assignments.",
      capabilities: [
        "New hire equipment kit assignment",
        "Individual asset checkout/return",
        "Room-based asset tracking",
        "Maintenance manager assignment",
      ],
    },
    {
      id: 3,
      name: "VINessa - Project Status Collector",
      elevenLabsId: "agent_status_003",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      status: "Active",
      knowledgeSources: ["statementofworks", "purchaseorders", "changeorders"],
      conversationCount: 124,
      avgResponseTime: 2.5,
      satisfactionScore: 4.6,
      lastSyncDate: new Date().toISOString(),
      createdDate: "2024-03-10T00:00:00Z",
      description: "Captures project updates and flags risks through 5 essential questions. Crisis detection built-in.",
      capabilities: [
        "5-question project capture (2-3 minutes)",
        "Automatic crisis detection and flagging",
        "Budget and timeline tracking",
        "Stakeholder identification",
      ],
    },
    {
      id: 4,
      name: "VINessa - Approval Assistant",
      elevenLabsId: "agent_approval_004",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      status: "Active",
      knowledgeSources: ["timecards", "expenses", "changeorders", "approvals"],
      conversationCount: 256,
      avgResponseTime: 1.5,
      satisfactionScore: 4.9,
      lastSyncDate: new Date().toISOString(),
      createdDate: "2024-03-20T00:00:00Z",
      description: "Voice-powered approval workflow. Managers approve/reject via phone in seconds.",
      capabilities: [
        "Bulk approval via voice commands",
        "Individual approval with reason capture",
        "Read-back confirmation for accuracy",
        "Instant notification to requestors",
      ],
    },
    {
      id: 5,
      name: "VINessa - Help Desk",
      elevenLabsId: "agent_help_005",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      status: "Active",
      knowledgeSources: [
        "contractors",
        "purchaseorders",
        "timecards",
        "invoices",
        "expenses",
        "statementofworks",
        "assets",
      ],
      conversationCount: 512,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8,
      lastSyncDate: new Date().toISOString(),
      createdDate: "2024-01-10T00:00:00Z",
      description: "Context-aware help assistant. Answers questions about Velocity features and data.",
      capabilities: [
        "Natural language Q&A about system features",
        "Context-aware answers (current page/data)",
        "Step-by-step instructions",
        "Proactive suggestions and tips",
      ],
    },
  ];
}

/**
 * Mock Conversation History
 */
export function getMockConversations(chatbotId: number): ChatbotConversation[] {
  const now = new Date();
  const conversations: Record<number, ChatbotConversation[]> = {
    1: [
      // Timecard Bot conversations
      {
        id: 1,
        chatbotId: 1,
        userId: 5,
        userName: "John Smith",
        startTime: new Date(now.getTime() - 3600000).toISOString(),
        endTime: new Date(now.getTime() - 3400000).toISOString(),
        messageCount: 8,
        resolved: true,
        rating: 5,
        feedback: "Super fast! Submitted my timecard in 90 seconds.",
        context: {
          timecardId: 42,
          projectName: "Building B Network Upgrade",
          hours: 8,
        },
      },
      {
        id: 2,
        chatbotId: 1,
        userId: 12,
        userName: "Sarah Chen",
        startTime: new Date(now.getTime() - 7200000).toISOString(),
        endTime: new Date(now.getTime() - 6900000).toISOString(),
        messageCount: 10,
        resolved: true,
        rating: 5,
        context: {
          timecardId: 43,
          projectName: "Data Center Migration",
          hours: 10.5,
        },
      },
    ],
    2: [
      // Equipment Bot conversations
      {
        id: 3,
        chatbotId: 2,
        userId: 8,
        userName: "Mike Johnson",
        startTime: new Date(now.getTime() - 5400000).toISOString(),
        endTime: new Date(now.getTime() - 5100000).toISOString(),
        messageCount: 12,
        resolved: true,
        rating: 5,
        feedback: "Checked out equipment for new hire in 2 minutes. Amazing!",
        context: {
          action: "checkout",
          employeeName: "Lisa Wong",
          kitType: "Engineer",
          assetsAssigned: 5,
        },
      },
    ],
    3: [
      // Status Bot conversations
      {
        id: 4,
        chatbotId: 3,
        userId: 15,
        userName: "David Park",
        startTime: new Date(now.getTime() - 1800000).toISOString(),
        endTime: new Date(now.getTime() - 1500000).toISOString(),
        messageCount: 7,
        resolved: true,
        rating: 4,
        context: {
          projectName: "Building B Network Upgrade",
          status: "At Risk",
          crisisFlagged: true,
        },
      },
    ],
  };

  return conversations[chatbotId] || [];
}

/**
 * Create ElevenLabs Agent Configuration
 */
export function createElevenLabsAgentConfig(
  agentType: "timecard" | "equipment" | "status" | "approval" | "help",
  voiceId: string = "21m00Tcm4TlvDq8ikWAM",
) {
  const prompts = {
    timecard: VELOCITY_SYSTEM_PROMPTS.timecardBot,
    equipment: VELOCITY_SYSTEM_PROMPTS.equipmentBot,
    status: VELOCITY_SYSTEM_PROMPTS.statusBot,
    approval: VELOCITY_SYSTEM_PROMPTS.approvalBot,
    help: VELOCITY_SYSTEM_PROMPTS.helpBot,
  };

  return {
    voice_id: voiceId,
    system_prompt: prompts[agentType],
    conversation_config: {
      model_id: "eleven_turbo_v2_5",
      stability: 0.75,
      similarity_boost: 0.85,
      style: 0.65,
      use_speaker_boost: true,
    },
  };
}

/**
 * Process Webhook from ElevenLabs
 * This would be called by your backend when ElevenLabs posts conversation data
 */
export async function processElevenLabsWebhook(webhookData: any) {
  const { event_type, conversation_id, extracted_data, agent_id } = webhookData;

  // Route to appropriate handler based on agent
  const handlers: Record<string, (data: any) => Promise<any>> = {
    agent_timecard_001: handleTimecardSubmission,
    agent_equipment_002: handleEquipmentAction,
    agent_status_003: handleStatusUpdate,
    agent_approval_004: handleApprovalAction,
    agent_help_005: handleHelpQuery,
  };

  const handler = handlers[agent_id];
  if (handler) {
    return await handler(extracted_data);
  }

  return { status: "unhandled", agent_id };
}

/**
 * Handler: Timecard Submission
 */
async function handleTimecardSubmission(data: any) {
  // Mock implementation - in production, this would call your API
  console.log("Creating timecard from voice input:", data);

  return {
    status: "success",
    timecardId: Math.floor(Math.random() * 1000),
    message: "Timecard created and pending approval",
  };
}

/**
 * Handler: Equipment Checkout/Return
 */
async function handleEquipmentAction(data: any) {
  console.log("Processing equipment action:", data);

  return {
    status: "success",
    assetsProcessed: data.assetIds?.length || 0,
    message: "Equipment assignment updated",
  };
}

/**
 * Handler: Status Update
 */
async function handleStatusUpdate(data: any) {
  console.log("Recording project status update:", data);

  if (data.crisis_flag) {
    // Send urgent notification
    console.log("🚨 CRISIS DETECTED - Notifying executives");
  }

  return {
    status: "success",
    crisisFlagged: data.crisis_flag,
    message: "Project status recorded",
  };
}

/**
 * Handler: Approval Action
 */
async function handleApprovalAction(data: any) {
  console.log("Processing approval action:", data);

  return {
    status: "success",
    itemsApproved: data.approved_ids?.length || 0,
    itemsRejected: data.rejected_ids?.length || 0,
    message: "Approvals processed",
  };
}

/**
 * Handler: Help Query
 */
async function handleHelpQuery(data: any) {
  console.log("Help query:", data.question);

  return {
    status: "success",
    question: data.question,
    answer: data.answer,
    message: "Help response provided",
  };
}

/**
 * Initiate Outbound Call (Twilio + ElevenLabs)
 */
export async function initiateOutboundCall(phoneNumber: string, agentId: string, metadata?: Record<string, any>) {
  // Mock implementation - in production, this would call your API
  console.log("Initiating outbound call:", {
    phoneNumber,
    agentId,
    metadata,
  });

  return {
    status: "initiated",
    callId: `call_${Date.now()}`,
    message: "Call initiated successfully",
  };
}
