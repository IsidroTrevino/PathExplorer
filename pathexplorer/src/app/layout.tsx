import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { UserProvider } from '@/features/context/userContext';
import { InactivityDetector } from '@/components/GlobalComponents/InactivityDetector';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'PathExplorer',
  icons: {
    icon: '/accenture/Acc_GT_Solid_P1_RGB.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <InactivityDetector />
        <body className="font-helvetica antialiased">
          <Toaster/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
