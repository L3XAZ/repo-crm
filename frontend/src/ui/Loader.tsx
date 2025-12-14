import { Box, CircularProgress } from '@mui/material';

type Props = {
    fullHeight?: boolean;
};

export function Loader({ fullHeight = false }: Props) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={fullHeight ? '100vh' : '100%'}
            width="100%"
        >
            <CircularProgress />
        </Box>
    );
}
