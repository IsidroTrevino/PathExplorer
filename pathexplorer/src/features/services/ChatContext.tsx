'use client';

import React, { createContext, useState, useContext, useRef, ReactNode } from 'react';
import { chatService } from '../services/ChatService';
import { useUser } from '@/features/context/userContext';

interface Message {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
}

interface ChatContextType {
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    resetSession: () => void;
    messages: Message[];
    sendMessage: (message: string) => Promise<void>;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userAuth } = useUser();
  const sessionCreated = useRef(false);

  const resetSession = async () => {
    setMessages([]);
    setSessionId(null);
    sessionCreated.current = false;

    setTimeout(() => {
      if (userAuth?.accessToken) {
        createNewSession();
      }
    }, 0);
  };

  const createNewSession = async () => {
    setIsLoading(true);
    try {
      const session = await chatService.createSession(userAuth!.accessToken);
      setSessionId(session.session_id);

      setMessages([
        {
          id: 0,
          content: 'Hi there! I am Pathy, your PathExplorer assistant. How can I help you today?',
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to create chat session:', error);
      sessionCreated.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = async () => {
    setIsOpen(true);

    if (!sessionId && userAuth?.accessToken && !sessionCreated.current) {
      sessionCreated.current = true;
      setIsLoading(true);
      try {
        const session = await chatService.createSession(userAuth.accessToken);
        setSessionId(session.session_id);

        setMessages([
          {
            id: 0,
            content: 'Hi there! I am Pathy, your PathExplorer assistant. How can I help you today?',
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Failed to create chat session:', error);
        sessionCreated.current = false;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const sendMessage = async (content: string) => {
    if (!sessionId || !userAuth?.accessToken) return;

    const userMessage: Message = {
      id: messages.length,
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        userAuth.accessToken,
        sessionId,
        content,
      );

      const botMessage: Message = {
        id: response.message_id,
        content: response.response,
        isUser: false,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 1,
          content: 'Sorry, I encountered an error. Please try again later.',
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
    messages,
    sendMessage,
    isLoading,
    resetSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
