import { Navigate, Outlet } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../features/auth/useAuth';
import { Loader } from '../ui/Loader';

export default function AppLayout() {
    const { isAuthenticated, isAuthLoading, logout } = useAuth();

    if (isAuthLoading) {
        return <Loader fullHeight />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box minHeight="100vh">
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar
                    sx={{
                        maxWidth: 1200,
                        width: '100%',
                        margin: '0 auto',
                        px: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6">Repo CRM</Typography>

                    <Button variant="text" onClick={() => void logout()}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Outlet />
        </Box>
    );
}
