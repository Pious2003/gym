class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lower = message.toLowerCase();
        if (lower.includes('giá') || lower.includes('price')) {
            this.actionProvider.replyPrice();
        } else if (lower.includes('giờ mở cửa') || lower.includes('open')) {
            this.actionProvider.replyOpenHours();
        } else if (lower.includes('pt') || lower.includes('huấn luyện viên')) {
            this.actionProvider.replyPT();
        } else if (lower.includes('địa chỉ') || lower.includes('location')) {
            this.actionProvider.replyLocation();
        } else {
            this.actionProvider.handleDefault(message);
        }
    }
}

export default MessageParser; 