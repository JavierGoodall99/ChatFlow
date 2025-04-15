import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Help & FAQ - ChatFlow',
  description: 'Learn how to use ChatFlow to organize your WhatsApp business communications and extract payment information',
};

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-6 w-full max-w-5xl py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Help & Frequently Asked Questions</h1>
          
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">How to Use ChatFlow</h2>
              
              <div className="space-y-6">
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-4">1. Export Your WhatsApp Chat</h3>
                  <p className="text-muted-foreground mb-4">
                    First, you need to export your WhatsApp chat as a .txt file:
                  </p>
                  <ol className="space-y-2 list-decimal pl-5">
                    <li>Open the WhatsApp chat with your client</li>
                    <li>Tap the three dots (•••) in the top right</li>
                    <li>Select &quot;More&quot; then &quot;Export chat&quot;</li>
                    <li>Choose &quot;Without media&quot; (unless you need images)</li>
                    <li>Save or share the .txt file to your computer</li>
                  </ol>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-4">2. Upload to ChatFlow</h3>
                  <p className="text-muted-foreground mb-4">
                    Once you have your .txt file:
                  </p>
                  <ol className="space-y-2 list-decimal pl-5">
                    <li>Go to the ChatFlow app</li>
                    <li>Drag and drop your .txt file, or click to browse and select it</li>
                    <li>ChatFlow automatically filters payment-related messages</li>
                  </ol>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-4">3. Work with Your Payment Data</h3>
                  <p className="text-muted-foreground mb-4">
                    Now you can:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>View all payment-related messages</li>
                    <li>Generate a professional invoice with one click</li>
                    <li>Export to PDF for your records</li>
                    <li>Export to CSV for spreadsheet analysis</li>
                    <li>Create a custom invoice manually</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-2">Is my data secure?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. ChatFlow processes everything locally in your browser. Your WhatsApp chats and payment 
                    information never leave your device. There&apos;s no server storage, no data transfer, and no tracking.
                  </p>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-2">What currencies are supported?</h3>
                  <p className="text-muted-foreground">
                    ChatFlow currently detects currency symbols for major currencies including R (South African Rand), $, €, £, and ₹. 
                    We&apos;re constantly improving our detection to support more formats.
                  </p>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-2">Can I customize my invoices?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can create invoices manually with our invoice generator. Add your business details, 
                    customize line items, and generate professional PDF invoices.
                  </p>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-2">Does ChatFlow work offline?</h3>
                  <p className="text-muted-foreground">
                    Yes, once the page is loaded, ChatFlow functions completely offline. You can process your 
                    WhatsApp chats, generate invoices, and export data without an internet connection.
                  </p>
                </div>
                
                <div className="rounded-lg border p-6 bg-card text-card-foreground">
                  <h3 className="text-xl font-medium mb-2">I have more questions!</h3>
                  <p className="text-muted-foreground">
                    We&apos;re constantly improving ChatFlow based on user feedback. If you have questions or suggestions, 
                    please visit our <a href="https://github.com/JavierGoodall99/whatsappp-reciept-cleaner" className="text-primary hover:underline">GitHub page</a>.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}