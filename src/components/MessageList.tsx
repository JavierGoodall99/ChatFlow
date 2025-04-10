'use client';

import { WhatsAppMessage } from '@/lib/parseChat';

interface MessageListProps {
  messages: WhatsAppMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  const cleanMessage = (message: WhatsAppMessage) => {
    // Remove the R amount pattern from the message
    return message.content.replace(/R\s*[0-9,]+(\.[0-9]{2})?/g, '').trim();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment Messages</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Sender</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {messages.map((message, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {message.timestamp.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {message.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {message.sender}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  R {message.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {cleanMessage(message) || <em className="text-gray-400">No additional message</em>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}