import createApiClient from './api.service';

class ReviewService {
    constructor(path = '/review') {
        this.api = createApiClient(path);
    }

    async getAllReviews(query) {
        const response = await this.api.get(`?${query}`);
        return response.data;
    }

    async createReview(data) {
        const response = await this.api.post('/', data);
        return response.data;
    }

    async deleteReview(id) {
        const response = await this.api.delete(`/${id}`);
        return response.data;
    }
}

export const reviewService = new ReviewService();