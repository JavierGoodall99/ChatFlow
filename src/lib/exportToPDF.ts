import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';

export function exportToPDF(messages: WhatsAppMessage[]): void {
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(16);
  doc.text('WhatsApp Payment Messages', 20, 20);
  
  // Set up table headers
  doc.setFontSize(12);
  const startY = 30;
  
  // Format data for table
  const data = messages.map(msg => [
    msg.timestamp.toLocaleDateString(),
    msg.sender,
    `${SUPPORTED_CURRENCIES[msg.currency].symbol} ${msg.amount.toFixed(2)}`,
    msg.content.length > 40 ? msg.content.substring(0, 37) + '...' : msg.content
  ]);
  
  // Calculate column widths
  const columns = [
    { header: 'Date', width: 25 },
    { header: 'Sender', width: 40 },
    { header: 'Amount', width: 25 },
    { header: 'Message', width: 100 }
  ];
  
  let currentY = startY;
  
  // Draw headers
  columns.forEach((col, i) => {
    let x = 20;
    columns.slice(0, i).forEach(c => x += c.width);
    doc.text(col.header, x, currentY);
  });
  
  currentY += 10;
  
  // Draw data rows
  data.forEach(row => {
    if (currentY > 270) { // Check if we need a new page
      doc.addPage();
      currentY = startY;
    }
    
    let x = 20;
    row.forEach((cell, i) => {
      doc.text(String(cell), x, currentY);
      x += columns[i].width;
    });
    
    currentY += 7;
  });
  
  // Save the PDF
  doc.save('whatsapp-payments.pdf');
}