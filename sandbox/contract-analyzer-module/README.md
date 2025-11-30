# Contract Analyzer Module

## Quick Start
Files are in proper directory structure. After uploading to your Replit:
1. Extract to project root
2. Give the AI agent the prompt below

---

## AGENT PROMPT (Copy this after uploading files)

```
I've uploaded a Contract Analyzer module package. Please integrate it into my project:

FILES UPLOADED (in correct directories):
- client/src/pages/HAEAContractAnalysis.tsx
- client/src/pages/DocumentAnalysis.tsx  
- client/src/pages/AIDocumentSupport.tsx
- client/src/components/HAEAAIPrompt.tsx
- client/src/components/DocumentUploader.tsx
- client/src/components/VoiceChatWidget.tsx
- shared/contractData.ts

INTEGRATION TASKS:
1. Add imports and routes to App.tsx:
   - /haea-contract -> HAEAContractAnalysis
   - /document-analysis -> DocumentAnalysis
   - /ai-document-support -> AIDocumentSupport

2. Verify these shadcn/ui components exist (install if missing):
   - Card, Button, Badge, Tabs, Select, Slider, Input, Label, Progress

3. Verify lucide-react is installed

4. Add navigation links to the main menu/sidebar

5. Test all three routes work

The module provides:
- Contract analysis with services, personnel, equipment, costs breakdown
- AI voice script generation for ChatGPT/Claude
- What-if scenario calculators
- Document upload interface
```

---

## Package Contents

```
contract-analyzer-module/
├── client/src/
│   ├── pages/
│   │   ├── HAEAContractAnalysis.tsx   (Sample MSP contract viewer)
│   │   ├── DocumentAnalysis.tsx       (Multi-contract analyzer)
│   │   └── AIDocumentSupport.tsx      (Upload + what-if scenarios)
│   └── components/
│       ├── HAEAAIPrompt.tsx           (AI prompt generator)
│       ├── DocumentUploader.tsx       (File upload component)
│       └── VoiceChatWidget.tsx        (Voice assistant widget)
├── shared/
│   └── contractData.ts                (Types + sample data)
└── README.md
```

## Features

### 1. HAEA Contract Analysis (`/haea-contract`)
- Pre-loaded sample MSP contract
- Tabs: Overview, Services, Personnel, Equipment, Responsibilities, Timeline, Costs, AI Support
- Interactive data visualization

### 2. Document Analysis (`/document-analysis`)
- Select from multiple sample contracts
- Auto-generates voice scripts for AI assistants
- Full contract breakdown views

### 3. AI Document Support (`/ai-document-support`)
- Document upload interface
- What-if scenario calculator (adjust fees, devices, SLA, etc.)
- Real-time ROI and cost calculations
- AI prompt templates

## Dependencies

Required packages:
- lucide-react
- @radix-ui/react-tabs
- @radix-ui/react-select
- @radix-ui/react-slider
- @radix-ui/react-progress

Required shadcn/ui components:
- Card, CardContent, CardHeader, CardTitle
- Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Slider, Input, Label, Progress

## Customization

### Add Your Own Contracts
Edit `shared/contractData.ts` - follow the `ContractData` interface to add new contracts.

### Voice Assistant
Update the ElevenLabs agent ID in `VoiceChatWidget.tsx` line 132 with your own agent ID.
