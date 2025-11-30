import { useState, useEffect, useMemo } from "react";
import type { MotionConfig, MotionGlobalSettings } from "@/config/motion-presets";
import {
  DEFAULT_GLOBAL_SETTINGS,
  MOTION_PRESETS,
  INTENSITY_MULTIPLIERS,
  MOTION_COLORS,
} from "@/config/motion-presets";

/**
 * Hook to get motion configuration for a card
 * Fetches from admin settings with fallback to defaults
 */
export function useMotionConfig(cardId: string, cardType?: string) {
  const [config, setConfig] = useState<MotionConfig | null>(null);
  const [globalSettings, setGlobalSettings] = useState<MotionGlobalSettings>(
    DEFAULT_GLOBAL_SETTINGS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotionConfig = async () => {
      try {
        const token = localStorage.getItem("velocity_token");
        
        // Fetch global settings
        const globalRes = await fetch("/api/admin/motion-settings/global", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (globalRes.ok) {
          const data = await globalRes.json();
          setGlobalSettings(data);
        }

        // Fetch card-specific config
        const cardRes = await fetch(`/api/admin/motion-settings/${cardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cardRes.ok) {
          const data = await cardRes.json();
          setConfig(data);
        } else {
          // Fallback: create default config
          setConfig({
            cardId,
            preset: globalSettings.defaultPreset,
            enabled: globalSettings.enabled,
            intensity: globalSettings.defaultIntensity,
            clickThrough: "detail",
          });
        }
      } catch (error) {
        console.error("Failed to fetch motion config:", error);
        setConfig({
          cardId,
          preset: globalSettings.defaultPreset,
          enabled: globalSettings.enabled,
          intensity: globalSettings.defaultIntensity,
          clickThrough: "detail",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMotionConfig();
  }, [cardId, globalSettings]);

  // Compute animation class and styles
  const animationClass = useMemo(() => {
    if (!config || !config.enabled || config.preset === "none") return "";
    
    const preset = MOTION_PRESETS[config.preset];
    if (!preset) return "";
    
    return preset.className;
  }, [config]);

  // Compute animation duration with intensity multiplier
  const animationDuration = useMemo(() => {
    if (!config || !config.enabled || config.preset === "none") return 0;
    
    const preset = MOTION_PRESETS[config.preset];
    if (!preset) return 0;
    
    const intensity = config.intensity || "moderate";
    const multiplier = INTENSITY_MULTIPLIERS[intensity];
    
    return preset.duration / multiplier;
  }, [config]);

  // Compute color for animation
  const animationColor = useMemo(() => {
    if (!config) return MOTION_COLORS.auto;
    
    const colorKey = config.color || "auto";
    return MOTION_COLORS[colorKey as keyof typeof MOTION_COLORS] || MOTION_COLORS.auto;
  }, [config]);

  return {
    config,
    globalSettings,
    loading,
    isEnabled: config?.enabled ?? globalSettings.enabled,
    preset: config?.preset ?? globalSettings.defaultPreset,
    animationClass,
    animationDuration,
    animationColor,
    intensity: config?.intensity ?? globalSettings.defaultIntensity,
    clickThrough: config?.clickThrough ?? "none",
    targetPath: config?.targetPath,
  };
}

/**
 * Hook to update motion configuration for a card
 */
export function useMotionConfigUpdate() {
  const [saving, setSaving] = useState(false);

  const updateConfig = async (cardId: string, config: Partial<MotionConfig>) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const response = await fetch(`/api/admin/motion-settings/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update motion config");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating motion config:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return { updateConfig, saving };
}
