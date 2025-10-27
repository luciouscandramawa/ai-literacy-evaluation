import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import * as mammoth from 'mammoth';

// Set the worker source for pdf.js to use the CDN version.
// This is required for the library to work correctly in a web environment.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

/**
 * Extracts all text content from a given PDF file.
 * @param file The PDF file object to process.
 * @returns A promise that resolves to a single string containing all the text from the PDF.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document from the array buffer.
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  // Iterate through each page of the PDF.
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Join the text items from the page content.
    const pageText = textContent.items.map(item => (item as TextItem).str).join(' ');
    fullText += pageText + '\n\n'; // Add newlines between pages for readability
  }
  
  return fullText.trim();
};

/**
 * Extracts text content from a .docx file.
 * @param file The DOCX file object to process.
 * @returns A promise that resolves to a string containing the text from the document.
 */
export const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};