import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOCR, type OCRResult } from "@/hooks/useOCR";
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TimecardOCRData {
  employeeName?: string;
  employeeId?: string;
  weekStart?: string;
  weekEnd?: string;
  mondayHours?: number;
  tuesdayHours?: number;
  wednesdayHours?: number;
  thursdayHours?: number;
  fridayHours?: number;
  saturdayHours?: number;
  sundayHours?: number;
  totalHours?: number;
  rawText: string;
}

interface OCRTimecardProcessorProps {
  onDataExtracted?: (data: TimecardOCRData) => void;
}

export function OCRTimecardProcessor({ onDataExtracted }: OCRTimecardProcessorProps) {
  const { performOCR, loading } = useOCR();
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [timecardData, setTimecardData] = useState<TimecardOCRData | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        const result = await performOCR(imageUrl);

        if (result) {
          setOcrResult(result);

          // Extract timecard data from OCR text
          const data = extractTimecardData(result.fullText);
          setTimecardData(data);
          onDataExtracted?.(data);

          toast.success("Timecard processed successfully!");
        } else {
          toast.error("Failed to process timecard image");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload timecard image");
    }
  };

  const extractTimecardData = (text: string): TimecardOCRData => {
    const data: TimecardOCRData = { rawText: text };

    // Simple regex patterns for common timecard formats
    const patterns = {
      employeeId: /(?:Employee ID|ID|Emp ID)[\s:]*([A-Z0-9]+)/i,
      employeeName: /(?:Name|Employee Name)[\s:]*([A-Za-z\s]+)/i,
      weekStart: /(?:Week Start|Start Date)[\s:]*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
      hours: /(\d+\.?\d*)\s*(?:hours|hrs|h)\b/gi,
      totalHours: /(?:Total|TOTAL)[\s:]*(\d+\.?\d*)\s*(?:hours|hrs)?/i,
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        (data as any)[key] = match[1];
      }
    });

    // Extract daily hours if available
    const dailyLabels = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const hourMatches = text.match(/\d+\.?\d*\s*(?:hours|hrs)/gi);

    dailyLabels.forEach((day, idx) => {
      if (hourMatches && hourMatches[idx]) {
        const hours = parseFloat(hourMatches[idx]);
        (data as any)[`${day}Hours`] = hours;
      }
    });

    return data;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-cyan-400" />
          OCR Timecard Processor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors">
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-cyan-400" />
                <p className="text-sm text-cyan-300 font-medium">Processing timecard...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-300 font-medium">Click to upload timecard image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF - any timecard format</p>
              </>
            )}
          </label>
        </div>

        {/* OCR Results */}
        {ocrResult && (
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Extraction Success
                </h4>
                <Badge className="bg-emerald-500/20 text-emerald-300">
                  {ocrResult.confidence?.toFixed(0)}% confidence
                </Badge>
              </div>
              <p className="text-xs text-slate-400 max-h-24 overflow-y-auto">
                {ocrResult.fullText.substring(0, 300)}...
              </p>
            </div>

            {/* Extracted Data */}
            {timecardData && (
              <div className="grid grid-cols-2 gap-2">
                {timecardData.employeeId && (
                  <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50">
                    <div className="text-xs text-slate-500">Employee ID</div>
                    <div className="font-mono text-sm text-cyan-300">{timecardData.employeeId}</div>
                  </div>
                )}
                {timecardData.employeeName && (
                  <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50">
                    <div className="text-xs text-slate-500">Name</div>
                    <div className="font-mono text-sm text-cyan-300">{timecardData.employeeName}</div>
                  </div>
                )}
                {timecardData.totalHours && (
                  <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50">
                    <div className="text-xs text-slate-500">Total Hours</div>
                    <div className="font-mono text-sm text-emerald-300">{timecardData.totalHours} hrs</div>
                  </div>
                )}
                {timecardData.weekStart && (
                  <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50">
                    <div className="text-xs text-slate-500">Week</div>
                    <div className="font-mono text-sm text-cyan-300">{timecardData.weekStart}</div>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                if (timecardData) {
                  onDataExtracted?.(timecardData);
                  toast.success("Timecard data ready for import");
                }
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Use Extracted Data
            </Button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
          <div className="flex gap-2 text-xs text-cyan-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Upload a timecard image and OCR will automatically extract employee ID, hours, and dates. Works
              with any timecard format.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
