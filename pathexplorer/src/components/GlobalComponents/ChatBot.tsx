'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/features/services/ChatContext';
import ReactMarkdown from 'react-markdown';

export const ChatBot: React.FC = () => {
  const { isOpen, toggleChat, closeChat, messages, sendMessage, isLoading, resetSession } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    sendMessage(inputValue);
    setInputValue('');
  };

  const handleNewChat = () => {
    resetSession();
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <svg className="w-6 h-6" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.0675 0L0 33.5511H38L19.0675 0Z" fill="white"/>
        </svg>
        <span className="font-medium">Pathy AI</span>
      </button>

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 sm:w-[28rem] h-[28rem] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 z-50 transition-all duration-300 ease-in-out transform origin-bottom-right animate-chatOpen"
        >
          <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.0675 0L0 33.5511H38L19.0675 0Z" fill="white"/>
              </svg>
              <h3 className="font-medium">Pathy AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="text-white hover:text-gray-200 flex items-center gap-1 text-sm cursor-pointer"
                aria-label="New chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New Chat</span>
              </button>
              <button
                onClick={closeChat}
                className="text-white hover:text-gray-200 cursor-pointer"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.isUser ? 'text-right' : 'text-left'
                }`}
                style={{
                  animation: 'fadeIn 0.3s ease-out forwards',
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-purple-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.isUser ? (
                    message.content
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-purple-100 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-10"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors duration-300 h-10 flex items-center justify-center cursor-pointer"
                disabled={isLoading || inputValue.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
