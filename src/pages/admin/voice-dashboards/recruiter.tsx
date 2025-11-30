/**
 * Voice-Enabled Recruiter Dashboard
 * Hands-free contractor screening and matching
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, UserPlus, Search, Star } from "lucide-react";
import { VoiceNarrator } from "@/utils/voice-commander";
import { useList } from "@refinedev/core";
import type { Contractor } from "@/types";

export default function RecruiterVoiceDashboard() {
  const [narrator] = useState(() => new VoiceNarrator());
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
    pagination: { pageSize: 10 },
  });

  const contractors = contractorsData?.data || [];
  const activeContractors = contractors.filter((c) => c.status === "Active");
  const inactiveContractors = contractors.filter((c) => c.status === "Inactive");

  const narrateDashboard = async () => {
    setIsNarrating(true);
    await narrator.speakBrowser(
      `Recruiter Dashboard. Total contractors: ${contractors.length}. Active: ${activeContractors.length}. Inactive: ${inactiveContractors.length}. Top contractor is ${contractors[0]?.firstName} ${contractors[0]?.lastName} with pay rate ${contractors[0]?.payRate} dollars per hour.`,
    );
    setIsNarrating(false);
  };

  const narrateContractor = async (contractor: Contractor) => {
    await narrator.speakBrowser(
      `${contractor.firstName} ${contractor.lastName}. Pay rate: ${contractor.payRate} dollars per hour. Status: ${contractor.status}. Location: ${contractor.location}. Job: ${contractor.jobDescription}.`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Voice Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎯 Recruiter Voice Dashboard</h1>
          <p className="text-muted-foreground">Voice-powered contractor screening and matching</p>
        </div>
        <Button onClick={narrateDashboard} disabled={isNarrating} size="lg">
          <Volume2 className="h-4 w-4 mr-2" />
          {isNarrating ? "Speaking..." : "Narrate Dashboard"}
        </Button>
      </div>

      {/* KPI Cards with Voice Narration */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Badge variant="default">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeContractors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Badge variant="secondary">Inactive</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveContractors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Pay Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {contractors.length > 0
                ? (contractors.reduce((sum, c) => sum + c.payRate, 0) / contractors.length).toFixed(0)
                : 0}
              /hr
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Commands Guide */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Mic className="inline h-5 w-5 mr-2" />
            Voice Commands
          </CardTitle>
          <CardDescription>Say these phrases for hands-free screening</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show active contractors"</p>
              <p className="text-sm text-muted-foreground">Filter by active status</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Search for [name]"</p>
              <p className="text-sm text-muted-foreground">Find specific contractor</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Add new contractor"</p>
              <p className="text-sm text-muted-foreground">Open create form</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Read details for [name]"</p>
              <p className="text-sm text-muted-foreground">Narrate contractor info</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractor List with Voice Narration */}
      <Card>
        <CardHeader>
          <CardTitle>Top Contractors</CardTitle>
          <CardDescription>Click to hear contractor details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {contractors.slice(0, 5).map((contractor) => (
              <div
                key={contractor.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                <div className="flex-1">
                  <p className="font-medium">
                    {contractor.firstName} {contractor.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{contractor.jobDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={contractor.status === "Active" ? "default" : "secondary"}>{contractor.status}</Badge>
                  <span className="font-medium">${contractor.payRate}/hr</span>
                  <Button variant="ghost" size="sm" onClick={() => narrateContractor(contractor)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
