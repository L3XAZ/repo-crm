import { useMemo, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { PageContainer } from '../ui/PageContainer';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import { RepoList } from '../features/repos/RepoList';
import { DeleteRepoDialog } from '../features/repos/DeleteRepoDialog';
import { useRepos } from '../features/repos/useRepos';
import { Repo } from '../types/repo.types';
import { mapError } from '../utils/errorMapper';

const REPO_FULL_NAME_REGEX = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

export default function DashboardPage() {
    const {
        repos,
        isLoading,
        addRepo,
        refreshRepo,
        deleteRepo,
        refreshingRepoId,
        isDeleting,
    } = useRepos();

    const [searchQuery, setSearchQuery] = useState('');
    const [newRepoFullName, setNewRepoFullName] = useState('');
    const [addError, setAddError] = useState<string | null>(null);
    const [repoToDelete, setRepoToDelete] = useState<Repo | null>(null);

    const trimmedRepoName = newRepoFullName.trim();
    const isRepoFormatValid =
        trimmedRepoName.length > 0 && REPO_FULL_NAME_REGEX.test(trimmedRepoName);

    const filteredRepos = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return repos;
        }

        return repos.filter(
            (repo) =>
                repo.owner.toLowerCase().includes(query) ||
                repo.name.toLowerCase().includes(query)
        );
    }, [repos, searchQuery]);

    if (isLoading) {
        return (
            <PageContainer>
                <Loader />
            </PageContainer>
        );
    }

    const handleAddRepo = async () => {
        if (!isRepoFormatValid) {
            return;
        }

        setAddError(null);

        try {
            await addRepo({ fullName: trimmedRepoName });
            setNewRepoFullName('');
        } catch (error) {
            const mapped = mapError(error);

            if (mapped.status === 409) {
                setAddError('Repository already added');
                return;
            }

            setAddError(mapped.message);
        }
    };

    return (
        <PageContainer>
            <Box display="flex" flexDirection="column" gap={2} marginBottom={4}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box flex={1}>
                        <TextField
                            placeholder="Enter GitHub repository"
                            value={newRepoFullName}
                            onChange={(event) => {
                                setNewRepoFullName(event.target.value);
                                setAddError(null);
                            }}
                            error={Boolean(trimmedRepoName) && !isRepoFormatValid}
                            helperText="Use format: owner/repository (example: facebook/react)"
                            fullWidth
                        />
                    </Box>

                    <Button
                        onClick={handleAddRepo}
                        disabled={!isRepoFormatValid}
                        sx={{ height: 56, minWidth: 140 }}
                    >
                        Add
                    </Button>
                </Box>

                {addError && (
                    <Typography variant="body2" color="error">
                        {addError}
                    </Typography>
                )}

                <Divider />

                <TextField
                    placeholder="Search your repositories"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    size="small"
                />
            </Box>

            {filteredRepos.length === 0 ? (
                <EmptyState
                    title="No repositories"
                    description="Add your first repository to get started"
                />
            ) : (
                <RepoList
                    repos={filteredRepos}
                    refreshingRepoId={refreshingRepoId}
                    onRefresh={refreshRepo}
                    onRequestDelete={setRepoToDelete}
                />
            )}

            <DeleteRepoDialog
                open={Boolean(repoToDelete)}
                repoName={
                    repoToDelete
                        ? `${repoToDelete.owner}/${repoToDelete.name}`
                        : null
                }
                isSubmitting={isDeleting}
                onClose={() => setRepoToDelete(null)}
                onConfirm={async () => {
                    if (!repoToDelete) {
                        return;
                    }

                    await deleteRepo(repoToDelete._id);
                    setRepoToDelete(null);
                }}
            />
        </PageContainer>
    );
}
