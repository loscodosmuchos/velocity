const fs = require('fs');

async function parsePDF(pdfBuffer) {
  console.log('🔵 Parsing PDF...');
  console.log('📊 Buffer size:', pdfBuffer.length, 'bytes');

  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true
    });

    const pdf = await loadingTask.promise;
    console.log('✅ PDF loaded successfully');
    console.log('📊 Pages:', pdf.numPages);

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    }

    console.log('✅ PDF parsing complete');
    console.log('📊 Total text extracted:', fullText.length, 'characters');

    return fullText;

  } catch (error) {
    console.error('❌ PDF parsing failed:', error.message);
    console.error('📊 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    
    throw new Error(`PDF parsing failed: ${error.message}. Please ensure the file is a valid PDF and try again.`);
  }
}

module.exports = { parsePDF };
