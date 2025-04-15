import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileWarning } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <FileWarning className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button asChild variant="outline">
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
}