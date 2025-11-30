import { useState, useEffect, useCallback } from 'react';

export type TextureId = 
  | 'carbon-fiber-bg'
  | 'carbon-fiber-luxe'
  | 'velocity-dashboard-shell'
  | 'racing-carbon'
  | 'genesis-premium'
  | 'electric-blue'
  | 'default';

const STORAGE_KEY = 'velocity-texture';

export const textureStyles: Record<TextureId, React.CSSProperties> = {
  'default': {
    background: `
      linear-gradient(135deg, #05070a 0%, #0a0f18 25%, #0d1420 50%, #0a0f18 75%, #05070a 100%),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(6, 182, 212, 0.015) 2px, rgba(6, 182, 212, 0.015) 4px),
      repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(59, 130, 246, 0.01) 2px, rgba(59, 130, 246, 0.01) 4px)
    `,
    minHeight: '100vh',
  },
  'carbon-fiber-bg': {
    backgroundColor: '#0d1117',
    backgroundImage: `
      linear-gradient(135deg, transparent 0%, rgba(100, 180, 255, 0.02) 25%, transparent 50%, rgba(100, 180, 255, 0.015) 75%, transparent 100%),
      linear-gradient(27deg, #0f1419 5px, transparent 5px),
      linear-gradient(207deg, #0f1419 5px, transparent 5px),
      linear-gradient(27deg, #151b23 5px, transparent 5px),
      linear-gradient(207deg, #151b23 5px, transparent 5px),
      linear-gradient(90deg, #0c1015 10px, transparent 10px),
      linear-gradient(#0e1318 25%, #0c1015 25%, #0c1015 50%, transparent 50%, transparent 75%, #131921 75%, #131921)
    `,
    backgroundSize: '100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px, 20px 20px, 20px 20px',
    backgroundPosition: '0 0, 0 5px, 10px 0, 0 10px, 10px 5px, 0 0, 0 0',
    minHeight: '100vh',
  },
  'carbon-fiber-luxe': {
    backgroundColor: '#0a0e12',
    backgroundImage: `
      radial-gradient(ellipse at top left, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.02) 0%, transparent 50%),
      repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(255, 255, 255, 0.008) 1px, rgba(255, 255, 255, 0.008) 2px),
      linear-gradient(27deg, #0c1117 4px, transparent 4px),
      linear-gradient(207deg, #0c1117 4px, transparent 4px),
      linear-gradient(27deg, #111920 4px, transparent 4px),
      linear-gradient(207deg, #111920 4px, transparent 4px),
      linear-gradient(90deg, #0a0f14 8px, transparent 8px),
      linear-gradient(#0c1117 25%, #0a0e12 25%, #0a0e12 50%, transparent 50%, transparent 75%, #0f151c 75%, #0f151c)
    `,
    backgroundSize: '100% 100%, 100% 100%, 3px 3px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px',
    backgroundPosition: '0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0',
    minHeight: '100vh',
  },
  'velocity-dashboard-shell': {
    backgroundColor: '#0a0e12',
    backgroundImage: `
      radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%),
      linear-gradient(180deg, rgba(6, 182, 212, 0.02) 0%, transparent 15%),
      linear-gradient(27deg, #0c1117 4px, transparent 4px),
      linear-gradient(207deg, #0c1117 4px, transparent 4px),
      linear-gradient(27deg, #111920 4px, transparent 4px),
      linear-gradient(207deg, #111920 4px, transparent 4px),
      linear-gradient(90deg, #0a0f14 8px, transparent 8px),
      linear-gradient(#0c1117 25%, #0a0e12 25%, #0a0e12 50%, transparent 50%, transparent 75%, #0f151c 75%, #0f151c)
    `,
    backgroundSize: '100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px',
    backgroundPosition: '0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  },
  'racing-carbon': {
    backgroundColor: '#080a0c',
    backgroundImage: `
      radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.04) 0%, transparent 40%),
      radial-gradient(ellipse at 70% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 35%),
      linear-gradient(27deg, #0a0d10 4px, transparent 4px),
      linear-gradient(207deg, #0a0d10 4px, transparent 4px),
      linear-gradient(27deg, #0e1216 4px, transparent 4px),
      linear-gradient(207deg, #0e1216 4px, transparent 4px),
      linear-gradient(90deg, #080b0e 8px, transparent 8px),
      linear-gradient(#0a0d10 25%, #080a0c 25%, #080a0c 50%, transparent 50%, transparent 75%, #0c1014 75%, #0c1014)
    `,
    backgroundSize: '100% 100%, 100% 100%, 14px 14px, 14px 14px, 14px 14px, 14px 14px, 14px 14px, 14px 14px',
    backgroundPosition: '0 0, 0 0, 0 4px, 7px 0, 0 7px, 7px 4px, 0 0, 0 0',
    minHeight: '100vh',
  },
  'genesis-premium': {
    backgroundColor: '#0b0d10',
    backgroundImage: `
      radial-gradient(ellipse at 15% 10%, rgba(244, 114, 182, 0.025) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 90%, rgba(168, 162, 158, 0.02) 0%, transparent 40%),
      linear-gradient(45deg, transparent 48%, rgba(244, 114, 182, 0.008) 50%, transparent 52%),
      linear-gradient(27deg, #0c0f13 4px, transparent 4px),
      linear-gradient(207deg, #0c0f13 4px, transparent 4px),
      linear-gradient(27deg, #10141a 4px, transparent 4px),
      linear-gradient(207deg, #10141a 4px, transparent 4px),
      linear-gradient(90deg, #090c0f 8px, transparent 8px),
      linear-gradient(#0c0f13 25%, #0b0d10 25%, #0b0d10 50%, transparent 50%, transparent 75%, #0e1218 75%, #0e1218)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px',
    backgroundPosition: '0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0',
    minHeight: '100vh',
  },
  'electric-blue': {
    backgroundColor: '#080c12',
    backgroundImage: `
      radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.045) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 45%),
      linear-gradient(135deg, transparent 40%, rgba(59, 130, 246, 0.01) 50%, transparent 60%),
      linear-gradient(27deg, #0a0e14 4px, transparent 4px),
      linear-gradient(207deg, #0a0e14 4px, transparent 4px),
      linear-gradient(27deg, #0e131c 4px, transparent 4px),
      linear-gradient(207deg, #0e131c 4px, transparent 4px),
      linear-gradient(90deg, #080b10 8px, transparent 8px),
      linear-gradient(#0a0e14 25%, #080c12 25%, #080c12 50%, transparent 50%, transparent 75%, #0c1118 75%, #0c1118)
    `,
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px, 16px 16px',
    backgroundPosition: '0 0, 0 0, 0 0, 0 4px, 8px 0, 0 8px, 8px 4px, 0 0, 0 0',
    minHeight: '100vh',
  },
};

export function useTexturePreference() {
  const [textureId, setTextureId] = useState<TextureId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in textureStyles) {
        return stored as TextureId;
      }
    }
    return 'default';
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (e.newValue in textureStyles) {
          setTextureId(e.newValue as TextureId);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent<TextureId>) => {
      setTextureId(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('texture-change' as any, handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('texture-change' as any, handleCustomEvent as EventListener);
    };
  }, []);

  const setTexture = useCallback((id: TextureId) => {
    localStorage.setItem(STORAGE_KEY, id);
    setTextureId(id);
    window.dispatchEvent(new CustomEvent('texture-change', { detail: id }));
  }, []);

  const textureStyle = textureStyles[textureId] || textureStyles['default'];

  return {
    textureId,
    setTexture,
    textureStyle,
  };
}
