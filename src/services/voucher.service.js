import createApiClient from './api.service';

class VoucherService {
    constructor(path = '/voucher') {
        this.api = createApiClient(path);
    }

    async getAllVouchers() {
        return (await this.api.get('?limit=-1&current=true')).data;
    }

    async collectVoucher(id) {
        return (await this.api.post(`/collect/${id}`)).data;
    }

    async getVoucherByUser(query) {
        return (await this.api.get(`/by-user?${query}`)).data;
    }

    async getVoucherById(id) {
        return (await this.api.get(`/${id}`)).data;
    }
}

export const voucherService = new VoucherService();
