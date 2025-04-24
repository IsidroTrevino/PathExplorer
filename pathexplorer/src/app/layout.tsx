import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { UserProvider } from '@/features/context/userContext';
import { InactivityDetector } from '@/components/GlobalComponents/InactivityDetector';
import { Toaster } from 'sonner';
import { ProjectProvider } from '@/features/context/projectContext';

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
    <html lang="en">
      <body className="font-helvetica antialiased" suppressHydrationWarning={true}>
        <UserProvider>
          <InactivityDetector />
          <ProjectProvider>
            {children}
          </ProjectProvider>
          <Toaster richColors position="top-center" />
        </UserProvider>
      </body>
    </html>
  );
}
