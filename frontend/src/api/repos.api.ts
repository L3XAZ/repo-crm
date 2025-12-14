import api from './axios';
import { AddRepoRequest, RepoResponse, ReposResponse } from '../types/repo.types';

export const getRepos = async (): Promise<ReposResponse> => {
    const { data } = await api.get<ReposResponse>('/repos');
    return data;
};

export const addRepo = async (payload: AddRepoRequest): Promise<RepoResponse> => {
    const { data } = await api.post<RepoResponse>('/repos', payload);
    return data;
};

export const refreshRepo = async (id: string): Promise<RepoResponse> => {
    const { data } = await api.put<RepoResponse>(`/repos/${id}/refresh`);
    return data;
};

export const deleteRepo = async (id: string): Promise<void> => {
    await api.delete(`/repos/${id}`);
};
