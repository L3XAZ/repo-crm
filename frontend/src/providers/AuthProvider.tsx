import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import axios from 'axios';

type AuthContextValue = {
    isAuthenticated: boolean;
    isAuthChecked: boolean;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const authCheckApi = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

export function AuthProvider({ children }: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                await authCheckApi.get('/repos');
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsAuthChecked(true);
            }
        };

        checkSession();
    }, []);

    const logout = async () => {
        try {
            await authCheckApi.post('/auth/logout');
        } finally {
            setIsAuthenticated(false);
            setIsAuthChecked(true);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isAuthChecked,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
