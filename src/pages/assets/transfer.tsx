import { useState } from "react";
import { useOne, useList, useUpdate } from "@refinedev/core";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, User, Building } from "lucide-react";
import type { Asset, Contractor, Room } from "@/types";

export default function AssetTransferPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState<"employee" | "room">("employee");
  const [targetId, setTargetId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const { data: assetData } = useOne<Asset>({
    resource: "assets",
    id: id!,
  });

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
    pagination: { pageSize: 100 },
  });

  const { data: roomsData } = useList<Room>({
    resource: "rooms",
    pagination: { pageSize: 100 },
  });

  const { mutate: updateAsset, isLoading } = useUpdate();

  const asset = assetData?.data;

  const handleTransfer = () => {
    if (!asset || !targetId) return;

    const updateData: Partial<Asset> = {
      assignmentType: transferType,
      notes: notes || asset.notes,
      assignedDate: new Date().toISOString(),
    };

    if (transferType === "employee") {
      updateData.assignedEmployeeId = Number(targetId);
      updateData.assignedRoomId = undefined;
    } else {
      updateData.assignedRoomId = Number(targetId);
      updateData.assignedEmployeeId = undefined;
    }

    updateAsset(
      {
        resource: "assets",
        id: asset.id,
        values: updateData,
      },
      {
        onSuccess: () => {
          navigate(`/assets/show/${asset.id}`);
        },
      },
    );
  };

  if (!asset) return <div>Loading...</div>;

  const currentAssignment =
    asset.assignmentType === "employee"
      ? contractorsData?.data?.find((c) => c.id === asset.assignedEmployeeId)
      : roomsData?.data?.find((r) => r.id === asset.assignedRoomId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transfer Asset</h1>
        <p className="text-muted-foreground mt-2">Transfer {asset.name} to a new employee or room</p>
      </div>

      {/* Current Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Current Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Asset</p>
              <p className="font-semibold">{asset.name}</p>
              <p className="text-xs text-muted-foreground">{asset.barcode}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              {currentAssignment ? (
                <div>
                  <p className="font-semibold">
                    {"firstName" in currentAssignment
                      ? `${currentAssignment.firstName} ${currentAssignment.lastName}`
                      : currentAssignment.name}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {asset.assignmentType === "employee" ? "Employee" : "Room"}
                  </Badge>
                </div>
              ) : (
                <Badge variant="secondary">Unassigned</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Assignment Type */}
          <div className="space-y-3">
            <Label>Transfer To</Label>
            <RadioGroup value={transferType} onValueChange={(value) => setTransferType(value as "employee" | "room")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee" className="font-normal cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Employee / Contractor
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="room" id="room" />
                <Label htmlFor="room" className="font-normal cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Room / Location
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Target Selection */}
          <div className="space-y-2">
            <Label>{transferType === "employee" ? "Select Employee/Contractor" : "Select Room/Location"}</Label>
            {transferType === "employee" ? (
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee..." />
                </SelectTrigger>
                <SelectContent>
                  {contractorsData?.data?.map((contractor) => (
                    <SelectItem key={contractor.id} value={String(contractor.id)}>
                      {contractor.firstName} {contractor.lastName} - {contractor.jobDescription}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose room..." />
                </SelectTrigger>
                <SelectContent>
                  {roomsData?.data?.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.name} ({room.building} - {room.roomNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Transfer Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Reason for transfer, condition notes, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleTransfer} disabled={!targetId || isLoading} className="flex-1">
              Complete Transfer
            </Button>
            <Button variant="outline" onClick={() => navigate(`/assets/show/${asset.id}`)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Impact */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm">📋 What Happens Next</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>✅ Asset assignment updated immediately</p>
          <p>✅ Transfer recorded in audit history</p>
          <p>✅ Previous assignee notified (if applicable)</p>
          <p>✅ New assignee receives confirmation email</p>
        </CardContent>
      </Card>
    </div>
  );
}
