"use client";
import 'react-chatbot-kit/build/main.css';

import React from 'react';

import {
  MessageCircle,
  X,
} from 'lucide-react';
import Chatbot from 'react-chatbot-kit';

import ActionProvider from '../app/user/ActionProvider';
import config from '../app/user/config';
import MessageParser from '../app/user/MessageParser';

const ChatbotWidget = () => {
    const [showChatbot, setShowChatbot] = React.useState(false);

    return (
        <>
            {/* Floating Chatbot Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowChatbot(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    aria-label="Open chat bot"
                >
                    <MessageCircle className="w-9 h-9" />
                </button>
            </div>
            {/* Chatbot Modal */}
            {showChatbot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setShowChatbot(false)}
                        aria-label="Đóng chat bot"
                    />
                    {/* Modal */}
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto z-10 animate-fadeInUp"
                        style={{ margin: '24px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowChatbot(false)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-20"
                            aria-label="Đóng chat bot"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-0 sm:p-4 w-full">
                            <Chatbot
                                config={config}
                                messageParser={MessageParser}
                                actionProvider={ActionProvider}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget; 