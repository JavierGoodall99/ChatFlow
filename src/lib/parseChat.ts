import { z } from "zod";

// Define supported currencies with expanded format support
export const SUPPORTED_CURRENCIES = {
  ZAR: { 
    symbol: 'R', 
    name: 'South African Rand',
    altFormats: ['ZAR', 'R$', 'RAND', 'РЭНД', 'ЮАР']
  },
  USD: { 
    symbol: '$', 
    name: 'US Dollar',
    altFormats: ['USD', 'US$', 'DOLLAR', 'ДОЛЛ', 'ДОЛЛАР', 'ДОЛ']
  },
  EUR: { 
    symbol: '€', 
    name: 'Euro',
    altFormats: ['EUR', 'EURO', 'ЕВРО', 'ЕУР', 'euros', 'euro']
  },
  GBP: { 
    symbol: '£', 
    name: 'British Pound',
    altFormats: ['GBP', 'UKP', 'STG', 'ФУНТ', 'POUND']
  },
  AUD: { 
    symbol: 'A$', 
    name: 'Australian Dollar',
    altFormats: ['AUD', 'AU$', 'АВСТР', 'AUS$']
  },
  INR: { 
    symbol: '₹', 
    name: 'Indian Rupee',
    altFormats: ['INR', 'RS', 'रु', 'रू', 'РУПИЯ', 'RUPEE']
  },
  BRL: { 
    symbol: 'R$', 
    name: 'Brazilian Real',
    altFormats: ['BRL', 'REAL', 'РЕАЛ']
  },
  CNY: { 
    symbol: '¥', 
    name: 'Chinese Yuan',
    altFormats: ['CNY', 'RMB', 'YUAN', 'ЮАНЬ', '元']
  },
  JPY: { 
    symbol: '¥', 
    name: 'Japanese Yen',
    altFormats: ['JPY', 'YEN', 'ЙЕНА', '円']
  },
  NGN: { 
    symbol: '₦', 
    name: 'Nigerian Naira',
    altFormats: ['NGN', 'NAIRA', 'НАЙРА']
  },
  RUB: {
    symbol: '₽',
    name: 'Russian Ruble',
    altFormats: ['RUB', 'РУБ', 'Р', 'р.', 'руб.', 'РУБЛЬ']
  },
  SAR: {
    symbol: 'SR',  // Changed from ﷼ to SR (Latin characters) for better PDF compatibility
    name: 'Saudi Riyal',
    altFormats: ['SAR', 'SR', 'س.ر', 'ر.س.', 'ر.س', 'ريال']
  }
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// Define the schema for a WhatsApp message
export const WhatsAppMessageSchema = z.object({
  timestamp: z.date(),
  sender: z.string(),
  content: z.string(),
  amount: z.number(),
  currency: z.enum([
    'ZAR', 'USD', 'EUR', 'GBP', 'AUD', 'INR', 
    'BRL', 'CNY', 'JPY', 'NGN', 'RUB', 'SAR'
  ]),
  // Source of the message - text or OCR
  source: z.enum(['text', 'ocr']).default('text'),
  // Optional image data if the message is from OCR
  imageData: z.string().optional(),
  // Optional filename reference for the original image (if applicable)
  imageFilename: z.string().optional(),
});

export interface WhatsAppMessage {
  timestamp: Date;
  sender: string;
  content: string;
  amount: number;
  currency: CurrencyCode;
  source: 'text' | 'ocr';
  imageFilename?: string;
  confidence?: number; // For OCR results, confidence level 0-1
}

// Create more flexible currency patterns with additional formats
function createCurrencyPattern(symbol: string, altFormats: readonly string[]): RegExp[] {
  // Escape special characters in currency symbols
  const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create patterns array
  const patterns: RegExp[] = [
    // Standard format: Currency symbol then amount with various separators
    new RegExp(
      // Match the currency symbol with optional spaces
      escapedSymbol + '\\s*' +
      // Match the amount with various decimal/thousand separators
      '([0-9]{1,3}(?:[., \\s][0-9]{3})*(?:[.,][0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)',
      'g'
    ),
    
    // Format: Amount followed by currency symbol (e.g., "100$" or "150€")
    new RegExp(
      // Match amount with various separators
      '([0-9]{1,3}(?:[., \\s][0-9]{3})*(?:[.,][0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)' +
      // Match optional space and then the symbol
      '\\s*' + escapedSymbol,
      'g'
    )
  ];
  
  // Add patterns for alternative formats (e.g., "USD 100", "100 USD")
  altFormats.forEach(altFormat => {
    const escapedAlt = altFormat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Pattern: Alternative format then amount (e.g., "USD 100")
    patterns.push(new RegExp(
      escapedAlt + '\\s+' +
      '([0-9]{1,3}(?:[., \\s][0-9]{3})*(?:[.,][0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)',
      'g'
    ));
    
    // Pattern: Amount then alternative format (e.g., "100 USD")
    patterns.push(new RegExp(
      '([0-9]{1,3}(?:[., \\s][0-9]{3})*(?:[.,][0-9]{1,2})?|[0-9]+(?:[.,][0-9]{1,2})?)' +
      '\\s+' + escapedAlt,
      'g'
    ));
  });

  // Add pattern for Arabic/Persian numerals (٠١٢٣٤٥٦٧٨٩)
  patterns.push(new RegExp(
    escapedSymbol + '\\s*' +
    '([٠-٩]{1,3}(?:[., \\s][٠-٩]{3})*(?:[.,][٠-٩]{1,2})?|[٠-٩]+(?:[.,][٠-٩]{1,2})?)',
    'g'
  ));
  
  patterns.push(new RegExp(
    '([٠-٩]{1,3}(?:[., \\s][٠-٩]{3})*(?:[.,][٠-٩]{1,2})?|[٠-٩]+(?:[.,][٠-٩]{1,2})?)' +
    '\\s*' + escapedSymbol,
    'g'
  ));

  // Add patterns for Arabic/Persian numerals with alternative formats
  altFormats.forEach(altFormat => {
    const escapedAlt = altFormat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    patterns.push(new RegExp(
      escapedAlt + '\\s+' +
      '([٠-٩]{1,3}(?:[., \\s][٠-٩]{3})*(?:[.,][٠-٩]{1,2})?|[٠-٩]+(?:[.,][٠-٩]{1,2})?)',
      'g'
    ));
    
    patterns.push(new RegExp(
      '([٠-٩]{1,3}(?:[., \\s][٠-٩]{3})*(?:[.,][٠-٩]{1,2})?|[٠-٩]+(?:[.,][٠-٩]{1,2})?)' +
      '\\s+' + escapedAlt,
      'g'
    ));
  });
  
  return patterns;
}

// Build patterns for all supported currencies
const CURRENCY_PATTERNS = Object.entries(SUPPORTED_CURRENCIES).reduce<Record<CurrencyCode, RegExp[]>>((acc, [code, { symbol, altFormats }]) => {
  acc[code as CurrencyCode] = createCurrencyPattern(symbol, altFormats || []);
  return acc;
}, {} as Record<CurrencyCode, RegExp[]>);

// Define special payment method keywords that might indicate transactions
const PAYMENT_METHOD_KEYWORDS = [
  'sent', 'received', 'paid', 'payment', 'transfer', 'transaction',
  'deposit', 'withdrawal', 'enviar', 'envié', 'recibido', 'pago',
  'transferencia', 'bizum', 'paytm', 'venmo', 'cashapp', 'zelle',
  'mpesa', 'paypal', 'revolut', 'alipay', 'wechat pay', 'bhej', 'bheja',
  'حوالة', 'دفع', 'ارسال', 'استلام', 'پرداخت', 'انتقال'
];

// Convert Arabic/Persian numerals to Latin numerals
function convertArabicToLatinNumerals(text: string): string {
  const arabicNumerals: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  return text.split('').map(char => arabicNumerals[char] || char).join('');
}

function extractAmount(text: string, pattern: RegExp): number | null {
  const match = pattern.exec(text);
  if (!match || !match[1]) return null;

  // Get the matched amount text
  let amountStr = match[1];
  
  // Convert Arabic numerals if present
  if (/[٠-٩]/.test(amountStr)) {
    amountStr = convertArabicToLatinNumerals(amountStr);
  }

  // Clean the amount string
  amountStr = amountStr
    .replace(/\s/g, '') // Remove spaces
    .replace(/,/g, '.'); // Convert commas to decimal points

  const amount = parseFloat(amountStr);
  return isNaN(amount) ? null : amount;
}

// Check if a message contains payment method keywords
function containsPaymentMethodKeyword(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PAYMENT_METHOD_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

export function parseChat(content: string): { 
  messages: WhatsAppMessage[], 
  imageReferences: string[] 
} {
  if (!content || content.trim().length === 0) {
    console.error('Empty content provided to parseChat');
    return { messages: [], imageReferences: [] };
  }

  console.log('Starting to parse chat content...');
  const lines = content.split('\n');
  console.log(`Found ${lines.length} lines in chat`);
  
  const messages: WhatsAppMessage[] = [];
  const imageReferences: string[] = [];
  let skippedLines = 0;
  
  // Regular expression to detect image attachments in WhatsApp chat
  const imageAttachmentRegex = /<attached: (.+\.(jpg|jpeg|png|gif))>/i;
  
  for (const line of lines) {
    try {
      // Skip empty lines
      if (!line.trim()) {
        skippedLines++;
        continue;
      }

      // Check for image attachment references
      const imageMatch = line.match(imageAttachmentRegex);
      if (imageMatch && imageMatch[1]) {
        const imageFilename = imageMatch[1].trim();
        // Add to our list of referenced images if not already included
        if (!imageReferences.includes(imageFilename)) {
          imageReferences.push(imageFilename);
        }
        // Continue processing the rest of the line for possible payment information
      }

      // WhatsApp format variations with more flexibility
      const formats = [
        // Standard WhatsApp formats
        /^(\d{4}\/\d{2}\/\d{2}, \d{2}:\d{2}) - ([^:]+): (.+)$/,
        /^\[(\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
        /^\[(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
        /^(\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}) - ([^:]+): (.+)$/,
        // Additional European and other formats (day first)
        /^(\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}) - ([^:]+): (.+)$/,
        /^(\d{2}-\d{2}-\d{4}, \d{2}:\d{2}) - ([^:]+): (.+)$/,
        // Allow for more flexibility in separators
        /^(\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4}[,\s]+\d{1,2}:\d{2}(?:\s*[AP]M)?)\s*[-\s]+([^:]+): (.+)$/,
        // Format with AM/PM
        /^(\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4}, \d{1,2}:\d{2} [AP]M) - ([^:]+): (.+)$/,
      ];

      let match = null;
      for (const format of formats) {
        match = line.match(format);
        if (match) {
          console.log('Matched format:', format, 'for line:', line);
          break;
        }
      }
      
      if (!match) {
        console.log('No format match for line:', line);
        skippedLines++;
        continue;
      }
      
      const [, timestamp, sender, messageContent] = match;
      console.log('Parsed components:', { timestamp, sender, messageContent });
      
      // Check for amounts in the message for each currency
      let foundAmount: number | null = null;
      let foundCurrency: CurrencyCode | null = null;

      // Try each currency pattern set
      patternSearch: for (const [currency, patterns] of Object.entries(CURRENCY_PATTERNS)) {
        for (const pattern of patterns) {
          // Reset lastIndex to ensure we start from the beginning of the string
          pattern.lastIndex = 0;
          
          const amount = extractAmount(messageContent, pattern);
          if (amount !== null) {
            foundAmount = amount;
            foundCurrency = currency as CurrencyCode;
            break patternSearch;
          }
        }
      }

      // If no currency pattern matched, but message contains payment keywords and numbers, try to extract amount
      if (foundAmount === null && containsPaymentMethodKeyword(messageContent)) {
        // Look for numbers in the text with a simple pattern
        const numberMatches = messageContent.match(/\b\d+(?:[.,]\d+)?\b/g) || 
                             messageContent.match(/\b[٠-٩]+(?:[.,][٠-٩]+)?\b/g);
        
        if (numberMatches && numberMatches.length > 0) {
          // Convert Arabic numerals if needed
          let amountStr = numberMatches[0];
          if (/[٠-٩]/.test(amountStr)) {
            amountStr = convertArabicToLatinNumerals(amountStr);
          }
          
          amountStr = amountStr.replace(/,/g, '.');
          const amount = parseFloat(amountStr);
          
          if (!isNaN(amount)) {
            foundAmount = amount;
            
            // Try to determine currency from context
            const lowerContent = messageContent.toLowerCase();
            
            // Simple currency detection based on keywords
            if (lowerContent.includes("euro") || lowerContent.includes("€")) {
              foundCurrency = "EUR";
            } else if (lowerContent.includes("dollar") || lowerContent.includes("$") || lowerContent.includes("usd")) {
              foundCurrency = "USD";
            } else if (lowerContent.includes("pound") || lowerContent.includes("£") || lowerContent.includes("gbp")) {
              foundCurrency = "GBP";
            } else if (lowerContent.includes("rupee") || lowerContent.includes("inr") || lowerContent.includes("rs") || lowerContent.includes("₹")) {
              foundCurrency = "INR";
            } else if (lowerContent.includes("ر.س") || lowerContent.includes("ريال") || lowerContent.includes("sar")) {
              foundCurrency = "SAR";
            } else if (lowerContent.includes("rand") || lowerContent.includes("zar") || messageContent.includes("R")) {
              foundCurrency = "ZAR";
            } else {
              // Default to USD if currency can't be determined
              foundCurrency = "USD";
            }
          }
        }
      }

      // If no amount or currency found, check for payment service mentions with numbers
      if (foundAmount === null || foundCurrency === null) {
        console.log('No amount found in message:', messageContent);
        skippedLines++;
        continue;
      }

      // Handle various date formats more flexibly
      let dateStr: string;
      try {
        if (timestamp.match(/^\d{4}\/\d{2}\/\d{2}/)) {
          // YYYY/MM/DD format
          const [date, time] = timestamp.split(',');
          const [year, month, day] = date.split('/');
          dateStr = `${year}-${month}-${day}T${time.trim().replace(/\s*[AP]M$/i, '')}:00`;
        } else if (timestamp.includes('.') && timestamp.match(/\d{2}\.\d{2}\.\d{4}/)) {
          // DD.MM.YYYY format (European)
          const [date, time] = timestamp.split(',');
          const [day, month, year] = date.split('.');
          dateStr = `${year}-${month}-${day}T${time.trim().replace(/\s*[AP]M$/i, '')}:00`;
        } else if (timestamp.includes('-') && timestamp.match(/\d{2}-\d{2}-\d{4}/)) {
          // DD-MM-YYYY format
          const [date, time] = timestamp.split(',');
          const [day, month, year] = date.split('-');
          dateStr = `${year}-${month}-${day}T${time.trim().replace(/\s*[AP]M$/i, '')}:00`;
        } else if (timestamp.includes(',')) {
          // DD/MM/YY format
          const [date, timeWithPossibleAMPM] = timestamp.split(',');
          const time = timeWithPossibleAMPM.trim().replace(/\s*[AP]M$/i, '');
          const parts = date.trim().split(/[\/\.-]/);
          
          if (parts.length === 3) {
            const [day, month, year] = parts;
            // Ensure year has 4 digits
            const fullYear = year.length === 2 ? `20${year}` : year;
            dateStr = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}:00`;
          } else {
            throw new Error(`Unrecognized date format: ${timestamp}`);
          }
        } else {
          // Fallback format
          const [datePart, timePart] = timestamp.split(' ');
          const cleanTimePart = timePart.replace(/\s*[AP]M$/i, '');
          const parts = datePart.split(/[\/\.-]/);
          const [day, month, year] = parts;
          
          // Ensure year has 4 digits
          const fullYear = year.length === 2 ? `20${year}` : year;
          dateStr = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${cleanTimePart}`;
        }
        
        console.log('Created date string:', dateStr);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error parsing date "${timestamp}": ${errorMessage}`);
        // Use current date as fallback if date parsing fails
        dateStr = new Date().toISOString();
      }
      
      // Check for image attachment in this message
      let imageFilename: string | undefined = undefined;
      const msgImageMatch = messageContent.match(imageAttachmentRegex);
      if (msgImageMatch && msgImageMatch[1]) {
        imageFilename = msgImageMatch[1].trim();
      }
      
      messages.push({
        timestamp: new Date(dateStr),
        sender,
        content: messageContent,
        amount: foundAmount,
        currency: foundCurrency,
        source: 'text',
        imageFilename
      });
      
      console.log('Successfully parsed message:', messages[messages.length - 1]);
      
    } catch (error) {
      console.error('Error parsing line:', line, error);
      skippedLines++;
      continue;
    }
  }
  
  console.log(`Parsing complete. Found ${messages.length} payment messages. Skipped ${skippedLines} lines.`);
  return { 
    messages: messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    imageReferences
  };
}