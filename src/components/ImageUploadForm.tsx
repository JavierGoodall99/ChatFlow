'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Determine if we're in standalone mode (no specific image references)
  const isStandaloneMode = imageReferences.length === 0;

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
          console.log('All processed status:', allDone);
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
          console.log('All processed status (error case):', allDone);
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

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {isStandaloneMode ? 'Process Receipt Images' : 'Process Referenced Images'}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {imageReferences.length > 0 
            ? `We found ${imageReferences.length} image reference${imageReferences.length !== 1 ? 's' : ''} in your chat. Upload these images to extract payment information.` 
            : 'Upload receipt images to extract payment information using OCR.'}
        </p>
      </CardHeader>
      <CardContent>
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
        
        {/* Image upload area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${
            isProcessing ? 'opacity-50 pointer-events-none' : 'hover:border-primary/40 hover:bg-gray-50/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
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
          }}
        >
          <div className="flex flex-col items-center">
            <svg 
              className="h-10 w-10 text-gray-400 mb-3"
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
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop receipt images, or click to browse
            </p>
            <Button 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              Select Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: JPG, PNG, JPEG, GIF, WEBP
            </p>
          </div>
        </div>

        {/* Image processing status */}
        {uploadedImages.length > 0 && (
          <div className="border rounded-lg overflow-hidden mt-4">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium">Processing Status</h3>
            </div>
            <div className="divide-y">
              {uploadedImages.map((img, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="truncate max-w-xs text-sm mr-2">{img.filename}</span>
                    {img.matchesReference && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Matches chat reference
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
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            disabled={isProcessing || uploadedImages.length === 0}
          >
            Reset
          </Button>
          
          <Button
            size="sm" 
            onClick={handleComplete}
            disabled={!allProcessed || uploadedImages.length === 0}
            className="ml-2"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Complete Processing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}