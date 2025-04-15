'use client';

import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/icon.png"
          alt="ChatFlow Icon"
          width={60}
          height={60}
          className="mb-4"
          priority
        />
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Get started with WhatsApp Receipt Cleaner
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              footerActionLink: 'text-primary hover:text-primary/90',
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}