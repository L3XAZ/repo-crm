import axios, { AxiosInstance } from 'axios';

import { config } from '../config';
import { HttpError } from '../utils/HttpError';

export interface GithubRepoData {
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: Date;
}

function createClient(): AxiosInstance {
    return axios.create({
        baseURL: 'https://api.github.com',
        timeout: 6000,
        headers: config.githubToken ? { Authorization: `token ${config.githubToken}` } : undefined,
    });
}

async function fetchWithRetry(client: AxiosInstance, url: string, retries = 2): Promise<any> {
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await client.get(url);
        } catch (error: any) {
            lastError = error;
            const status = error?.response?.status;

            if (status === 404) {
                throw new HttpError(404, 'Repository not found');
            }

            if (status === 403 && error?.response?.headers?.['x-ratelimit-remaining'] === '0') {
                throw new HttpError(429, 'GitHub rate limit exceeded');
            }

            if (status >= 400 && status < 500) break;

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
            }
        }
    }

    throw new HttpError(502, 'Failed to fetch repo from GitHub', {
        message: (lastError as any)?.message,
    });
}

export const githubService = {
    async fetchRepo(fullName: string): Promise<GithubRepoData> {
        const [owner, repo] = fullName.split('/');
        if (!owner || !repo) {
            throw new HttpError(400, 'fullName must be "owner/repo"');
        }

        const client = createClient();
        const response = await fetchWithRetry(client, `/repos/${owner}/${repo}`);
        const data = response.data;

        return {
            owner: data.owner.login,
            name: data.name,
            url: data.html_url,
            stars: Number(data.stargazers_count),
            forks: Number(data.forks_count),
            issues: Number(data.open_issues_count),
            createdAt: new Date(data.created_at),
        };
    },
};
