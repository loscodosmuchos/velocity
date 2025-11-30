import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Shield, 
  Database, 
  Eye,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  ShoppingCart,
  Crown,
  Star,
  Sparkles,
  Zap,
  Brain,
  Scale,
  Search,
  History
} from "lucide-react";

interface LegendaryPageStatus {
  path: string;
  name: string;
  status: 'legendary' | 'in_progress' | 'pending';
  icon: React.ComponentType<{className?: string}>;
  iconColor: string;
  criteria: {
    solves3PainPoints: boolean;
    realData: boolean;
    dualValidation: boolean;
    architectReviewed: boolean;
    symbolHierarchy: boolean;
  };
  removedFrom?: string;
  notes?: string;
}

const legendaryPages: LegendaryPageStatus[] = [
  {
    path: '/documents/command-center',
    name: 'Documents Command Center',
    status: 'legendary',
    icon: Zap,
    iconColor: 'text-cyan-400',
    criteria: {
      solves3PainPoints: true,
      realData: true,
      dualValidation: true,
      architectReviewed: true,
      symbolHierarchy: true
    },
    removedFrom: 'src/pages/documents/command-center.tsx',
    notes: 'Badge removed Nov 28 - 5-Lens AI, semantic search, audit trail'
  },
  {
    path: '/documents/search',
    name: 'Document Search',
    status: 'legendary',
    icon: Search,
    iconColor: 'text-purple-400',
    criteria: {
      solves3PainPoints: true,
      realData: true,
      dualValidation: true,
      architectReviewed: true,
      symbolHierarchy: true
    },
    removedFrom: 'src/pages/documents/search.tsx',
    notes: 'Badge removed Nov 28 - Full-text search with pgvector'
  },
  {
    path: '/documents/audit',
    name: 'Document Audit Trail',
    status: 'legendary',
    icon: History,
    iconColor: 'text-rose-400',
    criteria: {
      solves3PainPoints: true,
      realData: true,
      dualValidation: true,
      architectReviewed: true,
      symbolHierarchy: true
    },
    removedFrom: 'src/pages/documents/audit-trail.tsx',
    notes: 'Badge removed Nov 28 - 100% defensibility logging'
  },
  {
    path: '/statement-of-works/templates',
    name: 'SOW Templates',
    status: 'legendary',
    icon: FileText,
    iconColor: 'text-blue-400',
    criteria: {
      solves3PainPoints: true,
      realData: true,
      dualValidation: true,
      architectReviewed: true,
      symbolHierarchy: true
    },
    removedFrom: 'src/pages/statementofworks/templates.tsx',
    notes: 'Badge + text refs removed Nov 28 - Template patterns, quick start'
  }
];

interface ClaimValidation {
  claimId: string;
  title: string;
  category: string;
  currentStatus: string;
  uiStatus: Array<{ route: string; exists: boolean }>;
  claimable: boolean;
  discoverable: boolean;
  missing: string[];
}

interface DataHealth {
  sows: number;
  contractors: number;
  invoices: number;
  pos: number;
}

interface PrimeRealEstateCheck {
  dashboardHasData: boolean;
  minDataThresholds: {
    sows: { required: number; actual: number; met: boolean };
    contractors: { required: number; actual: number; met: boolean };
    invoices: { required: number; actual: number; met: boolean };
  };
}

interface AuditReport {
  timestamp: string;
  summary: {
    total: number;
    claimable: number;
    discoverable: number;
    incomplete: number;
    percentReady: number;
  };
  dataHealth: DataHealth;
  claims: ClaimValidation[];
  primeRealEstateCheck: PrimeRealEstateCheck;
}

export const ClaimsAuditPage: React.FC = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/claims-audit");
      if (!response.ok) {
        throw new Error(`Audit failed: ${response.status}`);
      }
      const data = await response.json();
      setReport(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Running claims audit...</span>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="p-6">
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Audit Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <Button onClick={fetchAudit} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const categories = ["all", ...new Set(report.claims.map((c) => c.category))];
  const filteredClaims = selectedCategory === "all" 
    ? report.claims 
    : report.claims.filter((c) => c.category === selectedCategory);

  const claimableCount = filteredClaims.filter((c) => c.claimable).length;
  const discoverableCount = filteredClaims.filter((c) => c.discoverable).length;

  const getStatusColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 p-6 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            VELO AUTHENTICITY Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Every claim must be discoverable and executable. No false advertising.
          </p>
          {lastRefresh && (
            <p className="text-xs text-slate-500 mt-2">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button 
          onClick={fetchAudit} 
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Audit
        </Button>
      </div>

      {/* Main Score */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wide">Demo Readiness Score</p>
              <div className={`text-6xl font-bold mt-2 ${getStatusColor(report.summary.percentReady)}`}>
                {report.summary.percentReady}%
              </div>
              <p className="text-slate-500 mt-1">
                {report.summary.claimable} of {report.summary.total} claims ready
              </p>
            </div>
            <div className="text-right space-y-4">
              <div>
                <div className="flex items-center gap-2 justify-end">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">{report.summary.claimable}</span>
                </div>
                <p className="text-xs text-slate-500">Claimable</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-end">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">{report.summary.discoverable}</span>
                </div>
                <p className="text-xs text-slate-500">Discoverable</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-end">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">{report.summary.incomplete}</span>
                </div>
                <p className="text-xs text-slate-500">Incomplete</p>
              </div>
            </div>
          </div>
          <Progress value={report.summary.percentReady} className="mt-6 h-3" />
        </CardContent>
      </Card>

      {/* Data Health & Prime Real Estate */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Data Health (Real Data Check)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto text-blue-400" />
                <div className="text-2xl font-bold text-white mt-1">{report.dataHealth.sows}</div>
                <p className="text-xs text-slate-500">SOWs</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto text-green-400" />
                <div className="text-2xl font-bold text-white mt-1">{report.dataHealth.contractors}</div>
                <p className="text-xs text-slate-500">Contractors</p>
              </div>
              <div className="text-center">
                <ShoppingCart className="w-6 h-6 mx-auto text-purple-400" />
                <div className="text-2xl font-bold text-white mt-1">{report.dataHealth.pos}</div>
                <p className="text-xs text-slate-500">POs</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-amber-400" />
                <div className="text-2xl font-bold text-white mt-1">{report.dataHealth.invoices}</div>
                <p className="text-xs text-slate-500">Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Prime Real Estate Check
            </CardTitle>
            <CardDescription className="text-slate-400">
              Dashboard cards must show meaningful data, not NaN or empty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(report.primeRealEstateCheck.minDataThresholds).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400 capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${val.met ? 'text-green-400' : 'text-red-400'}`}>
                      {val.actual} / {val.required} min
                    </span>
                    {val.met ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LEGENDARY Page Quality Tracker */}
      <Card className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 border-amber-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Page Quality Tracker
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 ml-2">
              Internal Only
            </Badge>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Pages meeting all D.A.I.S.Y. standards. LEGENDARY badges removed from UI but tracked here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {legendaryPages.map((page) => {
              const criteriaCount = Object.values(page.criteria).filter(Boolean).length;
              const totalCriteria = Object.keys(page.criteria).length;
              const allMet = criteriaCount === totalCriteria;
              
              return (
                <div 
                  key={page.path}
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    allMet 
                      ? 'bg-amber-950/20 border-amber-700/40' 
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      allMet ? 'bg-amber-500/20' : 'bg-slate-700/50'
                    }`}>
                      <page.icon className={`w-4 h-4 ${page.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{page.name}</span>
                        {allMet && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{page.path}</div>
                      {page.notes && (
                        <div className="text-xs text-amber-400/70 mt-1">{page.notes}</div>
                      )}
                      {page.removedFrom && (
                        <div className="text-[10px] text-slate-600 mt-0.5 font-mono">
                          {page.removedFrom}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {page.criteria.solves3PainPoints && (
                        <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center" title="Solves 3+ Pain Points">
                          <Brain className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                      {page.criteria.realData && (
                        <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center" title="Real Data">
                          <Database className="w-3 h-3 text-blue-400" />
                        </div>
                      )}
                      {page.criteria.dualValidation && (
                        <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center" title="Dual Validation">
                          <Shield className="w-3 h-3 text-purple-400" />
                        </div>
                      )}
                      {page.criteria.architectReviewed && (
                        <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center" title="Architect Reviewed">
                          <CheckCircle className="w-3 h-3 text-cyan-400" />
                        </div>
                      )}
                      {page.criteria.symbolHierarchy && (
                        <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center" title="Symbol Hierarchy">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {criteriaCount}/{totalCriteria} criteria
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Criteria Legend */}
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-emerald-400" />
                <span>3+ Pain Points</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-400" />
                <span>Real Data</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-400" />
                <span>Dual Validation</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-cyan-400" />
                <span>Architect Reviewed</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Symbol Hierarchy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Claims List */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            Claims Status ({claimableCount}/{filteredClaims.length} claimable)
          </CardTitle>
          <CardDescription className="text-slate-400">
            {discoverableCount} discoverable (routes exist) • {filteredClaims.length - claimableCount} need work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredClaims.map((claim) => (
              <div 
                key={claim.claimId} 
                className={`flex items-start justify-between p-4 rounded-lg border ${
                  claim.claimable 
                    ? 'bg-green-950/30 border-green-800' 
                    : claim.discoverable 
                      ? 'bg-yellow-950/30 border-yellow-800'
                      : 'bg-red-950/30 border-red-800'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {claim.claimable ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : claim.discoverable ? (
                      <Eye className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-white">{claim.title}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {claim.claimId}
                      </Badge>
                    </div>
                  </div>

                  {claim.missing.length > 0 && (
                    <div className="text-xs text-red-400 mt-2 ml-8">
                      Missing routes: {claim.missing.join(", ")}
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mt-1 ml-8">
                    Required: {claim.uiStatus.map((u, i) => (
                      <span key={u.route}>
                        <span className={u.exists ? 'text-green-400' : 'text-red-400'}>
                          {u.route}
                        </span>
                        {i < claim.uiStatus.length - 1 && ' → '}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={claim.claimable ? "default" : "secondary"} 
                    className={`capitalize ${claim.claimable ? 'bg-green-600' : ''}`}
                  >
                    {claim.currentStatus}
                  </Badge>
                  {claim.claimable && (
                    <span className="text-xs text-green-400">Demo Ready</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-400">Claimable (active + discoverable)</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-yellow-500" />
              <span className="text-slate-400">Discoverable (routes exist, status not active)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-slate-400">Missing (routes don't exist)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsAuditPage;
