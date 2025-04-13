import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Help & FAQ - WhatsApp Receipt Cleaner',
  description: 'Frequently asked questions and help documentation for WhatsApp Receipt Cleaner',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="relative">
                <Image
                  src="/icon.png"
                  alt="WhatsApp Receipt Cleaner Icon"
                  width={70}
                  height={70}
                  className="relative drop-shadow-md"
                  priority
                />
              </div>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Help & Frequently Asked Questions
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get answers to common questions about the WhatsApp Receipt Cleaner tool.
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* FAQ Items */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">How do I export my WhatsApp chat?</h3>
              <p className="text-gray-600">
                On your mobile device, open the WhatsApp chat you want to export, tap the three dots menu (⋮), select 
                &ldquo;More&rdquo; → &ldquo;Export chat&rdquo; → &ldquo;Without media&rdquo;. Then send the chat file to yourself by email or other means, 
                and download it to your device.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Is my data secure and private?</h3>
              <p className="text-gray-600">
                Yes. All processing happens entirely in your browser. Your chat data never leaves your device or gets sent 
                to any server. This tool works offline once loaded, and we don&apos;t store any of your information.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Which currencies are supported?</h3>
              <p className="text-gray-600">
                The tool currently supports major currencies including: South African Rand (R), US Dollar ($), Euro (€), 
                British Pound (£), Australian Dollar (A$), Indian Rupee (₹), Brazilian Real (R$), Chinese Yuan (¥), 
                Japanese Yen (¥), Nigerian Naira (₦), Russian Ruble (₽), and Saudi Riyal (﷼).
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Why aren&apos;t all my messages showing up?</h3>
              <p className="text-gray-600">
                The tool specifically filters for messages containing currency amounts. If a message doesn&apos;t include 
                a recognizable monetary value (like &ldquo;R250&rdquo; or &ldquo;$100&rdquo;), it won&apos;t be included in the results. This helps 
                focus on payment-related information only.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">How do I use the PDF export feature?</h3>
              <p className="text-gray-600">
                After uploading your chat file and seeing the filtered payment messages, scroll down to the &ldquo;Export&rdquo; 
                section and click &ldquo;Export as PDF&rdquo;. The tool will generate a professional PDF document with all your 
                payment information and a financial summary, which will download to your device.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Can I use this for business accounting?</h3>
              <p className="text-gray-600">
                This tool is designed to help freelancers and small businesses extract and organize payment records from 
                WhatsApp conversations. While it provides a convenient way to gather this information, we recommend 
                consulting with an accountant for official financial record-keeping requirements in your region.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Are there any file size limitations?</h3>
              <p className="text-gray-600">
                Since all processing happens in your browser, very large chat files (over 10MB) might slow down your 
                device. For best performance, consider exporting specific date ranges from your chats rather than 
                years of conversation history at once.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">What information is included in the PDF export?</h3>
              <p className="text-gray-600">
                The PDF includes a table with the date, sender, currency, amount, and message content for each payment 
                message. It also includes a financial summary showing totals by currency and by sender, making it easy 
                to track income from different sources.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-12">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Troubleshooting</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">My chat file won&apos;t upload</h3>
              <p className="text-gray-600">
                Make sure you&apos;re uploading a .txt file directly exported from WhatsApp. Screenshots or other file formats 
                aren&apos;t supported. If your file is very large, try clearing your browser cache or using a different browser.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">Currency amounts aren&apos;t being detected</h3>
              <p className="text-gray-600">
                The tool looks for common currency formats (like &ldquo;R100&rdquo;, &ldquo;$50.25&rdquo;, &ldquo;€10,50&rdquo;). If your amounts use 
                different formats or unusual spacing, they might not be detected. Try searching for those messages 
                manually in your exported chat file.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">The PDF export isn&apos;t working</h3>
              <p className="text-gray-600">
                Some browsers have stricter privacy settings that can interfere with downloads. Try allowing popups for 
                this site or using a different browser. Make sure you have sufficient storage space on your device.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-16">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>

        <footer className="text-center text-sm text-gray-400 mb-8">
          <p>© {new Date().getFullYear()} WhatsApp Receipt Cleaner | All processing happens in your browser</p>
        </footer>
      </div>
    </main>
  );
}