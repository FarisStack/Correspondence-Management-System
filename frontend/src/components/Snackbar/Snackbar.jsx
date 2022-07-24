// ============= MUI Snackbar Notification/Alert Component: =============
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles } from '@mui/styles';


import { useDispatch, useSelector } from "react-redux";
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/
import { setSnackbar } from "../../store/slices/snackbarSlice"; // setSncakbar is one of the case reducer functions
// import { setSnackbar } from "./redux/ducks/snackbar";

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        // "& > * + *": {
        //     marginTop: theme.spacing(2)
        // }
    },
}));

const CustomizedSnackbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch(); //now I can call dispatch() to update any state in the redux.
    // access the state.snackbar and destructure it:
    // const { snackbarOpen, snackbarType, snackbarMessage, vertical, horizontal }
    //     = useSelector(state => state.snackbar);
    const state = useSelector(state => state.snackbar);


    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        // dispatch(setSnackbar(false));
        // setSnackbar is the reducer function
        dispatch(setSnackbar({ ...state, snackbarOpen: false }));
    };

    return (
        <div style={{ zIndex: 99999 }}>
            <Snackbar
                sx={{ zIndex: 99999 }}
                open={state.snackbarOpen} //by default is false
                autoHideDuration={state.autoHideDuration ? state.autoHideDuration : null}
                onClose={handleClose} // close the snackbar by clicking on the X button
                anchorOrigin={{
                    vertical: state.vertical ? state.vertical : "top",
                    horizontal: state.horizontal ? state.horizontal : "center",
                }} //the position of the snackbar on screen.
            >
                <MuiAlert
                    sx={{ zIndex: 99999 }}
                    elevation={6}
                    variant={state.snackbarVariant}
                    onClose={handleClose} //will close the snackbar automatically after some time
                    severity={state.snackbarType} //ex: "success" or "warning" or "info"
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "left", gap: "7px" }}
                // action={state.action}
                >
                    {state.snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default CustomizedSnackbar
