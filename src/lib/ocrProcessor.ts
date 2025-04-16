import Tesseract from 'tesseract.js';
import type { WhatsAppMessage, CurrencyCode } from './parseChat';
import { SUPPORTED_CURRENCIES } from './parseChat';

// OCR Status types for tracking processing state
export type OCRProcessingStatus = 'idle' | 'loading' | 'processing' | 'success' | 'error';

export interface OCRResult {
    text: string;
    confidence: number;
    imageUrl?: string; // URL for displaying the processed image
    sourceFilename: string;
    detectedAmounts: Array<{
        amount: number;
        currency: CurrencyCode;
        text: string; // The text context around the amount
        item?: string; // The item name associated with the amount
    }>;
}

export interface OCRProgressInfo {
    status: OCRProcessingStatus;
    progress: number; // 0-100
    currentStep?: string;
    error?: string;
}

// Define proper type for Tesseract progress status
type TesseractProgressStatus = {
    status: string;
    progress: number;
    jobId?: string;
    userJobId?: string;
};

// Extract payment-related information from OCR text
export function extractPaymentInfo(ocrText: string): Array<{ amount: number, currency: CurrencyCode, text: string, item?: string }> {
    const results: Array<{ amount: number, currency: CurrencyCode, text: string, item?: string }> = [];

    // Currency patterns similar to those in parseChat.ts
    const currencyPatterns = [
        { currency: 'ZAR' as CurrencyCode, symbol: 'R', regex: /R\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'USD' as CurrencyCode, symbol: '$', regex: /\$\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'EUR' as CurrencyCode, symbol: '€', regex: /€\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'GBP' as CurrencyCode, symbol: '£', regex: /£\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'INR' as CurrencyCode, symbol: '₹', regex: /₹\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'AUD' as CurrencyCode, symbol: 'A$', regex: /A\$\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'BRL' as CurrencyCode, symbol: 'R$', regex: /R\$\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'JPY' as CurrencyCode, symbol: '¥', regex: /¥\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'CNY' as CurrencyCode, symbol: '¥', regex: /¥\s*(\d+(?:[.,]\d+)?)/ }, // Same symbol as JPY
        { currency: 'NGN' as CurrencyCode, symbol: '₦', regex: /₦\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'RUB' as CurrencyCode, symbol: '₽', regex: /₽\s*(\d+(?:[.,]\d+)?)/ },
        { currency: 'SAR' as CurrencyCode, symbol: 'SR', regex: /SR\s*(\d+(?:[.,]\d+)?)/ },
    ];

    // Common item descriptors and terminators for different languages
    const itemTerminators = ['total', 'subtotal', 'amount', 'price', 'cost', 'fee', 'charge', 'payment'];

    // Split the OCR text into lines for processing
    const lines = ocrText.split(/\r?\n/);

    lines.forEach(line => {
        for (const { currency, regex, symbol } of currencyPatterns) {
            const matches = line.match(new RegExp(regex, 'g'));

            if (matches) {
                matches.forEach(match => {
                    const amountMatch = match.match(regex);
                    if (amountMatch && amountMatch[1]) {
                        // Convert the matched amount to a number, handling both dot and comma as decimal separators
                        const amountStr = amountMatch[1].replace(',', '.');
                        const amount = parseFloat(amountStr);

                        if (!isNaN(amount)) {
                            // Get some context for this amount (the line where it was found)
                            const context = line.trim();

                            // Try to extract the item name from the context
                            let item: string | undefined = undefined;

                            // Method 1: Extract text before the currency symbol
                            const beforeSymbolMatch = context.match(new RegExp(`(.+?)\\s*${symbol}\\s*\\d`, 'i'));
                            if (beforeSymbolMatch && beforeSymbolMatch[1]) {
                                item = beforeSymbolMatch[1].trim();

                                // Clean up the item name - remove common prefixes and suffixes
                                item = item.replace(/^[^a-z0-9]+/i, '').trim();

                                // Check if item is just a number or empty after cleaning
                                if (!item || /^\d+$/.test(item) || item.length < 2) {
                                    item = undefined;
                                }
                            }

                            // Method 2: Look for item names in surrounding lines if no item found
                            if (!item) {
                                // Check previous line
                                const lineIndex = lines.indexOf(line);
                                if (lineIndex > 0) {
                                    const prevLine = lines[lineIndex - 1].trim();

                                    // Check if previous line isn't a monetary amount and isn't too long
                                    const hasCurrency = currencyPatterns.some(pattern =>
                                        prevLine.includes(pattern.symbol) || new RegExp(`\\b${pattern.currency}\\b`, 'i').test(prevLine)
                                    );

                                    if (!hasCurrency && prevLine.length > 0 && prevLine.length < 50) {
                                        // Exclude known headers and totals terminology
                                        const lowerPrevLine = prevLine.toLowerCase();
                                        const isTerminator = itemTerminators.some(term => lowerPrevLine.includes(term));

                                        if (!isTerminator) {
                                            item = prevLine;
                                        }
                                    }
                                }
                            }

                            // Method 3: Try to identify items based on common receipt patterns
                            if (!item) {
                                // Look for quantity x item format (e.g., "2 x Coffee" or "2X Coffee")
                                const quantityMatch = context.match(/(\d+)\s*(?:x|×)\s*([a-z].+?)(?=\s*\d|\s*$)/i);
                                if (quantityMatch && quantityMatch[2]) {
                                    item = quantityMatch[2].trim();
                                }
                            }

                            results.push({
                                amount,
                                currency,
                                text: context,
                                item
                            });
                        }
                    }
                });
            }
        }

        // Also look for currency codes followed by numbers (e.g., "USD 100")
        Object.entries(SUPPORTED_CURRENCIES).forEach(([code]) => {
            const currencyCode = code as CurrencyCode;
            // Check for patterns like "USD 100" or "100 USD"
            const codeBeforeRegex = new RegExp(`\\b${currencyCode}\\s+(\\d+(?:[.,]\\d+)?)\\b`, 'i');
            const codeAfterRegex = new RegExp(`\\b(\\d+(?:[.,]\\d+)?)\\s+${currencyCode}\\b`, 'i');

            let match = line.match(codeBeforeRegex);
            const beforeCurrency = !!match;
            if (!match) {
                match = line.match(codeAfterRegex);
            }

            if (match && match[1]) {
                const amountStr = match[1].replace(',', '.');
                const amount = parseFloat(amountStr);

                if (!isNaN(amount)) {
                    // Try to extract item name
                    let item: string | undefined = undefined;

                    // For pattern "Item USD 100", get text before currency code
                    if (beforeCurrency) {
                        const beforeMatch = line.match(new RegExp(`(.+?)\\s*${currencyCode}\\s+\\d`, 'i'));
                        if (beforeMatch && beforeMatch[1]) {
                            item = beforeMatch[1].trim();
                        }
                    }
                    // For pattern "100 USD item", get text after the amount and currency
                    else {
                        const afterMatch = line.match(new RegExp(`\\d+(?:[.,]\\d+)?\\s+${currencyCode}\\s+(.+)`, 'i'));
                        if (afterMatch && afterMatch[1]) {
                            item = afterMatch[1].trim();
                        }
                    }

                    results.push({
                        amount,
                        currency: currencyCode,
                        text: line.trim(),
                        item
                    });
                }
            }
        });
    });

    return results;
}


// Process an image file using Tesseract.js
export async function processImageWithOCR(
    imageFile: File,
    progressCallback?: (progress: OCRProgressInfo) => void
): Promise<OCRResult> {
    if (progressCallback) {
        progressCallback({ status: 'loading', progress: 0, currentStep: 'Loading image' });
    }

    try {
        // Create an object URL for the image file for display purposes
        const imageUrl = URL.createObjectURL(imageFile);

        if (progressCallback) {
            progressCallback({ status: 'processing', progress: 10, currentStep: 'Initializing OCR' });
        }

        // Initialize Tesseract worker
        const worker = await Tesseract.createWorker('eng', 1, {
            logger: (status: TesseractProgressStatus) => {
                if (progressCallback && status.progress !== undefined) {
                    const progress = Math.round(status.progress * 90) + 10; // Scale between 10-100%
                    progressCallback({
                        status: 'processing',
                        progress,
                        currentStep: status.status || 'Processing'
                    });
                }
            }
        });

        // Set worker parameters (if needed)
        await worker.setParameters({});

        // Process the image
        const result = await worker.recognize(imageFile);

        // Extract payment information from the OCR text
        const detectedAmounts = extractPaymentInfo(result.data.text);

        // Clean up the worker
        await worker.terminate();

        if (progressCallback) {
            progressCallback({ status: 'success', progress: 100, currentStep: 'Processing complete' });
        }

        return {
            text: result.data.text,
            confidence: result.data.confidence,
            imageUrl,
            sourceFilename: imageFile.name,
            detectedAmounts
        };
    } catch (error) {
        if (progressCallback) {
            progressCallback({
                status: 'error',
                progress: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
        throw error;
    }
}

// Convert OCR results to WhatsApp message format for integration with existing app flow
export function convertOCRResultToMessages(ocrResult: OCRResult, sender = 'Receipt (OCR)'): WhatsAppMessage[] {
    if (!ocrResult.detectedAmounts || ocrResult.detectedAmounts.length === 0) {
        return [];
    }

    return ocrResult.detectedAmounts.map(detection => ({
        timestamp: new Date(),
        sender,
        // Only show the item name by itself without any additional text
        content: detection.item
            ? detection.item
            : `[Receipt item]`,
        amount: detection.amount,
        currency: detection.currency,
        source: 'ocr',
        imageFilename: ocrResult.sourceFilename,
        confidence: ocrResult.confidence / 100, // Normalize to 0-1 range
        item: detection.item, // Store the item separately in case we need it elsewhere
    }));
}

// Extract image attachment references from WhatsApp chat export
export function extractImageReferences(chatText: string): string[] {
    // Pattern to match WhatsApp image attachment references
    // Examples: <attached: IMG-20240312-WA0001.jpg> or <attached: image-1.jpg>
    const imagePattern = /<attached:\s*([\w\-\.]+\.(?:jpg|jpeg|png|gif|webp))\s*>/gi;

    const matches = [...chatText.matchAll(imagePattern)];

    // Extract the filenames and remove duplicates
    const imageFilenames = matches
        .map(match => match[1])
        .filter((value, index, self) => self.indexOf(value) === index);

    return imageFilenames;
}