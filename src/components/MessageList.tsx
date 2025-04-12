'use client';

import { useState, useMemo } from 'react';
import { WhatsAppMessage, SUPPORTED_CURRENCIES } from '@/lib/parseChat';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: WhatsAppMessage[];
}

export function MessageList({ messages }: MessageListProps) {
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

  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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

  // Calculate min and max dates from messages
  const dateRange = useMemo(() => {
    const dates = messages.map(msg => msg.timestamp);
    return {
      minDate: new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0],
      maxDate: new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0]
    };
  }, [messages]);

  // Filter messages by sender, search term, and date range
  const filteredMessages = useMemo(() => {
    return messages
      .filter(msg => !currentFilter || msg.sender === currentFilter)
      .filter(msg => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          msg.content.toLowerCase().includes(searchLower) ||
          msg.sender.toLowerCase().includes(searchLower) ||
          formatAmount(msg.amount, msg.currency).toLowerCase().includes(searchLower)
        );
      })
      .filter(msg => {
        if (!startDate && !endDate) return true;
        const msgDate = msg.timestamp.toISOString().split('T')[0];
        if (startDate && !endDate) return msgDate >= startDate;
        if (!startDate && endDate) return msgDate <= endDate;
        return msgDate >= startDate && msgDate <= endDate;
      });
  }, [messages, currentFilter, searchTerm, startDate, endDate]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col gap-6">
            {/* Search Input */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Search Messages</h3>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by message, sender, or amount..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>

            {/* Sender Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Filter by Sender</h3>
                {currentFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setCurrentFilter(null)}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={currentFilter === null ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 px-3 ${currentFilter === null ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
                  onClick={() => setCurrentFilter(null)}
                >
                  All Messages ({messages.length})
                </Button>
                {uniqueSenders.map(sender => (
                  <Button
                    key={sender}
                    variant={currentFilter === sender ? "default" : "outline"}
                    size="sm"
                    className={`text-xs h-8 px-3 ${currentFilter === sender ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
                    onClick={() => setCurrentFilter(sender)}
                  >
                    {sender} ({messages.filter(m => m.sender === sender).length})
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Filter by Date Range</h3>
                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={dateRange.minDate}
                    max={dateRange.maxDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={dateRange.minDate}
                    max={dateRange.maxDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white mb-8">
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
                      {message.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
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

      {/* Financial Summary Card - Moved to bottom */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {financialSummary.map(({ currency, symbol, total }) => (
            <div key={currency} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">{currency} Total</div>
              <div className="text-2xl font-semibold text-green-600">
                {symbol}{total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}