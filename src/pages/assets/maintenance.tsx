import { useState } from "react";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import type { Asset } from "@/types";

export default function AssetMaintenancePage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assetsData } = useList<Asset>({
    resource: "assets",
    pagination: { pageSize: 100 },
  });

  // Calculate maintenance status for each asset
  const assetsWithStatus = (assetsData?.data || []).map((asset) => {
    const purchaseDate = new Date(asset.purchaseDate);
    const lastMaintenance = asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate) : purchaseDate;
    const daysSinceLastMaintenance = Math.floor(
      (new Date().getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24),
    );

    let status: "good" | "warning" | "overdue" | "critical";
    let nextMaintenanceDays: number;

    // Maintenance schedule based on asset category
    const maintenanceIntervals: Record<string, number> = {
      Laptop: 365,
      Phone: 730,
      Monitor: 730,
      Tablet: 365,
      Headset: 180,
      "Docking Station": 365,
    };

    const interval = maintenanceIntervals[asset.category] || 365;
    nextMaintenanceDays = interval - daysSinceLastMaintenance;

    if (nextMaintenanceDays < 0) {
      status = "overdue";
    } else if (nextMaintenanceDays < 30) {
      status = "critical";
    } else if (nextMaintenanceDays < 90) {
      status = "warning";
    } else {
      status = "good";
    }

    return {
      ...asset,
      maintenanceStatus: status,
      daysSinceLastMaintenance,
      nextMaintenanceDays,
    };
  });

  // Filter assets
  const filteredAssets = assetsWithStatus
    .filter((asset) => {
      if (filterStatus !== "all" && asset.maintenanceStatus !== filterStatus) return false;
      if (
        searchTerm &&
        !asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !asset.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const priority = { overdue: 0, critical: 1, warning: 2, good: 3 };
      return priority[a.maintenanceStatus] - priority[b.maintenanceStatus];
    });

  const stats = {
    overdue: assetsWithStatus.filter((a) => a.maintenanceStatus === "overdue").length,
    critical: assetsWithStatus.filter((a) => a.maintenanceStatus === "critical").length,
    warning: assetsWithStatus.filter((a) => a.maintenanceStatus === "warning").length,
    good: assetsWithStatus.filter((a) => a.maintenanceStatus === "good").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      overdue: { variant: "destructive", label: "Overdue" },
      critical: { variant: "destructive", label: "Due Soon" },
      warning: { variant: "secondary", label: "Upcoming" },
      good: { variant: "outline", label: "On Track" },
    };

    const config = variants[status] || variants.good;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Asset Maintenance Schedule
        </h1>
        <p className="text-muted-foreground mt-2">Track maintenance schedules and flag assets nearing end-of-life</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical ({"<30 days"})</p>
                <p className="text-3xl font-bold text-orange-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warning ({"<90 days"})</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Track</p>
                <p className="text-3xl font-bold text-green-600">{stats.good}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by asset name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="good">On Track</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Asset List */}
      <div className="space-y-3">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(asset.maintenanceStatus)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{asset.name}</p>
                      {getStatusBadge(asset.maintenanceStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {asset.category} • {asset.barcode}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {asset.maintenanceStatus === "overdue" ? (
                        <span className="text-red-600 font-medium">
                          Maintenance overdue by {Math.abs(asset.nextMaintenanceDays)} days
                        </span>
                      ) : asset.maintenanceStatus === "critical" ? (
                        <span className="text-orange-600 font-medium">
                          Maintenance due in {asset.nextMaintenanceDays} days
                        </span>
                      ) : asset.maintenanceStatus === "warning" ? (
                        <span className="text-yellow-600 font-medium">
                          Next maintenance in {asset.nextMaintenanceDays} days
                        </span>
                      ) : (
                        <span>Next maintenance in {asset.nextMaintenanceDays} days</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-sm text-muted-foreground">Last Maintenance</p>
                    <p className="text-sm font-medium">
                      {asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate).toLocaleDateString() : "Never"}
                    </p>
                    <p className="text-xs text-muted-foreground">{asset.daysSinceLastMaintenance} days ago</p>
                  </div>
                  <Button onClick={() => navigate(`/assets/${asset.id}`)}>Schedule Maintenance</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No assets found matching your filters
          </CardContent>
        </Card>
      )}
    </div>
  );
}
