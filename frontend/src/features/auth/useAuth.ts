import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProvider';
import * as authApi from '../../api/auth.api';
import {
    LoginRequest,
    RegisterRequest,
} from '../../types/auth.types';
import { mapError } from '../../utils/errorMapper';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    const { user, setUser, isAuthenticated, isAuthLoading } = context;

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: data => {
            setUser(data.user);
        },
        onError: error => {
            throw mapError(error);
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: data => {
            setUser(data.user);
        },
        onError: error => {
            throw mapError(error);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setUser(null);
        },
    });

    const login = (payload: LoginRequest) =>
        loginMutation.mutateAsync(payload);

    const register = (payload: RegisterRequest) =>
        registerMutation.mutateAsync(payload);

    const logout = () => logoutMutation.mutateAsync();

    return {
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        register,
        logout,
    };
};
