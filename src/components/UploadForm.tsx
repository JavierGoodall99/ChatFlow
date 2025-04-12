'use client';

import { useState, useEffect } from 'react';
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
      className={`w-full max-w-xl mx-auto p-8 border-2 border-dashed rounded-xl 
        ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}
        ${isLoading ? 'opacity-75' : ''}
        transition-all duration-300 cursor-pointer`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById(FILE_UPLOAD_ID)?.click()}
    >
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Upload WhatsApp Chat</h2>
        <p className="text-gray-600 mb-4">
          <span className="block mb-1">Drag and drop your WhatsApp chat export (.txt) here</span>
          <span className="text-sm opacity-80">or click to browse files</span>
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
        
        <div className="flex justify-center">
          {isLoading ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-gray-600">Processing your chat file...</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500 mt-2">All processing happens in your browser. Your data stays private.</div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg border border-red-200 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}