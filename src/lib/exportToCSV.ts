import { unparse } from 'papaparse';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';

export function exportToCSV(messages: WhatsAppMessage[]): void {
  const data = messages.map(msg => ({
    Date: msg.timestamp.toLocaleDateString(),
    Time: msg.timestamp.toLocaleTimeString(),
    Sender: msg.sender,
    Amount: msg.amount.toFixed(2),
    Currency: msg.currency,
    'Currency Symbol': SUPPORTED_CURRENCIES[msg.currency].symbol,
    Message: msg.content
  }));

  const csv = unparse(data, {
    header: true,
    delimiter: ',',
  });

  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'whatsapp-payments.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}