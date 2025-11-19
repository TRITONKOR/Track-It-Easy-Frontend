import API from "../config/axios.config";

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchUsers = async (): Promise<User[]> => {
    const response = await API.get(`/users`);
    return response.data;
};

export const createUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
}): Promise<User> => {
    const response = await API.post(`/users`, userData);
    return response.data;
};

export const updateUser = async (
    id: string,
    userData: {
        username?: string;
        email?: string;
        password?: string;
        role?: string;
    }
): Promise<User> => {
    const response = await API.patch(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await API.delete(`/users/${id}`);
};
