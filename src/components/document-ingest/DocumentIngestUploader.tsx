import React, { useState, useCallback } from 'react';
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
  FileCheck,
  Loader2,
  X
} from 'lucide-react';
import { useOCR } from '@/hooks/useOCR';
import { extractTextFromFile } from '@/lib/document-text-extractor';
import { toast } from 'sonner';

export type DocumentType = 'sow' | 'timecard' | 'invoice' | 'contract' | 'expense' | 'generic';

export interface ExtractedData {
  [key: string]: unknown;
}

export interface AnalysisResult {
  success: boolean;
  documentType: DocumentType;
  filename: string;
  analysisMethod: 'ai' | 'pattern' | 'ocr';
  aiGenerated: boolean;
  processingTime: number;
  extractedData: ExtractedData;
  patternMatches?: ExtractedData;
  confidence: number;
  textPreview?: string;
}

interface DocumentIngestUploaderProps {
  documentType?: DocumentType;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  acceptedTypes?: string[];
}

type UploadState = 'idle' | 'extracting' | 'analyzing' | 'complete' | 'error';

const DocumentIngestUploader: React.FC<DocumentIngestUploaderProps> = ({ 
  documentType = 'generic',
  onAnalysisComplete, 
  onCancel,
  title = 'Smart Document Analysis',
  description = 'Upload your document for AI-powered analysis and field extraction',
  acceptedTypes = ['.pdf', '.txt', '.png', '.jpg', '.jpeg']
}) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { performOCR } = useOCR();

  const analyzeText = useCallback(async (text: string, filename: string, method: 'pdf' | 'text' | 'ocr') => {
    setUploadState('analyzing');
    setAnalysisProgress(30);
    setAnalysisSteps(prev => [...prev, 'Running AI analysis on extracted text...']);

    try {
      const response = await fetch('/api/document-ingest/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          documentType: documentType !== 'generic' ? documentType : undefined,
        }),
      });

      setAnalysisProgress(80);

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await response.json();
      setAnalysisProgress(100);
      setAnalysisSteps(prev => [...prev, 'Analysis complete!']);
      
      setUploadState('complete');
      
      const analysisResult: AnalysisResult = {
        success: result.success,
        documentType: result.documentType,
        filename,
        analysisMethod: result.analysisMethod === 'ai' ? 'ai' : (method === 'ocr' ? 'ocr' : 'pattern'),
        aiGenerated: result.aiGenerated,
        processingTime: result.processingTime,
        extractedData: result.extractedData,
        patternMatches: result.patternMatches,
        confidence: result.confidence,
        textPreview: text.slice(0, 500),
      };

      onAnalysisComplete(analysisResult);
      toast.success('Document analyzed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setUploadState('error');
      toast.error('Document analysis failed');
    }
  }, [documentType, onAnalysisComplete]);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setError(null);
    setAnalysisSteps([]);
    setUploadState('extracting');
    setAnalysisProgress(10);

    try {
      if (file.type.startsWith('image/')) {
        setAnalysisSteps(['Running OCR on image...']);
        const imageUrl = URL.createObjectURL(file);
        const ocrResult = await performOCR(imageUrl);
        URL.revokeObjectURL(imageUrl);

        if (!ocrResult || !ocrResult.fullText || ocrResult.fullText.trim().length < 20) {
          throw new Error('OCR could not extract sufficient text from image');
        }

        setAnalysisSteps(prev => [...prev, `Extracted ${ocrResult.words.length} words (${ocrResult.confidence.toFixed(0)}% confidence)`]);
        await analyzeText(ocrResult.fullText, file.name, 'ocr');
      } else {
        setAnalysisSteps(['Extracting text from document...']);
        const extraction = await extractTextFromFile(file);

        if (!extraction.success) {
          if (extraction.error === 'USE_OCR') {
            throw new Error('Please upload an image file for OCR processing');
          }
          throw new Error(extraction.error || 'Failed to extract text');
        }

        if (extraction.text.trim().length < 20) {
          throw new Error('Document contains insufficient text for analysis');
        }

        const pageInfo = extraction.pageCount ? ` from ${extraction.pageCount} page(s)` : '';
        setAnalysisSteps(prev => [...prev, `Extracted ${extraction.text.split(/\s+/).length} words${pageInfo}`]);
        
        await analyzeText(extraction.text, file.name, extraction.method);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMessage);
      setUploadState('error');
      toast.error(errorMessage);
    }
  }, [performOCR, analyzeText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const resetUploader = () => {
    setUploadState('idle');
    setAnalysisProgress(0);
    setFileName('');
    setAnalysisSteps([]);
    setError(null);
  };

  const documentTypeLabels: Record<DocumentType, string> = {
    sow: 'Statement of Work',
    timecard: 'Timecard',
    invoice: 'Invoice',
    contract: 'Contract',
    expense: 'Expense Report',
    generic: 'Document'
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{title}</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">{description}</p>
            </div>
          </div>
          {onCancel && uploadState === 'idle' && (
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {documentType !== 'generic' && (
          <Badge className="mt-2 w-fit bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            Optimized for {documentTypeLabels[documentType]} extraction
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {uploadState === 'idle' && (
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                ${dragOver 
                  ? 'border-cyan-400 bg-cyan-500/10' 
                  : 'border-slate-600 hover:border-cyan-500/50 hover:bg-slate-800/50'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleInputChange}
                className="hidden"
                id="document-upload"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <div className="text-lg font-medium text-white mb-2">
                  Drop your {documentTypeLabels[documentType].toLowerCase()} here
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  or click to browse files
                </div>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Select Document
                </Button>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-emerald-400">AI Analysis</span>
                </div>
                <p className="text-xs text-slate-400">
                  Extracts key fields using Claude AI
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-400">Smart OCR</span>
                </div>
                <p className="text-xs text-slate-400">
                  Extract text from images
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <div className="text-sm font-medium text-slate-300 mb-2">Supported formats:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/50">PDF</Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-600">TXT</Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-500/50">PNG/JPG (OCR)</Badge>
              </div>
            </div>
          </div>
        )}

        {(uploadState === 'extracting' || uploadState === 'analyzing') && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              {uploadState === 'extracting' ? (
                <Loader2 className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
              ) : (
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
              )}
              <div className="font-medium text-white">
                {uploadState === 'extracting' ? 'Extracting text from' : 'Analyzing'} {fileName}
              </div>
              <div className="text-sm text-slate-400">
                {uploadState === 'extracting' ? 'Processing document...' : 'AI processing in progress...'}
              </div>
            </div>
            <Progress value={analysisProgress} className="w-full" />
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadState === 'complete' && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="font-medium text-lg text-white">Analysis Complete!</div>
            <div className="text-sm text-slate-400">
              Document analyzed successfully
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <FileCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-emerald-400">Fields Extracted</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-400">AI Verified</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-400">Ready to Import</div>
              </div>
            </div>
            <Button onClick={resetUploader} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Upload Another Document
            </Button>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-4 text-center py-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <div className="font-medium text-lg text-red-400">Analysis Failed</div>
            <div className="text-sm text-slate-400">
              {error || 'There was an error processing your document.'}
            </div>
            <Button onClick={resetUploader} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentIngestUploader;
