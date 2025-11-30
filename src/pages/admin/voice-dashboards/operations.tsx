/**
 * Voice-Enabled Operations Dashboard
 * Voice-powered asset management and field operations
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Package, Wrench, MapPin } from "lucide-react";
import { VoiceNarrator } from "@/utils/voice-commander";
import { useList } from "@refinedev/core";
import type { Asset } from "@/types";

export default function OperationsVoiceDashboard() {
  const [narrator] = useState(() => new VoiceNarrator());
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: assetsData } = useList<Asset>({ resource: "assets", pagination: { pageSize: 100 } });

  const assets = assetsData?.data || [];
  const availableAssets = assets.filter((a) => a.status === "Available");
  const assignedAssets = assets.filter((a) => a.status === "Assigned");
  const maintenanceAssets = assets.filter((a) => a.status === "Maintenance");

  const narrateDashboard = async () => {
    setIsNarrating(true);
    await narrator.speakBrowser(
      `Operations Dashboard. Total assets: ${assets.length}. Available: ${availableAssets.length}. Assigned: ${assignedAssets.length}. In maintenance: ${maintenanceAssets.length}.`,
    );
    setIsNarrating(false);
  };

  const narrateAsset = async (asset: Asset) => {
    await narrator.speakBrowser(
      `Asset: ${asset.name}. Category: ${asset.category}. Status: ${asset.status}. Value: ${asset.value} dollars. Barcode: ${asset.barcode}.`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Operations Voice Dashboard</h1>
          <p className="text-muted-foreground">Voice-powered asset management and field operations</p>
        </div>
        <Button onClick={narrateDashboard} disabled={isNarrating} size="lg">
          <Volume2 className="h-4 w-4 mr-2" />
          {isNarrating ? "Speaking..." : "Narrate Dashboard"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Badge variant="default">Available</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableAssets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assignedAssets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceAssets.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Asset Commands</CardTitle>
          <CardDescription>Hands-free asset management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Scan asset"</p>
              <p className="text-sm text-muted-foreground">Open barcode scanner</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show available equipment"</p>
              <p className="text-sm text-muted-foreground">Filter available assets</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Check out equipment"</p>
              <p className="text-sm text-muted-foreground">Start assignment workflow</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show maintenance items"</p>
              <p className="text-sm text-muted-foreground">List assets in maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>Click to hear asset details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assets.slice(0, 6).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                <div className="flex-1">
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.category} • {asset.barcode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      asset.status === "Available"
                        ? "default"
                        : asset.status === "Maintenance"
                          ? "destructive"
                          : "secondary"
                    }>
                    {asset.status}
                  </Badge>
                  <span className="font-medium">${asset.value}</span>
                  <Button variant="ghost" size="sm" onClick={() => narrateAsset(asset)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
