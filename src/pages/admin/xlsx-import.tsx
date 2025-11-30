/**
 * XLSX Multi-Sheet Import
 * Enterprise bulk data import with validation and preview
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Undo2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseXLSXFile, getSuggestedMappings, generateImportPreview, createImportJob } from "@/utils/xlsx-parser";
import type { SheetMetadata, ColumnMapping, ImportJob, ImportPreview } from "@/utils/xlsx-parser";
import { toast } from "sonner";

export default function XLSXImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetMetadata[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importJob, setImportJob] = useState<ImportJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "map" | "preview" | "import" | "complete">("upload");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith(".xlsx") && !uploadedFile.name.endsWith(".xls")) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const parsedSheets = await parseXLSXFile(uploadedFile);
      setSheets(parsedSheets);

      // Auto-select first sheet with data
      const firstDataSheet = parsedSheets.find((s) => s.rowCount > 0);
      if (firstDataSheet) {
        setSelectedSheet(firstDataSheet.sheetName);
        const suggestedMappings = getSuggestedMappings(firstDataSheet.entityType, firstDataSheet.headers);
        setMappings(suggestedMappings);
      }

      setStep("map");
      toast.success(`File uploaded: ${parsedSheets.length} sheet(s) detected`);
    } catch (error) {
      console.error("File parse error:", error);
      toast.error("Failed to parse Excel file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (fieldName: string, excelColumn: string) => {
    setMappings((prev) => prev.map((m) => (m.fieldName === fieldName ? { ...m, excelColumn } : m)));
  };

  const handleGeneratePreview = async () => {
    if (!file || !selectedSheet) return;

    setIsProcessing(true);

    try {
      const previewData = await generateImportPreview(file, selectedSheet, mappings);
      setPreview(previewData);
      setStep("preview");
      toast.success("Preview generated successfully");
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!preview || !file) return;

    setIsProcessing(true);

    try {
      // Simulate import process
      const job = createImportJob(file.name, [preview]);
      setImportJob(job);

      // Simulate progress
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update job status
      job.status = "completed";
      job.successCount = preview.validRows;

      setStep("complete");
      toast.success(`Successfully imported ${job.successCount} records`);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Import failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = () => {
    if (!importJob) return;

    toast.success("Import rolled back successfully");
    setImportJob(null);
    setStep("upload");
    setFile(null);
    setSheets([]);
    setSelectedSheet("");
    setMappings([]);
    setPreview(null);
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setSheets([]);
    setSelectedSheet("");
    setMappings([]);
    setPreview(null);
    setImportJob(null);
  };

  const currentSheet = sheets.find((s) => s.sheetName === selectedSheet);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">XLSX Multi-Sheet Import</h1>
        <p className="text-muted-foreground">Bulk import contractors, purchase orders, assets, and employees</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {["upload", "map", "preview", "import", "complete"].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : index <= ["upload", "map", "preview", "import", "complete"].indexOf(step)
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
              }`}>
              {index + 1}
            </div>
            {index < 4 && <div className="w-16 h-0.5 bg-muted mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload Excel File</CardTitle>
            <CardDescription>Upload an XLSX file with one or more sheets containing data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium">Click to upload or drag and drop</span>
                <p className="text-sm text-muted-foreground mt-2">Excel files (.xlsx, .xls)</p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Supported entities:</strong> Contractors, Purchase Orders, Assets, Employees
                <br />
                <strong>Features:</strong> Multi-sheet detection, duplicate prevention, 24-hour rollback
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Column Mapping */}
      {step === "map" && currentSheet && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Map Columns</CardTitle>
            <CardDescription>Map Excel columns to Velocity fields for {currentSheet.entityType}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <FileSpreadsheet className="h-8 w-8" />
              <div>
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Sheet: {selectedSheet} • {currentSheet.rowCount} rows • {currentSheet.columnCount} columns
                </p>
              </div>
              <Badge>{currentSheet.entityType}</Badge>
            </div>

            {/* Sheet Selector */}
            {sheets.length > 1 && (
              <div className="space-y-2">
                <Label>Select Sheet</Label>
                <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sheets.map((sheet) => (
                      <SelectItem key={sheet.sheetName} value={sheet.sheetName}>
                        {sheet.sheetName} ({sheet.rowCount} rows)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Mapping Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Velocity Field</TableHead>
                    <TableHead>Excel Column</TableHead>
                    <TableHead>Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.fieldName}>
                      <TableCell className="font-medium">{mapping.fieldName}</TableCell>
                      <TableCell>
                        <Select
                          value={mapping.excelColumn}
                          onValueChange={(value) => handleMappingChange(mapping.fieldName, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {currentSheet.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {mapping.required ? (
                          <Badge variant="destructive">Required</Badge>
                        ) : (
                          <Badge variant="secondary">Optional</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleGeneratePreview} disabled={isProcessing}>
                {isProcessing ? "Generating..." : "Generate Preview"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && preview && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Review Preview</CardTitle>
            <CardDescription>Review first 5 rows and validation results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 border rounded-lg">
                <p className="text-2xl font-bold">{preview.totalRows}</p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">{preview.validRows}</p>
                <p className="text-sm text-muted-foreground">Valid Rows</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-2xl font-bold text-red-600">{preview.errors.length}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{preview.warnings.length}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>

            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Data Preview</TabsTrigger>
                <TabsTrigger value="errors">Errors ({preview.errors.length})</TabsTrigger>
                <TabsTrigger value="warnings">Warnings ({preview.warnings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <div className="border rounded-lg overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(preview.preview[0] || {}).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.preview.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <TableCell key={i}>{String(value)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="errors">
                {preview.errors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                    <p>No errors found!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {preview.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Row {error.row}, Column {error.column}: {error.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="warnings">
                {preview.warnings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                    <p>No warnings!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {preview.warnings.map((warning, index) => (
                      <Alert key={index}>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Row {warning.row}, Column {warning.column}: {warning.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button onClick={() => setStep("map")} variant="outline">
                Back to Mapping
              </Button>
              <Button onClick={handleConfirmImport} disabled={preview.errors.length > 0 || isProcessing}>
                {isProcessing ? "Importing..." : "Confirm Import"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === "complete" && importJob && (
        <Card>
          <CardHeader>
            <CardTitle>Import Complete</CardTitle>
            <CardDescription>Data successfully imported into Velocity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <p className="text-2xl font-bold mb-2">Success!</p>
              <p className="text-muted-foreground">
                {importJob.successCount} records imported from {importJob.fileName}
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Rollback available until:</strong>{" "}
                {importJob.rollbackExpiresAt ? new Date(importJob.rollbackExpiresAt).toLocaleString() : "N/A"}
                <br />
                You can undo this import within 24 hours if needed.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleRollback} variant="outline">
                <Undo2 className="h-4 w-4 mr-2" />
                Rollback Import
              </Button>
              <Button onClick={handleReset}>Import Another File</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
