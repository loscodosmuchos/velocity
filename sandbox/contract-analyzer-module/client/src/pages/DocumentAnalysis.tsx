import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar, 
  Settings, 
  CheckCircle, 
  Monitor,
  Printer,
  Phone,
  Shield,
  Database,
  Clock,
  Building,
  Globe,
  Zap,
  Target,
  BarChart3,
  Layers,
  Brain,
  Upload,
  Download,
  Copy
} from 'lucide-react';
import { sampleContracts, type ContractData } from '@shared/contractData';

const DocumentAnalysis: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [contract, setContract] = useState<ContractData | null>(null);

  const handleContractSelect = (contractId: string) => {
    setSelectedContract(contractId);
    const selectedContractData = sampleContracts.find(c => c.id === contractId);
    setContract(selectedContractData || null);
    setActiveTab('overview');
  };

  const generateVoiceScript = () => {
    if (!contract) return '';
    
    return `You are an expert contract analysis AI assistant specialized in analyzing and answering questions about the ${contract.title}. 

**CONTRACT OVERVIEW:**
- Client: ${contract.client}
- Provider: ${contract.provider}
- Contract Type: ${contract.type}
- Duration: ${contract.effectiveDate} to ${contract.completionDate}
- Total Value: ${contract.totalValue}
- Scope: ${contract.overview.scope}

**KEY SERVICES:**
${contract.services.map(service => `• ${service.category}: ${service.description}`).join('\n')}

**PERSONNEL STRUCTURE (${contract.personnel.reduce((sum, p) => sum + p.count, 0)} Total):**
${contract.personnel.map(person => `• ${person.count} ${person.role} (${person.location}) - ${person.experience}`).join('\n')}

**COST STRUCTURE:**
- Model: ${contract.costStructure.model}
${contract.costStructure.breakdown.map(item => `• ${item.category}: ${item.amount} (${item.frequency})`).join('\n')}

**KEY RESPONSIBILITIES:**
Provider: ${contract.responsibilities.provider.slice(0, 3).join(', ')}
Client: ${contract.responsibilities.client.slice(0, 3).join(', ')}

**SLA METRICS:**
${contract.metrics.sla.map(sla => `• ${sla.metric}: ${sla.target}`).join('\n')}

**INSTRUCTIONS:**
1. Answer questions about this contract with specific details from the data above
2. Provide calculations for costs, personnel ratios, timelines, and ROI when asked
3. Explain contract terms, responsibilities, and obligations clearly
4. Offer strategic insights for different stakeholders (executives, technical teams, financial analysts)
5. Reference specific clauses, metrics, and deliverables when relevant
6. Suggest optimizations, risks, and opportunities based on the contract structure
7. Use a professional yet approachable tone suitable for business discussions

You have complete knowledge of this contract and can answer detailed questions about services, costs, timelines, personnel, equipment, responsibilities, and performance metrics. Be comprehensive yet concise in your responses.`;
  };

  const copyVoiceScript = () => {
    const script = generateVoiceScript();
    navigator.clipboard.writeText(script);
  };

  const iconMap: { [key: string]: React.ReactNode } = {
    'Settings': <Settings className="w-5 h-5" />,
    'Monitor': <Monitor className="w-5 h-5" />,
    'Shield': <Shield className="w-5 h-5" />,
    'FileText': <FileText className="w-5 h-5" />,
    'BarChart3': <BarChart3 className="w-5 h-5" />,
    'Layers': <Layers className="w-5 h-5" />,
    'Zap': <Zap className="w-5 h-5" />,
    'Target': <Target className="w-5 h-5" />,
    'Database': <Database className="w-5 h-5" />,
    'Users': <Users className="w-5 h-5" />,
    'Globe': <Globe className="w-5 h-5" />
  };

  if (!contract) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Smart Contract Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Select a contract or SOW to view comprehensive analysis, generate voice scripts, and explore insights.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Select Contract for Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleContractSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a contract to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {sampleContracts.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{contract.type}</Badge>
                      <span>{contract.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {sampleContracts.map((contract) => (
                <Card 
                  key={contract.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleContractSelect(contract.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Badge className="text-xs">{contract.type}</Badge>
                      <h3 className="font-semibold text-sm">{contract.client}</h3>
                      <p className="text-xs text-muted-foreground">{contract.title}</p>
                      <div className="flex justify-between text-xs">
                        <span>{contract.effectiveDate}</span>
                        <span className="font-medium">{contract.totalValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Your Own Contract</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="mb-4">
              Want to analyze your own contract or SOW? Upload your document and get the same comprehensive analysis.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Select value={selectedContract} onValueChange={handleContractSelect}>
            <SelectTrigger className="w-96">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sampleContracts.map((contract) => (
                <SelectItem key={contract.id} value={contract.id}>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{contract.type}</Badge>
                    <span>{contract.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          {contract.title}
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <Building className="w-4 h-4 mr-1" />
            {contract.client}
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <Calendar className="w-4 h-4 mr-1" />
            {contract.type}
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
            <DollarSign className="w-4 h-4 mr-1" />
            {contract.totalValue}
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="costs">Cost Structure</TabsTrigger>
          <TabsTrigger value="voice-script">Voice Script</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Client</div>
                    <div>{contract.client}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Provider</div>
                    <div>{contract.provider}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                    <div>{contract.effectiveDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">End Date</div>
                    <div>{contract.completionDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                    <div className="font-semibold text-green-600">{contract.totalValue}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Currency</div>
                    <div>{contract.currency}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Personnel</span>
                    <Badge variant="outline">{contract.personnel.reduce((sum, p) => sum + p.count, 0)} FTE</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Service Categories</span>
                    <Badge variant="outline">{contract.services.length} Services</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Model</span>
                    <Badge variant="outline">{contract.costStructure.model}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SLA Metrics</span>
                    <Badge variant="outline">{contract.metrics.sla.length} KPIs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contract.overview.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{contract.overview.summary}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium text-sm mb-2">Scope Details:</div>
                <div className="text-sm">{contract.overview.scope}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contract.services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {iconMap[service.icon] || <Settings className="w-5 h-5" />}
                    <span>{service.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{service.description}</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Scope:</div>
                    <div className="text-sm text-blue-700">{service.scope}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personnel Tab */}
        <TabsContent value="personnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Personnel Requirements</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {contract.personnel.reduce((sum, p) => sum + p.count, 0)} Total FTE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.personnel.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {person.count}
                      </div>
                      <div>
                        <div className="font-medium">{person.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {person.experience} • {person.location}
                        </div>
                        {person.specialSkills && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {person.specialSkills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{person.location}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hardware Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contract.equipment.hardware.map((hw, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium mb-2">{hw.category}</div>
                    {hw.quantity && (
                      <div className="text-sm text-muted-foreground mb-2">Quantity: {hw.quantity}</div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">Vendors: </span>
                      {hw.vendors}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Software Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contract.equipment.software.map((sw, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium mb-2">{sw.category}</div>
                    {sw.licensing && (
                      <div className="text-sm text-muted-foreground mb-2">Licensing: {sw.licensing}</div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {sw.applications.map((app, appIndex) => (
                        <Badge key={appIndex} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Responsibilities Tab */}
        <TabsContent value="responsibilities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Provider Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contract.responsibilities.provider.map((resp, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{resp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Client Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contract.responsibilities.client.map((resp, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{resp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Shared Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contract.responsibilities.shared.map((resp, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{resp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contract.timeline.phases.map((phase, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{phase.name}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Milestones:</h4>
                        <div className="space-y-1">
                          {phase.milestones.map((milestone, mIndex) => (
                            <div key={mIndex} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-sm">{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Deliverables:</h4>
                        <div className="space-y-1">
                          {phase.deliverables.map((deliverable, dIndex) => (
                            <div key={dIndex} className="flex items-center space-x-2">
                              <FileText className="w-3 h-3 text-blue-600" />
                              <span className="text-sm">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Critical Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract.timeline.criticalDates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{date.event}</div>
                        <div className="text-sm text-muted-foreground">{date.date}</div>
                      </div>
                    </div>
                    <Badge 
                      className={
                        date.importance === 'High' ? "bg-red-100 text-red-800 border-red-200" :
                        date.importance === 'Medium' ? "bg-orange-100 text-orange-800 border-orange-200" :
                        "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {date.importance}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <div className="text-sm text-muted-foreground">Model: {contract.costStructure.model}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contract.costStructure.breakdown.map((cost, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{cost.category}</div>
                      <div className="text-sm text-muted-foreground">{cost.frequency}</div>
                      {cost.notes && <div className="text-xs text-muted-foreground mt-1">{cost.notes}</div>}
                    </div>
                    <div className="font-semibold text-green-600">{cost.amount}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contract.costStructure.additionalCosts.map((cost, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium mb-1">{cost.item}</div>
                    <div className="text-sm text-green-600 mb-1">Rate: {cost.rate}</div>
                    <div className="text-xs text-muted-foreground">{cost.condition}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SLA Metrics & KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Service Level Agreements</h3>
                  <div className="space-y-3">
                    {contract.metrics.sla.map((sla, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">{sla.metric}</div>
                        <div className="text-sm text-green-600 font-semibold">Target: {sla.target}</div>
                        <div className="text-xs text-muted-foreground">{sla.measurement}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Key Performance Indicators</h3>
                  <div className="space-y-3">
                    {contract.metrics.kpis.map((kpi, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">{kpi.name}</div>
                        <div className="text-sm text-blue-600 font-semibold">Target: {kpi.target}</div>
                        <div className="text-xs text-muted-foreground">{kpi.reporting}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Script Tab */}
        <TabsContent value="voice-script" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Voice Assistant Script</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Copy this prompt to use with ChatGPT, Claude, or other AI assistants for interactive contract Q&A
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={copyVoiceScript} className="flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy Voice Script</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download as Text</span>
                </Button>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {generateVoiceScript()}
                </pre>
              </div>

              <div className="bg-blue-50 border-blue-200 border rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">How to Use This Voice Script:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>1. Copy the script above</div>
                  <div>2. Paste it into ChatGPT, Claude, or your preferred AI assistant</div>
                  <div>3. Start asking questions about the contract</div>
                  <div>4. The AI will respond with specific details from this contract analysis</div>
                </div>
              </div>

              <div className="bg-green-50 border-green-200 border rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Example Questions You Can Ask:</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• "What are the monthly personnel costs for this contract?"</div>
                  <div>• "How many Korean-speaking technicians are required?"</div>
                  <div>• "What are the SLA response time requirements?"</div>
                  <div>• "Calculate the cost per device for this engagement"</div>
                  <div>• "What are the provider's key responsibilities?"</div>
                  <div>• "When are the critical project milestones?"</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentAnalysis;