import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as reposApi from '../../api/repos.api';
import { Repo } from '../../types/repo.types';
import { mapError } from '../../utils/errorMapper';

const REPOS_QUERY_KEY = ['repos'];

export function useRepos() {
    const queryClient = useQueryClient();
    const [refreshingRepoId, setRefreshingRepoId] = useState<string | null>(null);

    const reposQuery = useQuery({
        queryKey: REPOS_QUERY_KEY,
        queryFn: async () => {
            const { repos } = await reposApi.getRepos();
            return repos;
        },
    });

    const addRepoMutation = useMutation({
        mutationFn: reposApi.addRepo,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: REPOS_QUERY_KEY });
        },
        onError: (error) => {
            throw mapError(error);
        },
    });

    const refreshRepoMutation = useMutation({
        mutationFn: ({ id }: { id: string }) => reposApi.refreshRepo(id),
        onMutate: ({ id }) => {
            setRefreshingRepoId(id);
        },
        onSuccess: ({ repo }) => {
            queryClient.setQueryData<Repo[]>(REPOS_QUERY_KEY, (current) =>
                current ? current.map((r) => (r._id === repo._id ? repo : r)) : current
            );
        },
        onError: (error) => {
            throw mapError(error);
        },
        onSettled: () => {
            setRefreshingRepoId(null);
        },
    });

    const deleteRepoMutation = useMutation({
        mutationFn: ({ id }: { id: string }) => reposApi.deleteRepo(id),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: REPOS_QUERY_KEY });

            const previous = queryClient.getQueryData<Repo[]>(REPOS_QUERY_KEY);

            queryClient.setQueryData<Repo[]>(REPOS_QUERY_KEY, (current) =>
                current?.filter((repo) => repo._id !== id)
            );

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(REPOS_QUERY_KEY, context.previous);
            }
            throw mapError(error);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: REPOS_QUERY_KEY });
        },
    });

    return {
        repos: reposQuery.data ?? [],
        isLoading: reposQuery.isLoading,

        addRepo: (payload: { fullName: string }) => addRepoMutation.mutateAsync(payload),
        refreshRepo: (id: string) => refreshRepoMutation.mutateAsync({ id }),
        deleteRepo: (id: string) => deleteRepoMutation.mutateAsync({ id }),

        refreshingRepoId,
        isDeleting: deleteRepoMutation.isPending,
    };
}
