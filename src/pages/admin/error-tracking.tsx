import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock, User } from 'lucide-react';

type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type ErrorStatus = 'unresolved' | 'in_progress' | 'resolved' | 'wont_fix';

interface TrackedError {
  id: string;
  severity: ErrorSeverity;
  message: string;
  location: string; // file:line
  source: string; // 'console' | 'api' | 'lsp' | 'workflow'
  status: ErrorStatus;
  assignedTo?: string;
  notes?: string;
  firstSeen: Date;
  lastSeen: Date;
  occurrences: number;
  stackTrace?: string;
}

// Initial seed data for error tracking - records actual resolved issues
const initialErrors: TrackedError[] = [
  {
    id: '1',
    severity: 'critical',
    message: 'Demo auth failed (FIXED)',
    location: 'server/index.cjs:120',
    source: 'console',
    status: 'resolved',
    assignedTo: 'Agent',
    notes: 'Variable hoisting bug - isDemoMode used before definition. Fixed by moving to line 27.',
    firstSeen: new Date('2025-11-17T01:20:22'),
    lastSeen: new Date('2025-11-17T01:47:39'),
    occurrences: 12,
    stackTrace: 'ReferenceError: isDemoMode is not defined',
  },
];

export function ErrorTrackingPage() {
  const [errors, setErrors] = useState<TrackedError[]>(initialErrors);
  const [selectedError, setSelectedError] = useState<TrackedError | null>(null);
  const [filter, setFilter] = useState<'all' | ErrorStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | ErrorSeverity>('all');

  const filteredErrors = errors.filter(err => {
    if (filter !== 'all' && err.status !== filter) return false;
    if (severityFilter !== 'all' && err.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: errors.length,
    unresolved: errors.filter(e => e.status === 'unresolved').length,
    inProgress: errors.filter(e => e.status === 'in_progress').length,
    critical: errors.filter(e => e.severity === 'critical' && e.status !== 'resolved').length,
  };

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Info className="h-4 w-4 text-blue-500" />;
      case 'info': return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: ErrorSeverity) => {
    const colors: Record<ErrorSeverity, string> = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      info: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return <Badge className={colors[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: ErrorStatus) => {
    const colors: Record<ErrorStatus, string> = {
      unresolved: 'bg-red-50 text-red-700 border-red-200',
      in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-50 text-green-700 border-green-200',
      wont_fix: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    const labels: Record<ErrorStatus, string> = {
      unresolved: 'Unresolved',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      wont_fix: "Won't Fix",
    };
    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  const updateErrorStatus = (errorId: string, status: ErrorStatus, notes?: string) => {
    setErrors(errors.map(err => 
      err.id === errorId 
        ? { ...err, status, notes: notes || err.notes }
        : err
    ));
    setSelectedError(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Error Tracking Dashboard</h1>
          <p className="text-gray-600 mt-1">
            "Zero tolerance for errors - every noise matters."
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Logs
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unresolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.unresolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Statement */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Zero-Tolerance Error Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>1. Never ignore errors</strong> - Even "innocuous" errors must be tracked and resolved</p>
          <p><strong>2. Errors cascade</strong> - One error can trigger waterfall effects and mask real problems</p>
          <p><strong>3. Clean logs = Clean code</strong> - Start every session with zero console noise</p>
          <p><strong>4. Track everything</strong> - Maintain ERROR LIST so nothing is forgotten in dynamic dev</p>
          <p><strong>5. "Exclamations, not explanations"</strong> - Users should be amazed, not confused</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Error Log</CardTitle>
          <CardDescription>
            All tracked errors, warnings, and console noise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="wont_fix">Won't Fix</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px]">Occurrences</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-700">No errors! Clean logs achieved. 🎉</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredErrors.map(error => (
                  <TableRow key={error.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(error.severity)}
                        {getSeverityBadge(error.severity)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">
                      {error.message}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono">
                      {error.location}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{error.source}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(error.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{error.occurrences}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedError(error)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Error Detail Dialog */}
      {selectedError && (
        <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getSeverityIcon(selectedError.severity)}
                Error Details
              </DialogTitle>
              <DialogDescription>
                Error ID: {selectedError.id} • First seen: {selectedError.firstSeen.toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Message</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                  {selectedError.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Location</label>
                  <p className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded mt-1">
                    {selectedError.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Source</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                    {selectedError.source}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Occurrences</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                    {selectedError.occurrences} times
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Last Seen</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                    {selectedError.lastSeen.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedError.stackTrace && (
                <div>
                  <label className="text-sm font-semibold">Stack Trace</label>
                  <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {selectedError.stackTrace}
                  </pre>
                </div>
              )}

              {selectedError.notes && (
                <div>
                  <label className="text-sm font-semibold">Resolution Notes</label>
                  <p className="text-sm text-gray-700 bg-green-50 p-2 rounded mt-1 border border-green-200">
                    {selectedError.notes}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block">Update Status</label>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateErrorStatus(selectedError.id, 'in_progress')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    In Progress
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-green-700 border-green-300 hover:bg-green-50"
                    onClick={() => updateErrorStatus(selectedError.id, 'resolved')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Resolved
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateErrorStatus(selectedError.id, 'wont_fix')}
                  >
                    Won't Fix
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedError(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
