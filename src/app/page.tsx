import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'WhatsApp Receipt Cleaner - Extract Payment Messages Easily',
  description: 'A clean tool for freelancers, side hustlers and small business owners to find payment messages in WhatsApp chats and convert them to organized records',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image
              src="/icon.png"
              alt="WhatsApp Receipt Cleaner"
              width={32}
              height={32}
              className="relative"
              priority
            />
            <span>WhatsApp Receipt Cleaner</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/cleaner" passHref>
              <Button variant="ghost">Try It Now</Button>
            </Link>
            <Link href="/help" passHref>
              <Button variant="ghost">Help & FAQ</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter max-w-3xl">
                Find Payment Messages in WhatsApp Chats Instantly
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[42rem]">
                A simple tool for freelancers, small business owners, and side hustlers to extract 
                payment-related messages and turn them into clean, exportable records.
              </p>
              <Link href="/cleaner" passHref>
                <Button size="lg" className="mt-6 gap-2">
                  Try It For Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                How It Works
              </h2>
              <p className="text-muted-foreground mt-2 max-w-[58rem]">
                Extract your payment messages in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                <div className="text-blue-600 bg-blue-100 p-3 rounded-full inline-block mb-4 self-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="relative mb-3">
                  <span className="absolute top-0 -left-2 text-5xl font-bold text-blue-100 -z-10">1</span>
                  <h3 className="text-xl font-semibold">Export & Upload</h3>
                </div>
                <p className="text-gray-600">
                  Export your WhatsApp chat as a .txt file and upload it to our secure tool
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                <div className="text-purple-600 bg-purple-100 p-3 rounded-full inline-block mb-4 self-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="4" y1="14" x2="20" y2="16"></line>
                  </svg>
                </div>
                <div className="relative mb-3">
                  <span className="absolute top-0 -left-2 text-5xl font-bold text-purple-100 -z-10">2</span>
                  <h3 className="text-xl font-semibold">Filter For Payments</h3>
                </div>
                <p className="text-gray-600">
                  Our system automatically detects payment messages and filters out the noise
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                <div className="text-green-600 bg-green-100 p-3 rounded-full inline-block mb-4 self-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div className="relative mb-3">
                  <span className="absolute top-0 -left-2 text-5xl font-bold text-green-100 -z-10">3</span>
                  <h3 className="text-xl font-semibold">Export & Use</h3>
                </div>
                <p className="text-gray-600">
                  Download as PDF, CSV, or create a professional invoice from your payment records
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/cleaner" passHref>
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                Why Use WhatsApp Receipt Cleaner?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center p-4">
                <div className="text-3xl mb-2">⏱️</div>
                <h3 className="text-lg font-medium mb-1">Save Time</h3>
                <p className="text-muted-foreground text-sm">
                  Find payment messages instantly instead of scrolling through endless chats
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-medium mb-1">Stay Organized</h3>
                <p className="text-muted-foreground text-sm">
                  Keep all your payment records in one place with clear timestamps
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="text-lg font-medium mb-1">100% Private</h3>
                <p className="text-muted-foreground text-sm">
                  All processing happens in your browser - we never see your chat data
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="text-3xl mb-2">💸</div>
                <h3 className="text-lg font-medium mb-1">Completely Free</h3>
                <p className="text-muted-foreground text-sm">
                  No sign up, no subscription, no limits
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                Ready to clean up your WhatsApp payment records?
              </h2>
              <p className="text-muted-foreground text-lg max-w-[42rem]">
                Start organizing your financial messages today - it only takes a minute.
              </p>
              <Link href="/cleaner" className="mt-6" passHref>
                <Button size="lg">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Feedback Section */}
      <section className="py-12 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Help Us Improve</h2>
            <p className="text-muted-foreground max-w-[42rem]">
              Found a bug or have a feature request? We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="https://github.com/JavierGoodall99/whatsappp-reciept-cleaner/issues" target="_blank" passHref>
                <Button variant="outline" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  Report on GitHub
                </Button>
              </Link>
              <Link href="mailto:feedback@example.com" passHref>
                <Button variant="outline">
                  Send Email Feedback
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 md:py-0">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:h-16 gap-4 md:gap-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WhatsApp Receipt Cleaner. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/help" className="text-sm text-muted-foreground hover:underline">
                Help & FAQ
              </Link>
              <Link href="/cleaner" className="text-sm text-muted-foreground hover:underline">
                Try the Tool
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}