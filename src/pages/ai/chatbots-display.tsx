import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, ExternalLink, Settings } from "lucide-react";
import { useGo } from "@refinedev/core";
import type { ChatbotWidget } from "@/types";

export function ChatbotsDisplayPage() {
  const go = useGo();

  const { data, isLoading } = useList<ChatbotWidget>({
    resource: "chatbotwidgets",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true,
      },
    ],
  });

  const widgets = data?.data || [];

  // Filter widgets based on current user role - defaults to Admin for demo
  const currentUserRole = "Admin"; // TODO: integrate with auth context when available
  const visibleWidgets = widgets.filter(
    (widget) => widget.visibleToRoles.length === 0 || widget.visibleToRoles.includes(currentUserRole),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chatbot Assistants</h1>
          <p className="text-muted-foreground mt-1">Select a chatbot to interact with and get instant assistance</p>
        </div>
        <Button variant="outline" onClick={() => go({ to: "/admin/chatbots-customize" })}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Widgets
        </Button>
      </div>

      {/* Info */}
      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          Click on any chatbot below to open the interactive assistant in a new window. These AI-powered chatbots can
          help you with various tasks across the platform.
        </AlertDescription>
      </Alert>

      {/* Chatbot Widgets */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">Loading chatbots...</CardContent>
        </Card>
      ) : visibleWidgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No chatbot widgets available. Contact your administrator to configure chatbots.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleWidgets.map((widget) => (
            <Card
              key={widget.id}
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => window.open(widget.elevenLabsWidgetUrl, "_blank")}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{widget.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{widget.description}</CardDescription>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    {widget.visibleToRoles.length > 0 ? (
                      <span>Visible to: {widget.visibleToRoles.join(", ")}</span>
                    ) : (
                      <span>Available to all users</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(widget.elevenLabsWidgetUrl, "_blank");
                    }}>
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Usage Guide */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            How to Use AI Chatbots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold">Select Chatbot</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Click on any chatbot card above to open the assistant in a new window
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold">Start Conversation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Type or speak your question naturally - the AI understands context
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold">Get Instant Help</h3>
              </div>
              <p className="text-sm text-muted-foreground">Receive immediate assistance with your task or question</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
            <p className="text-sm font-semibold mb-2">Example Interactions:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "Help me submit a timecard for today"</li>
              <li>• "What's the status of my invoice?"</li>
              <li>• "How do I create a new purchase order?"</li>
              <li>• "Show me the company expense policy"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
