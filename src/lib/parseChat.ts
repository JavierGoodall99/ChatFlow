import { z } from "zod";

// Define supported currencies
export const SUPPORTED_CURRENCIES = {
  ZAR: { symbol: 'R', name: 'South African Rand' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// Define the schema for a WhatsApp message
export const WhatsAppMessageSchema = z.object({
  timestamp: z.date(),
  sender: z.string(),
  content: z.string(),
  amount: z.number(),
  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP', 'AUD', 'INR']),
});

export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;

// Create currency patterns for each supported currency
function createCurrencyPattern(symbol: string): RegExp {
  // Escape special characters in currency symbols
  const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    // Match the currency symbol with optional spaces
    escapedSymbol + '\\s*' +
    // Match the amount with optional decimal places and thousand separators
    '([0-9]{1,3}(?:[., ][0-9]{3})*(?:[.,][0-9]{2})?|[0-9]+(?:[.,][0-9]{2})?)',
    'g'
  );
}

// Build patterns for all supported currencies
const CURRENCY_PATTERNS = Object.entries(SUPPORTED_CURRENCIES).reduce<Record<CurrencyCode, RegExp>>((acc, [code, { symbol }]) => {
  acc[code as CurrencyCode] = createCurrencyPattern(symbol);
  return acc;
}, {} as Record<CurrencyCode, RegExp>);

function extractAmount(text: string, pattern: RegExp): number | null {
  const match = pattern.exec(text);
  if (!match || !match[1]) return null;

  // Clean the amount string
  const amountStr = match[1]
    .replace(/\s/g, '') // Remove spaces
    .replace(/,/g, '.'); // Convert commas to decimal points

  const amount = parseFloat(amountStr);
  return isNaN(amount) ? null : amount;
}

export function parseChat(content: string): WhatsAppMessage[] {
  if (!content || content.trim().length === 0) {
    console.error('Empty content provided to parseChat');
    return [];
  }

  console.log('Starting to parse chat content...');
  const lines = content.split('\n');
  console.log(`Found ${lines.length} lines in chat`);
  
  const messages: WhatsAppMessage[] = [];
  let skippedLines = 0;
  
  for (const line of lines) {
    try {
      // Skip empty lines
      if (!line.trim()) {
        skippedLines++;
        continue;
      }

      // WhatsApp format variations
      const formats = [
        /^(\d{4}\/\d{2}\/\d{2}, \d{2}:\d{2}) - ([^:]+): (.+)$/,
        /^\[(\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
        /^\[(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})\] ([^:]+): (.+)$/,
        /^(\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}) - ([^:]+): (.+)$/
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

      // Try each currency pattern
      for (const [currency, pattern] of Object.entries(CURRENCY_PATTERNS)) {
        // Reset lastIndex to ensure we start from the beginning of the string
        pattern.lastIndex = 0;
        
        const amount = extractAmount(messageContent, pattern);
        if (amount !== null) {
          foundAmount = amount;
          foundCurrency = currency as CurrencyCode;
          break;
        }
      }

      // If no amount or currency found, skip
      if (foundAmount === null || foundCurrency === null) {
        console.log('No amount found in message:', messageContent);
        skippedLines++;
        continue;
      }

      // Handle date formats
      let dateStr: string;
      if (timestamp.match(/^\d{4}\/\d{2}\/\d{2}/)) {
        const [date, time] = timestamp.split(',');
        const [year, month, day] = date.split('/');
        dateStr = `${year}-${month}-${day}T${time.trim()}:00`;
      } else if (timestamp.includes(',')) {
        const [date, time] = timestamp.split(',');
        const [day, month, year] = date.split('/');
        dateStr = `20${year}-${month}-${day}T${time.trim()}:00`;
      } else {
        const [day, month, year] = timestamp.split(' ')[0].split('/');
        const time = timestamp.split(' ')[1];
        dateStr = `20${year}-${month}-${day}T${time}`;
      }
      
      console.log('Created date string:', dateStr);
      
      messages.push({
        timestamp: new Date(dateStr),
        sender,
        content: messageContent,
        amount: foundAmount,
        currency: foundCurrency,
      });
      
      console.log('Successfully parsed message:', messages[messages.length - 1]);
      
    } catch (error) {
      console.error('Error parsing line:', line, error);
      skippedLines++;
      continue;
    }
  }
  
  console.log(`Parsing complete. Found ${messages.length} payment messages. Skipped ${skippedLines} lines.`);
  return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}