# 🧾 WhatsApp Receipt Cleaner

A clean frontend tool for freelancers, side hustlers, and small business owners who need to extract **payment-related messages** from cluttered WhatsApp chats.

## 🚀 What It Does

- 📂 Upload `.txt` WhatsApp chat exports
- 💰 Filters messages with currency amounts (e.g. `R250.00`, `$1,200`, `€500`)
- 🧼 Strips out noise (small talk, emojis, spam)
- 📊 Shows a timestamped list of money-related messages
- 📄 Generate professional invoices from selected messages
- 📤 Export to **PDF** or **CSV**

> Built for clarity, speed, and control over your personal payment records.

## 🧠 Tech Stack & Best Practices

| Tech | Purpose | Best Practices Followed |
|------|---------|--------------------------|
| **Next.js 15 (App Router)** | Routing & page structure | Using `/app` directory for routing, server/client boundary separation, layout components |
| **TypeScript** | Type safety and scalability | Typed utility functions, typed component props, `zod` schemas (optional for validation) |
| **Tailwind CSS** | Utility-first styling | Responsive design with semantic classes, DRY layout patterns, `@layer` usage in `globals.css` |
| **shadcn/ui** | Headless components | Used for consistent styling, accessibility, and design consistency |
| **Clerk** | Authentication | Secure user management with modern auth flows |
| **jsPDF** | PDF export | Structured tables for transaction data |
| **PapaParse** | CSV export | Clean, well-formatted downloadable data, cross-platform friendly |

## 📁 Folder Structure

```bash
.
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main landing page
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── globals.css           # Global styles
│   │   ├── cleaner/              # Main tool interface
│   │   │   └── page.tsx
│   │   ├── help/                 # Help & FAQ
│   │   │   └── page.tsx
│   │   ├── sign-in/              # Auth pages (Clerk)
│   │   │   └── [[...sign-in]]/
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │
│   ├── components/
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Footer.tsx            # Site footer
│   │   ├── UploadForm.tsx        # File upload handler
│   │   ├── MessageList.tsx       # Filtered results display
│   │   ├── ExportButtons.tsx     # Export functionality
│   │   ├── CreateInvoiceButton.tsx # Invoice generation
│   │   ├── InvoiceForm.tsx       # Invoice customization
│   │   ├── ManualInvoiceForm.tsx # Manual invoice creation
│   │   └── ui/                   # Reusable UI components (shadcn)
│   │
│   └── lib/
│       ├── parseChat.ts          # Message parsing & currency detection
│       ├── exportToPDF.ts        # PDF generation
│       ├── exportToCSV.ts        # CSV export
│       ├── generateInvoicePDF.ts # Invoice PDF creation
│       ├── invoiceTemplates.ts   # Invoice design templates
│       └── utils.ts              # Shared utilities
│
├── public/                       # Static assets
│   ├── icon.png                  # App icon
│   ├── manifest.json             # PWA manifest
│   └── [other assets]
│
└── [Config Files]                # Next.js, TypeScript, ESLint, etc.
```

## 🌐 Supported Currencies

- 🇿🇦 ZAR (South African Rand)
- 🇺🇸 USD (US Dollar)
- 🇪🇺 EUR (Euro)
- 🇬🇧 GBP (British Pound)
- 🇦🇺 AUD (Australian Dollar)
- 🇮🇳 INR (Indian Rupee)
- 🇧🇷 BRL (Brazilian Real)
- 🇨🇳 CNY (Chinese Yuan)
- 🇯🇵 JPY (Japanese Yen)
- 🇳🇬 NGN (Nigerian Naira)
- 🇷🇺 RUB (Russian Ruble)
- 🇸🇦 SAR (Saudi Riyal)

## 🔒 Privacy First

All processing happens entirely in your browser - your chat data never leaves your device or gets sent to any server. The tool works offline once loaded, ensuring your sensitive financial information stays private.

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-receipt-cleaner.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env.local file with your Clerk keys (if using auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Development

To contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.