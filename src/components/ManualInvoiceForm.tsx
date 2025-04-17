'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, CurrencyCode } from '@/lib/parseChat';
import { Button } from '@/components/ui/button';
import { INVOICE_TEMPLATES, InvoiceTemplateID } from '@/lib/invoiceTemplates';

// Define a manual invoice line item
interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
}

interface ManualInvoiceFormProps {
  onClose: () => void;
}

export function ManualInvoiceForm({ onClose }: ManualInvoiceFormProps) {
  // Generate invoice number (current date + random suffix)
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateID>('modern');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { 
      id: crypto.randomUUID(),
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      currency: 'USD' 
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Update line item currency when selected currency changes
  useEffect(() => {
    if (selectedCurrency) {
      setLineItems(prevItems => 
        prevItems.map(item => ({ ...item, currency: selectedCurrency }))
      );
    }
  }, [selectedCurrency]);

  // Calculate totals
  const invoiceTotal = lineItems.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice), 0
  );

  // Add a new line item
  const addLineItem = () => {
    setLineItems([
      ...lineItems, 
      { 
        id: crypto.randomUUID(),
        description: '', 
        quantity: 1, 
        unitPrice: 0, 
        currency: selectedCurrency 
      }
    ]);
  };

  // Remove a line item
  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Update a line item
  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(prevItems => 
          prevItems.map(item => 
            item.id === id 
              ? { ...item, [field]: field === 'quantity' || field === 'unitPrice' 
                  ? parseFloat(value.toString()) || 0 
                  : value } 
              : item
          )
        );
  };

  // Format currency amount
  const formatCurrency = (amount: number, currency: CurrencyCode) => {
    const symbol = SUPPORTED_CURRENCIES[currency].symbol;
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get template accent color as a CSS color string
  const getTemplateAccentColor = (templateId: InvoiceTemplateID): string => {
    const template = INVOICE_TEMPLATES[templateId];
    return `rgb(${template.primaryColor[0]}, ${template.primaryColor[1]}, ${template.primaryColor[2]})`;
  };

  // Convert invoice data to a format compatible with existing PDF generator
  const prepareInvoiceData = () => {
    // Convert line items to "WhatsApp-like" messages format for compatibility
    const messages = lineItems.map(item => ({
      timestamp: new Date(invoiceDate),
      sender: clientName,
      content: item.description,
      amount: item.quantity * item.unitPrice,
      currency: item.currency,
      source: 'text' as const // Using const assertion to specify literal type
    }));

    return {
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      clientName,
      companyName: companyName || 'Your Business Name',
      messages,
      notes,
      templateId: selectedTemplate, // Include the selected template
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }

    if (lineItems.some(item => !item.description.trim())) {
      setError('All line items must have a description');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Dynamically import the PDF generator to reduce initial load time
      const { generateInvoicePDF } = await import('@/lib/generateInvoicePDF');
      await generateInvoicePDF(prepareInvoiceData());
      
      onClose();
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Failed to generate invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Manual Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Template selection section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Template
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.values(INVOICE_TEMPLATES).map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`cursor-pointer border rounded-md overflow-hidden transition-all hover:shadow-md ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-offset-2 ring-primary' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div 
                      className="h-12 w-full" 
                      style={{ backgroundColor: getTemplateAccentColor(template.id) }} 
                    />
                    <div className="p-2 bg-white">
                      <p className="text-xs font-medium">{template.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Invoice details section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  id="invoiceDate"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  required
                />
              </div>
            </div>

            {/* Client and company information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Business Name"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
              </div>
            </div>

            {/* Currency selection */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              >
                {Object.entries(SUPPORTED_CURRENCIES).map(([code, { name, symbol }]) => (
                  <option key={code} value={code}>
                    {name} ({symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Line items section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Items
                </label>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  className="text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Item
                </Button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Quantity</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Unit Price</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Amount</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-center">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                            className="w-16 px-2 py-1 text-center border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-center">
                          <div className="flex items-center">
                            <span className="mr-1">{SUPPORTED_CURRENCIES[selectedCurrency].symbol}</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
                              required
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.quantity * item.unitPrice, selectedCurrency)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 text-center">
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length === 1}
                            className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-2 text-sm" colSpan={2}></td>
                      <td className="px-4 py-2 text-sm font-semibold text-right">Total:</td>
                      <td className="px-4 py-2 text-sm font-semibold text-right">
                        {formatCurrency(invoiceTotal, selectedCurrency)}
                      </td>
                      <td className="px-4 py-2 text-sm"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes section */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional information for the invoice..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </span>
              ) : (
                "Generate Invoice PDF"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}