export type Repo = {
    _id: string;
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: string;
    addedAt: string;
    lastFetchedAt: string | null;
};

export type ReposResponse = {
    repos: Repo[];
};

export type RepoResponse = {
    repo: Repo;
};

export type AddRepoRequest = {
    fullName: string;
};
