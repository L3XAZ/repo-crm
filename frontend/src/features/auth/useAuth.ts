import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProvider';
import * as authApi from '../../api/auth.api';
import { LoginRequest, RegisterRequest } from '../../types/auth.types';
import { mapError } from '../../utils/errorMapper';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    const { isAuthenticated, isAuthChecked, logout } = context;

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: () => {
            window.location.replace('/');
        },
        onError: (error) => {
            throw mapError(error);
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            window.location.replace('/');
        },
        onError: (error) => {
            throw mapError(error);
        },
    });

    return {
        isAuthenticated,
        isAuthChecked,
        login: (payload: LoginRequest) => loginMutation.mutateAsync(payload),
        register: (payload: RegisterRequest) => registerMutation.mutateAsync(payload),
        logout,
    };
}
