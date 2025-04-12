'use client';

import { useState } from 'react';
import { UploadForm } from '@/components/UploadForm';
import { MessageList } from '@/components/MessageList';
import { ExportButtons } from '@/components/ExportButtons';
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
        <header className="mb-12 text-center">
          <div className="flex justify-center">
            <div className="bg-green-500 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="10" x2="15" y2="10"></line>
                <line x1="12" y1="7" x2="12" y2="13"></line>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            WhatsApp Receipt Cleaner
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Extract payment-related messages from your WhatsApp chats for easy record-keeping and accounting.
          </p>
        </header>

        {showIntro && messages.length === 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-blue-600 bg-blue-100 p-2 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">1. Upload Chat</h2>
              <p className="text-gray-600 text-sm">
                Export your WhatsApp chat as a .txt file and upload it here securely. All processing happens in your browser.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-purple-600 bg-purple-100 p-2 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="4" y1="14" x2="20" y2="16"></line>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">2. Review Results</h2>
              <p className="text-gray-600 text-sm">
                See a clean list of all payment-related messages, sorted by date, with amounts clearly labeled.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-green-600 bg-green-100 p-2 rounded-full inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">3. Export Data</h2>
              <p className="text-gray-600 text-sm">
                Download as PDF for records or CSV for importing into Excel, Google Sheets or accounting software.
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

        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>
            WhatsApp Receipt Cleaner | <span className="opacity-75">Privacy-focused & works entirely in your browser</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
