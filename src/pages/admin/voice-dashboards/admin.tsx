/**
 * Voice-Enabled Admin Dashboard
 * Voice-powered system control and management
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, AlertTriangle, Users, Database, Activity } from "lucide-react";
import { VoiceNarrator } from "@/utils/voice-commander";
import { useList } from "@refinedev/core";
import type { SystemException, User } from "@/types";

export default function AdminVoiceDashboard() {
  const [narrator] = useState(() => new VoiceNarrator());
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: exceptionsData } = useList<SystemException>({
    resource: "exceptions",
    pagination: { pageSize: 100 },
  });

  const exceptions = exceptionsData?.data || [];
  const criticalExceptions = exceptions.filter((e) => e.severity === "Critical" && e.status === "Open");
  const openExceptions = exceptions.filter((e) => e.status === "Open");

  const narrateDashboard = async () => {
    setIsNarrating(true);
    await narrator.speakBrowser(
      `Admin Dashboard. System health check. You have ${criticalExceptions.length} critical exceptions and ${openExceptions.length} total open exceptions requiring attention.`,
    );
    setIsNarrating(false);
  };

  const narrateException = async (exception: SystemException) => {
    await narrator.speakBrowser(
      `${exception.severity} exception. Type: ${exception.exceptionType}. Entity: ${exception.entityName}. Description: ${exception.description}.`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔧 Admin Voice Dashboard</h1>
          <p className="text-muted-foreground">Voice-powered system control and monitoring</p>
        </div>
        <Button onClick={narrateDashboard} disabled={isNarrating} size="lg">
          <Volume2 className="h-4 w-4 mr-2" />
          {isNarrating ? "Speaking..." : "Narrate Dashboard"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalExceptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{openExceptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {criticalExceptions.length === 0 ? "Good" : "Warning"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Admin Commands</CardTitle>
          <CardDescription>System management via voice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show critical alerts"</p>
              <p className="text-sm text-muted-foreground">List critical exceptions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Run system health check"</p>
              <p className="text-sm text-muted-foreground">Diagnose system status</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show user activity"</p>
              <p className="text-sm text-muted-foreground">Active user sessions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Export audit logs"</p>
              <p className="text-sm text-muted-foreground">Download system logs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Exceptions</CardTitle>
          <CardDescription>Click to hear exception details</CardDescription>
        </CardHeader>
        <CardContent>
          {criticalExceptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <p>No critical exceptions. System healthy!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {criticalExceptions.slice(0, 5).map((exception) => (
                <div key={exception.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div className="flex-1">
                    <p className="font-medium">{exception.exceptionType}</p>
                    <p className="text-sm text-muted-foreground">{exception.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{exception.severity}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => narrateException(exception)}>
                      <Volume2 className="h-4 w-4" />
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
