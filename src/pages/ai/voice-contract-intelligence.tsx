import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Loader2, Phone, CheckCircle, Clock, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useList } from '@refinedev/core';

interface ContractUpload {
  id: number;
  fileName: string;
  uploadedAt: string;
  analyzed: boolean;
  contractType?: string;
  riskScore?: number;
}

interface AnalysisResult {
  contractType: string;
  parties: string[];
  financialTerms: {
    totalValue?: string;
    paymentSchedule?: string;
  };
  risks: Array<{
    severity: string;
    description: string;
  }>;
  complianceRequirements: string[];
  summary: string;
}

export default function VoiceContractIntelligence() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPendingAnalysis, setIsPendingAnalysis] = useState(false);
  const [uploadResult, setUploadResult] = useState<ContractUpload | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+1234567890');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        
        const response = await fetch('/api/voice-contract/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'demo@velocity.com',
            subject: `Contract Upload: ${selectedFile.name}`,
            filename: selectedFile.name,
            attachment: base64.split(',')[1],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Upload failed');
        }

        const data = await response.json();
        
        if (!data.success && data.message?.toLowerCase().includes('pending')) {
          setUploadResult({
            id: 0,
            fileName: selectedFile.name,
            uploadedAt: new Date().toISOString(),
            analyzed: false,
          });
          setIsPendingAnalysis(true);
          setAnalysisResult(null);
          setSelectedFile(null);
          return;
        }
        
        if (!data.success) {
          throw new Error(data.message || 'Upload failed');
        }
        
        if (!data.contract_id) {
          if (data.message?.toLowerCase().includes('pending')) {
            setUploadResult({
              id: 0,
              fileName: selectedFile.name,
              uploadedAt: new Date().toISOString(),
              analyzed: false,
            });
            setIsPendingAnalysis(true);
            setAnalysisResult(null);
            setSelectedFile(null);
            return;
          }
          throw new Error('Upload succeeded but no contract ID returned');
        }

        const contractResponse = await fetch(`/api/voice-contract/contracts/${data.contract_id}`);
        if (!contractResponse.ok) {
          throw new Error('Failed to fetch uploaded contract details');
        }
        
        const contractData = await contractResponse.json();
        
        if (!contractData.success) {
          if (contractData.message?.toLowerCase().includes('pending')) {
            setUploadResult({
              id: data.contract_id,
              fileName: selectedFile.name,
              uploadedAt: new Date().toISOString(),
              analyzed: false,
            });
            setIsPendingAnalysis(true);
            setAnalysisResult(null);
            return;
          }
          throw new Error(contractData.message || 'Failed to retrieve contract details from server');
        }
        
        if (!contractData.contract) {
          setUploadResult({
            id: data.contract_id,
            fileName: selectedFile.name,
            uploadedAt: new Date().toISOString(),
            analyzed: false,
          });
          setIsPendingAnalysis(true);
          setAnalysisResult(null);
          return;
        }
        
        const contract = contractData.contract;
        const analysis = contract.analysis;
        
        if (!analysis || typeof analysis !== 'object' || !analysis.contract_type) {
          setUploadResult({
            id: contract.id,
            fileName: contract.filename || selectedFile.name,
            uploadedAt: contract.uploaded_at || new Date().toISOString(),
            analyzed: false,
          });
          setIsPendingAnalysis(true);
          setAnalysisResult(null);
          return;
        }
        
        setUploadResult({
          id: contract.id,
          fileName: contract.filename || selectedFile.name,
          uploadedAt: contract.uploaded_at || new Date().toISOString(),
          analyzed: true,
          contractType: analysis.contract_type,
          riskScore: analysis.risk_score || 0,
        });
        setAnalysisResult({
          contractType: analysis.contract_type,
          parties: [analysis.parties?.client || 'Client', analysis.parties?.vendor || 'Vendor'],
          financialTerms: {
            totalValue: analysis.total_value || 'Not specified',
            paymentSchedule: analysis.payment_schedule || 'Not specified',
          },
          risks: Array.isArray(analysis.risks) ? analysis.risks : [],
          complianceRequirements: Array.isArray(analysis.compliance_requirements) ? analysis.compliance_requirements : [],
          summary: analysis.summary || 'Contract analyzed successfully',
        });
        setIsPendingAnalysis(false);
        setSelectedFile(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleInitiateCall = async (contractId: number) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/voice-contract/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_id: contractId,
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Call initiation failed');
        }

      const data = await response.json();
      toast.success('Voice Call Initiated', {
        description: `You'll receive a call shortly to discuss this contract. Conversation ID: ${data.conversation_id}`,
        duration: 5000,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Call initiation failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string | undefined | null) => {
    if (!severity) return 'bg-gray-500';
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Voice-First Contract Intelligence</h1>
        <p className="text-muted-foreground">Upload contracts → AI analysis → 5-minute voice callback</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Contract</TabsTrigger>
          <TabsTrigger value="history">Contract History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Contract PDF
              </CardTitle>
              <CardDescription>
                Upload MSA, SOW, or contract PDF for instant AI analysis and voice callback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="contract-upload"
                />
                <label
                  htmlFor="contract-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  {selectedFile ? (
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Click to select PDF</p>
                      <p className="text-sm text-muted-foreground">
                        or drag and drop your contract here
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Contract...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {isPendingAnalysis && uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                  Analysis In Progress
                </CardTitle>
                <CardDescription>
                  Contract uploaded: {uploadResult.fileName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Your contract has been uploaded successfully. AI analysis is currently in progress (typically takes 15-25 seconds). Please check back in a moment or refresh this page.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult && uploadResult && !isPendingAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  Contract analyzed in {uploadResult.fileName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Type</p>
                    <p className="font-medium">{analysisResult.contractType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parties</p>
                    <p className="font-medium">{analysisResult.parties.join(', ')}</p>
                  </div>
                  {analysisResult.financialTerms.totalValue && (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-medium">{analysisResult.financialTerms.totalValue}</p>
                    </div>
                  )}
                  {analysisResult.financialTerms.paymentSchedule && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Schedule</p>
                      <p className="font-medium">{analysisResult.financialTerms.paymentSchedule}</p>
                    </div>
                  )}
                </div>

                {analysisResult.risks && analysisResult.risks.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Identified Risks</h3>
                    <div className="space-y-2">
                      {analysisResult.risks.map((risk, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 border rounded-lg">
                          <Badge className={getSeverityColor(risk.severity)}>
                            {risk.severity || 'Unknown'}
                          </Badge>
                          <p className="text-sm">{risk.description || 'No description provided'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number for Voice Callback</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll receive a voice call at this number to discuss the contract analysis
                  </p>
                </div>

                <Button
                  onClick={() => handleInitiateCall(uploadResult.id)}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Start Voice Q&A Session
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You'll receive a voice call to discuss this contract. Ask questions about specific clauses.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ContractHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContractHistory() {
  const [contracts, setContracts] = useState<ContractUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/voice-contract/contracts')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load contracts: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error('API returned unsuccessful response');
        }
        const mappedContracts = (data.contracts || []).map((contract: any) => ({
          id: contract.id,
          fileName: contract.filename,
          uploadedAt: contract.uploaded_at,
          analyzed: !!contract.contract_type,
          contractType: contract.contract_type,
        }));
        setContracts(mappedContracts);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading contracts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold mb-1">No Contracts Yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload your first contract to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract History</CardTitle>
        <CardDescription>View all uploaded and analyzed contracts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{contract.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {new Date(contract.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contract.analyzed ? (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Analyzed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                )}
                {contract.contractType && (
                  <Badge>{contract.contractType}</Badge>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
