"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { applySaturationToDom, interpolateSaturation } from "@/lib/saturation-utils";

type SaturationContextType = {
  saturation: number;
  setSaturation: (value: number) => void;
  increaseSaturation: () => void;
  decreaseSaturation: () => void;
  resetSaturation: () => void;
};

const initialState: SaturationContextType = {
  saturation: 0.7,
  setSaturation: () => null,
  increaseSaturation: () => null,
  decreaseSaturation: () => null,
  resetSaturation: () => null,
};

const SaturationContext = createContext<SaturationContextType>(initialState);

const SATURATION_STORAGE_KEY = "velocity-ui-saturation";
const SATURATION_STEP = 0.1;
const MIN_SATURATION = 0.2;
const MAX_SATURATION = 1.0;

type SaturationProviderProps = {
  children: ReactNode;
  defaultSaturation?: number;
};

export function SaturationProvider({
  children,
  defaultSaturation = 0.7,
}: SaturationProviderProps) {
  const [saturation, setSaturationState] = useState<number>(() => {
    if (typeof window === "undefined") return defaultSaturation;
    const stored = localStorage.getItem(SATURATION_STORAGE_KEY);
    return stored ? parseFloat(stored) : defaultSaturation;
  });

  useEffect(() => {
    const clampedValue = interpolateSaturation(saturation, MIN_SATURATION, MAX_SATURATION);
    localStorage.setItem(SATURATION_STORAGE_KEY, String(clampedValue));
    applySaturationToDom(clampedValue);
  }, [saturation]);

  const setSaturation = (value: number) => {
    const clampedValue = interpolateSaturation(value, MIN_SATURATION, MAX_SATURATION);
    setSaturationState(clampedValue);
  };

  const increaseSaturation = () => {
    setSaturation(saturation + SATURATION_STEP);
  };

  const decreaseSaturation = () => {
    setSaturation(saturation - SATURATION_STEP);
  };

  const resetSaturation = () => {
    setSaturation(defaultSaturation);
  };

  const value: SaturationContextType = {
    saturation,
    setSaturation,
    increaseSaturation,
    decreaseSaturation,
    resetSaturation,
  };

  return (
    <SaturationContext.Provider value={value}>
      {children}
    </SaturationContext.Provider>
  );
}

export function useSaturation() {
  const context = useContext(SaturationContext);
  if (context === undefined) {
    console.warn("useSaturation must be used within a SaturationProvider");
  }
  return context;
}
