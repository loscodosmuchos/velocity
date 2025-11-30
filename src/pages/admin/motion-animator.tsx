/**
 * Admin: Motion Animator Control Panel
 * Configure which cards get motion effects, their appearance, and behavior
 */

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  Sparkles,
  Wind,
  Gauge,
  Rocket,
  Lightbulb,
  Eye,
  Settings,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  MOTION_PRESETS,
  CARD_TYPE_DEFAULTS,
  CLICK_THROUGH_TARGETS,
  INTENSITY_MULTIPLIERS,
  type MotionPreset,
} from "@/config/motion-presets";

const PRESET_ICONS: Record<MotionPreset, React.ElementType> = {
  none: Eye,
  "subtle-glow": Sparkles,
  "pulse-energy": Zap,
  "speed-lines": Wind,
  "tach-sweep": Gauge,
  "turbo-boost": Rocket,
  "neon-drift": Lightbulb,
};

interface CardMotionRow {
  cardId: string;
  cardType: string;
  preset: MotionPreset;
  intensity: "subtle" | "moderate" | "aggressive";
  enabled: boolean;
  clickThrough: string;
  color: string;
}

export function MotionAnimatorPage() {
  const [cards, setCards] = useState<CardMotionRow[]>([
    {
      cardId: "kpi-active-contractors",
      cardType: "KPI",
      preset: "subtle-glow",
      intensity: "subtle",
      enabled: true,
      clickThrough: "detail",
      color: "cyan",
    },
    {
      cardId: "budget-utilization",
      cardType: "Budget",
      preset: "pulse-energy",
      intensity: "moderate",
      enabled: true,
      clickThrough: "category",
      color: "amber",
    },
    {
      cardId: "alert-compliance",
      cardType: "Alert",
      preset: "turbo-boost",
      intensity: "aggressive",
      enabled: true,
      clickThrough: "detail",
      color: "ruby",
    },
  ]);

  const [editingCard, setEditingCard] = useState<CardMotionRow | null>(null);
  const [previewPreset, setPreviewPreset] = useState<MotionPreset>("subtle-glow");

  const addCard = useCallback(() => {
    const newCard: CardMotionRow = {
      cardId: `card-${Date.now()}`,
      cardType: "Custom",
      preset: "subtle-glow",
      intensity: "moderate",
      enabled: true,
      clickThrough: "detail",
      color: "cyan",
    };
    setCards([...cards, newCard]);
    toast.success("New motion card added");
  }, [cards]);

  const updateCard = useCallback((cardId: string, updates: Partial<CardMotionRow>) => {
    setCards(
      cards.map((card) => (card.cardId === cardId ? { ...card, ...updates } : card))
    );
    setEditingCard(null);
    toast.success("Motion settings updated");
  }, [cards]);

  const deleteCard = useCallback((cardId: string) => {
    setCards(cards.filter((card) => card.cardId !== cardId));
    toast.success("Motion card removed");
  }, [cards]);

  const saveAllSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch("/api/admin/motion-settings/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cards }),
      });

      if (!response.ok) throw new Error("Failed to save settings");
      toast.success("All motion settings saved to database");
    } catch (error) {
      console.error("Error saving motion settings:", error);
      toast.error("Failed to save settings");
    }
  }, [cards]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Motion Animator Control</h1>
        <p className="text-muted-foreground">
          Configure which cards get motion effects, their animation style, and click-through behavior.
          Every card with data can have selective motion enabled.
        </p>
      </div>

      {/* Global Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Global Motion Settings</CardTitle>
          <CardDescription>Configure default animation behavior across all cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Enable All Animations</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Allow User Toggle</Label>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Default Animation Style</Label>
              <Select defaultValue="subtle-glow">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MOTION_PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Intensity</Label>
              <Select defaultValue="moderate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtle">Subtle (70% speed)</SelectItem>
                  <SelectItem value="moderate">Moderate (100% speed)</SelectItem>
                  <SelectItem value="aggressive">Aggressive (150% speed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motion Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Preview</CardTitle>
          <CardDescription>Select a preset to see how it looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(MOTION_PRESETS).map(([key, preset]) => {
              const Icon = PRESET_ICONS[key as MotionPreset];
              return (
                <Button
                  key={key}
                  variant={previewPreset === key ? "default" : "outline"}
                  onClick={() => setPreviewPreset(key as MotionPreset)}
                  className="h-auto flex flex-col gap-2 p-3"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center">{preset.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Preview Card */}
          <div className="mt-4 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
            <div
              className={`p-4 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-center transition-all ${
                MOTION_PRESETS[previewPreset].className
              }`}
              style={
                previewPreset !== "none"
                  ? {
                      animationDuration: `${MOTION_PRESETS[previewPreset].duration}ms`,
                    }
                  : {}
              }
            >
              <div className="text-sm text-slate-400">
                {MOTION_PRESETS[previewPreset].description}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Effect: {MOTION_PRESETS[previewPreset].visualEffect}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Motion Configurations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Card Motion Configurations</CardTitle>
            <CardDescription>Configure individual card animations</CardDescription>
          </div>
          <Button onClick={addCard} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cards.map((card) => {
              const Icon = PRESET_ICONS[card.preset];
              return (
                <div key={card.cardId} className="flex items-center justify-between p-3 border rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-sm">{card.cardType}</span>
                      <Badge variant={card.enabled ? "default" : "secondary"} className="text-xs">
                        {card.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {card.preset}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {card.intensity}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      ID: {card.cardId} • Click: {card.clickThrough} • Color: {card.color}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCard(card)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Configure {card.cardType} Motion</DialogTitle>
                          <DialogDescription>
                            Customize animation settings for this card
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Animation Style</Label>
                            <Select value={card.preset} onValueChange={(value) => updateCard(card.cardId, { preset: value as MotionPreset })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(MOTION_PRESETS).map(([key, preset]) => (
                                  <SelectItem key={key} value={key}>
                                    {preset.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Intensity: {card.intensity}</Label>
                            <Select value={card.intensity} onValueChange={(value) => updateCard(card.cardId, { intensity: value as any })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="subtle">Subtle (70% speed)</SelectItem>
                                <SelectItem value="moderate">Moderate (100% speed)</SelectItem>
                                <SelectItem value="aggressive">Aggressive (150% speed)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Click Behavior</Label>
                            <Select value={card.clickThrough} onValueChange={(value) => updateCard(card.cardId, { clickThrough: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(CLICK_THROUGH_TARGETS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Enable Motion</Label>
                            <Switch checked={card.enabled} onCheckedChange={(checked) => updateCard(card.cardId, { enabled: checked })} />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button onClick={() => setEditingCard(null)}>Done</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCard(card.cardId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        <Button onClick={saveAllSettings} className="bg-emerald-600 hover:bg-emerald-700">
          Save All Settings to Database
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            ✨ Each card can have its own motion animation configured independently
          </p>
          <p>
            🎯 Click behavior controls navigation on card click (detail, category, or section)
          </p>
          <p>
            ⚡ Intensity levels affect animation speed: Subtle (70%), Moderate (100%), Aggressive (150%)
          </p>
          <p>
            🚗 Automotive-inspired motion effects create speed and energy - perfect for luxury dashboard aesthetic
          </p>
          <p>
            ⚙️ Settings are saved per-card and loaded dynamically when pages render
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default MotionAnimatorPage;
