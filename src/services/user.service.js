import createApiClient from './api.service';

class authService {
    constructor(path = '/user') {
        this.api = createApiClient(path);
    }

    async getLoggedInUser() {
        return (await this.api.get('/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })).data;
    }
}

export default new authService();
