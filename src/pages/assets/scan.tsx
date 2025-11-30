import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Barcode, Camera, Search } from "lucide-react";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { useCustom } from "@refinedev/core";
import type { Asset } from "@/types";

export default function AssetsScanPage() {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { refetch, data, isLoading } = useCustom<{ data: Asset[] }>({
    url: "",
    method: "get",
    config: {
      query: {
        barcode_eq: barcode,
      },
    },
    queryOptions: {
      enabled: false,
    },
  });

  const handleSearch = async () => {
    if (!barcode.trim()) return;

    const result = await refetch();
    if (result.data?.data?.data && result.data.data.data.length > 0) {
      const asset = result.data.data.data[0];
      navigate(`/assets/show/${asset.id}`);
    }
  };

  const startCamera = async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is required for barcode scanning");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  return (
    <CreateView>
      <CreateViewHeader title="Scan Asset Barcode" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Alert>
          <Barcode className="h-4 w-4" />
          <AlertDescription>
            Use your device camera to scan asset barcodes or enter the barcode manually to quickly lookup assets.
          </AlertDescription>
        </Alert>

        {/* Manual Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Barcode Entry
            </CardTitle>
            <CardDescription>Enter the barcode number manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="ASSET-12345"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="font-mono"
              />
              <Button onClick={handleSearch} disabled={isLoading || !barcode.trim()}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Scanner
            </CardTitle>
            <CardDescription>Scan barcodes using your device camera (requires camera permission)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanning ? (
              <Button onClick={startCamera} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            ) : (
              <>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-green-500 w-64 h-32 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={stopCamera} variant="destructive" className="flex-1">
                    Stop Camera
                  </Button>
                  <Button
                    onClick={() => {
                      // In production, this would use a barcode detection library
                      const simulatedBarcode = `ASSET-${Math.floor(Math.random() * 100000)}`;
                      setBarcode(simulatedBarcode);
                      stopCamera();
                      alert(
                        `Scanned: ${simulatedBarcode}\n\nIn production, this would use a real barcode scanner library.`,
                      );
                    }}
                    className="flex-1">
                    Simulate Scan
                  </Button>
                </div>
                <Alert>
                  <AlertDescription className="text-xs">
                    Note: Production implementation would integrate with libraries like ZXing or QuaggaJS for real
                    barcode detection.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/assets")}>
            Back to Assets
          </Button>
        </div>
      </div>
    </CreateView>
  );
}
