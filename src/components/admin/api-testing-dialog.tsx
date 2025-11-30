import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, Eye, CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";

interface ApiEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requiresAuth: boolean;
  category: "summary" | "crud" | "notifications" | "search" | "compliance";
  requestSchema?: {
    queryParams?: Record<string, { type: string; description: string; required?: boolean }>;
    bodyParams?: Record<string, { type: string; description: string; required?: boolean }>;
  };
  responseSchema?: {
    description: string;
    example: any;
  };
}

interface ApiTestingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: ApiEndpoint;
}

export function ApiTestingDialog({ open, onOpenChange, endpoint }: ApiTestingDialogProps) {
  const [testResult, setTestResult] = useState<{
    status: "success" | "error" | "pending" | null;
    statusCode?: number;
    data?: any;
    error?: string;
    duration?: number;
  }>({ status: null });
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyParams, setBodyParams] = useState<string>("");

  const handleTest = async () => {
    setTestResult({ status: "pending" });
    const startTime = Date.now();

    try {
      const token = localStorage.getItem("token");
      const url = new URL(endpoint.path, window.location.origin);

      // Add query params
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
          ...(endpoint.requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      if (endpoint.method !== "GET" && bodyParams) {
        options.body = bodyParams;
      }

      const response = await fetch(url.toString(), options);
      const duration = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        setTestResult({
          status: "success",
          statusCode: response.status,
          data,
          duration,
        });
        toast.success(`API test successful (${duration}ms)`);
      } else {
        setTestResult({
          status: "error",
          statusCode: response.status,
          error: data.error || "Unknown error",
          duration,
        });
        toast.error(`API test failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "Network error",
        duration,
      });
      toast.error("API test failed: Network error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      summary: "default",
      crud: "secondary",
      notifications: "outline",
      search: "default",
      compliance: "outline",
    } as const;
    return <Badge variant={variants[category as keyof typeof variants] || "default"}>{category}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{endpoint.name}</span>
            <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
            {getCategoryBadge(endpoint.category)}
          </DialogTitle>
          <DialogDescription>{endpoint.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </TabsTrigger>
            <TabsTrigger value="test">
              <PlayCircle className="h-4 w-4 mr-2" />
              Test API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Endpoint Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Method</Label>
                    <div className="font-mono text-sm">{endpoint.method}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Path</Label>
                    <div className="font-mono text-sm">{endpoint.path}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Authentication</Label>
                    <div className="text-sm">
                      {endpoint.requiresAuth ? (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Not Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <div className="text-sm">{getCategoryBadge(endpoint.category)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {endpoint.requestSchema && (
              <>
                {endpoint.requestSchema.queryParams && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Query Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(endpoint.requestSchema.queryParams).map(([key, param]) => (
                          <div key={key} className="flex items-start gap-2 border-l-2 pl-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{key}</code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {endpoint.requestSchema.bodyParams && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Request Body</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(endpoint.requestSchema.bodyParams).map(([key, param]) => (
                          <div key={key} className="flex items-start gap-2 border-l-2 pl-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{key}</code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {endpoint.responseSchema && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    Response Example
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.responseSchema?.example, null, 2))}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">{endpoint.responseSchema.description}</p>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(endpoint.responseSchema.example, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            {endpoint.requestSchema?.queryParams && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Query Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(endpoint.requestSchema.queryParams).map(([key, param]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-xs">
                        {key} {param.required && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id={key}
                        placeholder={param.description}
                        value={queryParams[key] || ""}
                        onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {endpoint.method !== "GET" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Request Body (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder='{"key": "value"}'
                    value={bodyParams}
                    onChange={(e) => setBodyParams(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button onClick={handleTest} disabled={testResult.status === "pending"} className="flex-1">
                <PlayCircle className="h-4 w-4 mr-2" />
                {testResult.status === "pending" ? "Testing..." : "Run Test"}
              </Button>
            </div>

            {testResult.status && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {testResult.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {testResult.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                    {testResult.status === "pending" && <AlertCircle className="h-4 w-4 text-amber-600" />}
                    Test Result
                    {testResult.statusCode && (
                      <Badge variant={testResult.statusCode < 400 ? "default" : "destructive"}>
                        {testResult.statusCode}
                      </Badge>
                    )}
                    {testResult.duration && (
                      <Badge variant="outline" className="ml-auto">
                        {testResult.duration}ms
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResult.status === "success" && testResult.data && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Response Data</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(testResult.data, null, 2))}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {testResult.status === "error" && (
                    <div className="text-red-600 text-sm">
                      <strong>Error:</strong> {testResult.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
