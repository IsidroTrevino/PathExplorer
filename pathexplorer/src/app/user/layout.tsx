// components/layouts/AppLayout.tsx
'use client';

import { SideBar } from '@/components/GlobalComponents/SlideBar';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      {children}
    </div>
  );
}
