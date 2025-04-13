'use client';

import { useState, useMemo } from 'react';
import { WhatsAppMessage, SUPPORTED_CURRENCIES, CurrencyCode } from '@/lib/parseChat';
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
    // Use locale-aware formatting for amounts
    return `${currencyInfo.symbol} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
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
      // Use locale-aware date formatting
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
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyCode | null>(null);

  // Extract unique senders for filtering
  const uniqueSenders = useMemo(() => {
    const senders = new Set<string>();
    messages.forEach(msg => senders.add(msg.sender));
    return Array.from(senders);
  }, [messages]);

  // Extract unique currencies for filtering
  const uniqueCurrencies = useMemo(() => {
    const currencies = new Set<CurrencyCode>();
    messages.forEach(msg => currencies.add(msg.currency));
    return Array.from(currencies);
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
    // First make sure we have valid messages with valid dates
    if (!messages.length) {
      const today = new Date();
      return {
        minDate: today.toISOString().split('T')[0],
        maxDate: today.toISOString().split('T')[0]
      };
    }
    
    // Filter out any invalid dates
    const validDates = messages
      .map(msg => msg.timestamp)
      .filter(date => !isNaN(date.getTime()));
    
    // If no valid dates, return today's date
    if (!validDates.length) {
      const today = new Date();
      return {
        minDate: today.toISOString().split('T')[0],
        maxDate: today.toISOString().split('T')[0]
      };
    }
    
    const timestamps = validDates.map(d => d.getTime());
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    
    return {
      minDate: new Date(minTimestamp).toISOString().split('T')[0],
      maxDate: new Date(maxTimestamp).toISOString().split('T')[0]
    };
  }, [messages]);

  // Filter messages by sender, search term, date range, and currency
  const filteredMessages = useMemo(() => {
    return messages
      .filter(msg => !currentFilter || msg.sender === currentFilter)
      .filter(msg => !currencyFilter || msg.currency === currencyFilter)
      .filter(msg => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          msg.content.toLowerCase().includes(searchLower) ||
          msg.sender.toLowerCase().includes(searchLower) ||
          formatAmount(msg.amount, msg.currency).toLowerCase().includes(searchLower) ||
          // Also search by currency name
          SUPPORTED_CURRENCIES[msg.currency].name.toLowerCase().includes(searchLower) ||
          // Search by amount as number (without currency symbol)
          msg.amount.toString().includes(searchTerm)
        );
      })
      .filter(msg => {
        if (!startDate && !endDate) return true;
        const msgDate = msg.timestamp.toISOString().split('T')[0];
        if (startDate && !endDate) return msgDate >= startDate;
        if (!startDate && endDate) return msgDate <= endDate;
        return msgDate >= startDate && msgDate <= endDate;
      });
  }, [messages, currentFilter, searchTerm, startDate, endDate, currencyFilter]);

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
                placeholder="Search by message, sender, amount, or currency..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>

            {/* Currency Filter */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Filter by Currency</h3>
                {currencyFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setCurrencyFilter(null)}
                  >
                    Clear Currency Filter
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={currencyFilter === null ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 px-3 ${currencyFilter === null ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
                  onClick={() => setCurrencyFilter(null)}
                >
                  All Currencies
                </Button>
                {uniqueCurrencies.map(currency => (
                  <Button
                    key={currency}
                    variant={currencyFilter === currency ? "default" : "outline"}
                    size="sm"
                    className={`text-xs h-8 px-3 ${currencyFilter === currency ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
                    onClick={() => setCurrencyFilter(currency)}
                  >
                    {SUPPORTED_CURRENCIES[currency].name} ({SUPPORTED_CURRENCIES[currency].symbol})
                  </Button>
                ))}
              </div>
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
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
                        {message.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {SUPPORTED_CURRENCIES[message.currency].symbol}
                        </span>
                        <span className="text-gray-600">
                          {SUPPORTED_CURRENCIES[message.currency].name}
                        </span>
                      </div>
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
            <p className="text-gray-500">No messages match the current filters.</p>
            <div className="flex justify-center gap-3 mt-4">
              {currentFilter && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentFilter(null)}
                >
                  Clear Sender Filter
                </Button>
              )}
              {currencyFilter && (
                <Button
                  variant="outline"
                  onClick={() => setCurrencyFilter(null)}
                >
                  Clear Currency Filter
                </Button>
              )}
              {(startDate || endDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Clear Date Filter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Financial Summary Card - Moved to bottom */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {financialSummary.map(({ currency, symbol, total }) => (
            <div key={currency} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">{SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES].name}</span>
                <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">
                  {symbol}
                </span>
              </div>
              <div className="text-2xl font-semibold text-green-600">
                {symbol}{total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}