# 🧾 WhatsApp Receipt Cleaner

A clean frontend tool for freelancers, side hustlers, and small business owners who need to extract **payment-related messages** from cluttered WhatsApp chats.

---

## 🚀 What It Does

- 📂 Upload `.txt` WhatsApp chat exports
- 💰 Filters messages with `R` amounts (e.g. `R250.00`, `R 1,200`)
- 🧼 Strips out noise (small talk, emojis, spam)
- 📊 Shows a timestamped list of money-related messages
- 📤 Export to **PDF** or **CSV**

> Built for clarity, speed, and control over your personal payment records.

---

## 🧠 Tech Stack & Best Practices

| Tech | Purpose | Best Practices Followed |
|------|---------|--------------------------|
| **Next.js 14 (App Router)** | Routing & page structure | Using `/app` directory for routing, server/client boundary separation, layout components |
| **TypeScript** | Type safety and scalability | Typed utility functions, typed component props, `zod` schemas (optional for validation) |
| **Tailwind CSS** | Utility-first styling | Responsive design with semantic classes, DRY layout patterns, `@layer` usage in `globals.css` |
| **shadcn/ui** | Headless components | Used for consistent styling, accessibility, and design consistency |
| **jsPDF** | PDF export | Structured tables for transaction data |
| **PapaParse** | CSV export | Clean, well-formatted downloadable data, cross-platform friendly |

---

## 📁 Folder Structure

```bash
.
├── app/
│   └── page.tsx              # Main upload & display interface
│
├── components/
│   ├── UploadForm.tsx        # Upload input & file handler
│   ├── MessageList.tsx       # Displays filtered results
│   └── ExportButtons.tsx     # Handles export to PDF/CSV
│
├── lib/
│   ├── parseChat.ts          # Core message filtering logic (regex + parsing)
│   ├── exportToPDF.ts        # PDF generation utility (jsPDF)
│   └── exportToCSV.ts        # CSV formatter (PapaParse or native)
│
├── public/
│   └── logo.svg              # Optional logo or icons
│
├── styles/
│   └── globals.css           # Tailwind setup and custom utilities
│
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
