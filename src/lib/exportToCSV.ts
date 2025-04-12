import { unparse } from 'papaparse';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';
import { format } from 'date-fns';

export function exportToCSV(messages: WhatsAppMessage[]): void {
  // Format data with consistent date formats
  const formattedMessages = messages.map(msg => ({
    Date: format(msg.timestamp, 'yyyy-MM-dd'),
    Time: format(msg.timestamp, 'HH:mm:ss'),
    Sender: msg.sender,
    Currency: SUPPORTED_CURRENCIES[msg.currency].name,
    'Amount': msg.amount.toFixed(2),
    'Full Message': msg.content
  }));

  // Calculate currency totals for metadata
  const currencyTotals = messages.reduce((acc, msg) => {
    const currency = msg.currency;
    if (!acc[currency]) {
      acc[currency] = 0;
    }
    acc[currency] += msg.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create metadata rows
  const metadata = [
    ['WhatsApp Payment Records'],
    [`Generated on: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`],
    [''],
    ['Summary:'],
    ...Object.entries(currencyTotals).map(([currency, total]) => {
      const currencyInfo = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
      return [`Total ${currencyInfo.name}: ${currencyInfo.symbol}${total.toFixed(2)}`];
    }),
    [''],
    ['Transaction Details:'],
    ['']
  ];

  // Combine metadata with CSV content
  const csv = unparse(metadata, {
    header: false,
    delimiter: ',',
  }) + '\n' + unparse(formattedMessages, {
    header: true,
    delimiter: ',',
    columns: ['Date', 'Time', 'Sender', 'Currency', 'Amount', 'Full Message']
  });

  // Generate filename with date
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = `whatsapp-payments-${dateStr}.csv`;

  // Create and trigger download
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel UTF-8 compatibility
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
}