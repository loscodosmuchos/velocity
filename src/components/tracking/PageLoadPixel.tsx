import { useEffect } from 'react';

interface PageLoadPixelProps {
  page: string;
}

export function PageLoadPixel({ page }: PageLoadPixelProps) {
  useEffect(() => {
    const img = new Image();
    img.src = `/api/tracking/pixel.png?page=${encodeURIComponent(page)}&t=${Date.now()}`;
    img.style.display = 'none';
    document.body.appendChild(img);
    
    return () => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };
  }, [page]);

  return null;
}
