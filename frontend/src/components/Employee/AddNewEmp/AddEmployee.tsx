import React, { FC, useState, createRef, LegacyRef, useEffect } from "react";
// ========== Our CSS Stylings: ==========================
// import AddEmployeeCSS from "./css/AddEmployee.module.css";
import "../css/AddEmployee.css";
// // Using Styled-Components to apply <body> bacjaground image only on this page:
// import styled, { createGlobalStyle } from 'styled-components';
// ===== MUI ICONS: ======================================
import SendIcon from '@mui/icons-material/Send';
// ========== FontAwesome Icons: =================================
// ================= MUI Form Components: ==================
import Button from '@mui/material/Button';
// =========== react-phone-number-input ===============================
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'

// ======== My Custom Hook(s): ===============================
import useInformation from "../hooks/useInformation"; // our custom hook function
// ======== My Components: ===============================
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import EmployeePositionInfo from './EmployeePositionInfo'
// ============= Validators & Helpers: ==============================
import { validateAllBeforeSubmit, checkUsernameTaken } from "../helpers/Validators";
import { resetSelectedValues } from "../helpers/resetSelectedValues";
// =============== Snackbar Notification Alert: ===========
import { useDispatch } from "react-redux";
// import { setSnackbar } from "../../redux/ducks/snackbar"; //the reducer function
import { setSnackbar } from "../../../store/slices/snackbarSlice";
/* react-redux has 2 hooks: 
    1. useSelector: to access the states
    2. useDispatch: to modify/update/set the states 
*/
// ======== REACT MULTISELECT DROPDOWN with search feature ==========
import Multiselect from "multiselect-react-dropdown";

import axios from "axios";
import axiosInstance from "../../../api/axios";
// ----------------------- API functions: -------------------------
import { checkAutoLogin } from "../../Auth/api/authApi";
import { useNavigate } from "react-router-dom";


const AddEmployee: FC<any> = (props: any) => {
  const dispatchRedux = useDispatch();
  const navigate = useNavigate();

  const positionsMultiSelectRef: LegacyRef<Multiselect> = createRef();
  const jobTitlesMultiSelectRef: LegacyRef<Multiselect> = createRef();

  // Imagine that the useReducer & useEffect & useState (formIsValid) are placed here 😫
  // What the custom-hook (useInformation) did is just maintaining the useEffect, useReducer, 
  // and useState, then returning their values here, so that it makes the code cleaner instead of 
  // putting all our logic in here. 
  const { formIsValid, setFormIsValid, state, dispatch, EmpActionTypes } = useInformation();
  /* useInformation() is a custom hook function that returns 
     - formIsValid: boolean state. & setFormIsValid: the setter function.
     - state: a state object that contains all states needed for the form.
     - dispatch: reducer function invoked to update the `state`
     - EmpActionTypes: all possible actions to tell the dispatch() which state should be updated.
  */

  useEffect(() => {

    // (async () => {
    //   const resData = await checkAutoLogin(dispatchRedux, navigate);
    //   // If user not logged in, navigate("/login")
    //   console.log(resData);
    //   if (resData.user.role !== "admin") {
    //     navigate("/unauthorized");
    //   }
    // })();

  }, []);


  const handleSubmit = (event: any): void => {

    event.preventDefault();

    const verdict = validateAllBeforeSubmit(state); //returns true if all is well
    setFormIsValid(verdict);
    // console.log(state);
    if (formIsValid) {
      // console.log(state);

      const {
        firstName, middleName, lastName, username, email, phoneNumber,
        birthDate, hireDate, city, gender, maritalStatus,
        position, jobTitle, classification, startDate, endDate,
      } = state;

      axiosInstance().post(
        `${process.env.REACT_APP_API_URL}employee/add`,
        {
          firstName, middleName, lastName, username, email, phoneNumber,
          birthDate, hireDate, city, gender, maritalStatus,
          position, jobTitle, classification, startDate, endDate,
        }
      ).then((response) => {
        const { message, type } = response.data;
        dispatchRedux(
          setSnackbar({
            snackbarOpen: true,
            snackbarType: type,
            snackbarMessage: message,
            vertical: "top",
            horizontal: "center"
          })
        );
        // console.log(response.data.body);
      }).catch((error: any) => console.log(error));


      // =============== NOW RESET ALL FIELDS: ==========================
      dispatch({ type: EmpActionTypes.CLEAR_ALL_FIELDS }); // clear (reset) all fields
      resetSelectedValues(positionsMultiSelectRef, jobTitlesMultiSelectRef)
    }
    else {
      // alert("error");
      // console.log("Please make sure you fill all fields with proper values");
      // dispatchRedux(setSnackbar(true, "error", "Please make sure you fill all fields properly", "top", "center"));
      dispatchRedux(
        setSnackbar({
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: "Please make sure you fill all fields properly",
          vertical: "top",
          horizontal: "center"
        })
      );
      // setSnackbar(snackbarOpen, snackbarType, snackbarMessage)
    }
  };


  return (
    <div className="main-container">
      <form autoComplete="off" onSubmit={(e) => handleSubmit(e)} className="add-employee-form">
        <EmployeeBasicInfo
          state={state}
          dispatch={dispatch}
          EmpActionTypes={EmpActionTypes}
          checkUsernameTaken={checkUsernameTaken}
        />
        <EmployeePositionInfo
          state={state}
          dispatch={dispatch}
          EmpActionTypes={EmpActionTypes}
          positionsMultiSelectRef={positionsMultiSelectRef}
          jobTitlesMultiSelectRef={jobTitlesMultiSelectRef}
        />
        <Button
          className="submit-btn"
          variant="contained"
          // disableElevation
          color="primary"
          endIcon={<SendIcon />}
          // size="small"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddEmployee;
