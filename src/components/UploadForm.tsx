'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMessage } from '@/lib/parseChat';

interface UploadFormProps {
  onMessagesFound: (messages: WhatsAppMessage[]) => void;
}

export function UploadForm({ onMessagesFound }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Reading file:', file.name, 'Size:', file.size);
      const text = await file.text();
      console.log('File content length:', text.length);
      console.log('First 100 chars:', text.substring(0, 100));
      
      const { parseChat } = await import('@/lib/parseChat');
      const messages = parseChat(text);
      console.log('Found messages:', messages.length);
      
      if (messages.length === 0) {
        setError('No payment messages found in the chat. Make sure the file contains messages with Rand amounts (e.g., "R250.00")');
        return;
      }
      
      onMessagesFound(messages);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process the file. Make sure it\'s a valid WhatsApp chat export.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.txt')) {
      handleFileUpload(file);
    } else {
      setError('Please upload a .txt file exported from WhatsApp');
    }
  };

  return (
    <div 
      className={`w-full max-w-xl mx-auto p-8 border-2 border-dashed rounded-lg
        ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}
        transition-colors duration-200`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Upload WhatsApp Chat</h2>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop your WhatsApp chat export (.txt) here
        </p>
        
        <input
          type="file"
          accept=".txt"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          disabled={isLoading}
        />
        
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          variant="outline"
          className="mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Select File'}
        </Button>

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="mt-4 text-sm text-gray-600">
            Processing your chat file...
          </p>
        )}
      </div>
    </div>
  );
}