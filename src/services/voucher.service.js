import createApiClient from './api.service';

class VoucherService {
    constructor(path = '/voucher') {
        this.api = createApiClient(path);
    }

    async getAllVouchers(query) {
        return (await this.api.get(`?${query}`)).data;
    }

    async collectVoucher(id) {
        return (await this.api.post(`/collect/${id}`)).data;
    }

    async getVoucherByUser() {
        return (await this.api.get('/by-user')).data;
    }

    async getVoucherById(id) {
        return (await this.api.get(`/${id}`)).data;
    }
}

export const voucherService = new VoucherService();
