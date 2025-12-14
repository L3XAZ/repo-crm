import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

type Props = {
    open: boolean;
    repoName: string | null;
    isSubmitting: boolean;
    onConfirm: () => Promise<void> | void;
    onClose: () => void;
};

export function DeleteRepoDialog({ open, repoName, isSubmitting, onConfirm, onClose }: Props) {
    const displayName = repoName ?? 'this repository';

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Delete repository</DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete <strong>{displayName}</strong>?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
