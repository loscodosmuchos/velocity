import { Bell, AlertTriangle, CheckCircle, Clock, Filter, Settings, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const alerts = [
  { id: 1, type: "critical", title: "Budget Threshold Exceeded", message: "Q4 Engineering budget has exceeded 90% allocation", time: "5 min ago", category: "Budget" },
  { id: 2, type: "warning", title: "Contractor Certification Expiring", message: "3 contractors have certifications expiring in 7 days", time: "1 hour ago", category: "Compliance" },
  { id: 3, type: "info", title: "Invoice Batch Ready", message: "15 invoices are ready for approval in the queue", time: "2 hours ago", category: "Invoices" },
  { id: 4, type: "success", title: "SOW Approved", message: "Hyundai Phase 3 SOW has been approved by all stakeholders", time: "3 hours ago", category: "SOW" },
  { id: 5, type: "warning", title: "Timecard Submission Due", message: "12 contractors have not submitted timecards for this week", time: "4 hours ago", category: "Timecards" },
];

const typeConfig = {
  critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle, dotColor: "bg-red-500" },
  warning: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertTriangle, dotColor: "bg-amber-500" },
  info: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Bell, dotColor: "bg-blue-500" },
  success: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle, dotColor: "bg-emerald-500" },
};

export function AlertCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-400" />
              Alert Center
            </h1>
            <p className="text-slate-400 mt-1">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-400">2</div>
              <p className="text-slate-400 text-sm">Critical Alerts</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-400">5</div>
              <p className="text-slate-400 text-sm">Warnings</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-400">12</div>
              <p className="text-slate-400 text-sm">Informational</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-400">8</div>
              <p className="text-slate-400 text-sm">Resolved Today</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All Alerts</TabsTrigger>
            <TabsTrigger value="critical" className="data-[state=active]:bg-slate-700">Critical</TabsTrigger>
            <TabsTrigger value="warnings" className="data-[state=active]:bg-slate-700">Warnings</TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-slate-700">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-3">
            {alerts.map((alert) => {
              const config = typeConfig[alert.type as keyof typeof typeConfig];
              const AlertIcon = config.icon;
              return (
                <Card key={alert.id} className={`bg-slate-800/50 border ${config.color.split(' ')[2]}`}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-lg ${config.color.split(' ')[0]} flex items-center justify-center`}>
                          <AlertIcon className={`h-5 w-5 ${config.color.split(' ')[1]}`} />
                        </div>
                        <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${config.dotColor} animate-pulse`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{alert.title}</h3>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">{alert.category}</Badge>
                        </div>
                        <p className="text-slate-400 text-sm">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          View Details
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          <TabsContent value="critical" className="mt-4">
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Critical alerts will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="warnings" className="mt-4">
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Warning alerts will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="resolved" className="mt-4">
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Resolved alerts will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AlertCenterPage;
