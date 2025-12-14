import { Button as MuiButton, ButtonProps } from '@mui/material';

export function Button({ variant = 'contained', size = 'medium', ...props }: ButtonProps) {
    return <MuiButton variant={variant} size={size} {...props} />;
}
