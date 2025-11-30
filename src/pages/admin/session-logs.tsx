import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle, Clock, HelpCircle, Calendar } from "lucide-react";

interface SessionLog {
  id: number;
  sessionId: string;
  logType: string;
  summary: string;
  tasksCompleted: string[];
  tasksPending: string[];
  filesModified: string[];
  questionsBatched: string[];
  createdAt: string;
}

export function SessionLogsPage() {
  const { data } = useList<SessionLog>({
    resource: "session-logs",
    pagination: { current: 1, pageSize: 50 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const logs = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Session Logs</h1>
          <p className="text-slate-400">Development session progress tracking</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
          {logs.length} Sessions
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    {log.logType.toUpperCase()}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{log.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Completed ({log.tasksCompleted?.length || 0})
                    </div>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {(log.tasksCompleted || []).map((task, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Pending ({log.tasksPending?.length || 0})
                    </div>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {(log.tasksPending || []).map((task, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500">○</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {log.filesModified && log.filesModified.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-400">Files Modified</div>
                    <div className="flex flex-wrap gap-2">
                      {log.filesModified.map((file, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-slate-800 border-slate-600">
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {log.questionsBatched && log.questionsBatched.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                      <HelpCircle className="h-4 w-4" />
                      Batched Questions
                    </div>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {log.questionsBatched.map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-purple-500">?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {logs.length === 0 && (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="py-12 text-center text-slate-400">
                No session logs yet. Logs will appear after development sessions.
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
