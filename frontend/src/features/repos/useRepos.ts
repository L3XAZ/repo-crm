import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as reposApi from '../../api/repos.api';
import { Repo, RepoResponse } from '../../types/repo.types';
import { mapError } from '../../utils/errorMapper';

const REPOS_QUERY_KEY = ['repos'];

export const useRepos = () => {
    const queryClient = useQueryClient();

    const reposQuery = useQuery<Repo[]>({
        queryKey: REPOS_QUERY_KEY,
        queryFn: async () => {
            const data = await reposApi.getRepos();
            return data.repos;
        },
    });

    const addRepoMutation = useMutation<
        RepoResponse,
        unknown,
        { fullName: string }
    >({
        mutationFn: reposApi.addRepo,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: REPOS_QUERY_KEY,
            });
        },
        onError: error => {
            throw mapError(error);
        },
    });

    const refreshRepoMutation = useMutation<
        RepoResponse,
        unknown,
        { id: string }
    >({
        mutationFn: ({ id }) => reposApi.refreshRepo(id),
        onSuccess: data => {
            queryClient.setQueryData<Repo[]>(
                REPOS_QUERY_KEY,
                current =>
                    current
                        ? current.map(repo =>
                            repo._id === data.repo._id ? data.repo : repo
                        )
                        : current
            );
        },
        onError: error => {
            throw mapError(error);
        },
    });

    const deleteRepoMutation = useMutation<
        void,
        unknown,
        { id: string },
        { previous?: Repo[] }
    >({
        mutationFn: ({ id }) => reposApi.deleteRepo(id),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({
                queryKey: REPOS_QUERY_KEY,
            });

            const previous =
                queryClient.getQueryData<Repo[]>(REPOS_QUERY_KEY);

            queryClient.setQueryData<Repo[]>(
                REPOS_QUERY_KEY,
                current => current?.filter(repo => repo._id !== id)
            );

            return { previous };
        },
        onError: (error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    REPOS_QUERY_KEY,
                    context.previous
                );
            }
            throw mapError(error);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({
                queryKey: REPOS_QUERY_KEY,
            });
        },
    });

    return {
        repos: reposQuery.data ?? [],
        isLoading: reposQuery.isLoading,
        isError: reposQuery.isError,
        refetch: reposQuery.refetch,
        addRepo: addRepoMutation.mutateAsync,
        refreshRepo: (id: string) =>
            refreshRepoMutation.mutateAsync({ id }),
        deleteRepo: (id: string) =>
            deleteRepoMutation.mutateAsync({ id }),
        isAdding: addRepoMutation.isPending,
        refreshingRepoId:
            refreshRepoMutation.variables?.id ?? null,
    };
};
