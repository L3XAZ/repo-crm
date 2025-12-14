import { Box } from '@mui/material';
import { Repo } from '../../types/repo.types';
import { RepoCard } from './RepoCard';

type Props = {
    repos: Repo[];
    refreshingRepoId: string | null;
    onRefresh: (repoId: string) => void;
    onRequestDelete: (repo: Repo) => void;
};

export function RepoList({ repos, refreshingRepoId, onRefresh, onRequestDelete }: Props) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 2,
            }}
        >
            {repos.map((repo) => (
                <RepoCard
                    key={repo._id}
                    repo={repo}
                    isRefreshing={refreshingRepoId === repo._id}
                    onRefresh={onRefresh}
                    onRequestDelete={onRequestDelete}
                />
            ))}
        </Box>
    );
}
