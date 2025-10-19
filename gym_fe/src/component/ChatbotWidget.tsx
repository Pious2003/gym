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

    React.useEffect(() => {
        const handleOpenChatbot = () => {
            setShowChatbot(true);
        };

        window.addEventListener('openChatbot', handleOpenChatbot);
        
        return () => {
            window.removeEventListener('openChatbot', handleOpenChatbot);
        };
    }, []);

    return (
        <>
            {/* Floating Chatbot Button - Completely removed, controlled externally */}
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