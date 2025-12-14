import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps;

export function TextField({
    variant = 'outlined',
    fullWidth = true,
    size = 'medium',
    ...rest
}: Props) {
    return <MuiTextField variant={variant} fullWidth={fullWidth} size={size} {...rest} />;
}
