'use client';

import { Button } from '@/components/ui/button';
import { WhatsAppMessage } from '@/lib/parseChat';

interface ExportButtonsProps {
  messages: WhatsAppMessage[];
  disabled?: boolean;
}

export function ExportButtons({ messages, disabled }: ExportButtonsProps) {
  const handlePDFExport = async () => {
    const { exportToPDF } = await import('@/lib/exportToPDF');
    exportToPDF(messages);
  };

  const handleCSVExport = async () => {
    const { exportToCSV } = await import('@/lib/exportToCSV');
    exportToCSV(messages);
  };

  return (
    <div className="flex gap-4 justify-center mt-6">
      <Button
        onClick={handlePDFExport}
        disabled={disabled || messages.length === 0}
        variant="outline"
      >
        Export to PDF
      </Button>
      <Button
        onClick={handleCSVExport}
        disabled={disabled || messages.length === 0}
        variant="outline"
      >
        Export to CSV
      </Button>
    </div>
  );
}