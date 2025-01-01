import createApiClient from './api.service';

class authService {
    constructor(path = '/auth') {
        this.api = createApiClient(path);
    }

    async signIn(data) {
        return (await this.api.post('/sign-in', data)).data;
    }

    async signUp(data) {
        return (
            await this.api.post('/sign-up', data)).data;
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
