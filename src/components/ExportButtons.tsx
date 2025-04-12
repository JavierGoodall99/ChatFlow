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
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="relative">
          <Button
            onClick={handlePDFExport}
            disabled={disabled || messages.length === 0 || isPdfLoading}
            variant="outline"
            className="min-w-[140px] transition-all"
          >
            {isPdfLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Exporting
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                Export to PDF
              </span>
            )}
          </Button>
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 opacity-0 group-hover:opacity-100">
            Professional formatted document
          </div>
        </div>
      </div>

      {lastExported && (
        <div className="text-center animate-fade-in-down">
          <p className="text-sm text-green-600 bg-green-50 py-2 px-4 rounded-md inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Successfully exported as {lastExported}
          </p>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
        <p>
          Files are saved locally and include transaction summaries. No data is sent to any server.
        </p>
      </div>
    </div>
  );
}