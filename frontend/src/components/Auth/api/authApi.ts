// ---------------- Redux Toolkit -------------------------
import { loginSuccess, loginFail } from "../../../store/slices/loginSlice";
import { setSnackbar, ISeverity } from "../../../store/slices/snackbarSlice";
import { RootState } from "../../../store/";
// ---------------- Axios -------------------------
import axios, { AxiosResponse } from 'axios';
import axiosInstance from "../../../api/axios"

export const checkAutoLogin = async (dispatch: any) => {

    const response = await axiosInstance().get(`auth/verifyToken`, {
        // headers: {'Content-Type': 'application/json'},
        // withCredentials: true,
        /* XMLHttpRequest from a different domain cannot set cookie values for their own domain 
        unless withCredentials is set to true before making the request.*/
    });

    // console.log(response.data);
    const { tokenVerified } = response.data;

    if (tokenVerified) {
        const { user } = response.data; // `user` is an objet stores the decoded payload which that was stored about this user when he logged in. So, now we need this decoded payload to store it in our global redux state `login.user`
        dispatch(loginSuccess(user));
    }
    else {
        const { message } = response.data;
        dispatch(
            setSnackbar({
                snackbarOpen: true,
                snackbarType: ISeverity.ERROR,
                snackbarMessage: message,
            })
        );
        dispatch(loginFail(message));
    }

    // console.log("Done axios");
    return response.data;
}

export const handleLogout = (dispatch: any, logoutUser: any, navigate: any) => {
    // First of all, hit an API request to delete the cookie['access-token] from the server: 
    axiosInstance().delete(`auth/logout`, {
        withCredentials: true
    }).then(response => console.log(response.data));

    // Next, don't forget to update the redux state `state.login`
    dispatch(logoutUser()); //update the redux state `state.login`

    // ---- Don't forget to delete the localStorage entry (employeeCurrentPositionId):
    localStorage.removeItem("employeeCurrentPositionId");

    // Finally, direct user to login page for example
    // navigate("/login");
    navigate("/");
}
