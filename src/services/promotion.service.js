import createApiClient from './api.service';

class PromotionService {
    constructor(path = '/promotion') {
        this.api = createApiClient(path);
    }

    async getAllPromotions() {
        return (await this.api.get('/')).data;
    }
}

export const promotionService = new PromotionService();
