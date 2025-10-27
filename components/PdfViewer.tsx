import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import PdfPage from './PdfPage';
import LoadingSpinner from './LoadingSpinner';

interface PdfViewerProps {
  file: File;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      setPdf(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
        setPdf(pdfDoc);
      } catch (e) {
        console.error("Failed to load PDF", e);
        setError("Could not load the PDF file. It may be corrupted or in an unsupported format.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [file]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-700/50 rounded-md">
        <LoadingSpinner />
        <p className="mt-4 text-gray-400">Loading PDF preview...</p>
      </div>
    );
  }
  
  if (error) {
     return (
        <div className="flex items-center justify-center h-96 bg-red-900/50 rounded-md p-4 text-center">
            <p className="text-red-300">{error}</p>
        </div>
    );
  }

  if (!pdf) {
    return null;
  }

  return (
    <div className="space-y-4 bg-gray-900 p-2 sm:p-4 rounded-md">
      {Array.from(new Array(pdf.numPages), (el, index) => (
        <PdfPage key={`page_${index + 1}`} pdf={pdf} pageNumber={index + 1} />
      ))}
    </div>
  );
};

export default PdfViewer;