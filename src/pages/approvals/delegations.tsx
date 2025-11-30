import { UserCog, Plus, Calendar, Shield, Users, ArrowRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activeDelegations = [
  { 
    id: 1, 
    delegator: "Sarah Manager", 
    delegate: "Mike Supervisor",
    types: ["Timecards", "Expenses"],
    startDate: "Dec 1, 2025",
    endDate: "Dec 15, 2025",
    reason: "Vacation",
    status: "Active"
  },
  { 
    id: 2, 
    delegator: "Lisa VP", 
    delegate: "Tom Director",
    types: ["Purchase Orders", "SOWs"],
    startDate: "Dec 5, 2025",
    endDate: "Dec 8, 2025",
    reason: "Conference",
    status: "Active"
  },
  { 
    id: 3, 
    delegator: "John Director", 
    delegate: "Emily Manager",
    types: ["All Approvals"],
    startDate: "Dec 20, 2025",
    endDate: "Jan 3, 2026",
    reason: "Holiday Leave",
    status: "Scheduled"
  },
];

const delegationHistory = [
  { id: 101, delegator: "Mark VP", delegate: "Sarah Manager", period: "Nov 15-22, 2025", items: 23 },
  { id: 102, delegator: "Lisa VP", delegate: "John Director", period: "Nov 1-5, 2025", items: 45 },
];

export function ApprovalDelegationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserCog className="h-6 w-6 text-purple-400" />
              Approval Delegations
            </h1>
            <p className="text-slate-400 mt-1">Manage approval authority delegations</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Delegation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <div className="text-3xl font-bold text-emerald-400">2</div>
              </div>
              <p className="text-slate-400 text-sm">Active Delegations</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div className="text-3xl font-bold text-blue-400">1</div>
              </div>
              <p className="text-slate-400 text-sm">Scheduled Delegations</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <div className="text-3xl font-bold text-purple-400">68</div>
              </div>
              <p className="text-slate-400 text-sm">Items Delegated (30d)</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active & Scheduled Delegations</CardTitle>
            <CardDescription className="text-slate-400">Current approval authority transfers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDelegations.map((delegation) => (
              <div key={delegation.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border-2 border-slate-600">
                        <AvatarFallback className="bg-purple-500/20 text-purple-400">
                          {delegation.delegator.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                      <Avatar className="h-10 w-10 border-2 border-slate-600">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {delegation.delegate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{delegation.delegator} → {delegation.delegate}</h4>
                      <p className="text-slate-400 text-sm">{delegation.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={delegation.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}>
                      {delegation.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-400">{delegation.startDate} - {delegation.endDate}</span>
                  </div>
                  <div className="flex gap-2">
                    {delegation.types.map((type) => (
                      <Badge key={type} variant="outline" className="border-slate-600 text-slate-400">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Delegation History</CardTitle>
            <CardDescription className="text-slate-400">Past delegation records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {delegationHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{record.delegator}</span>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-300">{record.delegate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm">{record.period}</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-400">{record.items} items</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ApprovalDelegationsPage;
