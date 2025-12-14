import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../features/auth/useAuth';
import { Loader } from '../ui/Loader';

export default function AuthLayout() {
    const { isAuthenticated, isAuthChecked } = useAuth();

    const isLoading = !isAuthChecked;
    const shouldRedirect = isAuthenticated;

    if (isLoading) {
        return <Loader fullHeight />;
    }

    if (shouldRedirect) {
        return <Navigate to="/" replace />;
    }

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={2}
        >
            <Outlet />
        </Box>
    );
}
