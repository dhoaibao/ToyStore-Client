import createApiClient from './api.service';

class NewsService {
    constructor(path = '/news') {
        this.api = createApiClient(path);
    }

    async getAllNews(query) {
        return (await this.api.get(`?${query}`)).data;
    }
}

export const newsService = new NewsService();
