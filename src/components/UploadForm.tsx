'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMessage } from '@/lib/parseChat';

interface UploadFormProps {
  onMessagesFound: (messages: WhatsAppMessage[]) => void;
}

// Utility function to ensure minimum loading time
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
  const FILE_UPLOAD_ID = 'file-upload';

  // Reset file input when needed
  useEffect(() => {
    const fileInput = document.getElementById(FILE_UPLOAD_ID) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [error]);

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
      
      // Process file with minimum 3 second loading time
      const messages = await withMinimumLoadingTime(processFile(file), 3000);
      onMessagesFound(messages);
      
      // Reset the file input after successful upload
      const fileInput = document.getElementById(FILE_UPLOAD_ID) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
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
          id={FILE_UPLOAD_ID}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          disabled={isLoading}
        />
        
        <div className="relative">
          <Button
            onClick={() => document.getElementById(FILE_UPLOAD_ID)?.click()}
            variant="outline"
            className="mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Select File'}
          </Button>

          {isLoading && (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span className="text-sm text-gray-600">Processing your chat file...</span>
              </div>
            </div>
          )}
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