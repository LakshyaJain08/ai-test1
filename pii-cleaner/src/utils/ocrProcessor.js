// OCR Processing Utilities
import Tesseract from 'tesseract.js';

/**
 * Handles OCR processing for images and documents
 */
export class OCRProcessor {
  constructor() {
    this.worker = null;
  }

  /**
   * Initialize the Tesseract worker
   */
  async initialize() {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('eng');
    }
    return this.worker;
  }

  /**
   * Extract text from an image file
   * @param {File|string} imageSource - Image file or URL
   * @param {Function} progressCallback - Progress callback function
   * @returns {Promise<string>} - Extracted text
   */
  async extractTextFromImage(imageSource, progressCallback = null) {
    try {
      await this.initialize();
      
      const { data: { text } } = await this.worker.recognize(imageSource, {
        logger: progressCallback ? (m) => {
          if (m.status === 'recognizing text') {
            progressCallback(m.progress * 100);
          }
        } : undefined
      });
      
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image: ' + error.message);
    }
  }

  /**
   * Extract text from a PDF file
   * @param {File} pdfFile - PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async extractTextFromPDF(pdfFile) {
    try {
      // Using pdf.js to render PDF pages as images, then OCR them
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Extract text from canvas using OCR
        const pageText = await this.extractTextFromImage(canvas.toDataURL());
        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF OCR Error:', error);
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  /**
   * Process various file types
   * @param {File} file - File to process
   * @param {Function} progressCallback - Progress callback
   * @returns {Promise<string>} - Extracted text
   */
  async processFile(file, progressCallback = null) {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return await this.extractTextFromImage(file, progressCallback);
    } else if (fileType === 'application/pdf') {
      return await this.extractTextFromPDF(file);
    } else {
      throw new Error('Unsupported file type. Please upload an image or PDF file.');
    }
  }

  /**
   * Cleanup resources
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}
