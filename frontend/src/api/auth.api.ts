import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

import api from './axios';

export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
};

export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
};

export const refresh = async (): Promise<void> => {
    await api.post('/auth/refresh');
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};
