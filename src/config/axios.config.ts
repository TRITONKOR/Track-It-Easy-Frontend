import axios from 'axios';
import { config } from '../config';

const API = axios.create({
    baseURL: config.SERVER_URL,
    withCredentials: true,
});

const refreshToken = async () => {
    try {
        const response = await axios.patch(
            `${config.SERVER_URL}/auth/refresh`,
            {},
            { withCredentials: true },
        );

        localStorage.setItem('accessToken', response.data.accessToken);

        return response.data.accessToken;
    } catch (error) {
        console.error('❌ Не вдалося оновити токен', error);
        return null;
    }
};

API.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['x-Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            if (newToken) {
                originalRequest.headers['x-Authorization'] = `Bearer ${newToken}`;
                return API(originalRequest);
            }
        }

        return Promise.reject(error);
    },
);

export default API;
