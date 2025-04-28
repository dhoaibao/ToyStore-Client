import createApiClient from './api.service';

class ProductInfoService {
    constructor(path = '/product-information') {
        this.api = createApiClient(path);
    }

    async getAllProductInfo() {
        return (await this.api.get(`/?keyword=${encodeURIComponent('Chất liệu')}&isActive=true`)).data;
    }
}

export const productInfoService = new ProductInfoService();