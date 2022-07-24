import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
} from "@mui/material";
// MUI Icons
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
// Our CSS Module:
// Using Styled-Components to apply <body> bacjaground image only on this page:
import styled, { createGlobalStyle } from "styled-components";
// ======= Form Validation (Fromik & Yup): ==========
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// ======== HTTP Request to Backend: =========
import axiosInstance from "../../api/axios";
import { loginFail, loginSuccess } from "../../store/slices/loginSlice";
import { setSnackbar } from "../../store/slices/snackbarSlice";
import { useDispatch } from "react-redux";
// Since the server creates a cookie with the name: 'access-token'
// and it will be httpOnly: true, then we can't access it from browser, so no need
// to the following library right now:
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const Verification = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const GlobalStyle = createGlobalStyle`
        html,
        body {
            min-height: 100%;
        }
        body {
            height: 100vh;
            background-image: url("../images/bgLogin.png");
            background-size: cover;
            position: relative;
        }
        body::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgb(0 0 0 / 25%);
            z-index: -1;
        }
    `;

  // ============== My Custom Styles for MUI Components: ==============
  const gridStyle = {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    left: "50%",
  };
  const paperStyle = {
    padding: "20px 20px",
    // height: "70vh",
    width: "300px",
    height: "320px",
    margin: "0px auto",
    background: "rgba(255, 255, 255, 0.9)",
    position: "relative",
    zIndex: 2,
  };
  const avatarStyle = {
    backgroundColor: "#1bbd7e",
  };
  const btnStyle = {
    marginTop: "24px",
    padding: "10px",


  };
  const txtFieldStyle = {
    marginTop: "30px",
  };
  const errMsgStyle = {
    color: "red",
  };
  // ============== End My Custom Styles for MUI Components: ==============

  // ============== Formik & Yup for Validation: ==============
  const initialValues = {
    verification: "",

  };
  const validationSchema = Yup.object().shape({
    verification: Yup.string().required("Required"),

  });
  // ============== End Formik & Yup for Validation: ==============

  const onSubmit = async (values, props) => {
    props.setSubmitting(true);
    const { verification } = values;

    try {
      const response = await axiosInstance().post("/auth/verification", {
        verification
      });

      const { tokenData, message, type, employeeCurrentPositionId } = response.data;

      //tokenData is an object
      if (type === "success") {
        // ---- Store token data in the redux global state (login):
        dispatch(loginSuccess(tokenData));
        // --- Now, store the data that will be changing in the localStorage:
        localStorage.setItem("employeeCurrentPositionId", employeeCurrentPositionId);
        props.setSubmitting(false);
        navigate("/update-employee-info");
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

    }
    catch (error) {
      console.log(error);
      dispatch(loginFail(error.message));
    }
    // const response = axios
    //   .post(
    //     `${process.env.REACT_APP_API_URL}auth/verification`,
    //     { verification },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       withCredentials: true,
    //       /* XMLHttpRequest from a different domain cannot set cookie values for their own domain unless withCredentials is set to true before making the request.*/
    //     }
    //   )
    //   .then((res) => {
    //     // console.log(response.data);
    //     const { message, type, tokenData } = res.data;
    //     if (type === "success") {
    //       dispatch(loginSuccess(tokenData));
    //       // dispatch(getUserProfile());
    //       navigate(`/profile/${tokenData.id}`);
    //     }
    //     else {
    //       // Show a Snackbar Notification Alert:
    //       dispatch(
    //         setSnackbar({
    //           snackbarOpen: true,
    //           snackbarType: type,
    //           snackbarMessage: message,
    //         })
    //       );
    //       // Set the login state:
    //       dispatch(loginFail(message));
    //     }
    //   }).catch(err => {
    //     dispatch(loginFail(err.message));
    //   });
  };


  return (
    <>
      <GlobalStyle />
      <Grid style={gridStyle}>
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOpenOutlinedIcon />
            </Avatar>
            <h2>Verification Code</h2>
          </Grid>
          {/*Formik will not call onSubmit() validationSchema is satisfied*/}
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
                  name="verification"
                  label="Verification Code"
                  // placeholder="enter Email"
                  variant="outlined"
                  fullWidth //will take fillWidth fo its container
                  // required
                  style={txtFieldStyle}
                  helperText={
                    <ErrorMessage
                      name="verification"
                      render={(msg) => (
                        <span>{msg}</span>
                      )}
                    />
                  }
                />

                <Button

                  type="submit"
                  color="primary"
                  variant="contained"
                  // onClick={}
                  style={btnStyle}
                  fullWidth
                  startIcon={<LoginOutlinedIcon />}
                  disabled={props.isSubmitting}
                >
                  {props.isSubmitting ? "Verifying.." : "Verify"}
                </Button>
              </Form>
            )}
          </Formik>

        </Paper>
      </Grid>
    </>
  );
};

export default Verification;
