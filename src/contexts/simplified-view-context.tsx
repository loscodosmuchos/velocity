import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router';

interface PageData {
  title: string;
  section: string;
  metrics?: Array<{ label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }>;
  items?: Array<{ id: string; name: string; status?: string; value?: string | number }>;
  actions?: string[];
  alerts?: Array<{ type: 'warning' | 'error' | 'info' | 'success'; message: string }>;
}

interface SimplifiedViewContextType {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  pageData: PageData | null;
  setPageData: (data: PageData) => void;
  width: number;
  setWidth: (width: number) => void;
}

const SimplifiedViewContext = createContext<SimplifiedViewContextType | undefined>(undefined);

export function SimplifiedViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem('simplifiedViewOpen');
    return stored === 'true';
  });
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [width, setWidth] = useState(() => {
    const stored = localStorage.getItem('simplifiedViewWidth');
    return stored ? parseInt(stored) : 320;
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('simplifiedViewOpen', String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('simplifiedViewWidth', String(width));
  }, [width]);

  useEffect(() => {
    setPageData(null);
  }, [location.pathname]);

  const toggle = () => setIsOpen(!isOpen);
  const setOpen = (open: boolean) => setIsOpen(open);

  return (
    <SimplifiedViewContext.Provider value={{ 
      isOpen, 
      toggle, 
      setOpen, 
      pageData, 
      setPageData,
      width,
      setWidth
    }}>
      {children}
    </SimplifiedViewContext.Provider>
  );
}

export function useSimplifiedView() {
  const context = useContext(SimplifiedViewContext);
  if (!context) {
    throw new Error('useSimplifiedView must be used within SimplifiedViewProvider');
  }
  return context;
}
