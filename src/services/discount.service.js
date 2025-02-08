import createApiClient from './api.service';

class DiscountService {
    constructor(path = '/discount') {
        this.api = createApiClient(path);
    }

    async getAllDiscounts() {
        return (await this.api.get('/')).data;
    }
}

export const discountService = new DiscountService();
