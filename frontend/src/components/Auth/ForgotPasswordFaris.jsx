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
// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar, ISeverity, IVariant } from "../../store/slices/snackbarSlice";

// Since the server creates a cookie with the name: 'access-token'
// and it will be httpOnly: true, then we can't access it from browser, so no need
// to the following library right now:
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const ForgotPassword = () => {

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
  // const txtFieldStyle = {
  //   marginTop: "30px",
  //   textTransform: "none",
  // };
  const errMsgStyle = {
    color: "red",
  };
  // ============== End My Custom Styles for MUI Components: ==============

  // ============== Formik & Yup for Validation: ==============
  const initialValues = {
    username: "",

  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required"),

  });
  // ============== End Formik & Yup for Validation: ==============


  const onSubmit = async (values, props) => {

    props.setSubmitting(true);

    const { username } = values;
    // console.log(Email, password);

    try {
      const response = await axiosInstance().post("/auth/forgot-password-faris", {
        username
      });

      const { message, statusCode, type } = response.data;

      dispatch(
        setSnackbar({
          snackbarOpen: true,
          snackbarType:
            type == "success"
              ? ISeverity.SUCCESS
              : ISeverity.ERROR,
          snackbarVariant: IVariant.STANDARD,
          vertical: "top",
          snackbarMessage: message,
        })
      );

      props.setSubmitting(false);
      // Give the user some seconds to read the snackbar message then navigate:

      if (type == "success") {
        setTimeout(() => {
          navigate("/verification");
        }, 10000);
      } // end if
    } // end try
    catch (error) {
      console.log(error);
    }
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
            <h2>Forgot Password</h2>
          </Grid>
          {/*Formik will not call onSubmit() validationSchema is satisfied*/}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(props) => (
              <Form
                style={{ display: "flex", flexDirection: "column", gap: "5px", margin: "15px 0" }}
              >
                <Field
                  // In order to tell Formik that I am using MUI, I have
                  // to write the as={} property and specify the MUI component's name:
                  as={TextField}
                  id="username"
                  name="username"
                  label="Enter your username"
                  // placeholder="enter Email"
                  variant="standard"
                  fullWidth //will take fillWidth fo its container
                  // required
                  // style={txtFieldStyle}
                  helperText={
                    <ErrorMessage
                      name="username"
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
                  {props.isSubmitting ? "Sending email.." : "Send email"}
                </Button>
                <Button
                  sx={{ textTransform: 'none' }}
                  color="secondary"
                  variant="text"
                  onClick={() => navigate("/login")}
                >
                  Return to login
                </Button>
              </Form>
            )}
          </Formik>

        </Paper>
      </Grid>
    </>
  );
};

export default ForgotPassword;