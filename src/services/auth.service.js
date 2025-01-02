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

    async signOut() {
        return (await this.api.post('/sign-out')).data;
    }

    async verifyEmail(data) {
        return (await this.api.post('/verify-email', data)).data;
    }

    async resendOtp(data) {
        return (await this.api.post('/resend-otp', data)).data;
    }
}

export default new authService();
