import createApiClient from './api.service';

class discountService {
    constructor(path = '/discount') {
        this.api = createApiClient(path);
    }

    async getAllDiscounts() {
        return (await this.api.get('/')).data;
    }
}

export default new discountService();
