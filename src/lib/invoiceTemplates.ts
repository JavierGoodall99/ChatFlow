import { CurrencyCode } from './parseChat';

export type InvoiceTemplateID = 'classic' | 'modern' | 'minimalist' | 'professional' | 'creative';

// Define the template structure
export interface InvoiceTemplate {
  id: InvoiceTemplateID;
  name: string;
  description: string;
  primaryColor: [number, number, number]; // RGB values
  secondaryColor: [number, number, number]; // RGB values
  accentColor: [number, number, number]; // RGB values for amounts/totals
  fontFamily: string;
  previewImage?: string; // optional path to preview image
}

// Define available templates
export const INVOICE_TEMPLATES: Record<InvoiceTemplateID, InvoiceTemplate> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional black and white design with clean typography',
    primaryColor: [51, 51, 51], // Dark gray
    secondaryColor: [102, 102, 102], // Medium gray
    accentColor: [0, 0, 0], // Black
    fontFamily: 'helvetica',
  },
  
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek blue design with a contemporary look',
    primaryColor: [0, 82, 204], // Blue
    secondaryColor: [51, 51, 51], // Dark gray
    accentColor: [5, 150, 105], // Green for amounts
    fontFamily: 'helvetica',
  },
  
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simplified layout with plenty of white space',
    primaryColor: [100, 100, 100], // Gray
    secondaryColor: [180, 180, 180], // Light gray
    accentColor: [80, 80, 80], // Dark gray for amounts
    fontFamily: 'helvetica',
  },
  
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Formal design with navy blue accents for business settings',
    primaryColor: [25, 52, 88], // Navy blue
    secondaryColor: [62, 82, 109], // Slightly lighter navy
    accentColor: [66, 133, 244], // Bright blue for amounts
    fontFamily: 'helvetica',
  },
  
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful template for creative businesses',
    primaryColor: [142, 68, 173], // Purple
    secondaryColor: [41, 128, 185], // Blue
    accentColor: [39, 174, 96], // Green for amounts
    fontFamily: 'helvetica',
  }
};

// Helper function to get a template by ID with fallback to default
export function getTemplateByID(id: string): InvoiceTemplate {
  return INVOICE_TEMPLATES[id as InvoiceTemplateID] || INVOICE_TEMPLATES.modern;
}

// Format currency with the template's accent color
export function formatCurrency(
  amount: number, 
  currency: CurrencyCode, 
  symbol: string
): string {
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}