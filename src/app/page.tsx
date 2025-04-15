import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'ChatFlow - Organize WhatsApp Business Conversations',
  description: 'Turn WhatsApp chat exports into structured payment data, invoices, and reports - 100% private, no data stored',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-28 md:py-36 lg:py-44 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mx-auto max-w-4xl text-shimmer">
                Your business runs on WhatsApp. Now your backend does too.
              </h1>
              <p className="text-muted-foreground text-xl md:text-2xl mx-auto max-w-[50rem] text-shimmer">
                Turn your WhatsApp chat exports into organized payment records, professional invoices, and client summaries.
              </p>
              <Link href="/cleaner" passHref>
                <Button size="lg" className="mt-8 gap-2 text-lg px-8 py-6">
                  Try it now – it&apos;s free
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem + Solution Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium">The Problem</div>
                <h2 className="text-3xl font-bold tracking-tight">WhatsApp is chaotic for business management</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Payment messages buried in long conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Manual invoice creation wastes hours of time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Impossible to track payment history at a glance</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-md text-sm font-medium">The Solution</div>
                <h2 className="text-3xl font-bold tracking-tight">ChatFlow transforms messages into structured data</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automatically extract payment-related messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Generate professional invoices with one click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Visualize your income with financial summaries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mx-auto">
                Powerful features for your business
              </h2>
              <p className="text-muted-foreground mt-2 max-w-[58rem] mx-auto">
                Everything you need to organize your WhatsApp business communications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-primary bg-primary/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="4" y1="14" x2="20" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Filter Payments</h3>
                <p className="text-gray-600">
                  Automatically detect and extract payment messages with currency amounts from your WhatsApp chats.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-secondary bg-secondary/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="2" y1="8" x2="22" y2="8" />
                    <line x1="12" y1="16" x2="16" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate Invoices</h3>
                <p className="text-gray-600">
                  Turn selected messages into professional PDF invoices with your business details and branding.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-accent bg-accent/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Manually</h3>
                <p className="text-gray-600">
                  Create custom invoices from scratch when you need more control over invoice items and details.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-primary bg-primary/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <circle cx="12" cy="13" r="3" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Clients</h3>
                <p className="text-gray-600">
                  Filter messages by sender to track client payment history and create client-specific exports.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-secondary bg-secondary/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Financial Summary</h3>
                <p className="text-gray-600">
                  View payment totals by currency and client with automatic financial summaries of your transactions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover-lift">
                <div className="text-accent bg-accent/10 p-3 rounded-full inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Options</h3>
                <p className="text-gray-600">
                  Export your data as PDF reports or CSV files for further analysis in spreadsheet software.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy-First Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-6">
                <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium">Privacy First</div>
                <h2 className="text-3xl font-bold tracking-tight">Your data never leaves your device</h2>
                <p className="text-muted-foreground">
                  ChatFlow processes everything locally in your browser. Your sensitive business 
                  communications are never uploaded to any server or stored anywhere online.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100% client-side processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No data storage or transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Works offline after initial load</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-8 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">End-to-End Privacy</h3>
                  <p className="text-gray-600">
                    Your business data is too important to trust with third parties. 
                    ChatFlow is designed from the ground up with your privacy as the top priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for the Real Economy */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Built for the Real Economy</h2>
              <p className="text-muted-foreground mt-2 max-w-[58rem] mx-auto">
                ChatFlow is designed for the millions of businesses that run on WhatsApp every day
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Freelancers</h3>
                </div>
                <p className="text-gray-600">
                  Track client payments, create professional invoices, and keep your business finances organized.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Small Businesses</h3>
                </div>
                <p className="text-gray-600">
                  Streamline customer communications, payment tracking, and financial record-keeping.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Side Hustlers</h3>
                </div>
                <p className="text-gray-600">
                  Keep your side business organized with minimal effort and maximum professional appearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-xl font-semibold text-muted-foreground">Built With Modern Technology</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">Next.js 14</div>
                <div className="text-xs text-muted-foreground">App Router</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-600">TypeScript</div>
                <div className="text-xs text-muted-foreground">Type Safety</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-cyan-500">Tailwind CSS</div>
                <div className="text-xs text-muted-foreground">Styling</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-gray-800">shadcn/ui</div>
                <div className="text-xs text-muted-foreground">Components</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-red-500">jsPDF</div>
                <div className="text-xs text-muted-foreground">PDF Export</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-green-600">PapaParse</div>
                <div className="text-xs text-muted-foreground">CSV Export</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 md:px-6 w-full max-w-7xl">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mx-auto max-w-3xl">
                Ready to bring order to your WhatsApp business communications?
              </h2>
              <p className="text-muted-foreground text-lg max-w-[42rem] mx-auto">
                Start organizing your payment messages and generating professional invoices in minutes.
              </p>
              <Link href="/cleaner" className="mt-6" passHref>
                <Button size="lg" className="px-8 py-6 text-lg gap-2">
                  Try It Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}