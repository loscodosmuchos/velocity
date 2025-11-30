import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LayoutMode = 'expanded' | 'fixed';

interface LayoutModeContextType {
  layoutMode: LayoutMode;
  toggleLayoutMode: () => void;
  setLayoutMode: (mode: LayoutMode) => void;
  contentClasses: string;
}

const LayoutModeContext = createContext<LayoutModeContextType | undefined>(undefined);

export function LayoutModeProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    const stored = localStorage.getItem('layoutMode');
    return (stored as LayoutMode) || 'expanded';
  });

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === 'expanded' ? 'fixed' : 'expanded');
  };

  const contentClasses = layoutMode === 'expanded' 
    ? 'w-full' 
    : 'max-w-7xl mx-auto';

  return (
    <LayoutModeContext.Provider value={{ layoutMode, toggleLayoutMode, setLayoutMode, contentClasses }}>
      {children}
    </LayoutModeContext.Provider>
  );
}

export function useLayoutMode() {
  const context = useContext(LayoutModeContext);
  if (!context) {
    throw new Error('useLayoutMode must be used within LayoutModeProvider');
  }
  return context;
}
