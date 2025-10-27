import React, { useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

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
        const viewport = page.getViewport({ scale });
        
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = `${viewport.width / scale}px`;
        canvas.style.height = `${viewport.height / scale}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
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
