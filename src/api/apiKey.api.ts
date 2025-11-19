import API from "../config/axios.config";

export const generateApiKey = async (userId: string): Promise<string> => {
    const response = await API.post(`/users/${userId}/generate-api-key`);
    return response.data.apiKey;
};
