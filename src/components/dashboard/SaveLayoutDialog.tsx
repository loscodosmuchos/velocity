import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface SaveLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, isDefault: boolean) => void;
  isSaving: boolean;
}

export function SaveLayoutDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
}: SaveLayoutDialogProps) {
  const [layoutName, setLayoutName] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    if (layoutName.trim()) {
      onSave(layoutName, isDefault);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSaving) {
      setLayoutName("");
      setIsDefault(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Dashboard Layout</DialogTitle>
          <DialogDescription>
            Give your dashboard layout a name to save it for later use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="layout-name">Layout Name</Label>
            <Input
              id="layout-name"
              placeholder="My Custom Dashboard"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-default"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked as boolean)}
            />
            <Label
              htmlFor="is-default"
              className="text-sm font-normal cursor-pointer"
            >
              Set as my default dashboard
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!layoutName.trim() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Layout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
