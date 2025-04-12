'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMessage } from '@/lib/parseChat';

interface ExportButtonsProps {
  messages: WhatsAppMessage[];
  disabled?: boolean;
}

export function ExportButtons({ messages, disabled }: ExportButtonsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const handlePDFExport = async () => {
    try {
      setIsPdfLoading(true);
      const { exportToPDF } = await import('@/lib/exportToPDF');
      await exportToPDF(messages);
      setLastExported('PDF');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 pt-8 border-t border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Export Your Data</h2>
        <p className="text-gray-500 text-sm">
          Download your payment records as a professionally formatted PDF
        </p>
      </div>
      
      <div className="flex justify-center">
        {/* PDF Export Option */}
        <div className="w-full max-w-sm bg-white p-5 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="flex items-start mb-4">
            <div className="bg-red-50 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">PDF Document</h3>
              <p className="text-sm text-gray-500">Professional format with transaction summary</p>
            </div>
          </div>
          
          <Button
            onClick={handlePDFExport}
            disabled={disabled || messages.length === 0 || isPdfLoading}
            variant="outline"
            className="w-full group-hover:border-red-200 group-hover:bg-red-50 transition-all"
          >
            {isPdfLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Exporting...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Export as PDF</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>

      {lastExported && (
        <div className="text-center mt-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 py-2 px-4 rounded-full border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Successfully exported as PDF</span>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 max-w-md mx-auto mt-6">
        <div className="flex justify-center items-center gap-2 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Files are processed entirely in your browser</span>
        </div>
        <p>
          Your PDF includes a detailed transaction summary and is saved locally on your device.
        </p>
      </div>
    </div>
  );
}