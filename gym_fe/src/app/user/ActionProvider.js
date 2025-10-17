class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    greet() {
        const message = this.createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn?');
        this.addMessageToState(message);
    }

    handleHelp() {
        const message = this.createChatBotMessage('Bạn có thể hỏi tôi về các khóa học, lịch tập, hoặc các vấn đề liên quan đến phòng gym.');
        this.addMessageToState(message);
    }

    async replyPrice() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5231'}/api/workout-course`);
            const courses = await res.json();
            if (!Array.isArray(courses) || courses.length === 0) {
                const message = this.createChatBotMessage('Hiện chưa có khóa học nào.');
                this.addMessageToState(message);
                return;
            }
            const lines = courses.map(c => {
                const price = c.price && c.price > 0 ? `${c.price.toLocaleString('vi-VN')}đ/tháng` : 'Liên hệ';
                return `• ${c.coursename}: ${price}`;
            });
            const message = this.createChatBotMessage(
                `Các khóa học hiện có:\n\n${lines.join('\n')}\n\nBạn muốn xem chi tiết khóa học nào? Hãy nhập tên hoặc vào mục "Mua khóa tập" để xem danh sách đầy đủ.`
            );
            this.addMessageToState(message);
        } catch (err) {
            const message = this.createChatBotMessage('Xin lỗi, tôi không lấy được thông tin khóa học lúc này.');
            this.addMessageToState(message);
        }
    }

    replyOpenHours() {
        const message = this.createChatBotMessage('Phòng gym mở cửa từ 6:00 đến 22:00 mỗi ngày.');
        this.addMessageToState(message);
    }

    replyPT() {
        const message = this.createChatBotMessage('Bạn có thể đặt lịch với PT qua mục Lịch tập hoặc liên hệ quầy lễ tân.');
        this.addMessageToState(message);
    }

    replyLocation() {
        const message = this.createChatBotMessage('Địa chỉ phòng gym: 123 Đường ABC, Quận 1, TP.HCM.');
        this.addMessageToState(message);
    }

    handleDefault(userMessage) {
        const message = this.createChatBotMessage('Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi về giá, giờ mở cửa, PT, hoặc địa chỉ.');
        this.addMessageToState(message);
    }

    addMessageToState(message) {
        this.setState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, message],
        }));
    }
}

export default ActionProvider; 