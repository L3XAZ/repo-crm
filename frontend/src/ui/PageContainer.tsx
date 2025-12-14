import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export function PageContainer({ children }: Props) {
    return (
        <Box width="100%" maxWidth={1200} margin="0 auto" padding={3}>
            {children}
        </Box>
    );
}
