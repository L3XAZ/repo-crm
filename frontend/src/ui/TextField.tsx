import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export function TextField({
    variant = 'outlined',
    fullWidth = true,
    size = 'medium',
    ...props
}: TextFieldProps) {
    return <MuiTextField variant={variant} fullWidth={fullWidth} size={size} {...props} />;
}
