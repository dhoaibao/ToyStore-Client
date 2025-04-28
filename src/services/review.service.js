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
        return (await this.api.post('/', data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })).data;
    }
}

export const reviewService = new ReviewService();