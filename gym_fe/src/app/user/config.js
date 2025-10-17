import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
    botName: 'GymBot',
    initialMessages: [
        createChatBotMessage('Xin chào! Tôi là trợ lý GymBot. Bạn cần hỗ trợ gì?')
    ],
    customStyles: {
        botMessageBox: {
            backgroundColor: '#10b981',
        },
        chatButton: {
            backgroundColor: '#10b981',
        },
    },
};

export default config; 