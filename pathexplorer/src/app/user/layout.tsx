'use client';

import { SideBar } from '@/components/SlideBar';
import React from 'react';
import { ChatProvider } from '@/features/services/ChatContext';
import { ChatBot } from '@/components/ChatBot';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatProvider>
        <SideBar />
        {children}
        <ChatBot/>
      </ChatProvider>
    </div>
  );
}
