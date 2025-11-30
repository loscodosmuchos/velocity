import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useAIGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (userPrompt: string, systemPrompt?: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt,
          systemPrompt: systemPrompt || "You are a helpful assistant.",
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Generation failed";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateContent, loading, error };
}
