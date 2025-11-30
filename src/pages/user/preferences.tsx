import { useState, useRef, useEffect } from "react";
import { 
  Settings, Bell, Moon, Sun, Globe, Lock, Palette, LayoutGrid, Save, Check, 
  Maximize2, Minimize2, Upload, Image, Type, Grid3X3, Download, RefreshCw,
  Copy, FileJson, Share2, Trash2, Plus, Eye, Paintbrush, Monitor, ClipboardList
} from "lucide-react";
import { useLayoutMode } from "@/contexts/layout-mode-context";
import { useUserSettings, AVAILABLE_FONTS, AVAILABLE_ICON_SETS, type ColorScheme, type ColorSchemePreset, type ViewTemplate, type SettingsAuditEntry } from "@/contexts/user-settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function UserPreferencesPage() {
  const [saved, setSaved] = useState(false);
  const { layoutMode, toggleLayoutMode } = useLayoutMode();
  const { 
    settings, 
    updateSettings, 
    resetSettings,
    exportSettings, 
    importSettings,
    generateShareCode,
    applyShareCode,
    downloadBackup,
    restoreFromBackup,
    getAuditLog,
    clearAuditLog
  } = useUserSettings();
  
  const [importText, setImportText] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [applyCode, setApplyCode] = useState("");
  const [newColorSchemeName, setNewColorSchemeName] = useState("");
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const backupFileRef = useRef<HTMLInputElement>(null);

  // Apply CSS custom properties for colors
  useEffect(() => {
    const root = document.documentElement;
    const cs = settings.colorScheme;
    
    root.style.setProperty('--alert-critical', cs.alertCritical);
    root.style.setProperty('--alert-high', cs.alertHigh);
    root.style.setProperty('--alert-medium', cs.alertMedium);
    root.style.setProperty('--alert-low', cs.alertLow);
    root.style.setProperty('--alert-info', cs.alertInfo);
    
    root.style.setProperty('--status-active', cs.statusActive);
    root.style.setProperty('--status-pending', cs.statusPending);
    root.style.setProperty('--status-completed', cs.statusCompleted);
    root.style.setProperty('--status-cancelled', cs.statusCancelled);
    root.style.setProperty('--status-draft', cs.statusDraft);
    
    root.style.setProperty('--card-background', cs.cardBackground);
    root.style.setProperty('--card-border', cs.cardBorder);
    root.style.setProperty('--card-accent', cs.cardAccent);
    
    root.style.setProperty('--dept-it', cs.deptIT);
    root.style.setProperty('--dept-datascience', cs.deptDataScience);
    root.style.setProperty('--dept-cloud', cs.deptCloud);
    root.style.setProperty('--dept-qa', cs.deptQA);
    root.style.setProperty('--dept-security', cs.deptSecurity);
  }, [settings.colorScheme]);

  // Apply font family
  useEffect(() => {
    const font = AVAILABLE_FONTS.find(f => f.id === settings.fontFamily);
    if (font) {
      document.documentElement.style.setProperty('--font-family', font.family);
      document.body.style.fontFamily = font.family;
    }
  }, [settings.fontFamily]);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const resized = canvas.toDataURL('image/png');
          setUploadedLogo(resized);
          localStorage.setItem('velocity_custom_logo', resized);
          toast.success(`Logo uploaded (${Math.round(width)}x${Math.round(height)}px)`);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Background must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedBackground(result);
        localStorage.setItem('velocity_custom_background', result);
        toast.success("Background image uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const json = exportSettings();
    navigator.clipboard.writeText(json);
    toast.success("Settings copied to clipboard");
  };

  const handleImport = () => {
    const result = importSettings(importText);
    if (result.success) {
      toast.success("Settings imported successfully");
      setImportText("");
    } else {
      toast.error(result.error || "Import failed");
    }
  };

  const handleGenerateShareCode = () => {
    const code = generateShareCode();
    setShareCode(code);
    navigator.clipboard.writeText(code);
    toast.success("Share code generated and copied");
  };

  const handleApplyShareCode = () => {
    const result = applyShareCode(applyCode);
    if (result.success) {
      toast.success("Settings applied from share code");
      setApplyCode("");
    } else {
      toast.error(result.error || "Invalid share code");
    }
  };

  const handleBackupDownload = () => {
    downloadBackup();
    toast.success("Backup file downloaded");
  };

  const handleBackupRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await restoreFromBackup(file);
      if (result.success) {
        toast.success("Settings restored from backup");
      } else {
        toast.error(result.error || "Restore failed");
      }
    }
  };

  const updateColorScheme = (key: keyof ColorScheme, value: string) => {
    updateSettings({
      colorScheme: { ...settings.colorScheme, [key]: value }
    });
  };

  const saveCurrentAsPreset = () => {
    if (!newColorSchemeName.trim()) {
      toast.error("Please enter a name for the preset");
      return;
    }
    const newPreset: ColorSchemePreset = {
      id: `custom-${Date.now()}`,
      name: newColorSchemeName,
      scheme: JSON.parse(JSON.stringify(settings.colorScheme)),
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    updateSettings({
      savedColorSchemes: [...settings.savedColorSchemes, newPreset]
    });
    setNewColorSchemeName("");
    toast.success(`Preset "${newColorSchemeName}" saved`);
  };

  const applyPreset = (preset: ColorSchemePreset) => {
    updateSettings({ colorScheme: JSON.parse(JSON.stringify(preset.scheme)) });
    toast.success(`Applied "${preset.name}" color scheme`);
  };

  const deletePreset = (id: string) => {
    updateSettings({
      savedColorSchemes: settings.savedColorSchemes.filter(p => p.id !== id)
    });
    toast.success("Preset deleted");
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-slate-300 text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-600"
        />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-24 bg-slate-900/50 border-slate-600 text-white text-xs font-mono"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-400" />
              My Preferences
            </h1>
            <p className="text-slate-400 mt-1">Customize your Velocity experience - all settings are saved automatically</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetSettings} className="border-slate-600 text-slate-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {saved ? <><Check className="h-4 w-4 mr-2" />Saved!</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-slate-700">
              <Palette className="h-4 w-4 mr-2" />Appearance
            </TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:bg-slate-700">
              <Paintbrush className="h-4 w-4 mr-2" />Colors
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-slate-700">
              <Image className="h-4 w-4 mr-2" />Assets
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
              <Bell className="h-4 w-4 mr-2" />Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
              <Lock className="h-4 w-4 mr-2" />Security
            </TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-slate-700">
              <Share2 className="h-4 w-4 mr-2" />Backup & Share
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* APPEARANCE TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-400" />
                    Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-white">Theme</Label>
                    <RadioGroup 
                      value={settings.theme}
                      onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" className="border-slate-500" />
                        <Label htmlFor="light" className="text-slate-300 flex items-center gap-2 cursor-pointer">
                          <Sun className="h-4 w-4" />Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" className="border-slate-500" />
                        <Label htmlFor="dark" className="text-slate-300 flex items-center gap-2 cursor-pointer">
                          <Moon className="h-4 w-4" />Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" className="border-slate-500" />
                        <Label htmlFor="system" className="text-slate-300 cursor-pointer">System</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Compact Mode</Label>
                      <p className="text-slate-400 text-sm">Use smaller spacing and fonts</p>
                    </div>
                    <Switch 
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white flex items-center gap-2">
                        {layoutMode === 'expanded' ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        Page Layout Mode
                      </Label>
                      <p className="text-slate-400 text-sm">{layoutMode === 'expanded' ? 'Full width content' : 'Fixed width container'}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={toggleLayoutMode}
                    >
                      {layoutMode === 'expanded' ? 'Switch to Fixed' : 'Switch to Expanded'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Show Card Borders</Label>
                      <p className="text-slate-400 text-sm">Display borders around cards</p>
                    </div>
                    <Switch 
                      checked={settings.showCardBorders}
                      onCheckedChange={(checked) => updateSettings({ showCardBorders: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Type className="h-5 w-5 text-cyan-400" />
                    Typography & Icons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-white">Font Family</Label>
                    <Select 
                      value={settings.fontFamily}
                      onValueChange={(value) => updateSettings({ fontFamily: value })}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {AVAILABLE_FONTS.map(font => (
                          <SelectItem key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Menu Font Size</Label>
                    <Select 
                      value={settings.menuFontSize}
                      onValueChange={(value) => updateSettings({ menuFontSize: value as 'small' | 'medium' | 'large' })}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-3">
                    <Label className="text-white">Icon Set</Label>
                    <Select 
                      value={settings.iconSet}
                      onValueChange={(value) => updateSettings({ iconSet: value as 'lucide' | 'heroicons' | 'phosphor' | 'custom' })}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {AVAILABLE_ICON_SETS.map(iconSet => (
                          <SelectItem key={iconSet.id} value={iconSet.id}>
                            <div>
                              <div>{iconSet.name}</div>
                              <div className="text-xs text-slate-400">{iconSet.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">Language</Label>
                    <Select 
                      value={settings.language}
                      onValueChange={(value) => updateSettings({ language: value })}
                    >
                      <SelectTrigger className="w-full bg-slate-900/50 border-slate-600 text-white">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ko">한국어 (Korean)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-emerald-400" />
                  Navigation & Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-white">Sidebar Mode</Label>
                  <Select 
                    value={settings.sidebarMode}
                    onValueChange={(value) => updateSettings({ sidebarMode: value as 'full' | 'simplified' | 'minimal' })}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="full">Full Menu</SelectItem>
                      <SelectItem value="simplified">Simplified (Key items only)</SelectItem>
                      <SelectItem value="minimal">Minimal (Icons only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Controls sidebar navigation display</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Default Dashboard Layout</Label>
                  <Select 
                    value={settings.dashboardLayout}
                    onValueChange={(value) => updateSettings({ dashboardLayout: value as 'grid' | 'list' | 'compact' })}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="compact">Compact View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Default Start Page</Label>
                  <Select 
                    value={settings.defaultView}
                    onValueChange={(value) => updateSettings({ defaultView: value })}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="sow-command-center">SOW Command Center</SelectItem>
                      <SelectItem value="timecards">Timecards</SelectItem>
                      <SelectItem value="approvals">Approvals</SelectItem>
                      <SelectItem value="contractors">Contractors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* COLORS TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Alert Colors</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Used for notifications and warnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ColorPicker label="Critical" value={settings.colorScheme.alertCritical} onChange={(v) => updateColorScheme('alertCritical', v)} />
                  <ColorPicker label="High" value={settings.colorScheme.alertHigh} onChange={(v) => updateColorScheme('alertHigh', v)} />
                  <ColorPicker label="Medium" value={settings.colorScheme.alertMedium} onChange={(v) => updateColorScheme('alertMedium', v)} />
                  <ColorPicker label="Low" value={settings.colorScheme.alertLow} onChange={(v) => updateColorScheme('alertLow', v)} />
                  <ColorPicker label="Info" value={settings.colorScheme.alertInfo} onChange={(v) => updateColorScheme('alertInfo', v)} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Pipeline/Status Colors</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Used for workflow statuses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ColorPicker label="Active" value={settings.colorScheme.statusActive} onChange={(v) => updateColorScheme('statusActive', v)} />
                  <ColorPicker label="Pending" value={settings.colorScheme.statusPending} onChange={(v) => updateColorScheme('statusPending', v)} />
                  <ColorPicker label="Completed" value={settings.colorScheme.statusCompleted} onChange={(v) => updateColorScheme('statusCompleted', v)} />
                  <ColorPicker label="Cancelled" value={settings.colorScheme.statusCancelled} onChange={(v) => updateColorScheme('statusCancelled', v)} />
                  <ColorPicker label="Draft" value={settings.colorScheme.statusDraft} onChange={(v) => updateColorScheme('statusDraft', v)} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Card & UI Colors</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Background and accent colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ColorPicker label="Card BG" value={settings.colorScheme.cardBackground} onChange={(v) => updateColorScheme('cardBackground', v)} />
                  <ColorPicker label="Card Border" value={settings.colorScheme.cardBorder} onChange={(v) => updateColorScheme('cardBorder', v)} />
                  <ColorPicker label="Accent" value={settings.colorScheme.cardAccent} onChange={(v) => updateColorScheme('cardAccent', v)} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Department Colors (Standardized)</CardTitle>
                <CardDescription className="text-slate-400 text-xs">Used consistently across all charts and visualizations</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-4">
                <ColorPicker label="IT Operations" value={settings.colorScheme.deptIT} onChange={(v) => updateColorScheme('deptIT', v)} />
                <ColorPicker label="Data Science" value={settings.colorScheme.deptDataScience} onChange={(v) => updateColorScheme('deptDataScience', v)} />
                <ColorPicker label="Cloud Infra" value={settings.colorScheme.deptCloud} onChange={(v) => updateColorScheme('deptCloud', v)} />
                <ColorPicker label="QA" value={settings.colorScheme.deptQA} onChange={(v) => updateColorScheme('deptQA', v)} />
                <ColorPicker label="Security" value={settings.colorScheme.deptSecurity} onChange={(v) => updateColorScheme('deptSecurity', v)} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-amber-400" />
                  Color Scheme Presets
                </CardTitle>
                <CardDescription className="text-slate-400">Save and load color configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="New preset name..." 
                    value={newColorSchemeName}
                    onChange={(e) => setNewColorSchemeName(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                  <Button onClick={saveCurrentAsPreset} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />Save Current
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {settings.savedColorSchemes.map((preset) => (
                    <div 
                      key={preset.id} 
                      className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-white font-medium text-sm">{preset.name}</div>
                        {preset.description && <div className="text-slate-400 text-xs">{preset.description}</div>}
                        {preset.isDefault && <Badge className="bg-blue-500/20 text-blue-300 text-xs mt-1">Default</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => applyPreset(preset)} className="text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!preset.isDefault && (
                          <Button size="sm" variant="ghost" onClick={() => deletePreset(preset.id)} className="text-slate-400 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ASSETS TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="assets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Image className="h-5 w-5 text-blue-400" />
                    Logo
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload custom logo (max 2MB, auto-resized to 200px)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {uploadedLogo ? (
                        <img src={uploadedLogo} alt="Custom logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Image className="h-8 w-8 text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />Upload Logo
                      </Button>
                      {uploadedLogo && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setUploadedLogo(null);
                            localStorage.removeItem('velocity_custom_logo');
                            toast.success("Logo removed");
                          }}
                          className="border-slate-600 text-slate-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Storage:</strong> localStorage (velocity_custom_logo)<br/>
                    <strong>Format:</strong> PNG, auto-converted<br/>
                    <strong>Size:</strong> Max 200x200px
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Image className="h-5 w-5 text-purple-400" />
                    Background / Texture
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload custom background image (max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input 
                    type="file" 
                    ref={bgFileInputRef}
                    onChange={handleBackgroundUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-4 items-center">
                    <div className="w-32 h-24 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {uploadedBackground ? (
                        <img src={uploadedBackground} alt="Custom background" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Image className="h-6 w-6 text-slate-600 mx-auto" />
                          <span className="text-xs text-slate-500">No background</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button onClick={() => bgFileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
                        <Upload className="h-4 w-4 mr-2" />Upload Background
                      </Button>
                      {uploadedBackground && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setUploadedBackground(null);
                            localStorage.removeItem('velocity_custom_background');
                            toast.success("Background removed");
                          }}
                          className="border-slate-600 text-slate-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <strong>Storage:</strong> localStorage (velocity_custom_background)<br/>
                    <strong>Format:</strong> Any image format<br/>
                    <strong>Usage:</strong> Page backgrounds, carbon fiber replacement
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Asset Storage Reference</CardTitle>
                <CardDescription className="text-slate-400">Where assets are stored and how they're used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
                  <div><span className="text-blue-400">velocity_custom_logo</span> → Sidebar logo, login page</div>
                  <div><span className="text-purple-400">velocity_custom_background</span> → Page backgrounds</div>
                  <div><span className="text-emerald-400">velocity_user_settings</span> → All user preferences (JSON)</div>
                  <div><span className="text-amber-400">velocity-theme</span> → Theme preference (light/dark)</div>
                  <div><span className="text-cyan-400">layoutMode</span> → Expanded/Fixed layout</div>
                  <div><span className="text-pink-400">velocity-density</span> → UI density setting</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* NOTIFICATIONS TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-slate-400 text-sm">Browser push notifications</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSettings({ pushNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Weekly Digest</Label>
                    <p className="text-slate-400 text-sm">Summary email every Monday</p>
                  </div>
                  <Switch 
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => updateSettings({ weeklyDigest: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Alert Sounds</Label>
                    <p className="text-slate-400 text-sm">Play sound for important alerts</p>
                  </div>
                  <Switch 
                    checked={settings.alertSounds}
                    onCheckedChange={(checked) => updateSettings({ alertSounds: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SECURITY TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-400" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-slate-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={settings.twoFactorEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}>
                      {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch 
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSettings({ twoFactorEnabled: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Session Timeout</Label>
                  <Select 
                    value={settings.sessionTimeout}
                    onValueChange={(value) => updateSettings({ sessionTimeout: value })}
                  >
                    <SelectTrigger className="w-[200px] bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-slate-500 text-xs">Auto-logout after inactivity</p>
                </div>

                <Separator className="bg-slate-700" />

                <div className="flex gap-3">
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    Change Password
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    View Login History
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-cyan-400" />
                  Settings Audit Trail
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Track all changes made to your settings for compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-slate-700 text-slate-300">
                    {(settings.auditLog || []).length} entries (last 100 kept)
                  </Badge>
                  {(settings.auditLog || []).length > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        clearAuditLog();
                        toast.success("Audit log cleared");
                      }}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />Clear Log
                    </Button>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {(settings.auditLog || []).length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No audit entries yet</p>
                      <p className="text-xs">Changes will be logged here</p>
                    </div>
                  ) : (
                    [...(settings.auditLog || [])].reverse().map((entry) => (
                      <div key={entry.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              entry.action === 'reset' ? 'bg-red-500/20 text-red-300' :
                              entry.action === 'import' ? 'bg-blue-500/20 text-blue-300' :
                              entry.action === 'apply_share_code' ? 'bg-purple-500/20 text-purple-300' :
                              entry.action === 'restore_backup' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-slate-600/50 text-slate-300'
                            }`}>
                              {entry.action.replace(/_/g, ' ')}
                            </Badge>
                            {entry.source && (
                              <span className="text-slate-500 text-xs">{entry.source}</span>
                            )}
                          </div>
                          <span className="text-slate-500 text-xs">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {entry.changes.length <= 3 ? (
                            entry.changes.map((change, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="text-slate-500">{change.field}:</span>
                                <span className="text-red-400/70">{String(change.oldValue).slice(0, 20)}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-emerald-400/70">{String(change.newValue).slice(0, 20)}</span>
                              </div>
                            ))
                          ) : (
                            <span>{entry.changes.length} fields changed</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BACKUP & SHARE TAB */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <TabsContent value="backup" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5 text-emerald-400" />
                    Export / Backup
                  </CardTitle>
                  <CardDescription className="text-slate-400">Download or copy your settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleExport} className="bg-slate-700 hover:bg-slate-600">
                      <Copy className="h-4 w-4 mr-2" />Copy to Clipboard
                    </Button>
                    <Button onClick={handleBackupDownload} className="bg-emerald-600 hover:bg-emerald-700">
                      <Download className="h-4 w-4 mr-2" />Download JSON
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Exports all settings including color schemes, view templates, and dashboard configurations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    Import / Restore
                  </CardTitle>
                  <CardDescription className="text-slate-400">Restore from backup file or paste JSON</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input 
                    type="file" 
                    ref={backupFileRef}
                    onChange={handleBackupRestore}
                    accept=".json"
                    className="hidden"
                  />
                  <Button onClick={() => backupFileRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 w-full">
                    <FileJson className="h-4 w-4 mr-2" />Restore from File
                  </Button>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Or paste settings JSON here..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white font-mono text-xs h-20"
                    />
                    <Button 
                      onClick={handleImport} 
                      disabled={!importText}
                      className="bg-slate-700 hover:bg-slate-600 w-full"
                    >
                      Import from Text
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-400" />
                  Share Settings Between Users
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate a compact code to share your display settings with colleagues
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-white">Generate Share Code</Label>
                  <Button onClick={handleGenerateShareCode} className="bg-purple-600 hover:bg-purple-700 w-full">
                    <Share2 className="h-4 w-4 mr-2" />Generate Code
                  </Button>
                  {shareCode && (
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                      <Label className="text-slate-400 text-xs">Your Share Code (copied!):</Label>
                      <div className="font-mono text-xs text-emerald-400 break-all mt-1">{shareCode.slice(0, 50)}...</div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Apply Share Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste share code (VEL...)"
                      value={applyCode}
                      onChange={(e) => setApplyCode(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white font-mono text-xs"
                    />
                    <Button 
                      onClick={handleApplyShareCode}
                      disabled={!applyCode}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Share codes include display settings but exclude security settings for safety.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Current Settings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-xs text-slate-300 max-h-48 overflow-auto">
                  <pre>{JSON.stringify(settings, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserPreferencesPage;
