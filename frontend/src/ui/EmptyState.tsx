import { Box, Typography } from '@mui/material';

type Props = {
    title: string;
    description?: string;
};

export function EmptyState({ title, description }: Props) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={4}
            textAlign="center"
        >
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            )}
        </Box>
    );
}
