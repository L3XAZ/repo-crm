import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';

type RetryConfig = AxiosRequestConfig & {
    _retry?: boolean;
};

const api: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<{
    resolve: () => void;
    reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error?: AxiosError) => {
    refreshQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    refreshQueue = [];
};

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalConfig = error.config as RetryConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalConfig ||
            originalConfig._retry
        ) {
            return Promise.reject(error);
        }

        originalConfig._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                    resolve: () => resolve(api(originalConfig)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            await api.post('/auth/refresh');
            processQueue();
            return api(originalConfig);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            window.location.assign('/login');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
