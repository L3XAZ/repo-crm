import { IconButton as MuiIconButton, IconButtonProps } from '@mui/material';

type Props = IconButtonProps;

export function IconButton(props: Props) {
    return <MuiIconButton {...props} />;
}
