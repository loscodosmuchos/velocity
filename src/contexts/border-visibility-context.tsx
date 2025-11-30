import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BorderVisibilityContextType {
  showCardBorders: boolean;
  toggleCardBorders: () => void;
  setShowCardBorders: (show: boolean) => void;
}

const BorderVisibilityContext = createContext<BorderVisibilityContextType | undefined>(undefined);

export function BorderVisibilityProvider({ children }: { children: ReactNode }) {
  const [showCardBorders, setShowCardBorders] = useState(() => {
    const stored = localStorage.getItem('showCardBorders');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('showCardBorders', String(showCardBorders));
  }, [showCardBorders]);

  const toggleCardBorders = () => setShowCardBorders(!showCardBorders);

  return (
    <BorderVisibilityContext.Provider value={{ showCardBorders, toggleCardBorders, setShowCardBorders }}>
      {children}
    </BorderVisibilityContext.Provider>
  );
}

export function useBorderVisibility() {
  const context = useContext(BorderVisibilityContext);
  if (!context) {
    throw new Error('useBorderVisibility must be used within BorderVisibilityProvider');
  }
  return context;
}

export const CardBorderClasses = {
  visible: 'border border-slate-700/50',
  transparent: 'border-0 [background-clip:padding-box]'
};
