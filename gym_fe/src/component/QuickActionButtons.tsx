"use client";

import React from 'react';
import { Phone } from 'lucide-react';
import ChatbotWidget from './ChatbotWidget';

const QuickActionButtons = () => {
  return (
    <>
      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[9999] flex space-x-3">
        {/* Quick Call Button */}
        <button
          onClick={() => window.open('tel:0123456789', '_self')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl w-16 h-16 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 border-white"
          title="Gọi ngay: 0123 456 789"
          aria-label="Quick call"
        >
          <Phone className="w-9 h-9" />
        </button>
        
        {/* Chatbot Button */}
        <button
          onClick={() => {
            const event = new CustomEvent('openChatbot');
            window.dispatchEvent(event);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl w-16 h-16 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 border-2 border-white"
          title="Trợ lý ảo"
          aria-label="Open chatbot"
        >
          <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </button>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </>
  );
};

export default QuickActionButtons;