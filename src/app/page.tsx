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
  const [showIntro, setShowIntro] = useState(true);

  const handleMessagesFound = (foundMessages: WhatsAppMessage[]) => {
    setMessages(foundMessages);
    setShowIntro(false);
  };

  const handleStartOver = () => {
    setMessages([]);
    setShowIntro(true);
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

        {showIntro && messages.length === 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col">
              <div className="text-blue-600 bg-blue-100 p-3 rounded-full inline-block mb-4 self-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="relative mb-3">
                <span className="absolute top-0 -left-2 text-5xl font-bold text-blue-100 -z-10">1</span>
                <h2 className="text-xl font-semibold">Upload Chat</h2>
              </div>
              <p className="text-gray-600">
                Export your WhatsApp chat as a .txt file and upload it here securely. All processing happens in your browser.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all duration-300 flex flex-col">
              <div className="text-purple-600 bg-purple-100 p-3 rounded-full inline-block mb-4 self-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="4" y1="14" x2="20" y2="16"></line>
                </svg>
              </div>
              <div className="relative mb-3">
                <span className="absolute top-0 -left-2 text-5xl font-bold text-purple-100 -z-10">2</span>
                <h2 className="text-xl font-semibold">Review Results</h2>
              </div>
              <p className="text-gray-600">
                See a clean list of all payment-related messages, sorted by date, with amounts clearly labeled.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all duration-300 flex flex-col">
              <div className="text-green-600 bg-green-100 p-3 rounded-full inline-block mb-4 self-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div className="relative mb-3">
                <span className="absolute top-0 -left-2 text-5xl font-bold text-green-100 -z-10">3</span>
                <h2 className="text-xl font-semibold">Export Data</h2>
              </div>
              <p className="text-gray-600">
                Download as a professional PDF document with full transaction summary for your records.
              </p>
            </div>
          </div>
        )}

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
