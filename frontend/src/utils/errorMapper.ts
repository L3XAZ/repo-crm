import { AxiosError } from 'axios';

export type AppError = {
    status: number;
    message: string;
};

export const mapError = (error: unknown): AppError => {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status ?? 0;

        switch (status) {
            case 400:
                return { status, message: 'Bad request' };
            case 401:
                return { status, message: 'Unauthorized' };
            case 404:
                return { status, message: 'Not found' };
            case 409:
                return { status, message: 'Conflict' };
            case 429:
                return { status, message: 'Too many requests' };
            default:
                return { status, message: 'Unexpected error' };
        }
    }

    return { status: 0, message: 'Unknown error' };
};
