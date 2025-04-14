'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UploadForm } from '@/components/UploadForm';
import { MessageList } from '@/components/MessageList';
import { ExportButtons } from '@/components/ExportButtons';
import { CreateInvoiceButton } from '@/components/CreateInvoiceButton';
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
    <main className="min-h-screen p-4 md:p-8">
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                WhatsApp Receipt Cleaner
              </h1>
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

        <footer className="mt-16 border-t border-gray-200 pt-8 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-4">
              <Image
                src="/icon.png"
                alt="WhatsApp Receipt Cleaner Icon"
                width={32}
                height={32}
                className="opacity-80"
              />
            </div>
            
            <h3 className="text-gray-700 font-medium mb-3">WhatsApp Receipt Cleaner</h3>
            
            <p className="text-sm text-gray-500 mb-4">
              Privacy-focused tool for freelancers and small businesses.<br/>
              Process payment messages entirely in your browser.
            </p>
            
            <div className="flex justify-center gap-6 mb-6 text-xs text-gray-400">
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                How to export WhatsApp chats
              </a>
              <Link href="/help" className="hover:text-primary transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1-5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Help & FAQ
              </Link>
            </div>
            
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} WhatsApp Receipt Cleaner | All processing happens in your browser
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
