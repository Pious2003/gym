'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Bot,
  Loader2,
  Send,
  User,
} from 'lucide-react';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

function ChatBotAI() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Xin chào! Tôi là trợ lý AI . Tôi có thể giúp bạn với bất kỳ chủ đề nào - từ kiến thức chung đến câu hỏi kỹ thuật, viết sáng tạo, giải quyết vấn đề và nhiều hơn nữa. Bạn muốn trò chuyện về điều gì?',
            role: 'assistant',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const callCohereAI = async (message: string, history: any[]) => {
        try {
            console.log('Calling Cohere AI...');

            // Build conversation history for Cohere
            const conversationHistory = history.map((msg: any) => ({
                role: msg.role === 'user' ? 'USER' : 'CHATBOT',
                message: msg.content
            }));

            const response = await fetch('https://api.cohere.ai/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 9mQf0yARKgQ8Hxv3r3kB89siZkRRHRIcSJLcIu6d',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: 'command-r-plus',
                    message: message,
                    preamble: 'You are a helpful AI assistant for a gym booking system. Answer questions about fitness, gym services, appointments, and general health topics. Be friendly and engaging. Respond in Vietnamese when users speak Vietnamese.',
                    conversation_id: 'gym-booking-chat',
                    stream: false,
                    citation_quality: 'accurate',
                    connectors: [],
                    documents: [],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Cohere AI response received:', data);

                return data.text || 'Sorry, I could not generate a response.';
            } else {
                const errorData = await response.json();
                console.log(`Cohere AI failed with status: ${response.status}`, errorData);
                throw new Error(`Cohere AI error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.log('Cohere AI error:', error);
            throw error;
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            content: inputValue.trim(),
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Call Cohere AI directly from frontend
            const aiResponse = await callCohereAI(userMessage.content, messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })));

            const assistantMessage: Message = {
                id: generateId(),
                content: aiResponse,
                role: 'assistant',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            const errorMessage: Message = {
                id: generateId(),
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`,
                role: 'assistant',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Restore focus to textarea after sending message
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col bg-gray-100 rounded-2xl overflow-hidden h-[calc(100vh-130px)]" >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
                style={{
                    height: 'calc(100vh - 140px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-3 ${message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                        >
                            <div className="flex items-start space-x-2">
                                {message.role === 'assistant' && (
                                    <Bot className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                                        }`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                                {message.role === 'user' && (
                                    <User className="w-5 h-5 text-blue-100 mt-0.5 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <Bot className="w-5 h-5 text-gray-500" />
                                <div className="flex space-x-1">
                                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                    <span className="text-sm text-gray-500">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex space-x-4">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={1}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ChatBotAI;
