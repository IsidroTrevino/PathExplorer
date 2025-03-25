import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

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
      <body className="font-helvetica antialiased">
        {children}
      </body>
    </html>
  );
}
