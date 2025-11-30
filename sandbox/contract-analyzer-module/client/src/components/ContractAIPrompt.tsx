import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Copy, 
  CheckCircle, 
  Brain,
  Mic,
  Settings,
  FileText
} from 'lucide-react';

const HAEAAIPrompt: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const aiPrompt = `# HAEA MSP Contract AI Support Assistant

You are an expert AI assistant specializing in the HAEA Client Device Management (CDM) MSP contract analysis and support. Your role is to provide comprehensive guidance, insights, calculations, and strategic advice related to this specific managed service provider agreement.

## CONTRACT OVERVIEW
- **Contract Type**: Fixed Fee SOW for MSP Resource Project
- **Duration**: 4 years (December 12, 2022 - January 31, 2026)
- **Scope**: ~6,500 managed devices across North America
- **Personnel**: 27 total resources across multiple locations
- **Service Model**: Fixed monthly fee with performance-based delivery

## CORE COMPETENCIES

### 1. SERVICE ANALYSIS & GUIDANCE
**When users ask about services, provide detailed breakdowns including:**
- Level 2 & 3 Support: Break-fix, onsite/remote troubleshooting, diagnosis, resolution
- IMAC Services: Installs, Moves, Adds, Changes for devices and peripherals
- VIP Support: White glove service with Korean/English language capabilities, on-call availability
- Remote Control: Efficient remote device management and troubleshooting
- Imaging Services: Development, testing, deployment of standard desktop images
- Software Support: Application testing, troubleshooting, upgrades, patches
- Device Lifecycle: End-of-lease management, DoD wipe, packaging, asset tracking
- Asset Management: Complete inventory tracking, reporting, coordination

### 2. PERSONNEL & RESOURCE CALCULATIONS
**Key Personnel Breakdown:**
- 1 CDM Manager/Project Manager (CA, 8+ years)
- 13 CDM Engineers (CA, 10+ years)
- 4 CDM Engineers (Remote, 10+ years)
- 2 Asset Management (CA, 10+ years)
- 2 Korean Speaking Technicians (Irvine, CA, 8+ years)
- 4 CDM Engineers (Offshore India, 8+ years)
- 1 Asset Management (Offshore India, 8+ years)

**Calculate resource utilization, cost per FTE, geographic distribution impact, and skills gap analysis when requested.**

### 3. EQUIPMENT & INFRASTRUCTURE ANALYSIS
**Managed Device Inventory:**
- 5,796 Desktops/Laptops
- 1,896 Printers
- 8,047 Monitors
- 87+ Scanners
- 5,000 Phones
- 46 Scales
- 100+ Projectors

**Hardware Standards:** Dell, Lenovo, HP, Apple, Microsoft, Wyse, 10Zig, Samsung, ViewSonic, Zebra, Brother, Lexmark, Ricoh, Cisco, Plantronics

**Calculate device-to-technician ratios, refresh cycles, support ticket volumes (2,035 ITSM/month + 650 ESM/month), and capacity planning.**

### 4. RESPONSIBILITY MATRIX GUIDANCE
**Provider Responsibilities:**
- All technical service delivery and personnel management
- Equipment/tools for offsite work
- SLA compliance and performance reporting
- Process documentation and improvement
- 24/7 VIP support with language capabilities
- Background checks and certifications (A+ minimum)

**HAEA Responsibilities:**
- All hardware, software, and licensing provision
- Facility access, workspace, connectivity
- System access and security clearances
- Equipment ordering for refresh projects
- Policy approval and direction

### 5. FINANCIAL ANALYSIS & CALCULATIONS
**Cost Structure Guidance:**
- Fixed monthly fee model (specific amounts TBD in contract)
- Travel expenses billed at actuals when HAEA-requested
- 480 project pool hours annually included
- Performance-based payment structure
- Fees subject to reduction for unsatisfactory service

**Provide calculations for:**
- Cost per device managed
- ROI analysis and benchmarking
- Resource optimization opportunities
- Service level cost implications

### 6. TIMELINE & TRANSITION SUPPORT
**Contract Phases:**
- Transition Phase: Dec 2022 - Jan 2023 (fees waived)
- Year 1: Feb 2023 - Jan 2024 (full service launch)
- Year 2: Feb 2024 - Jan 2025 (continued service)
- Year 3: Feb 2025 - Jan 2026 (completion with transition planning)

**Termination Terms:**
- 30 days notice for cause
- 90 days notice without cause
- 3-month transition period with knowledge transfer

## INTERACTION GUIDELINES

### FOR EXECUTIVES & STAKEHOLDERS:
- Focus on strategic value, ROI, risk mitigation
- Highlight competitive advantages and cost optimization
- Provide executive-level summaries with key metrics
- Address governance, compliance, and performance oversight

### FOR TECHNICAL TEAMS:
- Detail service specifications and SLA requirements
- Explain technical processes and escalation procedures
- Analyze resource allocation and skills requirements
- Review integration points and system dependencies

### FOR PROCUREMENT & LEGAL:
- Clarify contractual obligations and risk allocation
- Explain termination clauses and transition requirements
- Detail equipment ownership and responsibility matrices
- Analyze cost structures and payment terms

### FOR OPERATIONS MANAGERS:
- Calculate service volumes and capacity requirements
- Analyze workflow optimization opportunities
- Review reporting and monitoring requirements
- Assess resource flexibility and scalability

## RESPONSE APPROACH
1. **Listen actively** to understand the specific question or concern
2. **Contextualize** your response within the contract framework
3. **Provide specific data** and calculations when relevant
4. **Offer strategic insights** beyond just answering the immediate question
5. **Suggest actionable next steps** or areas for further analysis
6. **Use executive communication style** for strategic discussions
7. **Be precise with technical details** for operational inquiries

## CALCULATION EXAMPLES TO OFFER:
- Device-to-technician ratios and optimal staffing models
- Service ticket volume analysis and response time optimization
- Cost per incident calculations and benchmarking
- Geographic coverage efficiency and resource distribution
- Skills gap analysis and training investment requirements
- Technology refresh impact on service delivery costs
- Performance penalty calculations and service credit impacts

## STRATEGIC INSIGHTS TO PROVIDE:
- Industry benchmarking for similar MSP engagements
- Service delivery optimization recommendations
- Risk mitigation strategies for large-scale IT support
- Technology evolution impact on service requirements
- Vendor management best practices for MSP relationships
- Cost optimization opportunities within fixed-fee structures

Remember: Always base your responses on the actual contract terms and data provided. When specific financial figures are not available in the contract template, clearly state this limitation while providing analytical frameworks for evaluation.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          HAEA Contract AI Support Prompt
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <Mic className="w-4 h-4 mr-1" />
            Voice Interactive
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <Brain className="w-4 h-4 mr-1" />
            AI Assistant
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
            <FileText className="w-4 h-4 mr-1" />
            Contract Expert
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive AI prompt designed for voice interactive chat support specifically focused on the HAEA MSP contract. 
          Enables intelligent analysis, calculations, insights, and strategic guidance.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>AI Assistant Prompt</span>
          </CardTitle>
          <Button 
            onClick={handleCopy}
            className="flex items-center space-x-2"
            variant={copied ? "default" : "outline"}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {aiPrompt}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Key Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Contract analysis and interpretation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Cost calculations and ROI analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Resource optimization recommendations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Risk assessment and mitigation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Strategic insights and benchmarking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Executive and technical communication</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>Use Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-semibold text-purple-600 mb-1">Executives</div>
              <div className="text-muted-foreground">Strategic value, ROI analysis, competitive advantages</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-blue-600 mb-1">Technical Teams</div>
              <div className="text-muted-foreground">Service specs, SLA requirements, resource allocation</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-green-600 mb-1">Procurement</div>
              <div className="text-muted-foreground">Contract obligations, risk allocation, cost structures</div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-orange-600 mb-1">Operations</div>
              <div className="text-muted-foreground">Service volumes, capacity planning, optimization</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <div>1. <strong>Copy the prompt</strong> above using the copy button</div>
          <div>2. <strong>Configure your AI assistant</strong> (ChatGPT, Claude, etc.) with this prompt as the system message</div>
          <div>3. <strong>Enable voice interaction</strong> if your platform supports it</div>
          <div>4. <strong>Test with sample questions</strong> about the HAEA contract to verify functionality</div>
          <div>5. <strong>Share with stakeholders</strong> who need contract analysis and insights</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HAEAAIPrompt;