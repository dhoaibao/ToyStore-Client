import createApiClient from './api.service';

class productService {
    constructor(path = '/product') {
        this.api = createApiClient(path);
    }

    async getAllProducts() {
        return (await this.api.get('/')).data;
    }

    async getProductBySlug(slug) {
        return (await this.api.get(`/${slug}`)).data;
    }
}

export default new productService();