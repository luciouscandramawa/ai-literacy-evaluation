import React, { useEffect, useRef } from 'react';
// Fix: Import PageViewport and PDFDocumentProxy from the main 'pdfjs-dist' package instead of the internal path.
import type { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
}

const PdfPage: React.FC<PdfPageProps> = ({ pdf, pageNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;
    
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas || isCancelled) return;

        // Adjust scale for high-resolution displays
        const scale = window.devicePixelRatio || 1;
        const viewport: PageViewport = page.getViewport({ scale });
        
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = `${viewport.width / scale}px`;
        canvas.style.height = `${viewport.height / scale}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          // The type definitions for pdfjs-dist included in this project seem to be incorrect, 
          // requiring a 'canvas' property on RenderParameters even when 'canvasContext' is provided.
          // We add it here to satisfy the TypeScript compiler; it is ignored by the pdf.js runtime.
          canvas: canvas,
        };
        await page.render(renderContext).promise;
      } catch (error) {
        console.error(`Failed to render page ${pageNumber}`, error);
      }
    };

    renderPage();
    
    return () => {
      isCancelled = true;
    };

  }, [pdf, pageNumber]);

  return <canvas ref={canvasRef} className="w-full h-auto shadow-lg rounded-md" />;
};

export default PdfPage;