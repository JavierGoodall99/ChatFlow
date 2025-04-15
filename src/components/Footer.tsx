import React from 'react';

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-10">
      <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold">ChatFlow</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Turn your WhatsApp chat exports into organized payment records, professional invoices, and client summaries.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold">Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/cleaner" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Try It Now
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Help & FAQ
                  </a>
                </li>
                <li>
                  <a href="https://github.com/JavierGoodall99/whatsappp-reciept-cleaner" target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                100% client-side processing. Your data never leaves your device.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center w-full border-t pt-6 gap-4 md:gap-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ChatFlow. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}