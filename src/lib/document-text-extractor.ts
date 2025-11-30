import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface ExtractionResult {
  text: string;
  pageCount?: number;
  method: 'pdf' | 'text' | 'ocr';
  success: boolean;
  error?: string;
}

export async function extractTextFromPDF(file: File): Promise<ExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: unknown) => (item as { str: string }).str)
        .join(' ');
      textParts.push(pageText);
    }
    
    const fullText = textParts.join('\n\n');
    
    return {
      text: fullText,
      pageCount: pdf.numPages,
      method: 'pdf',
      success: true,
    };
  } catch (error) {
    return {
      text: '',
      method: 'pdf',
      success: false,
      error: error instanceof Error ? error.message : 'PDF extraction failed',
    };
  }
}

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }

  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    try {
      const text = await file.text();
      return {
        text,
        method: 'text',
        success: true,
      };
    } catch (error) {
      return {
        text: '',
        method: 'text',
        success: false,
        error: 'Failed to read text file',
      };
    }
  }

  if (fileType.startsWith('image/')) {
    return {
      text: '',
      method: 'ocr',
      success: false,
      error: 'USE_OCR',
    };
  }

  return {
    text: '',
    method: 'text',
    success: false,
    error: `Unsupported file type: ${fileType || fileName.split('.').pop()}`,
  };
}
