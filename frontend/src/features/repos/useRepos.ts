import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import * as reposApi from '../../api/repos.api';
import { Repo } from '../../types/repo.types';

const REPOS_QUERY_KEY = ['repos'];

export function useRepos() {
    const queryClient = useQueryClient();
    const [refreshingRepoId, setRefreshingRepoId] = useState<string | null>(null);

    const { data: repos = [], isLoading } = useQuery({
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
    });

    const refreshRepoMutation = useMutation({
        mutationFn: reposApi.refreshRepo,
        onMutate: (id: string) => {
            setRefreshingRepoId(id);
        },
        onSuccess: ({ repo }) => {
            queryClient.setQueryData<Repo[]>(REPOS_QUERY_KEY, (current) =>
                current ? current.map((r) => (r._id === repo._id ? repo : r)) : current
            );
        },
        onSettled: () => {
            setRefreshingRepoId(null);
        },
    });

    const deleteRepoMutation = useMutation({
        mutationFn: reposApi.deleteRepo,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: REPOS_QUERY_KEY });

            const previous = queryClient.getQueryData<Repo[]>(REPOS_QUERY_KEY);

            queryClient.setQueryData<Repo[]>(REPOS_QUERY_KEY, (current) =>
                current?.filter((repo) => repo._id !== id)
            );

            return { previous };
        },
        onError: (_error, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(REPOS_QUERY_KEY, context.previous);
            }
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: REPOS_QUERY_KEY });
        },
    });

    const addRepo = (payload: { fullName: string }) => {
        return addRepoMutation.mutateAsync(payload);
    };

    const refreshRepo = (id: string) => {
        return refreshRepoMutation.mutateAsync(id);
    };

    const deleteRepo = (id: string) => {
        return deleteRepoMutation.mutateAsync(id);
    };

    return {
        repos,
        isLoading,

        addRepo,
        refreshRepo,
        deleteRepo,

        refreshingRepoId,
        isDeleting: deleteRepoMutation.isPending,
    };
}
