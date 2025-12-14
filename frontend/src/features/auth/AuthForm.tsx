import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppError } from '../../utils/errorMapper';

import { useAuth } from './useAuth';

type AuthMode = 'login' | 'register';

const MIN_REGISTER_PASSWORD_LENGTH = 6;

export default function AuthForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const mode: AuthMode = location.pathname === '/register' ? 'register' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isPasswordValid =
        mode === 'register' ? password.length >= MIN_REGISTER_PASSWORD_LENGTH : password.length > 0;

    const showPasswordError = mode === 'register' && password.length > 0 && !isPasswordValid;

    const passwordHelperText =
        mode === 'register'
            ? `Password must be at least ${MIN_REGISTER_PASSWORD_LENGTH} characters`
            : undefined;

    const isSubmitDisabled = isSubmitting || !isPasswordValid;

    const title = mode === 'login' ? 'Sign in' : 'Create account';
    const submitLabel = mode === 'login' ? 'Login' : 'Register';
    const switchLabel =
        mode === 'login' ? 'Don’t have an account? Register' : 'Already have an account? Login';
    const switchPath = mode === 'login' ? '/register' : '/login';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            if (mode === 'login') {
                await login({ email, password });
            } else {
                await register({ email, password });
            }
        } catch (error) {
            const appError = error as AppError;

            if (mode === 'login') {
                setErrorMessage(
                    appError.status === 401
                        ? 'Invalid email or password'
                        : 'Unable to sign in. Please try again'
                );
            } else {
                setErrorMessage(
                    appError.status === 409
                        ? 'This email is already registered'
                        : 'Unable to create account. Please try again'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            width="100%"
            maxWidth={360}
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Typography variant="h5" align="center">
                {title}
            </Typography>

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                error={showPasswordError}
                helperText={passwordHelperText}
            />

            {errorMessage && (
                <Typography color="error" variant="body2">
                    {errorMessage}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={isSubmitDisabled} fullWidth>
                {submitLabel}
            </Button>

            <Button variant="text" onClick={() => navigate(switchPath)} disabled={isSubmitting}>
                {switchLabel}
            </Button>
        </Box>
    );
}
