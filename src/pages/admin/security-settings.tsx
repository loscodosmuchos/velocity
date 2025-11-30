import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Shield, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettingsPage() {
  const { adminSettings, updateAdminSettings } = useAdminAuth();
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showGatewayPassword, setShowGatewayPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [localSettings, setLocalSettings] = useState(adminSettings);

  const handleSave = () => {
    updateAdminSettings(localSettings);
    setSaved(true);
    toast.success('Security settings updated successfully');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure password protection for demo mode. These settings are stored locally in the browser.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Menu Protection
          </CardTitle>
          <CardDescription>
            Hide admin menu items from clients during demos. Require password to access admin features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="admin-enabled" className="text-base font-medium">
                Enable Admin Password
              </Label>
              <p className="text-sm text-muted-foreground">
                Require password to access admin menu items
              </p>
            </div>
            <Switch
              id="admin-enabled"
              checked={localSettings.adminPasswordEnabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, adminPasswordEnabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <div className="flex gap-2">
              <Input
                id="admin-password"
                type={showAdminPassword ? 'text' : 'password'}
                value={localSettings.adminPassword}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, adminPassword: e.target.value })
                }
                placeholder="Enter admin password"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
              >
                {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Default: 123456. Click "Close Admin" in the sidebar to log out and hide admin menu.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gateway Password Protection
          </CardTitle>
          <CardDescription>
            Require password before anyone can access the entire platform. Useful for shared public links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="gateway-enabled" className="text-base font-medium">
                Enable Gateway Password
              </Label>
              <p className="text-sm text-muted-foreground">
                Show password prompt before accessing any page
              </p>
            </div>
            <Switch
              id="gateway-enabled"
              checked={localSettings.gatewayPasswordEnabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, gatewayPasswordEnabled: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="gateway-password">Gateway Password</Label>
            <div className="flex gap-2">
              <Input
                id="gateway-password"
                type={showGatewayPassword ? 'text' : 'password'}
                value={localSettings.gatewayPassword}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, gatewayPassword: e.target.value })
                }
                placeholder="Enter gateway password"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowGatewayPassword(!showGatewayPassword)}
              >
                {showGatewayPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Default: velocity2024. Users must enter this password to access the platform.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} disabled={saved} className="min-w-32">
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-blue-900">Demo Mode Security Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Settings are stored in browser localStorage (client-side only)</li>
              <li>Not intended for production use - implement server-side auth for production</li>
              <li>Useful for quick demos and preventing accidental changes during presentations</li>
              <li>Click "Close Admin" in sidebar to hide admin menu without leaving the page</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
