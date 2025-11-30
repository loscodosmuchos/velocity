import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Wand2,
  Users,
  Mail,
  Sparkles,
  Loader2,
  History,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Stakeholder {
  id: number;
  userId: number;
  role: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface MessageHistoryItem {
  id: number;
  subject: string;
  body: string;
  senderName: string;
  createdAt: string;
  templateType?: string;
}

interface SOWContext {
  sowId: number | string;
  sowNumber: string;
  title: string;
  status: string;
  stage: string;
  totalValue: number;
  remainingValue: number;
  startDate: string;
  endDate: string;
}

interface AIMessageComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sowContext: SOWContext;
  stakeholders: Stakeholder[];
  onMessageSent?: () => void;
}

const messageTemplates = [
  { id: "status-update", label: "Status Update", description: "General progress update", icon: FileText },
  { id: "milestone-reached", label: "Milestone Reached", description: "Celebrating completion", icon: CheckCircle2 },
  { id: "action-required", label: "Action Required", description: "Requesting approval/review", icon: AlertTriangle },
  { id: "budget-alert", label: "Budget Alert", description: "Budget threshold notification", icon: AlertTriangle },
  { id: "schedule-change", label: "Schedule Change", description: "Timeline update", icon: Calendar },
  { id: "custom", label: "Custom", description: "Free-form message", icon: MessageSquare },
];

const roleConfig: Record<string, { color: string; bgColor: string }> = {
  Legal: { color: "text-blue-300", bgColor: "bg-blue-500/20" },
  Finance: { color: "text-green-300", bgColor: "bg-green-500/20" },
  Operations: { color: "text-amber-300", bgColor: "bg-amber-500/20" },
  Procurement: { color: "text-cyan-300", bgColor: "bg-cyan-500/20" },
  Executive: { color: "text-purple-300", bgColor: "bg-purple-500/20" },
  Compliance: { color: "text-red-300", bgColor: "bg-red-500/20" },
  ProjectManager: { color: "text-teal-300", bgColor: "bg-teal-500/20" },
  Approver: { color: "text-indigo-300", bgColor: "bg-indigo-500/20" },
};

export function AIMessageComposer({
  open,
  onOpenChange,
  sowContext,
  stakeholders,
  onMessageSent,
}: AIMessageComposerProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [templateType, setTemplateType] = useState<string>("status-update");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");

  const fetchMessageHistory = useCallback(async () => {
    if (!sowContext.sowId) return;
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/messages?relatedSowId=${sowContext.sowId}&_end=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessageHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch message history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [sowContext.sowId]);

  useEffect(() => {
    if (open) {
      fetchMessageHistory();
      setSelectedRecipients([]);
      setSubject("");
      setBody("");
      setActiveTab("compose");
    }
  }, [open, fetchMessageHistory]);

  const handleSelectAll = () => {
    if (selectedRecipients.length === stakeholders.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(stakeholders.map((s) => s.userId));
    }
  };

  const handleRecipientToggle = (userId: number) => {
    setSelectedRecipients((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleGenerateDraft = async () => {
    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const selectedStakeholders = stakeholders
        .filter((s) => selectedRecipients.includes(s.userId))
        .map((s) => ({
          name: `${s.user.firstName} ${s.user.lastName}`,
          role: s.role,
        }));

      const response = await fetch(`/api/sows/${sowContext.sowId}/messages/ai-draft`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateType,
          context: {
            sowTitle: sowContext.title || sowContext.sowNumber,
            sowNumber: sowContext.sowNumber,
            stage: sowContext.stage,
            status: sowContext.status,
            totalValue: sowContext.totalValue,
            remainingValue: sowContext.remainingValue,
            startDate: sowContext.startDate,
            endDate: sowContext.endDate,
            stakeholders: selectedStakeholders,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubject(data.subject);
        setBody(data.body);
        toast.success("Draft generated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate draft");
      }
    } catch (error) {
      console.error("Failed to generate draft:", error);
      toast.error("Failed to generate draft. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToneAdjustment = async (tone: "formal" | "casual") => {
    if (!body.trim()) {
      toast.error("Please generate or write a message first");
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowContext.sowId}/messages/ai-draft`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateType: "tone-adjustment",
          context: {
            currentBody: body,
            currentSubject: subject,
            targetTone: tone,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubject(data.subject);
        setBody(data.body);
        toast.success(`Message adjusted to ${tone} tone`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to adjust tone");
      }
    } catch (error) {
      console.error("Failed to adjust tone:", error);
      toast.error("Failed to adjust tone. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!body.trim()) {
      toast.error("Please generate or write a message first");
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowContext.sowId}/messages/ai-draft`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateType: "improve",
          context: {
            currentBody: body,
            currentSubject: subject,
            sowTitle: sowContext.title || sowContext.sowNumber,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubject(data.subject);
        setBody(data.body);
        toast.success("Message improved!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to improve message");
      }
    } catch (error) {
      console.error("Failed to improve message:", error);
      toast.error("Failed to improve message. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!body.trim()) {
      toast.error("Please enter a message body");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/sows/${sowContext.sowId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: selectedRecipients,
          subject,
          body,
          templateType,
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        onOpenChange(false);
        onMessageSent?.();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-slate-900 border-slate-700 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-100">
            <Mail className="h-5 w-5 text-cyan-400" />
            Compose Message
            <Badge variant="outline" className="ml-2 bg-slate-800 border-slate-600 text-slate-300">
              {sowContext.sowNumber}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Recipients</Label>
                <div className="border border-slate-700 rounded-lg bg-slate-800/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Checkbox
                        checked={selectedRecipients.length === stakeholders.length && stakeholders.length > 0}
                        className="h-3 w-3"
                      />
                      Select All ({stakeholders.length})
                    </button>
                    <span className="text-xs text-slate-500">
                      {selectedRecipients.length} selected
                    </span>
                  </div>
                  <ScrollArea className="h-24">
                    <div className="space-y-1">
                      {stakeholders.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2">
                          No stakeholders assigned to this SOW
                        </p>
                      ) : (
                        stakeholders.map((stakeholder) => {
                          const config = roleConfig[stakeholder.role] || roleConfig.Approver;
                          return (
                            <div
                              key={stakeholder.id}
                              className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-700/50 cursor-pointer"
                              onClick={() => handleRecipientToggle(stakeholder.userId)}
                            >
                              <Checkbox
                                checked={selectedRecipients.includes(stakeholder.userId)}
                                className="h-3 w-3"
                              />
                              <span className="text-sm text-slate-200 flex-1">
                                {stakeholder.user.firstName} {stakeholder.user.lastName}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${config.bgColor} ${config.color} border-transparent`}
                              >
                                {stakeholder.role === "ProjectManager" ? "PM" : stakeholder.role}
                              </Badge>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Template</Label>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {messageTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <SelectItem key={template.id} value={template.id} className="text-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-400" />
                            <div>
                              <span className="font-medium">{template.label}</span>
                              <span className="text-xs text-slate-500 ml-2">{template.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                AI Assistance
              </Label>
              <div className="border border-slate-700 rounded-lg bg-slate-800/50 p-3 space-y-2">
                <Button
                  onClick={handleGenerateDraft}
                  disabled={generating || selectedRecipients.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 gap-2 text-sm"
                  size="sm"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate Draft
                </Button>
                <Button
                  onClick={handleImprove}
                  disabled={generating || !body.trim()}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 gap-2 text-sm"
                  size="sm"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Improve
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToneAdjustment("formal")}
                    disabled={generating || !body.trim()}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    size="sm"
                  >
                    Formal
                  </Button>
                  <Button
                    onClick={() => handleToneAdjustment("casual")}
                    disabled={generating || !body.trim()}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    size="sm"
                  >
                    Casual
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compose" | "preview")}>
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="compose" className="data-[state=active]:bg-slate-700">
                Compose
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-3 mt-3">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Message</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter your message or click 'Generate Draft' to use AI..."
                  className="bg-slate-800 border-slate-700 text-slate-100 min-h-[150px] resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-3">
              <div className="border border-slate-700 rounded-lg bg-slate-800/50 p-4">
                <div className="border-b border-slate-700 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Users className="h-3 w-3" />
                    To: {selectedRecipients.length} recipient(s)
                  </div>
                  <h3 className="text-lg font-medium text-slate-100">
                    {subject || "(No subject)"}
                  </h3>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  {body ? (
                    <div className="text-slate-300 whitespace-pre-wrap">{body}</div>
                  ) : (
                    <p className="text-slate-500 italic">No message content yet</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t border-slate-700 pt-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
            >
              <History className="h-4 w-4" />
              Recent Messages ({messageHistory.length})
              {showHistory ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  </div>
                ) : messageHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-2">
                    No previous messages for this SOW
                  </p>
                ) : (
                  messageHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2 rounded bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-colors"
                      onClick={() => {
                        setSubject(msg.subject);
                        setBody(msg.body);
                        setActiveTab("compose");
                        toast.info("Previous message loaded as draft");
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200 truncate flex-1">
                          {msg.subject}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {msg.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-slate-700 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={sending || selectedRecipients.length === 0 || !subject.trim() || !body.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { AIMessageComposerProps, SOWContext, Stakeholder };
