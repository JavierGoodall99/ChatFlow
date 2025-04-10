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
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Time</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Sender</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Amount</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {messages.map((message, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {message.timestamp.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {message.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {message.sender}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      R {message.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 min-w-[200px]">
                      {cleanMessage(message) || <em className="text-gray-400">No additional message</em>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}