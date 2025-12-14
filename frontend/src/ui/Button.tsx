import { Button as MuiButton, ButtonProps } from '@mui/material';

type Props = ButtonProps;

export function Button({ variant = 'contained', size = 'medium', ...rest }: Props) {
    return <MuiButton variant={variant} size={size} {...rest} />;
}
