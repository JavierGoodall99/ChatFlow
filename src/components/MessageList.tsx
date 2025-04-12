'use client';

import { useState, useMemo } from 'react';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from '@/lib/parseChat';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: WhatsAppMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  // Extract unique senders for filtering
  const uniqueSenders = useMemo(() => {
    const senders = new Set<string>();
    messages.forEach(msg => senders.add(msg.sender));
    return Array.from(senders);
  }, [messages]);

  // Calculate financial totals
  const financialSummary = useMemo(() => {
    const totals: Record<string, number> = {};
    
    messages.forEach(msg => {
      if (!totals[msg.currency]) {
        totals[msg.currency] = 0;
      }
      totals[msg.currency] += msg.amount;
    });
    
    return Object.entries(totals).map(([currency, total]) => ({
      currency,
      symbol: SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].symbol,
      total
    }));
  }, [messages]);

  // Filter messages by sender if filter is active
  const filteredMessages = useMemo(() => {
    if (!currentFilter) return messages;
    return messages.filter(msg => msg.sender === currentFilter);
  }, [messages, currentFilter]);

  if (messages.length === 0) {
    return null;
  }

  const cleanMessage = (message: WhatsAppMessage) => {
    return message.content.trim();
  };

  const formatAmount = (amount: number, currency: keyof typeof SUPPORTED_CURRENCIES) => {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];
    return `${currencyInfo.symbol} ${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Messages</h2>
          <p className="text-gray-500 text-sm mt-1">Found {messages.length} payment-related messages</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Financial Summary</div>
            <div className="flex gap-3">
              {financialSummary.map(({ currency, symbol, total }) => (
                <div key={currency} className="text-sm font-semibold">
                  <span className="text-green-600">{symbol}{total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Filter by sender</div>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant={currentFilter === null ? "default" : "outline"}
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => setCurrentFilter(null)}
              >
                All
              </Button>
              
              {uniqueSenders.map(sender => (
                <Button
                  key={sender}
                  variant={currentFilter === sender ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setCurrentFilter(sender)}
                >
                  {sender}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredMessages.map((message, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(message.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {message.timestamp.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                          {message.sender.charAt(0)}
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{message.sender}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                      <span className="text-green-600 font-semibold">
                        {formatAmount(message.amount, message.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="max-w-[300px] line-clamp-2 hover:line-clamp-none">
                        {cleanMessage(message) || <em className="text-gray-400">No additional message</em>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages match the current filter.</p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => setCurrentFilter(null)}
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}