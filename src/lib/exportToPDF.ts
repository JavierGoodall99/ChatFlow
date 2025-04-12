import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';
import { format } from 'date-fns';

export function exportToPDF(messages: WhatsAppMessage[]): void {
  // Create PDF document in portrait mode
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document metadata
  doc.setProperties({
    title: 'WhatsApp Payment Records',
    subject: 'Payment Messages',
    author: 'WhatsApp Receipt Cleaner',
    keywords: 'whatsapp, payments, records',
    creator: 'WhatsApp Receipt Cleaner'
  });
  
  // Add document title
  doc.setFillColor(39, 39, 42); // Zinc-800
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('WhatsApp Payment Records', 10, 13);
  
  // Add export date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const exportDate = format(new Date(), "MMMM d, yyyy 'at' h:mm a");
  doc.text(`Generated on ${exportDate}`, doc.internal.pageSize.width - 15, 13, { align: 'right' });
  
  // Set up table settings
  const startY = 30;
  const margin = 10;
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = pageWidth - (margin * 2);
  
  // Calculate column widths based on table width
  const columns = [
    { header: 'Date', width: tableWidth * 0.20 },
    { header: 'Sender', width: tableWidth * 0.25 },
    { header: 'Amount', width: tableWidth * 0.15 },
    { header: 'Message', width: tableWidth * 0.40 }
  ];
  
  // Calculate totals by currency
  const totals: Record<string, number> = {};
  messages.forEach(msg => {
    if (!totals[msg.currency]) {
      totals[msg.currency] = 0;
    }
    totals[msg.currency] += msg.amount;
  });
  
  // Format data for table
  const data = messages.map(msg => [
    format(msg.timestamp, 'dd MMM yyyy'),
    msg.sender,
    `${SUPPORTED_CURRENCIES[msg.currency].symbol}${msg.amount.toFixed(2)}`,
    msg.content.length > 50 ? msg.content.substring(0, 47) + '...' : msg.content
  ]);
  
  let currentY = startY;
  
  // Table header style
  doc.setFillColor(243, 244, 246); // Gray-100
  doc.rect(margin, currentY - 6, tableWidth, 8, 'F');
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.line(margin, currentY - 6, margin + tableWidth, currentY - 6);
  doc.line(margin, currentY + 2, margin + tableWidth, currentY + 2);
  
  // Draw headers
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  let xPos = margin;
  columns.forEach(col => {
    doc.text(col.header, xPos + 1, currentY);
    xPos += col.width;
  });
  
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Draw data rows
  data.forEach((row, i) => {
    // Check if we need a new page
    if (currentY > doc.internal.pageSize.height - 25) {
      doc.addPage();
      // Add light header to new page
      doc.setFillColor(243, 244, 246); // Gray-100
      doc.rect(margin, 10, tableWidth, 8, 'F');
      doc.setDrawColor(229, 231, 235); // Gray-200
      doc.line(margin, 10, margin + tableWidth, 10);
      doc.line(margin, 18, margin + tableWidth, 18);
      
      doc.setTextColor(17, 24, 39); // Gray-900
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      
      let headerX = margin;
      columns.forEach(col => {
        doc.text(col.header, headerX + 1, 16);
        headerX += col.width;
      });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      currentY = 25;
    }

    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251); // Gray-50
      doc.rect(margin, currentY - 4, tableWidth, 7, 'F');
    }
    
    // Draw row content
    let x = margin;
    row.forEach((cell, j) => {
      const color = j === 2 ? [5, 150, 105] as const : [55, 65, 81] as const;
      doc.setTextColor(color[0], color[1], color[2]); // Green-700 for amounts, Gray-700 for other text
      doc.text(String(cell), x + 1, currentY);
      x += columns[j].width;
    });
    
    currentY += 7;
  });

  // Add totals section
  currentY += 5;
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.line(margin, currentY - 2, margin + tableWidth, currentY - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text('Summary', margin, currentY + 5);

  currentY += 10;
  doc.setFont('helvetica', 'normal');
  
  // Display totals by currency
  Object.entries(totals).forEach(([currency, amount]) => {
    const symbol = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].symbol;
    const currencyName = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].name;
    
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text(`Total ${currencyName}:`, margin, currentY);
    
    doc.setTextColor(5, 150, 105); // Green-700
    doc.setFont('helvetica', 'bold');
    doc.text(`${symbol}${amount.toFixed(2)}`, margin + 60, currentY);
    
    currentY += 7;
  });
  
  // Add footer with page numbers
  const pageCount = doc.internal.pages.length - 1;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128); // Gray-500
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount} | Generated by WhatsApp Receipt Cleaner`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Generate filename with date
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = `whatsapp-payments-${dateStr}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}