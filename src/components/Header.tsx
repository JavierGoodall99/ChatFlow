import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="WhatsApp Receipt Cleaner"
                width={32}
                height={32}
                className="relative"
                priority
              />
              <span className="text-xl font-semibold">WhatsApp Receipt Cleaner</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/cleaner" passHref>
              <Button variant="ghost" size="sm" className="text-sm font-medium">Try It Now</Button>
            </Link>
            <Link href="/help" passHref>
              <Button variant="ghost" size="sm" className="text-sm font-medium">Help & FAQ</Button>
            </Link>
            <Link href="https://github.com/JavierGoodall99/whatsappp-reciept-cleaner" target="_blank" passHref>
              <Button variant="ghost" size="sm" className="text-sm font-medium">GitHub</Button>
            </Link>
            <Link href="/cleaner" passHref>
              <Button size="sm" className="ml-2 text-sm font-medium">Get Started</Button>
            </Link>
          </nav>
          <div className="flex md:hidden">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}