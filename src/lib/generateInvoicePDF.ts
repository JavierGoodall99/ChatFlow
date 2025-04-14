import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';
import { format } from 'date-fns';

// Define the invoice data interface
interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  clientName: string;
  companyName: string;
  messages: WhatsAppMessage[];
  notes?: string;
}

/**
 * Sanitizes text to avoid encoding issues in PDF generation
 * Removes or replaces problematic characters
 */
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Replace known problematic character sequences
  return text
    .replace(/Ø=Þ/g, '') // Remove specific problematic sequence
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[\u0080-\uFFFF]/g, '') // Remove Unicode characters that might cause issues
    .trim();
}

/**
 * Creates a professional invoice PDF from the selected WhatsApp messages
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  // Initialize the document with professional settings
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  // Set document metadata
  doc.setProperties({
    title: `Invoice ${data.invoiceNumber}`,
    subject: 'Payment Invoice',
    author: data.companyName,
    keywords: 'invoice, payment',
    creator: 'WhatsApp Receipt Cleaner'
  });

  // Document measurements
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Reusable formatting helpers
  const formatDate = (date: Date) => format(date, 'MMMM d, yyyy');
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].symbol;
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Group messages by currency
  const groupedMessages = data.messages.reduce<Record<string, WhatsAppMessage[]>>((acc, message) => {
    if (!acc[message.currency]) {
      acc[message.currency] = [];
    }
    acc[message.currency].push(message);
    return acc;
  }, {});

  // Calculate totals by currency
  const totals = Object.entries(groupedMessages).map(([currency, messages]) => {
    const total = messages.reduce((sum, msg) => sum + msg.amount, 0);
    return {
      currency,
      symbol: SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].symbol,
      name: SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].name,
      total,
    };
  });

  // Colors
  const primaryColor = [0, 82, 204]; // Blue
  const secondaryColor = [51, 51, 51]; // Dark gray
  const lightGrayColor = [240, 240, 240]; // Light gray
  const textColor = [70, 70, 70]; // Medium gray
  
  // Fonts
  doc.setFont('helvetica', 'bold');
  
  // --- Header Section --- //
  let currentY = margin;
  
  // Company name at the top
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(sanitizeText(data.companyName), margin, currentY);
  
  // Invoice title on the right
  doc.setFontSize(28);
  doc.text('INVOICE', pageWidth - margin, currentY, { align: 'right' });
  
  currentY += 15;
  
  // Company info section
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'normal');
  
  // Add dummy company details
  doc.text('123 Business Street', margin, currentY);
  currentY += 5;
  doc.text('City, State 12345', margin, currentY);
  currentY += 5;
  doc.text('Phone: (123) 456-7890', margin, currentY);
  currentY += 5;
  doc.text('Email: contact@yourbusiness.com', margin, currentY);
  
  // Invoice details on the right
  doc.setFont('helvetica', 'bold');
  const invoiceDetailsY = 35;
  doc.text('Invoice Number:', pageWidth - margin - 50, invoiceDetailsY);
  doc.text('Date:', pageWidth - margin - 50, invoiceDetailsY + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.text(sanitizeText(data.invoiceNumber), pageWidth - margin, invoiceDetailsY, { align: 'right' });
  doc.text(formatDate(data.invoiceDate), pageWidth - margin, invoiceDetailsY + 8, { align: 'right' });
  
  // Line separator
  currentY += 15;
  doc.setDrawColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  
  // --- Bill To Section --- //
  currentY += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('BILL TO:', margin, currentY);
  
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(sanitizeText(data.clientName), margin, currentY);
  
  // --- Invoice Items Section --- //
  currentY += 20;
  
  // Table headers
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, currentY, contentWidth, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  
  // Define column widths for the table
  const dateWidth = 40;
  const descriptionWidth = contentWidth - dateWidth - 40; // Adjusting for other columns
  
  doc.text('Date', margin + 5, currentY + 6);
  doc.text('Description', margin + dateWidth + 5, currentY + 6);
  doc.text('Amount', pageWidth - margin - 5, currentY + 6, { align: 'right' });
  
  currentY += 10;
  
  // List each item in the invoice
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  let prevCurrency = '';
  let alternateRow = false;
  
  // Process each currency as a separate section
  for (const [currency, messages] of Object.entries(groupedMessages)) {
    const currencyName = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].name;
    
    // Add currency header if we have multiple currencies
    if (Object.keys(groupedMessages).length > 1) {
      if (prevCurrency !== '') {
        currentY += 5; // Add some spacing between currency sections
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${currencyName} Transactions:`, margin, currentY + 6);
      doc.setFont('helvetica', 'normal');
      currentY += 8;
    }
    
    prevCurrency = currency;
    
    // List items for this currency
    for (const message of messages) {
      // Draw alternating row backgrounds
      if (alternateRow) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, currentY, contentWidth, 8, 'F');
      }
      alternateRow = !alternateRow;
      
      // Format message content or use a default description
      const rawDescription = message.content.trim() || `Payment from ${message.sender}`;
      const description = sanitizeText(rawDescription);
      
      // Ensure we don't exceed page height
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = margin;
        
        // Redraw table header on new page
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(margin, currentY, contentWidth, 10, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('Date', margin + 5, currentY + 6);
        doc.text('Description', margin + dateWidth + 5, currentY + 6);
        doc.text('Amount', pageWidth - margin - 5, currentY + 6, { align: 'right' });
        
        currentY += 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      }
      
      // Date column
      doc.text(format(message.timestamp, 'dd/MM/yyyy'), margin + 5, currentY + 5);
      
      // Description column - handle long text with wrapping
      const descriptionLines = doc.splitTextToSize(description, descriptionWidth - 10);
      doc.text(descriptionLines, margin + dateWidth + 5, currentY + 5);
      
      // If we have multiple lines, adjust the row height
      const descriptionHeight = Math.max(8, descriptionLines.length * 5);
      
      // Amount column
      doc.text(
        formatCurrency(message.amount, message.currency),
        pageWidth - margin - 5,
        currentY + 5,
        { align: 'right' }
      );
      
      currentY += descriptionHeight;
    }
    
    // Add subtotal for this currency
    const currencyTotal = messages.reduce((sum, msg) => sum + msg.amount, 0);
    
    // Subtotal row
    currentY += 5;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin + contentWidth - 70, currentY, pageWidth - margin, currentY);
    currentY += 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', pageWidth - margin - 70, currentY + 5);
    doc.text(
      formatCurrency(currencyTotal, currency),
      pageWidth - margin - 5,
      currentY + 5,
      { align: 'right' }
    );
    
    currentY += 10;
  }
  
  // --- Totals Section --- //
  if (totals.length > 1) {
    currentY += 5;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('INVOICE SUMMARY', margin, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    totals.forEach(({ currency, name, total }) => {
      doc.text(`Total (${name}):`, pageWidth - margin - 70, currentY);
      doc.text(
        formatCurrency(total, currency),
        pageWidth - margin - 5,
        currentY,
        { align: 'right' }
      );
      currentY += 7;
    });
  }
  
  // --- Notes Section --- //
  if (data.notes && data.notes.trim()) {
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Notes:', margin, currentY);
    
    currentY += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(sanitizeText(data.notes), contentWidth);
    doc.text(noteLines, margin, currentY);
    
    currentY += noteLines.length * 5 + 5;
  }
  
  // --- Footer --- //
  const footerY = pageHeight - 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Generated by WhatsApp Receipt Cleaner | All data processed in your browser',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  
  // Save the PDF
  const fileName = `invoice-${data.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}