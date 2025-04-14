import jsPDF from 'jspdf';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from './parseChat';
import { format } from 'date-fns';
import { getTemplateByID, InvoiceTemplateID } from './invoiceTemplates';

// Define the invoice data interface
interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  clientName: string;
  companyName: string;
  messages: WhatsAppMessage[];
  notes?: string;
  templateId?: InvoiceTemplateID; // Added template ID
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
  // Get the selected template or default to modern
  const template = getTemplateByID(data.templateId || 'modern');

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

  // Extract colors from template
  const primaryColor = template.primaryColor;
  const secondaryColor = template.secondaryColor;
  const accentColor = template.accentColor;
  const textColor = [70, 70, 70]; // Medium gray for most text
  const lightGrayColor = [240, 240, 240]; // Light gray for backgrounds/separators
  
  // Apply template fonts
  doc.setFont(template.fontFamily, 'bold');
  
  // --- Header Section --- //
  let currentY = margin;
  
  // Apply different header styles based on the template
  if (template.id === 'minimalist') {
    // Minimalist has a simpler header
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(sanitizeText(data.companyName), margin, currentY);
    
    currentY += 12;
    
    doc.setFontSize(16);
    doc.text('INVOICE', margin, currentY);
    currentY += 10;
  } 
  else if (template.id === 'creative') {
    // Creative uses a colored background header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(sanitizeText(data.companyName), margin, currentY + 5);
    
    doc.setFontSize(16);
    doc.text('INVOICE', pageWidth - margin, currentY + 5, { align: 'right' });
    
    currentY += 45; // Move down past the colored header
  }
  else {
    // Default header styling (classic, modern, professional)
    // Company name at the top
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(sanitizeText(data.companyName), margin, currentY);
    
    // Invoice title on the right
    doc.setFontSize(28);
    doc.text('INVOICE', pageWidth - margin, currentY, { align: 'right' });
    
    currentY += 15;
  }
  
  // Company info section
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont(template.fontFamily, 'normal');
  
  // Add dummy company details
  doc.text('123 Business Street', margin, currentY);
  currentY += 5;
  doc.text('City, State 12345', margin, currentY);
  currentY += 5;
  doc.text('Phone: (123) 456-7890', margin, currentY);
  currentY += 5;
  doc.text('Email: contact@yourbusiness.com', margin, currentY);
  
  // Invoice details on the right
  doc.setFont(template.fontFamily, 'bold');
  const invoiceDetailsY = template.id === 'creative' ? 60 : 35;
  doc.text('Invoice Number:', pageWidth - margin - 50, invoiceDetailsY);
  doc.text('Date:', pageWidth - margin - 50, invoiceDetailsY + 8);
  
  doc.setFont(template.fontFamily, 'normal');
  doc.text(sanitizeText(data.invoiceNumber), pageWidth - margin, invoiceDetailsY, { align: 'right' });
  doc.text(formatDate(data.invoiceDate), pageWidth - margin, invoiceDetailsY + 8, { align: 'right' });
  
  // Line separator (some templates use different styles)
  currentY += 15;
  
  if (template.id === 'creative') {
    // Creative template uses thicker, colored separator
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(1.5);
  } else if (template.id === 'minimalist') {
    // Minimalist has very subtle separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
  } else {
    // Default separator
    doc.setDrawColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
    doc.setLineWidth(0.5);
  }
  
  doc.line(margin, currentY, pageWidth - margin, currentY);
  
  // --- Bill To Section --- //
  currentY += 15;
  doc.setFont(template.fontFamily, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('BILL TO:', margin, currentY);
  
  currentY += 8;
  doc.setFont(template.fontFamily, 'normal');
  doc.setFontSize(11);
  doc.text(sanitizeText(data.clientName), margin, currentY);
  
  // --- Invoice Items Section --- //
  currentY += 20;
  
  // Table header styling based on template
  if (template.id === 'minimalist') {
    // Minimalist uses subtle header
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    doc.line(margin, currentY + 8, pageWidth - margin, currentY + 8);
    
    doc.setFont(template.fontFamily, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  } 
  else if (template.id === 'creative') {
    // Creative uses a gradient-like background
    // First a primary color strip
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, currentY, contentWidth, 5, 'F');
    // Then secondary color for the text area
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(margin, currentY + 5, contentWidth, 5, 'F');
    
    doc.setFont(template.fontFamily, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
  }
  else {
    // Standard header with colored background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, currentY, contentWidth, 10, 'F');
    
    doc.setFont(template.fontFamily, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
  }
  
  // Define column widths for the table
  const dateWidth = 40;
  const descriptionWidth = contentWidth - dateWidth - 40; // Adjusting for other columns
  
  doc.text('Date', margin + 5, currentY + 6);
  doc.text('Description', margin + dateWidth + 5, currentY + 6);
  doc.text('Amount', pageWidth - margin - 5, currentY + 6, { align: 'right' });
  
  currentY += 10;
  
  // List each item in the invoice
  doc.setFont(template.fontFamily, 'normal');
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
      
      doc.setFont(template.fontFamily, 'bold');
      doc.text(`${currencyName} Transactions:`, margin, currentY + 6);
      doc.setFont(template.fontFamily, 'normal');
      currentY += 8;
    }
    
    prevCurrency = currency;
    
    // List items for this currency
    for (const message of messages) {
      // Draw alternating row backgrounds if not minimalist (which prefers clean design)
      if (alternateRow && template.id !== 'minimalist') {
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
        
        // Redraw table header on new page based on template
        if (template.id === 'minimalist') {
          doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.setLineWidth(0.3);
          doc.line(margin, currentY, pageWidth - margin, currentY);
          doc.line(margin, currentY + 8, pageWidth - margin, currentY + 8);
          
          doc.setFont(template.fontFamily, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        } 
        else if (template.id === 'creative') {
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(margin, currentY, contentWidth, 5, 'F');
          doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.rect(margin, currentY + 5, contentWidth, 5, 'F');
          
          doc.setFont(template.fontFamily, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
        }
        else {
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(margin, currentY, contentWidth, 10, 'F');
          
          doc.setFont(template.fontFamily, 'bold');
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
        }
        
        doc.text('Date', margin + 5, currentY + 6);
        doc.text('Description', margin + dateWidth + 5, currentY + 6);
        doc.text('Amount', pageWidth - margin - 5, currentY + 6, { align: 'right' });
        
        currentY += 10;
        doc.setFont(template.fontFamily, 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      }
      
      // Date column
      doc.text(format(message.timestamp, 'dd/MM/yyyy'), margin + 5, currentY + 5);
      
      // Description column - handle long text with wrapping
      const descriptionLines = doc.splitTextToSize(description, descriptionWidth - 10);
      doc.text(descriptionLines, margin + dateWidth + 5, currentY + 5);
      
      // If we have multiple lines, adjust the row height
      const descriptionHeight = Math.max(8, descriptionLines.length * 5);
      
      // Amount column with accent color from template
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFont(template.fontFamily, 'bold');
      doc.text(
        formatCurrency(message.amount, message.currency),
        pageWidth - margin - 5,
        currentY + 5,
        { align: 'right' }
      );
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont(template.fontFamily, 'normal');
      
      currentY += descriptionHeight;
    }
    
    // Add subtotal for this currency
    const currencyTotal = messages.reduce((sum, msg) => sum + msg.amount, 0);
    
    // Subtotal row styling based on template
    currentY += 5;
    
    if (template.id === 'creative') {
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setLineWidth(0.8);
    } else if (template.id === 'minimalist') {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
    } else {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
    }
    
    doc.line(margin + contentWidth - 70, currentY, pageWidth - margin, currentY);
    currentY += 5;
    
    doc.setFont(template.fontFamily, 'bold');
    doc.text('Subtotal:', pageWidth - margin - 70, currentY + 5);
    
    // Subtotal amount with accent color
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(
      formatCurrency(currencyTotal, currency),
      pageWidth - margin - 5,
      currentY + 5,
      { align: 'right' }
    );
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    currentY += 10;
  }
  
  // --- Totals Section --- //
  if (totals.length > 1) {
    currentY += 5;
    
    if (template.id === 'creative') {
      // Creative uses a thick colored line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(2);
    } else if (template.id === 'minimalist') {
      // Minimalist uses a thin gray line
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
    } else {
      // Default uses a medium colored line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
    }
    
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
    
    doc.setFont(template.fontFamily, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('INVOICE SUMMARY', margin, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    totals.forEach(({ currency, name, total }) => {
      doc.text(`Total (${name}):`, pageWidth - margin - 70, currentY);
      
      // Total amount with accent color
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(
        formatCurrency(total, currency),
        pageWidth - margin - 5,
        currentY,
        { align: 'right' }
      );
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      currentY += 7;
    });
  }
  
  // --- Notes Section --- //
  if (data.notes && data.notes.trim()) {
    currentY += 10;
    
    // Notes section styling based on template
    if (template.id === 'creative') {
      // Creative uses a colored background
      doc.setFillColor(245, 245, 245);
      const noteText = doc.splitTextToSize(sanitizeText(data.notes), contentWidth - 10);
      const noteHeight = noteText.length * 5 + 15;
      doc.roundedRect(margin, currentY - 5, contentWidth, noteHeight, 3, 3, 'F');
      
      doc.setFont(template.fontFamily, 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    } else {
      // Default notes styling
      doc.setFont(template.fontFamily, 'bold');
      doc.setFontSize(11);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    }
    
    doc.text('Notes:', margin + (template.id === 'creative' ? 5 : 0), currentY);
    
    currentY += 7;
    doc.setFont(template.fontFamily, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const noteLines = doc.splitTextToSize(sanitizeText(data.notes), contentWidth - (template.id === 'creative' ? 10 : 0));
    doc.text(noteLines, margin + (template.id === 'creative' ? 5 : 0), currentY);
    
    currentY += noteLines.length * 5 + 5;
  }
  
  // --- Footer --- //
  const footerY = pageHeight - 20;
  doc.setFont(template.fontFamily, 'normal');
  doc.setFontSize(9);
  
  // Footer styling based on template
  if (template.id === 'creative') {
    // Creative has a colored footer
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.8); // Slightly transparent
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
  } else {
    // Default footer styling
    doc.setTextColor(150, 150, 150);
  }
  
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