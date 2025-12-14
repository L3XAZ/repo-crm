import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Link,
    Typography,
} from '@mui/material';
import { Repo } from '../../types/repo.types';

type Props = {
    repo: Repo;
    isRefreshing: boolean;
    onRefresh: (repoId: string) => void;
    onRequestDelete: (repo: Repo) => void;
};

export function RepoCard({ repo, isRefreshing, onRefresh, onRequestDelete }: Props) {
    return (
        <Card>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                }}
            >
                <Typography variant="subtitle1" fontWeight={600}>
                    {repo.owner}/{repo.name}
                </Typography>

                <Link
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="text.secondary"
                >
                    Open on GitHub
                </Link>

                <Typography variant="body2">
                    ⭐ {repo.stars} • 🍴 {repo.forks} • 🐞 {repo.issues}
                </Typography>

                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Created {new Date(repo.createdAt).toLocaleDateString()}
                    </Typography>

                    {repo.lastFetchedAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            Last fetched {new Date(repo.lastFetchedAt).toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    pb: 2,
                }}
            >
                <Button
                    size="small"
                    variant="text"
                    onClick={() => onRefresh(repo._id)}
                    disabled={isRefreshing}
                >
                    Refresh
                </Button>

                <IconButton size="small" onClick={() => onRequestDelete(repo)}>
                    Delete
                </IconButton>
            </CardActions>
        </Card>
    );
}
