'use client';

import { useState, useEffect } from 'react';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from '@/lib/parseChat';
import { Button } from '@/components/ui/button';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { INVOICE_TEMPLATES, InvoiceTemplateID } from '@/lib/invoiceTemplates';

interface InvoiceFormProps {
  selectedMessages: WhatsAppMessage[];
  onClose: () => void;
}

export function InvoiceForm({ selectedMessages, onClose }: InvoiceFormProps) {
  // Create a copy of the messages that can be modified
  const [editableMessages, setEditableMessages] = useState<WhatsAppMessage[]>([]);
  
  // Initialize editable messages when selected messages change
  useEffect(() => {
    setEditableMessages([...selectedMessages]);
  }, [selectedMessages]);
  
  // Group messages by currency for display
  const groupedMessages = editableMessages.reduce<Record<string, WhatsAppMessage[]>>((acc, message) => {
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

  // Update message description handler
  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedMessages = [...editableMessages];
    updatedMessages[index] = {
      ...updatedMessages[index],
      content: newDescription
    };
    setEditableMessages(updatedMessages);
  };

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
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateID>('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Determine if the primary sender is the same for all messages
  const primarySender = editableMessages.length > 0 ? editableMessages[0].sender : '';
  const allSameSender = editableMessages.every(msg => msg.sender === primarySender);

  // Prefill client name if all messages have the same sender
  useEffect(() => {
    if (allSameSender && primarySender) {
      setClientName(primarySender);
    }
  }, [allSameSender, primarySender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      await generateInvoicePDF({
        invoiceNumber,
        clientName,
        companyName: companyName || 'Your Business Name',
        invoiceDate: new Date(invoiceDate),
        messages: editableMessages, // Use the edited messages
        notes,
        templateId: selectedTemplate,
      });
      
      onClose();
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Failed to generate invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get template accent color as a CSS color string
  const getTemplateAccentColor = (templateId: InvoiceTemplateID): string => {
    const template = INVOICE_TEMPLATES[templateId];
    return `rgb(${template.primaryColor[0]}, ${template.primaryColor[1]}, ${template.primaryColor[2]})`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Invoice</h2>
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
          <div className="space-y-4 mb-6">
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
          
          <div className="border-t border-b border-gray-100 py-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Items ({editableMessages.length})</h3>
            
            {/* Summary by currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {totals.map(({ currency, symbol, name, total }) => (
                <div key={currency} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{name}</span>
                    <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">
                      {symbol}
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {symbol}{total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message list preview with editable descriptions */}
            <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Description</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editableMessages.map((message, index) => (
                    <tr key={index} className="text-sm">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {message.timestamp.toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {message.sender}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={message.content}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
                          placeholder="Add or edit description"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">
                        {SUPPORTED_CURRENCIES[message.currency].symbol}
                        {message.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
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