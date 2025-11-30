import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_PASSWORD = "123456";
const SESSION_KEY = "velocity_admin_unlocked";

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: () => void;
}

export function AdminPasswordDialog({
  open,
  onOpenChange,
  onUnlock,
}: AdminPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      // Store unlock state in sessionStorage (clears on browser close)
      sessionStorage.setItem(SESSION_KEY, "true");
      setError("");
      setPassword("");
      onUnlock();
      onOpenChange(false);
    } else {
      setError("Incorrect password. Try again.");
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            Admin Access Required
          </DialogTitle>
          <DialogDescription>
            Enter the admin password to access administrative functions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              autoFocus
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPassword("");
                setError("");
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!password}>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to check if admin is unlocked
 */
export function useAdminUnlock() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem(SESSION_KEY) === "true";
    setIsUnlocked(unlocked);
  }, []);

  const unlock = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setIsUnlocked(true);
  };

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
  };

  return { isUnlocked, unlock, lock };
}

AdminPasswordDialog.displayName = "AdminPasswordDialog";
