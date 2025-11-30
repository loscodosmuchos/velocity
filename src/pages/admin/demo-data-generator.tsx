import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Database, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  RotateCcw,
  FileCheck,
  Package,
  Archive,
  TestTube,
  Plus
} from 'lucide-react';

export default function DemoDataGeneratorPage() {
  const [entityType, setEntityType] = useState('contractors');
  const [recordCount, setRecordCount] = useState(100);
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [backupData, setBackupData] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [importProgress, setImportProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const entityTypes = [
    { value: 'contractors', label: 'Contractors', icon: '👤' },
    { value: 'purchase_orders', label: 'Purchase Orders', icon: '📄' },
    { value: 'timecards', label: 'Timecards', icon: '⏰' },
    { value: 'invoices', label: 'Invoices', icon: '💰' },
    { value: 'employees', label: 'Employees', icon: '👔' },
    { value: 'vendors', label: 'Vendors', icon: '🏢' }
  ];

  // Step 1: Backup current data
  const handleBackup = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/demo-data/backup/${entityType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      setBackupData(data);
      
      // Download backup file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${entityType}_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`✅ Backup created: ${data.recordCount} ${entityType} records`);
    } catch (error: any) {
      toast.error('Failed to create backup: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Clear current data (reversible with backup)
  const handleClear = async () => {
    if (!backupData) {
      toast.error('Create backup first before clearing data!');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ This will DELETE all ${entityType} records.\n\n` +
      `Backup exists: ${backupData.recordCount} records\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:3001/api/demo-data/clear/${entityType}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success(`Cleared ${entityType} data (backup available)`);
    } catch (error: any) {
      toast.error('Failed to clear data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Generate demo data
  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedData([]);
    setValidationResults(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/demo-data/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          count: recordCount,
          mode: 'demo' // Ensures demo data rules are followed
        })
      });

      const data = await response.json();
      setGeneratedData(data.records);
      toast.success(`Generated ${data.records.length} demo ${entityType} records`);
    } catch (error: any) {
      toast.error('Failed to generate data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Validate generated data
  const handleValidate = async () => {
    if (generatedData.length === 0) {
      toast.error('Generate data first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/demo-data/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          records: generatedData 
        })
      });

      const results = await response.json();
      setValidationResults(results);
      
      if (results.isValid) {
        toast.success(`✅ Validation passed: ${results.validRecords}/${results.totalRecords} valid`);
      } else {
        toast.error(`❌ Validation failed: ${results.errors.length} errors found`);
      }
    } catch (error: any) {
      toast.error('Validation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Test import with 5 records
  const handleTestImport = async () => {
    if (!validationResults?.isValid) {
      toast.error('Validate data first');
      return;
    }

    setLoading(true);
    try {
      const testRecords = generatedData.slice(0, 5);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/demo-data/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          records: testRecords,
          mode: 'test'
        })
      });

      const result = await response.json();
      toast.success(`✅ Test import successful: ${result.imported} records`);
      
      setImportProgress({ test: true, testCount: result.imported });
    } catch (error: any) {
      toast.error('Test import failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 6: Import remaining records
  const handleFullImport = async () => {
    if (!importProgress?.test) {
      toast.error('Run test import first');
      return;
    }

    const confirmed = window.confirm(
      `Import remaining ${generatedData.length - 5} ${entityType} records?\n\n` +
      `Total: ${generatedData.length} records`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const remainingRecords = generatedData.slice(5);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/demo-data/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          records: remainingRecords,
          mode: 'full'
        })
      });

      const result = await response.json();
      toast.success(`✅ Full import complete: ${result.imported} records`);
      
      setImportProgress({ ...importProgress, full: true, fullCount: result.imported });
    } catch (error: any) {
      toast.error('Full import failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 7: Generate addendum (incremental import test)
  const handleGenerateAddendum = async () => {
    if (!importProgress?.full) {
      toast.error('Complete full import first');
      return;
    }

    setLoading(true);
    try {
      const addendumCount = Math.floor(recordCount * 0.1); // 10% more
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/demo-data/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          count: addendumCount,
          mode: 'addendum'
        })
      });

      const data = await response.json();
      
      // Auto-import addendum
      const importResponse = await fetch('http://localhost:3001/api/demo-data/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          records: data.records,
          mode: 'addendum'
        })
      });

      const importResult = await importResponse.json();
      toast.success(`✅ Addendum imported: ${importResult.imported} additional records`);
      
      setImportProgress({ 
        ...importProgress, 
        addendum: true, 
        addendumCount: importResult.imported 
      });
    } catch (error: any) {
      toast.error('Addendum generation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 8: Restore from backup
  const handleRestore = async () => {
    if (!backupData) {
      toast.error('No backup available');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ Restore from backup?\n\n` +
      `This will replace current ${entityType} data with ${backupData.recordCount} backup records.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await fetch('http://localhost:3001/api/demo-data/restore', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          entityType, 
          backup: backupData 
        })
      });
      
      toast.success(`✅ Restored ${backupData.recordCount} ${entityType} records from backup`);
      setImportProgress(null);
      setGeneratedData([]);
    } catch (error: any) {
      toast.error('Restore failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Export current data
  const handleExport = () => {
    if (generatedData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo_${entityType}_${generatedData.length}records_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Exported to JSON file');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Demo Data Generator</h1>
          <p className="text-muted-foreground mt-2">
            Safe, reversible demo data generation with backup, validation, and incremental import testing
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Database className="mr-2 h-4 w-4" />
          100% Reversible
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select entity type and record count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Record Count</Label>
              <Input
                type="number"
                value={recordCount}
                onChange={(e) => setRecordCount(parseInt(e.target.value) || 0)}
                min={1}
                max={10000}
              />
              <p className="text-xs text-muted-foreground">
                1-10,000 records (recommended: 100-1,000 for testing)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracker</CardTitle>
            <CardDescription>Step-by-step validation process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {backupData ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={backupData ? 'font-medium' : 'text-muted-foreground'}>
                1. Backup Created ({backupData?.recordCount || 0} records)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {generatedData.length > 0 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={generatedData.length > 0 ? 'font-medium' : 'text-muted-foreground'}>
                2. Data Generated ({generatedData.length} records)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {validationResults?.isValid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={validationResults?.isValid ? 'font-medium' : 'text-muted-foreground'}>
                3. Validation Passed
              </span>
            </div>
            <div className="flex items-center gap-2">
              {importProgress?.test ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={importProgress?.test ? 'font-medium' : 'text-muted-foreground'}>
                4. Test Import (5 records)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {importProgress?.full ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={importProgress?.full ? 'font-medium' : 'text-muted-foreground'}>
                5. Full Import ({importProgress?.fullCount || 0} records)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {importProgress?.addendum ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2" />}
              <span className={importProgress?.addendum ? 'font-medium' : 'text-muted-foreground'}>
                6. Addendum Import ({importProgress?.addendumCount || 0} records)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
          <TabsTrigger value="validation">Validation Results</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Step 1: Backup & Clear
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={handleBackup} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Create Backup
              </Button>
              <Button onClick={handleClear} variant="destructive" disabled={loading || !backupData}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Clear Data (Reversible)
              </Button>
              <Button onClick={handleRestore} variant="outline" disabled={loading || !backupData}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore from Backup
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Step 2: Generate & Validate
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={handleGenerate} disabled={loading}>
                <Play className="mr-2 h-4 w-4" />
                Generate {recordCount} Records
              </Button>
              <Button onClick={handleValidate} variant="outline" disabled={loading || generatedData.length === 0}>
                <FileCheck className="mr-2 h-4 w-4" />
                Validate Data
              </Button>
              <Button onClick={handleExport} variant="outline" disabled={generatedData.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Step 3: Test & Import
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={handleTestImport} disabled={loading || !validationResults?.isValid}>
                <TestTube className="mr-2 h-4 w-4" />
                Test Import (5 records)
              </Button>
              <Button onClick={handleFullImport} disabled={loading || !importProgress?.test}>
                <Upload className="mr-2 h-4 w-4" />
                Full Import
              </Button>
              <Button onClick={handleGenerateAddendum} variant="outline" disabled={loading || !importProgress?.full}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Addendum (+10%)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Generated Data Preview</CardTitle>
              <CardDescription>First 5 records</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No data generated yet</p>
              ) : (
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(generatedData.slice(0, 5), null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!validationResults ? (
                <p className="text-muted-foreground text-center py-8">Run validation to see results</p>
              ) : validationResults.isValid ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">All validations passed!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">{validationResults.totalRecords}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Records</p>
                      <p className="text-2xl font-bold text-green-600">{validationResults.validRecords}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{validationResults.errors.length} validation errors found</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    {validationResults.errors.slice(0, 10).map((error: string, i: number) => (
                      <p key={i} className="text-sm text-red-800">• {error}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
