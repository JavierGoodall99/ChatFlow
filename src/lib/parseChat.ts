import { z } from "zod";

// Define the schema for a WhatsApp message
export const WhatsAppMessageSchema = z.object({
  timestamp: z.date(),
  sender: z.string(),
  content: z.string(),
  amount: z.number(),
});

export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;

// Regex pattern for R currency amounts - now handles more variations
const AMOUNT_PATTERN = /R\s*([0-9,]+(?:\.[0-9]{2})?)|R\s*([0-9,]+)/g;

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

      // WhatsApp format variations:
      // YYYY/MM/DD, HH:mm - Sender: Message (your format)
      // [DD/MM/YY HH:mm:ss] Sender: Message
      // [DD/MM/YYYY, HH:mm:ss] Sender: Message
      // DD/MM/YY, HH:mm - Sender: Message
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
      
      // Look for currency amounts in the message
      const amountMatches = Array.from(messageContent.matchAll(AMOUNT_PATTERN));
      if (amountMatches.length === 0) {
        console.log('No amount found in message:', messageContent);
        skippedLines++;
        continue;
      }
      
      console.log('Found amount matches:', amountMatches);
      
      // Extract the first amount found
      const amountStr = amountMatches[0][0]
        .replace('R', '')
        .replace(/\s/g, '')
        .replace(/,/g, '');
      
      const amount = parseFloat(amountStr);
      
      if (isNaN(amount)) {
        console.warn('Failed to parse amount:', amountStr);
        skippedLines++;
        continue;
      }

      // Handle YYYY/MM/DD format specifically
      let dateStr: string;
      if (timestamp.match(/^\d{4}\/\d{2}\/\d{2}/)) {
        // YYYY/MM/DD, HH:mm format
        const [date, time] = timestamp.split(',');
        const [year, month, day] = date.split('/');
        dateStr = `${year}-${month}-${day}T${time.trim()}:00`;
      } else if (timestamp.includes(',')) {
        // DD/MM/YY, HH:mm format
        const [date, time] = timestamp.split(',');
        const [day, month, year] = date.split('/');
        dateStr = `20${year}-${month}-${day}T${time.trim()}:00`;
      } else {
        // [DD/MM/YY HH:mm:ss] format
        const [day, month, year] = timestamp.split(' ')[0].split('/');
        const time = timestamp.split(' ')[1];
        dateStr = `20${year}-${month}-${day}T${time}`;
      }
      
      console.log('Created date string:', dateStr);
      
      messages.push({
        timestamp: new Date(dateStr),
        sender,
        content: messageContent,
        amount,
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