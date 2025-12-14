import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const mode: AuthMode = location.pathname === '/register' ? 'register' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDisabled = isSubmitting;

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

            navigate('/', { replace: true });
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                setErrorMessage(String(error.message));
            } else {
                setErrorMessage('Authentication failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = mode === 'login' ? 'Sign in' : 'Create account';
    const submitLabel = mode === 'login' ? 'Login' : 'Register';
    const switchLabel =
        mode === 'login' ? 'Don’t have an account? Register' : 'Already have an account? Login';
    const switchPath = mode === 'login' ? '/register' : '/login';

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
                fullWidth
                autoComplete="email"
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                fullWidth
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {errorMessage && (
                <Typography color="error" variant="body2">
                    {errorMessage}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={isDisabled} fullWidth>
                {isSubmitting ? <CircularProgress size={20} /> : submitLabel}
            </Button>

            <Button variant="text" onClick={() => navigate(switchPath)} disabled={isDisabled}>
                {switchLabel}
            </Button>
        </Box>
    );
}
