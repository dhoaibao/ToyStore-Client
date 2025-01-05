import createApiClient from './api.service';

class imageService {
    constructor(path = '/image') {
        this.api = createApiClient(path);
    }

    async uploadSingleImage(data) {
        return (await this.api.post('/single', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })).data;
    }
}

export default new imageService();
