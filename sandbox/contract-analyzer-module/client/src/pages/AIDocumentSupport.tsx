import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Upload, 
  FileText, 
  Brain,
  Zap,
  MessageSquare,
  Settings,
  Copy,
  Download,
  CheckCircle,
  ArrowRight,
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Target
} from 'lucide-react';
import DocumentUploader from '@/components/DocumentUploader';
import HAEAAIPrompt from '@/components/HAEAAIPrompt';

const AIDocumentSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  
  // Scenario Calculator State
  const [scenarios, setScenarios] = useState({
    baseContract: {
      monthlyFee: 150000,
      devices: 6500,
      personnel: 18,
      slaUptime: 99.5,
      contractTerm: 36
    },
    current: {
      monthlyFee: 150000,
      devices: 6500,
      personnel: 18,
      slaUptime: 99.5,
      contractTerm: 36
    }
  });

  const handleUploadComplete = (analysisData: any) => {
    setUploadedDocuments(prev => [...prev, analysisData]);
    setActiveTab('documents');
  };

  const features = [
    {
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      title: "Smart Document Upload",
      description: "Upload any contract, SOW, or agreement for AI-powered analysis",
      capabilities: ["PDF, DOC, DOCX support", "Automatic text extraction", "Structure recognition"]
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "AI Analysis Engine",
      description: "Advanced AI extracts key information and generates insights",
      capabilities: ["Service categorization", "Cost structure analysis", "Personnel requirements"]
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      title: "Voice Script Generation",
      description: "Create interactive AI prompts for Q&A sessions about your contracts",
      capabilities: ["Contract-specific prompts", "Voice assistant ready", "Copy-paste friendly"]
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Instant Insights",
      description: "Get immediate analysis results with comprehensive breakdowns",
      capabilities: ["Real-time processing", "Structured outputs", "Executive summaries"]
    },
    {
      icon: <Calculator className="w-6 h-6 text-red-600" />,
      title: "What-If Scenarios",
      description: "Interactive calculators for contract optimization and planning",
      capabilities: ["Cost modeling", "ROI analysis", "Risk assessment", "Strategic planning"]
    }
  ];

  // Scenario calculation functions
  const calculateMetrics = (params: any) => {
    const costPerDevice = params.monthlyFee / params.devices;
    const annualCost = params.monthlyFee * 12;
    const totalContractCost = params.monthlyFee * params.contractTerm;
    const costPerPersonnel = params.monthlyFee / params.personnel;
    const downtimeRisk = (100 - params.slaUptime) * 0.01 * annualCost * 0.1; // Estimated downtime cost
    const efficiencyScore = Math.min(100, (params.slaUptime - 95) * 20 + 60);
    
    return {
      costPerDevice: costPerDevice,
      annualCost: annualCost,
      totalContractCost: totalContractCost,
      costPerPersonnel: costPerPersonnel,
      downtimeRisk: downtimeRisk,
      efficiencyScore: efficiencyScore,
      roiProjection: ((params.devices * 250 - annualCost) / annualCost) * 100 // Estimated ROI
    };
  };

  const baseMetrics = calculateMetrics(scenarios.baseContract);
  const currentMetrics = calculateMetrics(scenarios.current);

  const updateScenario = (field: string, value: number) => {
    setScenarios(prev => ({
      ...prev,
      current: {
        ...prev.current,
        [field]: value
      }
    }));
  };

  const resetScenario = () => {
    setScenarios(prev => ({
      ...prev,
      current: { ...prev.baseContract }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const getChangeIndicator = (base: number, current: number) => {
    const change = ((current - base) / base) * 100;
    const isPositive = change > 0;
    const color = isPositive ? 'text-red-600' : 'text-green-600';
    const symbol = isPositive ? '▲' : '▼';
    
    return (
      <span className={`text-sm ${color} font-medium`}>
        {symbol} {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          AI Document Support
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <Brain className="w-4 h-4 mr-1" />
            AI Powered
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <Upload className="w-4 h-4 mr-1" />
            Document Upload
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
            <MessageSquare className="w-4 h-4 mr-1" />
            Voice Scripts
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Upload your contracts and documents to get AI-powered analysis, insights, and interactive voice scripts 
          for comprehensive Q&A sessions with ChatGPT, Claude, or other AI assistants.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">{feature.icon}</div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <div className="space-y-1">
                {feature.capabilities.map((capability, capIndex) => (
                  <div key={capIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs">{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="documents">Analyzed Documents</TabsTrigger>
          <TabsTrigger value="scenarios">What-If Scenarios</TabsTrigger>
          <TabsTrigger value="haea-prompt">HAEA Contract Prompt</TabsTrigger>
          <TabsTrigger value="how-to">How to Use</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <DocumentUploader 
            onUploadComplete={handleUploadComplete}
            onAnalysisStart={() => console.log('Analysis started')}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {uploadedDocuments.length === 0 ? (
            <Card className="text-center p-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Documents Analyzed Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload a document to see your analyzed contracts and SOWs here
              </p>
              <Button onClick={() => setActiveTab('upload')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Document
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedDocuments.map((doc, index) => (
                <Card key={index} className="hover:bg-gray-50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{doc.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline">{doc.type}</Badge>
                      <div className="text-xs text-muted-foreground">
                        Analyzed: {new Date().toLocaleDateString()}
                      </div>
                      <Button size="sm" className="w-full">
                        View Analysis
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* What-If Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  <span>Interactive Contract Scenario Calculators</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Modify contract parameters below and see real-time calculations for key metrics. 
                  Perfect for optimization planning and stakeholder discussions.
                </p>
              </CardHeader>
            </Card>

            {/* Controls Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Scenario Parameters</span>
                    <Button onClick={resetScenario} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Adjust values to explore different contract scenarios
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monthly Fee */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Monthly Fee</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={scenarios.current.monthlyFee}
                        onChange={(e) => updateScenario('monthlyFee', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {formatCurrency(scenarios.current.monthlyFee)}
                      </span>
                    </div>
                    <Slider
                      value={[scenarios.current.monthlyFee]}
                      onValueChange={(value) => updateScenario('monthlyFee', value[0])}
                      max={300000}
                      min={50000}
                      step={5000}
                      className="w-full"
                    />
                  </div>

                  {/* Devices */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Total Devices</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={scenarios.current.devices}
                        onChange={(e) => updateScenario('devices', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {scenarios.current.devices.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[scenarios.current.devices]}
                      onValueChange={(value) => updateScenario('devices', value[0])}
                      max={15000}
                      min={1000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Personnel */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Personnel Count</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={scenarios.current.personnel}
                        onChange={(e) => updateScenario('personnel', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {scenarios.current.personnel} people
                      </span>
                    </div>
                    <Slider
                      value={[scenarios.current.personnel]}
                      onValueChange={(value) => updateScenario('personnel', value[0])}
                      max={50}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* SLA Uptime */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">SLA Uptime Target</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={scenarios.current.slaUptime}
                        onChange={(e) => updateScenario('slaUptime', Number(e.target.value))}
                        className="flex-1"
                        step="0.1"
                        min="95"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {formatPercent(scenarios.current.slaUptime)}
                      </span>
                    </div>
                    <Slider
                      value={[scenarios.current.slaUptime]}
                      onValueChange={(value) => updateScenario('slaUptime', value[0])}
                      max={100}
                      min={95}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Contract Term */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contract Term (Months)</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={scenarios.current.contractTerm}
                        onChange={(e) => updateScenario('contractTerm', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px]">
                        {(scenarios.current.contractTerm / 12).toFixed(1)} years
                      </span>
                    </div>
                    <Slider
                      value={[scenarios.current.contractTerm]}
                      onValueChange={(value) => updateScenario('contractTerm', value[0])}
                      max={60}
                      min={12}
                      step={6}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Live Calculations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Live Calculations</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Real-time metrics based on your scenario parameters
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cost Per Device */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Cost Per Device</span>
                      </div>
                      {getChangeIndicator(baseMetrics.costPerDevice, currentMetrics.costPerDevice)}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(currentMetrics.costPerDevice)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Monthly cost per managed device
                    </div>
                  </div>

                  {/* Annual Cost */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Annual Cost</span>
                      </div>
                      {getChangeIndicator(baseMetrics.annualCost, currentMetrics.annualCost)}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentMetrics.annualCost)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total yearly contract value
                    </div>
                  </div>

                  {/* ROI Projection */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">ROI Projection</span>
                      </div>
                      {getChangeIndicator(baseMetrics.roiProjection, currentMetrics.roiProjection)}
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercent(currentMetrics.roiProjection)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated return on investment
                    </div>
                  </div>

                  {/* Efficiency Score */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Efficiency Score</span>
                      </div>
                      {getChangeIndicator(baseMetrics.efficiencyScore, currentMetrics.efficiencyScore)}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {currentMetrics.efficiencyScore.toFixed(1)}/100
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on SLA performance targets
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Cost Per Personnel</div>
                  <div className="text-xl font-bold">{formatCurrency(currentMetrics.costPerPersonnel)}</div>
                  <div className="text-xs mt-1">
                    {getChangeIndicator(baseMetrics.costPerPersonnel, currentMetrics.costPerPersonnel)}
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Contract Value</div>
                  <div className="text-xl font-bold">{formatCurrency(currentMetrics.totalContractCost)}</div>
                  <div className="text-xs mt-1">
                    {getChangeIndicator(baseMetrics.totalContractCost, currentMetrics.totalContractCost)}
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Downtime Risk Cost</div>
                  <div className="text-xl font-bold">{formatCurrency(currentMetrics.downtimeRisk)}</div>
                  <div className="text-xs mt-1">
                    {getChangeIndicator(baseMetrics.downtimeRisk, currentMetrics.downtimeRisk)}
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Devices Per Person</div>
                  <div className="text-xl font-bold">{Math.round(scenarios.current.devices / scenarios.current.personnel)}</div>
                  <div className="text-xs mt-1">
                    {getChangeIndicator(
                      scenarios.baseContract.devices / scenarios.baseContract.personnel,
                      scenarios.current.devices / scenarios.current.personnel
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Strategic Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-700">Optimization Opportunities</h4>
                    <div className="space-y-2 text-sm">
                      {currentMetrics.costPerDevice < baseMetrics.costPerDevice && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Improved cost efficiency per device</span>
                        </div>
                      )}
                      {currentMetrics.efficiencyScore > baseMetrics.efficiencyScore && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Higher efficiency score achieved</span>
                        </div>
                      )}
                      {scenarios.current.devices / scenarios.current.personnel > 300 && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Good personnel-to-device ratio</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-700">Risk Factors</h4>
                    <div className="space-y-2 text-sm">
                      {scenarios.current.devices / scenarios.current.personnel > 500 && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>High device-to-personnel ratio</span>
                        </div>
                      )}
                      {scenarios.current.slaUptime < 99.0 && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>SLA uptime below industry standard</span>
                        </div>
                      )}
                      {currentMetrics.downtimeRisk > baseMetrics.downtimeRisk && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Increased downtime risk exposure</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* HAEA Prompt Tab */}
        <TabsContent value="haea-prompt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>HAEA Contract AI Assistant Prompt</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Pre-configured AI prompt for the HAEA MSP contract analysis and Q&A
              </div>
            </CardHeader>
            <CardContent>
              <HAEAAIPrompt />
            </CardContent>
          </Card>
        </TabsContent>

        {/* How to Use Tab */}
        <TabsContent value="how-to" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Step 1: Upload Your Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Select PDF, DOC, or DOCX file</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Wait for AI analysis to complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Review extracted information</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Step 2: Generate Voice Script</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Navigate to "Voice Script" tab</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Copy the generated AI prompt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Use with any AI assistant</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Step 3: Interactive Q&A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Paste prompt into ChatGPT/Claude</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Ask questions about your contract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Get detailed, contextual answers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-700">Step 4: Advanced Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Request cost calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Analyze risks and opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Generate strategic insights</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Example Questions You Can Ask</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 space-y-2">
              <div>• "What are the key financial terms and cost structures?"</div>
              <div>• "How many personnel are required and what are their roles?"</div>
              <div>• "What are the main responsibilities of each party?"</div>
              <div>• "Calculate the total cost per device or per user"</div>
              <div>• "What are the SLA requirements and performance metrics?"</div>
              <div>• "When are the critical project milestones and deadlines?"</div>
              <div>• "What risks should we be aware of in this contract?"</div>
              <div>• "How does this compare to industry standards?"</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Benefits of AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700 space-y-2">
              <div>✓ Instant extraction of key contract information</div>
              <div>✓ Automated cost and resource calculations</div>
              <div>✓ Interactive Q&A capability with any AI assistant</div>
              <div>✓ Risk identification and opportunity analysis</div>
              <div>✓ Strategic insights for different stakeholders</div>
              <div>✓ Comprehensive documentation and reporting</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDocumentSupport;