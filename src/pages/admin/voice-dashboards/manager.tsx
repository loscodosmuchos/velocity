/**
 * Voice-Enabled Manager Dashboard
 * Voice-powered approval workflow
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { VoiceNarrator } from "@/utils/voice-commander";
import { useList } from "@refinedev/core";
import type { Timecard, Expense } from "@/types";

export default function ManagerVoiceDashboard() {
  const [narrator] = useState(() => new VoiceNarrator());
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: timecardsData } = useList<Timecard>({ resource: "timecards", pagination: { pageSize: 100 } });
  const { data: expensesData } = useList<Expense>({ resource: "expenses", pagination: { pageSize: 100 } });

  const timecards = timecardsData?.data || [];
  const expenses = expensesData?.data || [];

  const pendingTimecards = timecards.filter((t) => t.status === "Pending");
  const pendingExpenses = expenses.filter((e) => e.status === "Pending");

  const narrateDashboard = async () => {
    setIsNarrating(true);
    await narrator.speakBrowser(
      `Manager Dashboard. You have ${pendingTimecards.length} pending timecards and ${pendingExpenses.length} pending expenses awaiting your approval.`,
    );
    setIsNarrating(false);
  };

  const narrateTimecard = async (timecard: Timecard) => {
    await narrator.speakBrowser(
      `Timecard for ${timecard.hours} hours. Task: ${timecard.taskDescription}. Amount: ${timecard.totalAmount} dollars. Say approve or reject.`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👔 Manager Voice Dashboard</h1>
          <p className="text-muted-foreground">Voice-powered approvals and team management</p>
        </div>
        <Button onClick={narrateDashboard} disabled={isNarrating} size="lg">
          <Volume2 className="h-4 w-4 mr-2" />
          {isNarrating ? "Speaking..." : "Narrate Dashboard"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Timecards</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTimecards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingExpenses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Badge variant="outline">{pendingTimecards.length + pendingExpenses.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTimecards.length + pendingExpenses.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Approval Commands</CardTitle>
          <CardDescription>Hands-free approval workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show pending approvals"</p>
              <p className="text-sm text-muted-foreground">List items awaiting approval</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Approve all timecards"</p>
              <p className="text-sm text-muted-foreground">Bulk approve workflow</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Read next timecard"</p>
              <p className="text-sm text-muted-foreground">Narrate timecard details</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Approve" / "Reject"</p>
              <p className="text-sm text-muted-foreground">Quick approval actions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Timecards</CardTitle>
          <CardDescription>Click to hear details and approve/reject</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTimecards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p>No pending timecards. All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTimecards.slice(0, 5).map((timecard) => (
                <div key={timecard.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{timecard.hours} hours</p>
                    <p className="text-sm text-muted-foreground">{timecard.taskDescription}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${timecard.totalAmount}</span>
                    <Button variant="ghost" size="sm" onClick={() => narrateTimecard(timecard)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="sm">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
