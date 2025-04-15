'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UploadForm } from '@/components/UploadForm';
import { MessageList } from '@/components/MessageList';
import { ExportButtons } from '@/components/ExportButtons';
import { CreateInvoiceButton } from '@/components/CreateInvoiceButton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { WhatsAppMessage } from '@/lib/parseChat';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);

  const handleMessagesFound = (foundMessages: WhatsAppMessage[]) => {
    setMessages(foundMessages);
  };

  const handleStartOver = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src="/icon.png"
                  alt="WhatsApp Receipt Cleaner Icon"
                  width={90}
                  height={90}
                  className="relative drop-shadow-md"
                  priority
                />
              </div>
              <div className="text-center">
                <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
                  Extract payment-related messages from your WhatsApp chats for easy record-keeping and accounting.
                </p>
                <div className="flex justify-center space-x-4">
                  <CreateInvoiceButton />
                </div>
              </div>
            </div>
          </header>
          <div className={messages.length > 0 ? "opacity-75 scale-95 transform transition-all" : ""}>
            <UploadForm onMessagesFound={handleMessagesFound} />
          </div>
          
          {messages.length > 0 && (
            <div className="mt-12 space-y-10 animate-fade-in">
              <MessageList messages={messages} />
              <ExportButtons messages={messages} />
              
              <div className="flex justify-center pt-4 gap-4">
                <Button 
                  onClick={handleStartOver}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Start Over
                </Button>
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload New Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
