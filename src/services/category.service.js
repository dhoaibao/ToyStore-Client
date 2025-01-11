import createApiClient from './api.service';

class categoryService {
    constructor(path = '/category') {
        this.api = createApiClient(path);
    }

    async getAllCategories() {
        return (await this.api.get('/')).data;
    }
}

export default new categoryService();
