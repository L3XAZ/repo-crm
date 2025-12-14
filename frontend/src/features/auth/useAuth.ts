import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import * as authApi from '../../api/auth.api';
import { AuthContext } from '../../providers/AuthProvider';
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
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
    });

    const login = async (payload: LoginRequest) => {
        try {
            await loginMutation.mutateAsync(payload);
            window.location.replace('/');
        } catch (error) {
            throw mapError(error);
        }
    };

    const register = async (payload: RegisterRequest) => {
        try {
            await registerMutation.mutateAsync(payload);
            window.location.replace('/');
        } catch (error) {
            throw mapError(error);
        }
    };

    return {
        isAuthenticated,
        isAuthChecked,
        login,
        register,
        logout,
    };
}
