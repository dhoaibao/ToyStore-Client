import createApiClient from './api.service';

class OrderService {
    constructor(path = '/order') {
        this.api = createApiClient(path);
    }

    async createOrder(data) {
        return (await this.api.post('/', data)).data;
    }

    async getCartByUser() {
        return (await this.api.get('/by-user')).data;
    }

    async getCartById(id) {
        return (await this.api.get(`/${id}`)).data;
    }
}

export const orderService = new OrderService();
