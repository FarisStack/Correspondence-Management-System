import React from 'react'
// ------------------ MUI Dialog ------------------------------
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// --------------- Other MUI Components -------------------------
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

import { makeStyles } from '@mui/styles';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// ----------------- Redux Toolkit ---------------------------
import { useSelector, useDispatch } from "react-redux";
// ----------------- ConfirmDialog Slice -----------------
import { setConfirmDialog } from "../../store/slices/confirmDialogSlice";


const theme = createTheme();
// MUI uses a recommended 8px scaling factor by default.
// So, theme.spacing(2); // `${8 * 2}px` = '16px'

const useStyles = makeStyles(() => ({
    dialog: {
        padding: theme.spacing(2), // 8 * 2 = 16px
        position: "absolute",
        // top: theme.spacing(2),
    },
    dialogTitle: {
        textAlign: "center"
    },
    dialogContent: {
        textAlign: "center"
    },
    dialogActions: {
        justifyContent: "center !important",
    },
    titleIcon: {
        backgroundColor: "#e91e6333 !important",
        color: "#e91e63 !important",
        '&:hover': {
            backgroundColor: "#F0F2F5",
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    },
    btnNo: {
        // color: "#e91e63 !important",
        // borderColor: "#e91e63 !important",
    }
}));

const ConfirmDialog = (props) => {

    // const { confirmDialog, setConfirmDialog } = props;
    const confirmDialogState = useSelector(state => state.confirmDialog);
    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <Dialog open={confirmDialogState.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialogState.title}
                </Typography>
                <Typography variant="subtitle1">
                    {confirmDialogState.subtitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button color="primary" variant="contained"
                    onClick={confirmDialogState.onConfirm}
                >Yes</Button>
                <Button variant="outlined" className={classes.btnNo}
                    onClick={() => {
                        dispatch(
                            setConfirmDialog({ ...confirmDialogState, isOpen: false })
                        )
                    }}
                >No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;