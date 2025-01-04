import createApiClient from './api.service';

class authService {
    constructor(path = '/user') {
        this.api = createApiClient(path);
    }

    async getLoggedInUser() {
        return (await this.api.get('/me')).data;
    }

    async updateProfile(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async changePassword(data) {
        return (await this.api.put('/change-password', data)).data;
    }
}

export default new authService();
