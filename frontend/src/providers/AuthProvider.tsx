import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { User } from '../types/auth.types';
import * as authApi from '../api/auth.api';

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                await authApi.refresh();
            } catch {
                setUser(null);
            } finally {
                setIsAuthLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user),
                isAuthLoading,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
