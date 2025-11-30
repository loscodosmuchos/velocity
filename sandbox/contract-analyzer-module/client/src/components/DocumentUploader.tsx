import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Zap,
  Clock,
  FileCheck
} from 'lucide-react';

interface DocumentUploaderProps {
  onUploadComplete?: (analysisData: any) => void;
  onAnalysisStart?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  onUploadComplete, 
  onAnalysisStart 
}) => {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    simulateUploadAndAnalysis(file);
  };

  const simulateUploadAndAnalysis = async (file: File) => {
    // Simulate upload
    setUploadState('uploading');
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          startAnalysis();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startAnalysis = async () => {
    setUploadState('analyzing');
    setAnalysisProgress(0);
    onAnalysisStart?.();

    const steps = [
      'Extracting text content...',
      'Identifying contract structure...',
      'Analyzing service categories...',
      'Processing personnel requirements...',
      'Extracting cost information...',
      'Identifying responsibilities...',
      'Creating timeline analysis...',
      'Generating insights...',
      'Finalizing analysis...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisSteps(prev => [...prev, steps[i]]);
      setAnalysisProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Simulate completed analysis
    setTimeout(() => {
      setUploadState('complete');
      const mockAnalysisData = {
        id: `uploaded-${Date.now()}`,
        title: fileName.replace(/\.[^/.]+$/, ''),
        type: 'SOW',
        // Add more mock data as needed
      };
      onUploadComplete?.(mockAnalysisData);
    }, 1000);
  };

  const resetUploader = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setAnalysisProgress(0);
    setFileName('');
    setAnalysisSteps([]);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <span>Smart Document Analysis</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Upload your contract, SOW, or agreement for AI-powered analysis
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadState === 'idle' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium mb-2">Choose a document to analyze</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Supports PDF, DOC, DOCX, and TXT files up to 10MB
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Select Document
                </Button>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">AI Analysis</span>
                </div>
                <div className="text-sm text-green-700">
                  Automatically extracts key information including services, costs, personnel, and timelines
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Voice Script</span>
                </div>
                <div className="text-sm text-blue-700">
                  Generates interactive AI prompts for Q&A sessions about your contract
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadState === 'uploading' && (
          <div className="space-y-4">
            <div className="text-center">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-pulse" />
              <div className="font-medium">Uploading {fileName}</div>
              <div className="text-sm text-muted-foreground">Transferring document...</div>
            </div>
            <Progress value={uploadProgress} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">
              {uploadProgress}% complete
            </div>
          </div>
        )}

        {uploadState === 'analyzing' && (
          <div className="space-y-4">
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2 animate-pulse" />
              <div className="font-medium">Analyzing {fileName}</div>
              <div className="text-sm text-muted-foreground">AI processing in progress...</div>
            </div>
            <Progress value={analysisProgress} className="w-full" />
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadState === 'complete' && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <div className="font-medium text-lg">Analysis Complete!</div>
            <div className="text-sm text-muted-foreground">
              Your document has been successfully analyzed and is ready for review
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <FileCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-800">Contract Structure</div>
                <div className="text-xs text-green-600">Extracted successfully</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-800">AI Insights</div>
                <div className="text-xs text-blue-600">Generated voice script</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-800">Interactive Q&A</div>
                <div className="text-xs text-purple-600">Ready for questions</div>
              </div>
            </div>
            <Button onClick={resetUploader} variant="outline">
              Upload Another Document
            </Button>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <div className="font-medium text-lg text-red-600">Analysis Failed</div>
            <div className="text-sm text-muted-foreground">
              There was an error processing your document. Please try again.
            </div>
            <Button onClick={resetUploader} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="text-sm font-medium mb-2">Supported Document Types:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">PDF</Badge>
            <Badge variant="outline">DOC/DOCX</Badge>
            <Badge variant="outline">TXT</Badge>
            <Badge variant="outline">Contracts</Badge>
            <Badge variant="outline">SOWs</Badge>
            <Badge variant="outline">Agreements</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;