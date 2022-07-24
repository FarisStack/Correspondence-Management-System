import React, { Fragment, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Grid, Paper, Avatar, TextField, Checkbox, FormControlLabel,
    Button, Typography, Link
} from '@mui/material'

// MUI Icons
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
// Our CSS Module:
import LoginCSS from "./css/Login.module.css";
// Using Styled-Components to apply <body> bacjaground image only on this page:
import styled, { createGlobalStyle } from 'styled-components';
// ======= Form Validation (Fromik & Yup): ==========
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
// ======== HTTP Request to Backend: =========
import axios from 'axios'
import axiosInstance from "../../api/axios";
// =============== Snackbar Notification Alert: ===========
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/
import { setSnackbar } from "../../store/slices/snackbarSlice";
import { loginPending, loginSuccess, loginFail } from "../../store/slices/loginSlice";

// --------- React-Router-Dom ---------------
import { Navigate, Location, useLocation } from "react-router-dom";

// Since the server creates a cookie with the name: 'access-token'
// and it will be httpOnly: true, then we can't access it from browser, so no need
// to the following library right now:
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

interface LoginFormAttrs {
    // Login Form Attributes
    username: string;
    password: string;
}

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, isAuth, errorMessage }: any = useSelector((state: RootState) => state.login);
    const location: Location = useLocation(); //returns the current location object, which represents the current URL in web browsers.
    console.log(location);

    // useEffect(() => {
    //     dispatch(setSnackbar({
    //         snackbarOpen: true,
    //         snackbarType: "error",
    //         snackbarMessage: errorMessage,
    //     }))
    // }, [errorMessage]);

    const paperStyle: any = {
        // padding: "20px 20px",
        padding: "30px 30px",
        // height: "70vh",
        // width: "300px",
        // height: "400px",
        width: "380px",
        height: "460px",
        margin: "0px auto",
        background: "rgba(255, 255, 255, 0.8)",
        position: "relative",
        zIndex: "2",
        borderRadius : '13px'
    };
    const avatarStyle = {
        backgroundColor: "#1bbd7e",
        marginBottom: "6px"
    };
    const btnStyle = {
        // margin: "12px 0"
        margin: "15px 0"
    };
    const txtFieldStyle = {
        // marginBottom: "12px",
        textTransform: "none",
        marginBottom: "15px"
    };
    const errMsgStyle = {
        color: "red"
    };
    // ============== End My Custom Styles for MUI Components: ==============

    // ============== Formik & Yup for Validation: ==============
    const initialValues = {
        username: "",
        password: "",
        rememberMe: false,
    };
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required").min(4)
    });
    // ============== End Formik & Yup for Validation: ==============

    const onSubmit = (values: LoginFormAttrs, props: any) => {
        console.log(values);
        dispatch(loginPending());

        const { username, password } = values;

        const response = axios.post(
            `${process.env.REACT_APP_API_URL}auth/login`,
            { username, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                /* XMLHttpRequest from a different domain cannot set cookie values for their 
                own domain unless withCredentials is set to true before making the request.*/
            }
        ).then((response) => {
            // const { message, type, tokenData } = response.data;
            const { tokenData, message, type, employeeCurrentPositionId } = response.data;
            //tokenData is an object
            if (type === "success") {
                // ---- Store token data in the redux global state (login):
                dispatch(
                    loginSuccess(tokenData)
                );
                // dispatch(getUserProfile());
                // --- Now, store the data that will be changing in the localStorage:
                localStorage.setItem("employeeCurrentPositionId", employeeCurrentPositionId);
            }
            else {
                // Show a Snackbar Notification Alert:
                dispatch(
                    setSnackbar({
                        snackbarOpen: true,
                        snackbarType: type,
                        snackbarMessage: message,
                        autoHideDuration: 5000,
                    })
                );
                // Set the login state:
                dispatch(loginFail(message));
            }
        }).catch(err => {
            dispatch(loginFail(err.message));
        });
    }

    return (
        <Fragment >
            {isAuth === true ? (
                <Navigate to="/" state={{ from: location }} replace />
                // {navigate(-1)}
            ) : (
                <Grid className={LoginCSS["main-container"]}>
                    <Paper
                        sx={{ textTransform: 'none' }}
                        elevation={3}
                        style={paperStyle}
                    >
                        <Grid className={LoginCSS["paper-title"]}>
                            <Avatar style={avatarStyle}><LockOpenOutlinedIcon /></Avatar>

                            <h2>Login</h2>
                        </Grid>
                        {/* Formik will not call onSubmit() validationSchema is satisfied*/}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {(props) => (
                                <Form>
                                    <Field
                                        // In order to tell Formik that I am using MUI, I have 
                                        // to write the as={} property and specify the MUI component's name:
                                        as={TextField}
                                        name="username"
                                        label="username"
                                        // placeholder="enter username"
                                        variant="standard"
                                        fullWidth //will take fillWidth fo its container
                                        // required
                                        style={txtFieldStyle}
                                        helperText={
                                            <ErrorMessage
                                                name="username"
                                                render={msg => <span className={LoginCSS.errMsg}>{msg}</span>}
                                            />
                                        }
                                    // helperText is a MUI prop, and we pass to it the
                                    // Formik's <ErrorMessage /> compoent to be rendered. 
                                    // We shoul tell Formik the `name` to know which error to show.
                                    />
                                    <Field
                                        as={TextField}
                                        type="password"
                                        name="password"
                                        label="password"
                                        // placeholder="enter password"
                                        variant="standard"
                                        fullWidth //will take fillWidth fo its container
                                        // required
                                        style={txtFieldStyle}
                                        helperText={
                                            <ErrorMessage
                                                name="password"
                                                render={msg => <span className={LoginCSS.errMsg}>{msg}</span>}
                                            />
                                        }
                                    />
                                    {/* <Field
                                        as={FormControlLabel}
                                        name="rememberMe"
                                        control={
                                            <Checkbox
                                                color="primary"
                                                size="small"
                                            // checked={checked}
                                            // onChange={handleChange}
                                            />
                                        }
                                        label="Remember me"
                                    /> */}
                                    <Button
                                        type='submit'
                                        color='primary'
                                        variant="contained"
                                        // onClick={}
                                        style={btnStyle}
                                        fullWidth
                                        startIcon={<LoginOutlinedIcon />}
                                        disabled={isLoading as boolean}
                                    >
                                        {isLoading ? "Submitting.." : "Login"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <Typography align='center'>
                            {/* <Link href="/forgot-password">
                                Forgot password?
                            </Link> */}
                            <Button
                                sx={{ textTransform: 'none' }}
                                color="primary"
                                variant="text"
                                // onClick={() => navigate("/forgot-password")}
                                onClick={() => navigate("/forgot-password-faris")}
                            >
                                Forgot password?
                            </Button>
                        </Typography>
                    </Paper>
                </Grid>
            )
            }
        </Fragment >
    )
}
export default Login

