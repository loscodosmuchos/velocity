import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Sparkles, ExternalLink } from "lucide-react";
import { askAssistant, getConversationStarters, type AssistantMessage } from "@/utils/ai-assistant";

export function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const question = messageText || input.trim();
    if (!question) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
      context: {
        page: location.pathname,
      },
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askAssistant(question, { page: location.pathname });

      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Add related links as a separate system message if available
      if (response.relatedLinks && response.relatedLinks.length > 0) {
        const linksMessage: AssistantMessage = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: JSON.stringify({ links: response.relatedLinks }),
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, linksMessage]);
      }
    } catch (error) {
      console.error("Assistant error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const starters = getConversationStarters(location.pathname);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          aria-label="Open AI Assistant">
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b flex-row items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Ask me anything</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="font-medium mb-2">👋 Hi! I'm your AI assistant.</p>
                    <p className="text-muted-foreground text-xs">
                      I can help you with questions about the Velocity Workforce Management System. Try asking about:
                    </p>
                  </div>
                  <div className="space-y-2">
                    {starters.map((starter, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2 text-left"
                        onClick={() => handleSendMessage(starter)}>
                        {starter}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  // Check if message contains links
                  let links: Array<{ label: string; url: string }> = [];
                  let content = message.content;

                  try {
                    const parsed = JSON.parse(message.content);
                    if (parsed.links) {
                      links = parsed.links;
                      content = "";
                    }
                  } catch {
                    // Not JSON, use as-is
                  }

                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                        {content && <p className="text-sm whitespace-pre-wrap">{content}</p>}
                        {links.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium mb-1">📎 Related Links:</p>
                            {links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <ExternalLink className="h-3 w-3" />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
