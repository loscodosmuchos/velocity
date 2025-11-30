import { useState } from "react";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Eye, Bot, ExternalLink } from "lucide-react";

interface ChatbotWidget {
  id: number;
  name: string;
  elevenLabsWidgetUrl: string;
  description: string;
  isActive: boolean;
  visibleToRoles: string[];
  visibleToDepartments: number[];
  createdAt: string;
  updatedAt: string;
}

export function ChatbotsCustomizePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<ChatbotWidget | null>(null);

  const { data, isLoading } = useList<ChatbotWidget>({
    resource: "chatbotwidgets",
    pagination: { pageSize: 100 },
  });

  const { mutate: createWidget } = useCreate();
  const { mutate: updateWidget } = useUpdate();
  const { mutate: deleteWidget } = useDelete();

  const widgets = data?.data || [];

  const handleAddWidget = (formData: Partial<ChatbotWidget>) => {
    createWidget(
      {
        resource: "chatbotwidgets",
        values: {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
        },
      },
    );
  };

  const handleUpdateWidget = (id: number, formData: Partial<ChatbotWidget>) => {
    updateWidget(
      {
        resource: "chatbotwidgets",
        id,
        values: {
          ...formData,
          updatedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedWidget(null);
        },
      },
    );
  };

  const handleDeleteWidget = (id: number) => {
    if (confirm("Are you sure you want to delete this chatbot widget?")) {
      deleteWidget({
        resource: "chatbotwidgets",
        id,
      });
    }
  };

  const handleToggleActive = (widget: ChatbotWidget) => {
    updateWidget({
      resource: "chatbotwidgets",
      id: widget.id,
      values: {
        ...widget,
        isActive: !widget.isActive,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chatbot Widget Manager</h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage ElevenLabs chatbot widgets across the application
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Chatbot Widget</DialogTitle>
              <DialogDescription>Configure a new ElevenLabs chatbot widget for your application</DialogDescription>
            </DialogHeader>
            <WidgetForm onSubmit={handleAddWidget} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">How to use</p>
              <p className="text-sm text-blue-700 mt-1">
                Add your ElevenLabs widget embed URLs here. Control which roles and departments can see each chatbot.
                Active widgets will appear on the chatbots page for users to select and interact with.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">Loading widgets...</CardContent>
          </Card>
        ) : widgets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No chatbot widgets configured. Click "Add Widget" to get started.
            </CardContent>
          </Card>
        ) : (
          widgets.map((widget) => (
            <Card key={widget.id} className={!widget.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>{widget.name}</CardTitle>
                      {widget.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">{widget.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={widget.isActive} onCheckedChange={() => handleToggleActive(widget)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Widget URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-xs bg-muted p-2 rounded break-all">{widget.elevenLabsWidgetUrl}</code>
                    <Button size="sm" variant="ghost" onClick={() => window.open(widget.elevenLabsWidgetUrl, "_blank")}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Roles: </span>
                    {widget.visibleToRoles.length > 0 ? (
                      <span className="font-medium">{widget.visibleToRoles.join(", ")}</span>
                    ) : (
                      <span className="text-muted-foreground">All</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Departments: </span>
                    {widget.visibleToDepartments.length > 0 ? (
                      <span className="font-medium">{widget.visibleToDepartments.join(", ")}</span>
                    ) : (
                      <span className="text-muted-foreground">All</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Dialog
                    open={isEditDialogOpen && selectedWidget?.id === widget.id}
                    onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedWidget(widget)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Chatbot Widget</DialogTitle>
                        <DialogDescription>Update widget configuration</DialogDescription>
                      </DialogHeader>
                      <WidgetForm
                        initialData={widget}
                        onSubmit={(data) => handleUpdateWidget(widget.id, data)}
                        onCancel={() => {
                          setIsEditDialogOpen(false);
                          setSelectedWidget(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleDeleteWidget(widget.id)}>
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

interface WidgetFormProps {
  initialData?: ChatbotWidget;
  onSubmit: (data: Partial<ChatbotWidget>) => void;
  onCancel: () => void;
}

function WidgetForm({ initialData, onSubmit, onCancel }: WidgetFormProps) {
  const [formData, setFormData] = useState<Partial<ChatbotWidget>>({
    name: initialData?.name || "",
    elevenLabsWidgetUrl: initialData?.elevenLabsWidgetUrl || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
    visibleToRoles: initialData?.visibleToRoles || [],
    visibleToDepartments: initialData?.visibleToDepartments || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Widget Name *</Label>
        <Input
          placeholder="e.g., Procurement Assistant"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>ElevenLabs Widget URL *</Label>
        <Input
          placeholder="https://elevenlabs.io/convai-widget/..."
          value={formData.elevenLabsWidgetUrl}
          onChange={(e) => setFormData({ ...formData, elevenLabsWidgetUrl: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Paste the full embed URL from your ElevenLabs dashboard</p>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Describe what this chatbot does..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Visible to Roles (leave empty for all)</Label>
        <div className="flex gap-2 mt-2">
          {["Admin", "Manager", "Contractor", "Viewer"].map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibleToRoles?.includes(role)}
                onChange={(e) => {
                  const roles = formData.visibleToRoles || [];
                  if (e.target.checked) {
                    setFormData({ ...formData, visibleToRoles: [...roles, role] });
                  } else {
                    setFormData({ ...formData, visibleToRoles: roles.filter((r) => r !== role) });
                  }
                }}
              />
              <span className="text-sm">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Active (visible to users)</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Widget"}</Button>
      </div>
    </form>
  );
}
