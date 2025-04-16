'use client';

import { useState, useEffect } from 'react';
import { WhatsAppMessage } from '@/lib/parseChat';
import { cn } from '@/lib/utils';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    const result = parseChat(text);
    
    if (result.messages.length === 0) {
      throw new Error('No payment messages found in the chat. Make sure the file contains messages with currency amounts.');
    }
    
    return result.messages;
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedFile(file);
    
      
      // Process file with minimum 2.5 second loading time
      const messages = await withMinimumLoadingTime(processFile(file), 2500);
      onMessagesFound(messages);
      
      // Reset the file input after successful upload
      const fileInput = document.getElementById(FILE_UPLOAD_ID) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the file. Make sure it\'s a valid WhatsApp chat export.');
      setSelectedFile(null);
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
  
  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    const fileInput = document.getElementById(FILE_UPLOAD_ID) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full rounded-2xl transition-all duration-300",
          "border-2 border-dashed p-8",
          isDragging 
            ? "border-primary/60 bg-primary/5" 
            : "border-gray-200 hover:border-primary/40 hover:bg-gray-50/50",
          isLoading && "opacity-70 pointer-events-none"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* File Upload Icon */}
        <div className={cn(
          "mb-5 flex flex-col items-center justify-center text-center",
          isLoading ? "opacity-50" : ""
        )}>
          <div className="h-20 w-20 mb-3 rounded-full flex items-center justify-center bg-primary/5">
            <svg 
              className="h-10 w-10 text-primary" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>

          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold">Ready to process</div>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                {!isLoading && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      removeFile();
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium mb-1">Upload WhatsApp Chat</div>
              <p className="text-gray-500 text-sm max-w-xs text-center mb-2">
                Drag and drop your WhatsApp chat export or click to browse files
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>All processing happens in your browser</span>
              </div>
            </div>
          )}
        </div>

        {/* Browse Button */}
        {!selectedFile && !isLoading && (
          <button
            onClick={() => document.getElementById(FILE_UPLOAD_ID)?.click()}
            className="relative inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/80"
            type="button"
          >
            Browse Files
          </button>
        )}

        {/* Process Button */}
        {selectedFile && !isLoading && (
          <button
            onClick={() => selectedFile && handleFileUpload(selectedFile)}
            className="relative inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/80"
            type="button"
          >
            Process Chat File
          </button>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 h-10 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm font-medium text-gray-700">Processing your chat...</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs text-center">
              Analyzing messages and identifying payment data. This may take a moment.
            </p>
          </div>
        )}

        {/* Hidden Input */}
        <input
          type="file"
          accept=".txt"
          className="hidden"
          id={FILE_UPLOAD_ID}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.name.endsWith('.txt')) {
                handleFileUpload(file);
              } else {
                setError('Please upload a .txt file exported from WhatsApp');
              }
            }
          }}
          disabled={isLoading}
        />

        {error && (
          <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg border border-red-100 shadow-sm max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="font-medium">Upload Error</span>
            </div>
            <p className="text-sm">
              {error}
            </p>
          </div>
        )}
        
        {/* Help Text */}
        <div className="text-xs text-gray-400 mt-6 text-center max-w-sm">
          <p>Supported format: .txt</p>
        </div>
      </div>
    </div>
  );
}