import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../features/auth/useAuth';
import { Loader } from '../ui/Loader';

export default function AuthLayout() {
    const { isAuthenticated, isAuthChecked } = useAuth();

    if (!isAuthChecked) {
        return <Loader fullHeight />;
    }

    if (isAuthenticated) {
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
