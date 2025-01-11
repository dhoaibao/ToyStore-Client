import createApiClient from './api.service';

class brandService {
    constructor(path = '/brand') {
        this.api = createApiClient(path);
    }

    async getAllBrands() {
        return (await this.api.get('/')).data;
    }
}

export default new brandService();
