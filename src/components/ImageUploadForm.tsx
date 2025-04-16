'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  WhatsAppMessage, 
} from '@/lib/parseChat';
import { 
  processImageWithOCR, 
  convertOCRResultToMessages,
  OCRProgressInfo
} from '@/lib/ocrProcessor';

interface ImageUploadFormProps {
  imageReferences: string[];
  onImagesProcessed: (messages: WhatsAppMessage[]) => void;
}

interface UploadedImageStatus {
  filename: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  messages?: WhatsAppMessage[];
  error?: string;
  matchesReference?: boolean;
}

export function ImageUploadForm({ imageReferences, onImagesProcessed }: ImageUploadFormProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImageStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allProcessed, setAllProcessed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newImageStatuses = newFiles.map(file => {
      // Check if the file matches any of the referenced images
      const matchesReference = imageReferences.some(ref => {
        // Simple matching - filename with or without path
        const refLowercase = ref.toLowerCase();
        const fileLowercase = file.name.toLowerCase();
        return refLowercase === fileLowercase || refLowercase.includes(fileLowercase) || fileLowercase.includes(refLowercase);
      });
      
      return {
        filename: file.name,
        status: 'pending' as const,
        progress: 0,
        matchesReference
      };
    });
    
    setUploadedImages(prev => [...prev, ...newImageStatuses]);
    
    // Process the files
    newFiles.forEach((file, index) => {
      processImage(file, newImageStatuses[index].filename);
    });
  };

  // Process an image with OCR
  const processImage = async (file: File, filename: string) => {
    try {
      // Update status to processing
      updateImageStatus(filename, { status: 'processing', progress: 0 });
      setIsProcessing(true);
      
      // Process the image with OCR
      const ocrResult = await processImageWithOCR(file, (progress: OCRProgressInfo) => {
        // Update progress during processing
        updateImageStatus(filename, { 
          progress: progress.progress,
          error: progress.error
        });
      });
      
      // Convert OCR result to messages
      const messages = convertOCRResultToMessages(ocrResult);
      
      // Update status to success and manually trigger checkAllProcessed after state update
      setUploadedImages(prev => {
        const updated = prev.map(img => 
          img.filename === filename
            ? { ...img, status: 'success' as const, progress: 100, messages }
            : img
        );
        
        // Check if all images are now processed
        const allDone = updated.length > 0 && 
          updated.every(img => img.status === 'success' || img.status === 'error');
        
        // Schedule state updates
        setTimeout(() => {
          setAllProcessed(allDone);
          setIsProcessing(!allDone);
        }, 0);
        
        return updated;
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Use the same approach for error state
      setUploadedImages(prev => {
        const updated = prev.map(img => 
          img.filename === filename
            ? { 
                ...img, 
                status: 'error' as const, 
                progress: 0,
                error: error instanceof Error ? error.message : 'Failed to process image'
              }
            : img
        );
        
        // Check if all images are now processed
        const allDone = updated.length > 0 && 
          updated.every(img => img.status === 'success' || img.status === 'error');
        
        // Schedule state updates
        setTimeout(() => {
          setAllProcessed(allDone);
          setIsProcessing(!allDone);
        }, 0);
        
        return updated;
      });
    }
  };

  // Helper to update a specific image's status
  const updateImageStatus = useCallback((filename: string, updates: Partial<UploadedImageStatus>) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.filename === filename 
          ? { ...img, ...updates } 
          : img
      )
    );
  }, []);

  // Handle completion - combine all successful results
  const handleComplete = () => {
    const allMessages = uploadedImages
      .filter(img => img.status === 'success' && img.messages && img.messages.length > 0)
      .flatMap(img => img.messages!);
    
    onImagesProcessed(allMessages);
  };

  // Reset the form
  const resetForm = () => {
    setUploadedImages([]);
    setAllProcessed(false);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0 && fileInputRef.current) {
      // Create a DataTransfer object to set the files
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger the onChange event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Image references display */}
      {imageReferences.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg 
              className="h-5 w-5 flex-shrink-0 mt-0.5"
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-medium mb-1">Image references found in chat:</p>
              <ul className="list-disc list-inside space-y-1">
                {imageReferences.map((ref, index) => (
                  <li key={index} className="truncate">{ref}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Image upload area - Styled to match UploadForm */}
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full rounded-2xl transition-all duration-300",
          "border-2 border-dashed p-8",
          isDragging 
            ? "border-primary/60 bg-primary/5" 
            : "border-gray-200 hover:border-primary/40 hover:bg-gray-50/50",
          isProcessing && "opacity-70 pointer-events-none"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Image Upload Icon */}
        <div className={cn(
          "mb-5 flex flex-col items-center justify-center text-center",
          isProcessing ? "opacity-50" : ""
        )}>
          <div className="h-20 w-20 mb-3 rounded-full flex items-center justify-center bg-primary/5">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="h-10 w-10 text-primary"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-lg font-medium mb-1">Upload Receipt Images</div>
            <p className="text-gray-500 text-sm max-w-xs text-center mb-2">
              Drag and drop receipt images or click to browse files
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
              <span>OCR processing happens in your browser</span>
            </div>
          </div>
        </div>

        {/* Browse Button */}
        {!isProcessing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/80"
            type="button"
          >
            Browse Images
          </button>
        )}

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        
        {/* Loading Indicator */}
        {isProcessing && uploadedImages.length > 0 && !allProcessed && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 h-10 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm font-medium text-gray-700">Processing images...</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs text-center">
              Analyzing images to extract payment data using OCR. This may take a moment.
            </p>
          </div>
        )}
        
        {/* Help Text */}
        <div className="text-xs text-gray-400 mt-6 text-center max-w-sm">
          <p>Supported formats: JPG, PNG, JPEG, GIF, WEBP</p>
        </div>
      </div>

      {/* Image processing status */}
      {uploadedImages.length > 0 && (
        <div className="border rounded-lg overflow-hidden mt-8 bg-white shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-700">Processing Status</h3>
          </div>
          <div className="divide-y">
            {uploadedImages.map((img, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
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
                      className="text-gray-400 mr-2"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span className="truncate max-w-xs text-sm">{img.filename}</span>
                  </div>
                  {img.matchesReference && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      Matches reference
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={img.progress} className="h-2 flex-grow" />
                  <span className="text-xs text-gray-500 w-10 text-right">{img.progress}%</span>
                </div>
                
                {img.status === 'processing' && (
                  <p className="text-xs text-gray-500">Processing image...</p>
                )}
                
                {img.status === 'success' && (
                  <p className="text-xs text-green-600">
                    {img.messages && img.messages.length > 0 
                      ? `Found ${img.messages.length} payment amount${img.messages.length !== 1 ? 's' : ''}` 
                      : 'No payment amounts detected'}
                  </p>
                )}
                
                {img.status === 'error' && (
                  <p className="text-xs text-red-600">{img.error || 'Failed to process image'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      {uploadedImages.length > 0 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isProcessing && !allProcessed}
            className="h-10 text-sm"
          >
            Reset
          </Button>
          
          <Button
            onClick={handleComplete}
            disabled={!allProcessed}
            className="h-10 text-sm bg-primary hover:bg-primary/90 text-white"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Complete Processing
          </Button>
        </div>
      )}
    </div>
  );
}