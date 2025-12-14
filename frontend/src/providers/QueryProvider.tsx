import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
