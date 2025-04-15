import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chatflow.studio/';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'WhatsApp Receipt Cleaner - Extract Payment Messages Easily',
    template: '%s | WhatsApp Receipt Cleaner'
  },
  description: 'Clean frontend tool for freelancers and small businesses to extract payment-related messages from WhatsApp chats. Export to PDF or CSV.',
  keywords: ['whatsapp', 'receipt', 'payment', 'invoice', 'business', 'export', 'pdf', 'csv', 'freelancer'],
  authors: [{ name: 'WhatsApp Receipt Cleaner' }],
  creator: 'WhatsApp Receipt Cleaner',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'WhatsApp Receipt Cleaner - Extract Payment Messages Easily',
    description: 'Clean frontend tool for freelancers and small businesses to extract payment-related messages from WhatsApp chats.',
    siteName: 'WhatsApp Receipt Cleaner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsApp Receipt Cleaner - Extract Payment Messages Easily',
    description: 'Clean frontend tool for freelancers and small businesses to extract payment-related messages from WhatsApp chats.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};