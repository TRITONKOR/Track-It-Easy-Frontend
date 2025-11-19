import API from '../config/axios.config';

interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
        apiKey?: string;
        createdAt: string;
    };
}

export const authService = {
    login: async (email: string, password: string) => {
        const response = await API.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        return response.data;
    },

    refresh: async () => {
        const response = await API.patch<AuthResponse>(
            '/auth/refresh',
            {},
            { withCredentials: true },
        );

        return response.data;
    },

    logout: async () => {
        await API.post('/auth/logout', {}, { withCredentials: true });
    },
};
