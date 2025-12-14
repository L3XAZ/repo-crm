import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../features/auth/useAuth';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';

export default function AppLayout() {
    const { isAuthenticated, isAuthChecked, logout } = useAuth();

    const isLoading = !isAuthChecked;
    const shouldRedirect = !isAuthenticated;

    if (isLoading) {
        return <Loader fullHeight />;
    }

    if (shouldRedirect) {
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
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            userSelect: 'none',
                            cursor: 'default',
                        }}
                    >
                        Repo CRM
                    </Typography>

                    <Button
                        variant="text"
                        size="large"
                        sx={{ fontWeight: 500 }}
                        onClick={() => void logout()}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Outlet />
        </Box>
    );
}
