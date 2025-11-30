import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  Settings,
  Mail,
  Bell,
  Trash2,
  Loader2,
  Shield,
  Briefcase,
  Scale,
  DollarSign,
  Cog,
  FileCheck,
  UserCheck,
  ClipboardCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  thresholds: {
    budgetPercent: number;
    daysRemaining: number;
  };
}

interface Stakeholder {
  id: number;
  sowId: number;
  userId: number;
  role: string;
  notificationPreferences: NotificationPreferences;
  addedAt: string;
  isActive: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  addedByUser?: {
    firstName: string;
    lastName: string;
  } | null;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface SOWStakeholdersPanelProps {
  sowId: number | string;
  onComposeMessage?: (stakeholders: Stakeholder[]) => void;
}

const roleConfig: Record<string, { color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  Legal: { color: "text-blue-300", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30", icon: Scale },
  Finance: { color: "text-green-300", bgColor: "bg-green-500/20", borderColor: "border-green-500/30", icon: DollarSign },
  Operations: { color: "text-amber-300", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/30", icon: Cog },
  Procurement: { color: "text-cyan-300", bgColor: "bg-cyan-500/20", borderColor: "border-cyan-500/30", icon: Briefcase },
  Executive: { color: "text-purple-300", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30", icon: Shield },
  Compliance: { color: "text-red-300", bgColor: "bg-red-500/20", borderColor: "border-red-500/30", icon: FileCheck },
  ProjectManager: { color: "text-teal-300", bgColor: "bg-teal-500/20", borderColor: "border-teal-500/30", icon: ClipboardCheck },
  Approver: { color: "text-indigo-300", bgColor: "bg-indigo-500/20", borderColor: "border-indigo-500/30", icon: UserCheck },
};

const roleOptions = [
  { value: "Legal", label: "Legal" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Procurement", label: "Procurement" },
  { value: "Executive", label: "Executive" },
  { value: "Compliance", label: "Compliance" },
  { value: "ProjectManager", label: "Project Manager" },
  { value: "Approver", label: "Approver" },
];

export function SOWStakeholdersPanel({ sowId, onComposeMessage }: SOWStakeholdersPanelProps) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [newStakeholder, setNewStakeholder] = useState({
    userId: "",
    role: "",
  });

  const [editingPreferences, setEditingPreferences] = useState<NotificationPreferences>({
    email: true,
    inApp: true,
    thresholds: { budgetPercent: 80, daysRemaining: 14 },
  });

  const fetchStakeholders = useCallback(async () => {
    if (!sowId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowId}/stakeholders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStakeholders(data);
      }
    } catch (error) {
      console.error("Failed to fetch stakeholders:", error);
    } finally {
      setLoading(false);
    }
  }, [sowId]);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch("/api/users?_start=0&_end=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchStakeholders();
    fetchUsers();
  }, [fetchStakeholders, fetchUsers]);

  const handleAddStakeholder = async () => {
    if (!newStakeholder.userId || !newStakeholder.role) {
      toast.error("Please select a user and role");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowId}/stakeholders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(newStakeholder.userId),
          role: newStakeholder.role,
        }),
      });

      if (response.ok) {
        toast.success("Stakeholder added successfully");
        setAddDialogOpen(false);
        setNewStakeholder({ userId: "", role: "" });
        fetchStakeholders();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add stakeholder");
      }
    } catch (error) {
      console.error("Failed to add stakeholder:", error);
      toast.error("Failed to add stakeholder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveStakeholder = async () => {
    if (!selectedStakeholder) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowId}/stakeholders/${selectedStakeholder.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Stakeholder removed");
        setDeleteDialogOpen(false);
        setSelectedStakeholder(null);
        fetchStakeholders();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to remove stakeholder");
      }
    } catch (error) {
      console.error("Failed to remove stakeholder:", error);
      toast.error("Failed to remove stakeholder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!selectedStakeholder) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowId}/stakeholders/${selectedStakeholder.id}/preferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationPreferences: editingPreferences }),
      });

      if (response.ok) {
        toast.success("Notification preferences updated");
        setSettingsDialogOpen(false);
        setSelectedStakeholder(null);
        fetchStakeholders();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setSubmitting(false);
    }
  };

  const openSettingsDialog = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setEditingPreferences(stakeholder.notificationPreferences);
    setSettingsDialogOpen(true);
  };

  const openDeleteDialog = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="bg-slate-950/50 border-slate-800">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950/50 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg text-slate-100">Stakeholders</CardTitle>
            <p className="text-sm text-slate-400">
              {stakeholders.length} stakeholder{stakeholders.length !== 1 ? "s" : ""} assigned
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onComposeMessage && stakeholders.length > 0 && (
            <Button 
              size="sm" 
              variant="outline"
              className="gap-2 border-cyan-600 text-cyan-400 hover:bg-cyan-600/20"
              onClick={() => onComposeMessage(stakeholders)}
            >
              <Send className="h-4 w-4" />
              Compose Message
            </Button>
          )}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                <UserPlus className="h-4 w-4" />
                Add Stakeholder
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Add Stakeholder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">User</Label>
                <Select
                  value={newStakeholder.userId}
                  onValueChange={(value) => setNewStakeholder((prev) => ({ ...prev, userId: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()} className="text-slate-200">
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Role</Label>
                <Select
                  value={newStakeholder.role}
                  onValueChange={(value) => setNewStakeholder((prev) => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {roleOptions.map((role) => {
                      const config = roleConfig[role.value];
                      const Icon = config?.icon || Users;
                      return (
                        <SelectItem key={role.value} value={role.value} className="text-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${config?.color || "text-slate-400"}`} />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button onClick={handleAddStakeholder} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Stakeholder"}
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {stakeholders.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No stakeholders assigned yet.</p>
            <p className="text-sm mt-1">Click "Add Stakeholder" to assign team members.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stakeholders.map((stakeholder) => {
              const config = roleConfig[stakeholder.role] || roleConfig.Approver;
              const RoleIcon = config.icon;
              return (
                <div
                  key={stakeholder.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <RoleIcon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-100">
                          {stakeholder.user.firstName} {stakeholder.user.lastName}
                        </span>
                        <Badge variant="outline" className={`${config.bgColor} ${config.color} ${config.borderColor}`}>
                          {stakeholder.role === "ProjectManager" ? "Project Manager" : stakeholder.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">{stakeholder.user.email}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        {stakeholder.notificationPreferences.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Email
                          </span>
                        )}
                        {stakeholder.notificationPreferences.inApp && (
                          <span className="flex items-center gap-1">
                            <Bell className="h-3 w-3" /> In-App
                          </span>
                        )}
                        <span>
                          Alert at {stakeholder.notificationPreferences.thresholds.budgetPercent}% budget
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openSettingsDialog(stakeholder)}
                      className="h-8 w-8 text-slate-400 hover:text-slate-100">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(stakeholder)}
                      className="h-8 w-8 text-slate-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Notification Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <Label className="text-slate-200">Email Notifications</Label>
                  <p className="text-xs text-slate-400">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={editingPreferences.email}
                onCheckedChange={(checked) =>
                  setEditingPreferences((prev) => ({ ...prev, email: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <Label className="text-slate-200">In-App Notifications</Label>
                  <p className="text-xs text-slate-400">Show alerts in the application</p>
                </div>
              </div>
              <Switch
                checked={editingPreferences.inApp}
                onCheckedChange={(checked) =>
                  setEditingPreferences((prev) => ({ ...prev, inApp: checked }))
                }
              />
            </div>
            <div className="space-y-3">
              <Label className="text-slate-200">Budget Alert Threshold</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[editingPreferences.thresholds.budgetPercent]}
                  onValueChange={([value]) =>
                    setEditingPreferences((prev) => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, budgetPercent: value },
                    }))
                  }
                  min={50}
                  max={95}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-slate-300 w-12 text-right">
                  {editingPreferences.thresholds.budgetPercent}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Alert when budget usage reaches this percentage
              </p>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-200">Days Remaining Alert</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[editingPreferences.thresholds.daysRemaining]}
                  onValueChange={([value]) =>
                    setEditingPreferences((prev) => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, daysRemaining: value },
                    }))
                  }
                  min={7}
                  max={60}
                  step={7}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-slate-300 w-16 text-right">
                  {editingPreferences.thresholds.daysRemaining} days
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Alert when SOW end date is within this many days
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button onClick={handleUpdatePreferences} disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Preferences"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">Remove Stakeholder</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to remove{" "}
              <span className="font-medium text-slate-200">
                {selectedStakeholder?.user.firstName} {selectedStakeholder?.user.lastName}
              </span>{" "}
              from this SOW? They will no longer receive notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStakeholder}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export type { Stakeholder };
