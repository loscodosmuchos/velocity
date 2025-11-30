import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Zap, TrendingUp, Copy, Search } from "lucide-react";
import { toast } from "sonner";

interface BugPattern {
  id: number;
  title: string;
  description: string;
  root_cause: string;
  file_path: string;
  bug_type: string;
  severity: string;
  likelihood_score: number;
  grep_pattern: string;
  files_affected: string[];
  created_at: string;
  fixed_at?: string;
  notes: string;
}

interface BugOccurrence {
  id: number;
  bug_pattern_id: number;
  file_path: string;
  line_number: number;
  code_snippet: string;
  severity: string;
}

const severityColors = {
  critical: "bg-red-900/30 border-red-500 text-red-400",
  high: "bg-orange-900/30 border-orange-500 text-orange-400",
  medium: "bg-yellow-900/30 border-yellow-500 text-yellow-400",
  low: "bg-blue-900/30 border-blue-500 text-blue-400",
};

export function BugPatternDetector() {
  const [patterns, setPatterns] = useState<BugPattern[]>([]);
  const [occurrences, setOccurrences] = useState<BugOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    try {
      const response = await fetch("/api/bug-patterns", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatterns(data);
      }
    } catch (error) {
      console.error("Error loading patterns:", error);
    } finally {
      setLoading(false);
    }
  };

  const scanForPattern = async (pattern: BugPattern) => {
    try {
      const response = await fetch(`/api/bug-patterns/${pattern.id}/scan`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const found = await response.json();
        setOccurrences(found);
        toast.success(`Found ${found.length} potential occurrences of "${pattern.title}"`);
      }
    } catch (error) {
      toast.error("Scan failed");
    }
  };

  const copyGrepCommand = (pattern: BugPattern) => {
    const command = `grep -r "${pattern.grep_pattern}" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"`;
    navigator.clipboard.writeText(command);
    toast.success("Grep command copied to clipboard");
  };

  const getLikelihoodColor = (score: number) => {
    if (score >= 75) return "bg-red-900 text-red-200";
    if (score >= 50) return "bg-orange-900 text-orange-200";
    if (score >= 25) return "bg-yellow-900 text-yellow-200";
    return "bg-blue-900 text-blue-200";
  };

  const getLikelihoodLabel = (score: number) => {
    if (score >= 75) return "VERY LIKELY TO REPEAT";
    if (score >= 50) return "Likely";
    if (score >= 25) return "Possible";
    return "Unlikely";
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">🐛 Bug Pattern Detector</h1>
        <p className="text-slate-400 mt-2">Identify bug patterns, rank repetition likelihood, search for similar issues</p>
      </div>

      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="patterns">Patterns ({patterns.length})</TabsTrigger>
          <TabsTrigger value="occurrences">Found Issues ({occurrences.length})</TabsTrigger>
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          {patterns.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                No bug patterns recorded yet
              </CardContent>
            </Card>
          ) : (
            patterns
              .sort((a, b) => b.likelihood_score - a.likelihood_score)
              .map((pattern) => (
                <Card key={pattern.id} className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{pattern.title}</CardTitle>
                        <p className="text-sm text-slate-300 mb-3">{pattern.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={severityColors[pattern.severity as keyof typeof severityColors]}>
                            {pattern.severity}
                          </Badge>
                          <Badge className={getLikelihoodColor(pattern.likelihood_score)}>
                            {pattern.likelihood_score}% - {getLikelihoodLabel(pattern.likelihood_score)}
                          </Badge>
                          <Badge variant="outline">{pattern.bug_type}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Root Cause:</p>
                      <p className="text-sm text-slate-200">{pattern.root_cause}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Grep Pattern:</p>
                      <p className="text-sm font-mono text-cyan-400 break-all">{pattern.grep_pattern}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Found In:</p>
                      <p className="text-sm text-slate-200">{pattern.file_path}</p>
                      {pattern.files_affected?.length > 0 && (
                        <p className="text-xs text-orange-400 mt-1">
                          Also found in {pattern.files_affected.length} other files
                        </p>
                      )}
                    </div>

                    {pattern.notes && (
                      <div className="bg-slate-950 p-3 rounded border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">Analysis Notes:</p>
                        <p className="text-sm text-slate-200">{pattern.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm"
                        onClick={() => scanForPattern(pattern)}
                        className="gap-1"
                      >
                        <Search className="h-3 w-3" />
                        Scan for This Pattern
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyGrepCommand(pattern)}
                        className="gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Grep
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Occurrences Tab */}
        <TabsContent value="occurrences" className="space-y-4">
          {occurrences.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                Click "Scan for This Pattern" to find occurrences
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-amber-400">Found {occurrences.length} potential issues</p>
              {occurrences.map((occ) => (
                <Card key={occ.id} className="bg-slate-900 border-slate-700">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-mono text-cyan-400">{occ.file_path}:{occ.line_number}</p>
                        <p className="text-xs text-slate-400 mt-1 font-mono bg-slate-950 p-2 rounded mt-2">
                          {occ.code_snippet}
                        </p>
                      </div>
                      <Badge className={severityColors[occ.severity as keyof typeof severityColors]}>
                        {occ.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-400" />
                  Critical Risk (75%+ likelihood)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-400 mb-2">
                  {patterns.filter(p => p.likelihood_score >= 75).length}
                </p>
                <p className="text-sm text-slate-400">
                  These patterns are very likely to repeat - prioritize prevention strategies
                </p>
                <ul className="mt-3 space-y-1">
                  {patterns
                    .filter(p => p.likelihood_score >= 75)
                    .map((p) => (
                      <li key={p.id} className="text-sm text-slate-300">
                        • {p.title}
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Prevention Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ Auto-scan on every commit with grep patterns</li>
                  <li>✓ Add linting rules for high-likelihood patterns</li>
                  <li>✓ Code review checklist includes pattern keywords</li>
                  <li>✓ Create test cases for each bug pattern</li>
                  <li>✓ Archive fixed patterns to prevent regression</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Top Patterns by Severity × Likelihood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patterns
                  .sort((a, b) => {
                    const scoreA = (a.likelihood_score * (a.severity === 'critical' ? 1.5 : 1));
                    const scoreB = (b.likelihood_score * (b.severity === 'critical' ? 1.5 : 1));
                    return scoreB - scoreA;
                  })
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <span className="text-sm">{p.title}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                            style={{ width: `${p.likelihood_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-400">{p.likelihood_score}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
