import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ProjectDocument {
  id: number;
  original_filename: string;
  document_type: string;
  status: string;
  mime_type: string;
  file_size_bytes: number;
  created_at: string;
  updated_at: string;
  analysis_summary?: string;
  extracted_text?: string;
}

export function useDocumentFetch() {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async (params?: { start?: number; end?: number; sort?: string; order?: string }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("velocity_token");
      const start = params?.start ?? 0;
      const end = params?.end ?? 100;
      const sort = params?.sort ?? "created_at";
      const order = params?.order ?? "DESC";

      const response = await fetch(
        `/api/project-documents?_start=${start}&_end=${end}&_sort=${sort}&_order=${order}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        return data;
      } else {
        toast.error("Failed to load documents");
        return [];
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error loading documents");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, loading, fetchDocuments, setDocuments };
}
