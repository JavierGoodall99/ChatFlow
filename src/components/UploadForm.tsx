'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMessage } from '@/lib/parseChat';

interface UploadFormProps {
  onMessagesFound: (messages: WhatsAppMessage[]) => void;
}

const withMinimumLoadingTime = async <T,>(
  promise: Promise<T>,
  minimumTime: number
): Promise<T> => {
  const startTime = Date.now();
  const result = await promise;
  const elapsedTime = Date.now() - startTime;
  
  if (elapsedTime < minimumTime) {
    await new Promise(resolve => setTimeout(resolve, minimumTime - elapsedTime));
  }
  
  return result;
};

export function UploadForm({ onMessagesFound }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    const text = await file.text();
    const { parseChat } = await import('@/lib/parseChat');
    const messages = parseChat(text);
    
    if (messages.length === 0) {
      throw new Error('No payment messages found in the chat. Make sure the file contains messages with currency amounts.');
    }
    
    return messages;
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const messages = await withMinimumLoadingTime(processFile(file), 3000);
      onMessagesFound(messages);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the file. Make sure it\'s a valid WhatsApp chat export.');
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
        ${isLoading ? 'opacity-75' : ''}
        transition-all duration-200`}
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
        
        <div className="relative">
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            variant="outline"
            className="mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Select File'}
          </Button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}