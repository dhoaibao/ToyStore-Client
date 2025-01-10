import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://provinces.open-api.vn/api/",
    withCredentials: false,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

class ProvincesOpenApiService {
    async getProvinces() {
        try {
            const response = await apiClient.get("/p/");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Error fetching open api");
        }
    }

    async getDistricts(provinceCode) {
        try {
            const response = await apiClient.get(`/p/${provinceCode}?depth=2`);
            return response.data.districts;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Error fetching open api");
        }
    }

    async getWards(districtCode) {
        try {
            const response = await apiClient.get(`/d/${districtCode}?depth=2`);
            return response.data.wards;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Error fetching open api");
        }
    }
}

export default new ProvincesOpenApiService();