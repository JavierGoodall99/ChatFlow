'use client';

import { useState } from 'react';
import { UploadForm } from '@/components/UploadForm';
import { MessageList } from '@/components/MessageList';
import { ExportButtons } from '@/components/ExportButtons';
import type { WhatsAppMessage } from '@/lib/parseChat';

export default function Home() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          WhatsApp Receipt Cleaner
        </h1>
        
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your WhatsApp chat export to extract payment-related messages. 
          We&apos;ll filter out the noise and show you a clean list of transactions.
        </p>

        <UploadForm onMessagesFound={setMessages} />
        
        {messages.length > 0 && (
          <>
            <MessageList messages={messages} />
            <ExportButtons messages={messages} />
          </>
        )}
      </div>
    </main>
  );
}
