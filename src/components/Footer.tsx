import React from 'react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center w-full md:h-16 gap-2 md:gap-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WhatsApp Receipt Cleaner. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              All processing happens in your browser - we never see your chat data
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}