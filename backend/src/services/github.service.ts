import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

export interface GithubRepoData {
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: string;
}

function createClient(): AxiosInstance {
    return axios.create({
        baseURL: 'https://api.github.com',
        timeout: 6000,
        headers: config.githubToken
            ? { Authorization: `token ${config.githubToken}` }
            : undefined
    });
}

async function fetchWithRetry(client: AxiosInstance, url: string, retries = 2): Promise<any> {
    let lastError: any = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await client.get(url);
        } catch (error: any) {
            lastError = error;
            const status = error?.response?.status;

            if (status === 404) {
                const err: any = new Error('Repository not found');
                err.status = 404;
                throw err;
            }

            if (status === 403 && error?.response?.headers?.['x-ratelimit-remaining'] === '0') {
                const err: any = new Error('GitHub rate limit exceeded');
                err.status = 429;
                throw err;
            }

            if (status >= 400 && status < 500) break;

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
                continue;
            }
        }
    }

    const err: any = new Error('Failed to fetch repo from GitHub');
    err.status = 502;
    err.details = lastError?.message;
    throw err;
}

export const githubService = {
    async fetchRepo(fullName: string): Promise<GithubRepoData> {
        const parts = fullName.split('/');
        if (parts.length !== 2) {
            const err: any = new Error('fullName must be "owner/repo"');
            err.status = 400;
            throw err;
        }

        const [owner, repo] = parts;

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
            createdAt: new Date(data.created_at).toISOString()
        };
    }
};
