import createApiClient from './api.service';

class MessageService {
    constructor(path = '/message') {
        this.api = createApiClient(path);
    }

    async getMessages(id, query) {
        return (await this.api.get(`/${id}?${query}`)).data;
    }

    async getUnreadCount(id) {
        return (await this.api.get(`/unread/${id}`)).data;
    }
}

export const messageService = new MessageService();
