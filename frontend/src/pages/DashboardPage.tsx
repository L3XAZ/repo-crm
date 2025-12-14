import { Box, Divider, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useMemo, useState } from 'react';

import { DeleteRepoDialog } from '../features/repos/DeleteRepoDialog';
import { RepoList } from '../features/repos/RepoList';
import { useRepos } from '../features/repos/useRepos';
import { Repo } from '../types/repo.types';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Loader } from '../ui/Loader';
import { PageContainer } from '../ui/PageContainer';
import { TextField } from '../ui/TextField';

const REPO_FULL_NAME_REGEX = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

export default function DashboardPage() {
    const { repos, isLoading, addRepo, refreshRepo, deleteRepo, refreshingRepoId, isDeleting } =
        useRepos();

    const [searchQuery, setSearchQuery] = useState('');
    const [newRepoFullName, setNewRepoFullName] = useState('');
    const [addError, setAddError] = useState<string | null>(null);
    const [repoToDelete, setRepoToDelete] = useState<Repo | null>(null);

    const trimmedRepoName = newRepoFullName.trim();
    const isRepoFormatValid =
        trimmedRepoName.length > 0 && REPO_FULL_NAME_REGEX.test(trimmedRepoName);

    const isAddDisabled = !isRepoFormatValid;
    const showAddError = Boolean(addError);

    const filteredRepos = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return repos;
        }

        return repos.filter(
            (repo) =>
                repo.owner.toLowerCase().includes(query) || repo.name.toLowerCase().includes(query)
        );
    }, [repos, searchQuery]);

    const hasRepos = filteredRepos.length > 0;

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
            const axiosError = error as AxiosError;
            const status = axiosError.response?.status;

            if (status === 409) {
                setAddError('Repository already added');
                return;
            }

            if (status === 404) {
                setAddError('Repository not found on GitHub');
                return;
            }

            setAddError('Something went wrong. Please try again.');
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
                        disabled={isAddDisabled}
                        sx={{ height: 56, minWidth: 140 }}
                    >
                        Add
                    </Button>
                </Box>

                {showAddError && (
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

            {hasRepos ? (
                <RepoList
                    repos={filteredRepos}
                    refreshingRepoId={refreshingRepoId}
                    onRefresh={refreshRepo}
                    onRequestDelete={setRepoToDelete}
                />
            ) : (
                <EmptyState
                    title="No repositories"
                    description="Add your first repository to get started"
                />
            )}

            <DeleteRepoDialog
                open={Boolean(repoToDelete)}
                repoName={repoToDelete ? `${repoToDelete.owner}/${repoToDelete.name}` : null}
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
