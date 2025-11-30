import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Upload, Clock, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function VendorExtractionPage() {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedVendor, setExtractedVendor] = useState<any>(null);
  const [error, setError] = useState("");
  const [showSample, setShowSample] = useState(false);

  const sampleVendorText = `Subject: RE: Software Developer Available - John Smith

Hi,

I'm John Smith, a senior full-stack developer with 8 years of experience in React, Node.js, and PostgreSQL. I'm currently available for contract work starting February 1st, 2025.

My Rate: $150/hour
Email: john.smith@techconsulting.com
Phone: +1-415-555-0123
LinkedIn: linkedin.com/in/johnsmith-dev

I specialize in:
- React & TypeScript
- Node.js & Express  
- PostgreSQL & MongoDB
- AWS & Docker

Certifications:
- AWS Certified Solutions Architect
- Certified Scrum Master

Company: TechConsulting LLC
Tax ID: 94-1234567
Website: www.techconsulting.com
Location: San Francisco, CA

I've worked with Fortune 500 companies and startups. Happy to provide references and portfolio upon request.

Best regards,
John Smith`;

  const handleExtract = async () => {
    if (!rawText.trim()) {
      setError("Please paste vendor text to extract");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedVendor(null);

    try {
      const token = localStorage.getItem("auth_token") || "demo_token";
      const response = await axios.post(
        "/api/ai/vendor/extract",
        { rawText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setExtractedVendor(response.data);
    } catch (err: any) {
      console.error("❌ Vendor extraction error:", err);
      setError(err.response?.data?.error || "Extraction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!extractedVendor) return;
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token") || "demo_token";
      const response = await axios.post(
        "/api/ai/vendor/import",
        { vendor: extractedVendor.vendor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      
      // Show success message
      alert(`✅ SUCCESS! ${response.data.message}\n\nContractor ID: ${response.data.contractor.contractor_id}\nYou can now view this contractor in the Contractors list.`);
      
      // Clear form
      setRawText("");
      setExtractedVendor(null);
      
    } catch (err: any) {
      console.error("❌ Vendor import error:", err);
      setError(err.response?.data?.error || "Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setRawText(sampleVendorText);
    setShowSample(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Vendor Data Extraction</h1>
        <p className="text-muted-foreground mt-2">
          Paste unstructured vendor text from emails, PDFs, or spreadsheets → AI extracts structured data in 35 seconds
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            For: Procurement Teams & VMS Directors
          </CardTitle>
          <CardDescription className="text-blue-800">
            Pain Points Solved:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5" />
            <span>2.5 hours manual entry → 35 seconds automated extraction (99% time savings)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
            <span>Manual data entry errors → AI accuracy with confidence scores</span>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 mt-0.5" />
            <span>$125,000/year saved (500 vendors/year × 2.5 hours × $100/hour)</span>
          </div>
          <div className="flex items-start gap-2">
            <Upload className="w-4 h-4 mt-0.5" />
            <span>Vendor onboarding bottleneck → One-click import to database</span>
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Paste Vendor Text</CardTitle>
          <CardDescription>
            Paste text from emails, PDFs, bios, LinkedIn profiles, or any vendor documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste vendor text here... (emails, PDFs, spreadsheets, LinkedIn bios, etc.)"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />

          <div className="flex gap-2">
            <Button onClick={handleExtract} disabled={loading || !rawText.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Vendor Data
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleLoadSample}>
              Load Sample
            </Button>

            {rawText && (
              <Button variant="ghost" onClick={() => setRawText("")}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Extraction Results */}
      {extractedVendor && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Extraction Complete
                </CardTitle>
                <CardDescription className="text-green-700">
                  {extractedVendor.stats?.extractedFields}/{extractedVendor.stats?.totalFields} fields extracted
                  ({extractedVendor.stats?.completeness.toFixed(1)}% complete)
                  • Confidence: {(extractedVendor.vendor?.confidence * 100).toFixed(0)}%
                  • Time Saved: {extractedVendor.stats?.timeSaved}
                </CardDescription>
              </div>
              <Button onClick={handleImport} size="sm" className="bg-green-700 hover:bg-green-800">
                <Upload className="w-4 h-4 mr-2" />
                Import to Database
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-green-900">Vendor Name</Label>
                <Input value={extractedVendor.vendor?.vendorName || "N/A"} readOnly className="bg-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-green-900">Contact Person</Label>
                <Input value={extractedVendor.vendor?.contactName || "N/A"} readOnly className="bg-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-green-900">Email</Label>
                <Input value={extractedVendor.vendor?.email || "N/A"} readOnly className="bg-white" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-green-900">Phone</Label>
                <Input value={extractedVendor.vendor?.phone || "N/A"} readOnly className="bg-white" />
              </div>
            </div>

            {/* Rate Info */}
            {extractedVendor.vendor?.rate && (
              <div>
                <Label className="text-sm font-semibold text-green-900">Rate</Label>
                <Input
                  value={`${extractedVendor.vendor.rate.currency} $${extractedVendor.vendor.rate.amount}/${extractedVendor.vendor.rate.period}`}
                  readOnly
                  className="bg-white"
                />
              </div>
            )}

            {/* Skills */}
            {extractedVendor.vendor?.skills && extractedVendor.vendor.skills.length > 0 && (
              <div>
                <Label className="text-sm font-semibold text-green-900 block mb-2">Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedVendor.vendor.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              {extractedVendor.vendor?.experience && (
                <div>
                  <Label className="text-sm font-semibold text-green-900">Experience</Label>
                  <Input value={`${extractedVendor.vendor.experience} years`} readOnly className="bg-white" />
                </div>
              )}
              {extractedVendor.vendor?.industry && (
                <div>
                  <Label className="text-sm font-semibold text-green-900">Industry</Label>
                  <Input value={extractedVendor.vendor.industry} readOnly className="bg-white" />
                </div>
              )}
              {extractedVendor.vendor?.website && (
                <div>
                  <Label className="text-sm font-semibold text-green-900">Website</Label>
                  <Input value={extractedVendor.vendor.website} readOnly className="bg-white" />
                </div>
              )}
              {extractedVendor.vendor?.availability && (
                <div>
                  <Label className="text-sm font-semibold text-green-900">Availability</Label>
                  <Input value={extractedVendor.vendor.availability} readOnly className="bg-white" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
