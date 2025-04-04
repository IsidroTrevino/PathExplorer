import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { UserProvider } from '@/features/context/userContext';
import { InactivityDetector } from '@/components/GlobalComponents/InactivityDetector';
import { SideBar } from '../components/GlobalComponents/SlideBar';

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
    <html lang="en" className="h-screen">
      <body className="h-screen overflow-hidden font-helvetica antialiased">
        <UserProvider>
          <InactivityDetector />
          <div className="flex h-full">
            <SideBar />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
