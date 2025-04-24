import createApiClient from "./api.service";

class RecommendationService {
  constructor(path = "/recommendations") {
    this.api = createApiClient(path);
  }

  async getRecommendations() {
    return (await this.api.get("/")).data;
  }
  
  async getTrendingProducts() {
    return (await this.api.get("/trending")).data;
  }
}

export const recommendationService = new RecommendationService();
