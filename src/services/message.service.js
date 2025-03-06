import createApiClient from './api.service';

class MessageService {
    constructor(path = '/message') {
        this.api = createApiClient(path);
    }

    async getMessages(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async getUnreadCount(id) {
        return (await this.api.get(`/unread/${id}`)).data;
    }

    async markAsRead(id) {
        return (await this.api.put(`/${id}`)).data;
    }
}

export const messageService = new MessageService();
