import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';
import { format } from 'date-fns';

// Helper function to clean and encode text for PDF
function sanitizeText(text: string): string {
  // First normalize text to decompose Unicode characters
  return text
    .normalize('NFKD')
    .replace(/[\u0080-\uFFFF]/g, (ch) => {
      // Comprehensive special character mapping
      const specialChars: Record<string, string> = {
        'Ø': 'O',
        'þ': 'th',
        'Þ': 'Th',
        'æ': 'ae',
        'Æ': 'AE',
        'œ': 'oe',
        'Œ': 'OE',
        'ß': 'ss',
        '™': '(TM)',
        '©': '(c)',
        '®': '(R)',
        '°': 'deg',
        '±': '+/-',
        '×': 'x',
        '÷': '/',
        '•': '*',
        '…': '...',
        '—': '-',
        '–': '-',
        "''": "'",
        "'": "'",
        '"': '"',
        '«': '<<',
        '»': '>>',
        '≤': '<=',
        '≥': '>=',
        '≠': '!=',
        '≈': '~',
        '∑': 'sum',
        '∏': 'prod',
        '∂': 'd',
        '∆': 'delta',
        'π': 'pi',
        'µ': 'u',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        '¢': 'c',
        '†': '+',
        '‡': '++',
        '§': 'S',
        '¶': 'P'
      };
      return specialChars[ch] || ch.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    })
    .replace(/[^\x20-\x7E]/g, ''); // Remove any remaining non-printable ASCII chars
}

// Helper function to split text into lines based on available width
function getLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  const sanitizedText = sanitizeText(text);
  const words = sanitizedText.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = doc.getStringUnitWidth(currentLine + ' ' + word) * doc.getFontSize() / doc.internal.scaleFactor;
    
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Initialize PDF document with proper font settings
function initializeDocument(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16 // Increase precision for better text measurement
  });

  // Force embed complete font
  doc.setFont('helvetica', 'normal', 'normal');
  doc.setR2L(false); // Ensure left-to-right text
  doc.setLanguage('en-US');

  return doc;
}

export function exportToPDF(messages: WhatsAppMessage[]): void {
  const doc = initializeDocument();
  
  // Set document metadata
  doc.setProperties({
    title: 'WhatsApp Payment Records',
    subject: 'Payment Messages',
    author: 'WhatsApp Receipt Cleaner',
    keywords: 'whatsapp, payments, records',
    creator: 'WhatsApp Receipt Cleaner'
  });
  
  // Add document title with proper font settings
  doc.setFillColor(39, 39, 42); // Zinc-800
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(sanitizeText('WhatsApp Payment Records'), 10, 13);
  
  // Add export date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const exportDate = format(new Date(), "MMMM d, yyyy 'at' h:mm a");
  doc.text(sanitizeText(`Generated on ${exportDate}`), doc.internal.pageSize.width - 15, 13, { align: 'right' });
  
  // Set up table settings
  const startY = 30;
  const margin = 10;
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = pageWidth - (margin * 2);
  
  // Calculate column widths based on table width
  const columns = [
    { header: 'Date', width: tableWidth * 0.15 },
    { header: 'Sender', width: tableWidth * 0.20 },
    { header: 'Amount', width: tableWidth * 0.15 },
    { header: 'Message', width: tableWidth * 0.50 } // Increased message column width
  ];
  
  // Calculate totals by currency
  const totals: Record<string, number> = {};
  messages.forEach(msg => {
    if (!totals[msg.currency]) {
      totals[msg.currency] = 0;
    }
    totals[msg.currency] += msg.amount;
  });

  let currentY = startY;
  
  // Table header style
  const drawTableHeader = () => {
    doc.setFillColor(243, 244, 246); // Gray-100
    doc.rect(margin, currentY - 6, tableWidth, 8, 'F');
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.line(margin, currentY - 6, margin + tableWidth, currentY - 6);
    doc.line(margin, currentY + 2, margin + tableWidth, currentY + 2);
    
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    
    let xPos = margin;
    columns.forEach(col => {
      doc.text(sanitizeText(col.header), xPos + 1, currentY);
      xPos += col.width;
    });
    
    currentY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  drawTableHeader();

  // Draw data rows
  messages.forEach((msg, i) => {
    // Format row data with sanitized text
    const rowData = [
      format(msg.timestamp, 'dd MMM yyyy'),
      sanitizeText(msg.sender),
      `${SUPPORTED_CURRENCIES[msg.currency].symbol}${msg.amount.toFixed(2)}`,
      sanitizeText(msg.content)
    ];

    // Calculate needed height for message content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const messageLines = getLines(doc, msg.content, columns[3].width - 2);
    const lineHeight = 5; // Standard line height in mm
    const rowHeight = Math.max(7, messageLines.length * lineHeight + 2); // Minimum 7mm height

    // Check if we need a new page
    if (currentY + rowHeight > doc.internal.pageSize.height - 25) {
      doc.addPage();
      currentY = 25;
      drawTableHeader();
    }

    // Draw row background for alternating rows
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251); // Gray-50
      doc.rect(margin, currentY - 4, tableWidth, rowHeight, 'F');
    }

    // Draw row content with improved text handling
    let x = margin;
    rowData.forEach((cell, j) => {
      const color = j === 2 ? [5, 150, 105] as const : [55, 65, 81] as const;
      doc.setTextColor(color[0], color[1], color[2]);
      
      if (j === 3) { // Message column
        messageLines.forEach((line, lineIndex) => {
          doc.text(line, x + 1, currentY + (lineIndex * lineHeight));
        });
      } else {
        doc.text(String(cell), x + 1, currentY);
      }
      x += columns[j].width;
    });

    currentY += rowHeight;
  });

  // Add totals section
  currentY += 5;
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.line(margin, currentY - 2, margin + tableWidth, currentY - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.text(sanitizeText('Summary'), margin, currentY + 5);

  currentY += 10;
  doc.setFont('helvetica', 'normal');
  
  // Display totals by currency
  Object.entries(totals).forEach(([currency, amount]) => {
    const symbol = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].symbol;
    const currencyName = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].name;
    
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text(sanitizeText(`Total ${currencyName}:`), margin, currentY);
    
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
      sanitizeText(`Page ${i} of ${pageCount} | Generated by WhatsApp Receipt Cleaner`),
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Generate filename with date
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = sanitizeText(`whatsapp-payments-${dateStr}.pdf`);
  
  // Save the PDF
  doc.save(filename);
}