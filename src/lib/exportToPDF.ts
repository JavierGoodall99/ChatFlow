import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES, CurrencyCode } from './parseChat';
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
        '¶': 'P',
        // Cyrillic characters
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
        'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y',
        'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
        'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y',
        'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        // Common diacritics
        'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o', 'ø': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ÿ': 'y', 'ñ': 'n', 'ç': 'c'
      };
      return specialChars[ch] || ch.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    })
    .replace(/[^\x20-\x7E]/g, ''); // Remove any remaining non-printable ASCII chars
}

// Format amount with proper currency symbol
function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  return `${currencyInfo.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
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
    { header: 'Currency', width: tableWidth * 0.10 },
    { header: 'Amount', width: tableWidth * 0.15 },
    { header: 'Message', width: tableWidth * 0.40 } // Adjusted message column width
  ];
  
  // Calculate totals by currency and sender
  const totals: Record<string, number> = {};
  const senderTotals: Record<string, Record<string, number>> = {};
  
  messages.forEach(msg => {
    // Currency totals
    if (!totals[msg.currency]) {
      totals[msg.currency] = 0;
    }
    totals[msg.currency] += msg.amount;
    
    // Sender totals by currency
    if (!senderTotals[msg.sender]) {
      senderTotals[msg.sender] = {};
    }
    if (!senderTotals[msg.sender][msg.currency]) {
      senderTotals[msg.sender][msg.currency] = 0;
    }
    senderTotals[msg.sender][msg.currency] += msg.amount;
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
      SUPPORTED_CURRENCIES[msg.currency].symbol,
      msg.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sanitizeText(msg.content)
    ];

    // Calculate needed height for message content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const messageLines = getLines(doc, msg.content, columns[4].width - 2);
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
      // Set color based on column (make amount green)
      const color = j === 3 ? [5, 150, 105] as const : [55, 65, 81] as const;
      doc.setTextColor(color[0], color[1], color[2]);
      
      if (j === 4) { // Message column
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

  // Add summary section with enhanced styling
  currentY += 10;
  
  // Add summary header with background
  doc.setFillColor(39, 39, 42); // Zinc-800
  doc.rect(margin, currentY - 6, tableWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(sanitizeText('PAYMENT SUMMARY'), margin + 5, currentY);
  
  currentY += 10;
  
  // Set up two-column layout for summary
  const colWidth = tableWidth / 2 - 5;
  
  // Left column: Currency totals
  doc.setFillColor(243, 244, 246); // Gray-100
  doc.rect(margin, currentY - 6, colWidth, 8, 'F');
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(sanitizeText('TOTAL BY CURRENCY'), margin + 5, currentY);
  
  currentY += 8;
  
  // Format currency totals
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const maxCurrencyY = currentY;
  Object.entries(totals).forEach(([currency, amount], index) => {
    const currencyCode = currency as CurrencyCode;
    const currencyName = SUPPORTED_CURRENCIES[currencyCode].name;
    
    // Add alternating row colors for readability
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251); // Gray-50
      doc.rect(margin, currentY - 4, colWidth, 7, 'F');
    }
    
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text(sanitizeText(currencyName), margin + 5, currentY);
    
    doc.setTextColor(5, 150, 105); // Green-700
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(amount, currencyCode), margin + colWidth - 25, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    currentY += 7;
  });
  
  // Right column: Sender totals
  const rightColX = margin + colWidth + 10;
  currentY = maxCurrencyY - 8; // Reset Y position for the right column
  
  doc.setFillColor(243, 244, 246); // Gray-100
  doc.rect(rightColX, currentY - 6, colWidth, 8, 'F');
  doc.setTextColor(17, 24, 39); // Gray-900 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(sanitizeText('TOTAL BY SENDER'), rightColX + 5, currentY);
  
  currentY += 8;
  
  // Format sender totals
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  let senderRowIndex = 0;
  Object.entries(senderTotals).forEach(([sender, currencies]) => {
    // Add sender name with background
    if (senderRowIndex % 2 === 0) {
      doc.setFillColor(243, 244, 246); // Gray-100
    } else {
      doc.setFillColor(249, 250, 251); // Gray-50
    }
    doc.rect(rightColX, currentY - 4, colWidth, 7, 'F');
    
    doc.setTextColor(17, 24, 39); // Gray-900
    doc.setFont('helvetica', 'bold');
    doc.text(sanitizeText(sender), rightColX + 5, currentY);
    doc.setFont('helvetica', 'normal');
    
    currentY += 7;
    
    // Add currencies for this sender with indent
    Object.entries(currencies).forEach(([currency, amount]) => {
      const currencyCode = currency as CurrencyCode;
      const currencyName = SUPPORTED_CURRENCIES[currencyCode].name;
      
      doc.setTextColor(55, 65, 81); // Gray-700
      doc.text(sanitizeText(currencyName), rightColX + 15, currentY);
      
      doc.setTextColor(5, 150, 105); // Green-700
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(amount, currencyCode), rightColX + colWidth - 15, currentY, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      currentY += 7;
    });
    
    senderRowIndex++;
  });
  
  // Add footer with page numbers and language note
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