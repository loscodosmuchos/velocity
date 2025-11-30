import { useState } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Mail, Clock } from "lucide-react";
import type { Department } from "@/types";

export function ApprovalConfigurationPage() {
  const { data: departmentsData } = useList<Department>({
    resource: "departments",
  });

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smtpConfigured, setSmtpConfigured] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval Configuration</h1>
        <p className="text-muted-foreground mt-1">Configure approval workflows and email notification settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure email settings for approval notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send emails for approval requests, reminders, and status updates
              </p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="smtp-provider">Email Service Provider</Label>
              <Select defaultValue="sendgrid">
                <SelectTrigger id="smtp-provider" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="ses">AWS SES</SelectItem>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="api-key">API Key / Credentials</Label>
              <Input id="api-key" type="password" placeholder="Enter your API key" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="from-email">From Email Address</Label>
              <Input id="from-email" type="email" placeholder="noreply@yourcompany.com" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input id="from-name" placeholder="Velocity Workforce System" className="mt-2" />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSmtpConfigured(true)}>Test Connection</Button>
              <Button variant="outline" onClick={() => {
                setSmtpConfigured(true);
              }}>Save Configuration</Button>
            </div>

            {smtpConfigured && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Badge variant="default">Connected</Badge>
                <span>Email service is configured and working</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            SLA & Reminder Settings
          </CardTitle>
          <CardDescription>Configure approval deadlines and reminder schedules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default-sla">Default SLA (Hours)</Label>
              <Input id="default-sla" type="number" defaultValue="48" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="reminder-before">Send Reminder Before (Hours)</Label>
              <Input id="reminder-before" type="number" defaultValue="24" className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="escalation-after">Escalate After (Hours)</Label>
            <Input id="escalation-after" type="number" defaultValue="72" className="mt-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Send Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Send a daily summary of pending approvals to approvers</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <Label htmlFor="digest-time">Daily Digest Time</Label>
            <Input id="digest-time" type="time" defaultValue="09:00" className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval Rules by Entity Type</CardTitle>
          <CardDescription>Configure approval workflows for different entity types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {["Purchase Order", "Expense", "Change Order", "Timecard"].map((entityType) => (
            <div key={entityType} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{entityType} Approvals</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="text-sm">
                    <span className="font-medium">Amount &gt; $10,000:</span>
                    <span className="text-muted-foreground ml-2">Budget Owner → Manager → Finance</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="text-sm">
                    <span className="font-medium">Amount &lt;= $10,000:</span>
                    <span className="text-muted-foreground ml-2">Manager Only</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
