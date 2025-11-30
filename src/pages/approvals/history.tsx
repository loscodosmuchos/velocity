import { useList } from "@refinedev/core";
import { History, CheckCircle, XCircle, Clock, Search, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface ApprovalRequest {
  id: string;
  type: string;
  item: string;
  requested_by: string;
  status: string;
  submitted_at: string;
  amount: number;
  current_approver?: string;
}

const statusConfig = {
  "Approved": { color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
  "Rejected": { color: "bg-red-500/20 text-red-400", icon: XCircle },
  "Pending": { color: "bg-amber-500/20 text-amber-400", icon: Clock },
  "Pending Review": { color: "bg-amber-500/20 text-amber-400", icon: Clock },
};

export function ApprovalHistoryPage() {
  const { data: approvalsData, isLoading } = useList<ApprovalRequest>({
    resource: "approval_requests",
    sorters: [{ field: "submitted_at", order: "desc" }],
    pagination: { pageSize: 50 },
  });

  const approvals = approvalsData?.data || [];
  
  const approvedCount = approvals.filter(a => a.status === 'Approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'Rejected').length;
  const totalApprovedValue = approvals
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  const approvalHistory = approvals.map(approval => ({
    id: approval.id,
    type: approval.type || 'Unknown',
    description: approval.item || `${approval.type} request`,
    status: approval.status === 'Pending' ? 'Pending Review' : approval.status,
    approver: approval.current_approver || approval.requested_by || 'System',
    date: approval.submitted_at ? format(new Date(approval.submitted_at), 'MMM d, yyyy') : 'N/A',
    amount: `$${(Number(approval.amount) || 0).toLocaleString()}`
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <History className="h-6 w-6 text-blue-400" />
              Approval History
            </h1>
            <p className="text-slate-400 mt-1">View past approval decisions and audit trail</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-12 w-20 bg-slate-700" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <div className="text-3xl font-bold text-emerald-400">{approvedCount}</div>
                  </div>
                  <p className="text-slate-400 text-sm">Approved This Month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-12 w-20 bg-slate-700" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <div className="text-3xl font-bold text-red-400">{rejectedCount}</div>
                  </div>
                  <p className="text-slate-400 text-sm">Rejected This Month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-12 w-20 bg-slate-700" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <div className="text-3xl font-bold text-amber-400">1.2</div>
                  </div>
                  <p className="text-slate-400 text-sm">Avg Days to Approve</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              {isLoading ? (
                <Skeleton className="h-12 w-20 bg-slate-700" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-400" />
                    <div className="text-3xl font-bold text-blue-400">
                      ${totalApprovedValue >= 1000000 
                        ? `${(totalApprovedValue / 1000000).toFixed(1)}M` 
                        : `${(totalApprovedValue / 1000).toFixed(0)}K`}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">Total Approved Value</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Approvals</CardTitle>
                <CardDescription className="text-slate-400">Complete history of approval decisions</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search history..." 
                    className="pl-10 w-64 bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="timecard">Timecards</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                    <SelectItem value="po">Purchase Orders</SelectItem>
                    <SelectItem value="sow">SOWs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full bg-slate-700" />
                ))
              ) : approvalHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                  <p>No approval history found</p>
                </div>
              ) : (
                approvalHistory.map((item) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["Pending Review"];
                  const StatusIcon = config.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${config.color.split(' ')[0]}`}>
                        <StatusIcon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-slate-600 text-slate-400">{item.type}</Badge>
                          <h4 className="text-white font-medium">{item.description}</h4>
                        </div>
                        <p className="text-slate-400 text-sm">Reviewed by {item.approver} on {item.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{item.amount}</div>
                        <Badge className={config.color}>{item.status}</Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ApprovalHistoryPage;
