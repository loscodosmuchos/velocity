import { useState, useCallback } from "react";

export interface OCRWord {
  id: string;
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface OCRResult {
  fullText: string;
  words: OCRWord[];
  confidence: number;
}

export function useOCR() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performOCR = useCallback(async (imageUrl: string, minConfidence = 60): Promise<OCRResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tesseract: any = await import("tesseract.js");
      const result = await Tesseract.recognize(imageUrl, "eng");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const words = (result.data.words || [])
        .filter((w: any) => w.confidence > minConfidence)
        .map((w: any, idx: number) => ({
          id: `word-${idx}`,
          text: w.text,
          confidence: w.confidence,
          x: w.bbox.x0,
          y: w.bbox.y0,
          width: w.bbox.x1 - w.bbox.x0,
          height: w.bbox.y1 - w.bbox.y0,
          color: ["cyan", "blue", "purple", "pink", "amber", "emerald"][idx % 6] + "-400",
        }));

      return {
        fullText: result.data.text,
        words,
        confidence: result.data.confidence || 0,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "OCR processing failed";
      setError(errorMsg);
      console.error("OCR Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { performOCR, loading, error };
}
