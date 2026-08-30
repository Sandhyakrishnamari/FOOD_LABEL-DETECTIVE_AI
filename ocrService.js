/**
 * Client-Side Offline OCR Service using Tesseract.js
 * Enables 100% offline text extraction directly in the browser.
 */

import { createWorker } from 'tesseract.js';

let ocrWorker = null;

export async function performOfflineOCR(imageSource, onProgress = null) {
  try {
    if (!ocrWorker) {
      if (onProgress) onProgress({ status: 'Initializing OCR Engine...', progress: 0.1 });
      ocrWorker = await createWorker('eng');
    }

    if (onProgress) onProgress({ status: 'Scanning fine print & extracting text...', progress: 0.4 });

    const ret = await ocrWorker.recognize(imageSource);
    
    if (onProgress) onProgress({ status: 'OCR Complete', progress: 1.0 });

    return {
      text: ret.data.text || '',
      confidence: ret.data.confidence || 0,
      words: ret.data.words || []
    };
  } catch (error) {
    console.error('Offline OCR Error:', error);
    throw new Error(`Offline OCR failed: ${error.message || error}`);
  }
}

export async function terminateOCRWorker() {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
}
