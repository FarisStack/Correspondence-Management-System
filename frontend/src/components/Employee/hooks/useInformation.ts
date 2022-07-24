import axios from "axios";
import axiosInstance from "../../../api/axios";

import { useReducer, useState, useEffect } from "react";
import { validateName, validateMiddleName, validateEmail, validatePhoneNumber } from "../helpers/Validators";

// An enum with all the types of actions to use in our reducer
export enum EmpActionTypes {
  CLEAR_ALL_FIELDS = "clear-all",
  FIRST_NAME_UPDATED = "first-name-updated",
  FIRST_NAME_BLURED = "first-name-blured",

  MIDDLE_NAME_UPDATED = "middle-name-updated",
  MIDDLE_NAME_BLURED = "middle-name-blured",

  LAST_NAME_UPDATED = "last-name-updated",
  LAST_NAME_BLURED = "last-name-blured",

  EMAIL_UPDATED = "email-updated",
  EMAIL_BLURED = "email-blured",

  PHONE_UPDATED = "phone-updated",
  PHONE_BLURED = "phone-blured",

  USERNAME_UPDATED = "username-updated",
  USERNAME_BLURED = "username-blured",

  GENDER_UPDATED = "gender-updated",

  BIRTHDATE_UPDATED = "birth-date-updated",
  HIREDATE_UPDATED = "hire-date-updated",
  MARITAL_STATUS_UPDATED = "marital-status-updated",
  CITY_UPDATED = "city-updated",
  POSITION_SELECTED = "position-selected",
  CLASSIFICATION_SELECTED = "classification-selected",
  JOBTITLE_SELECTED = "jobtitle-selected",
  LISTS_FETCHED_FROM_DB = "lists-fetched-from-DB",
  STARTDATE_UPDATED = "position-start-date-updated",
  ENDDATE_UPDATED = "position-end-date-updated",
};

// An interface for our actions
interface EmpAction {
  type: EmpActionTypes;
  value?: any; //optional
}

// This is the default values (initial values) for our reducer state
const initialState = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  username: "",
  usernameHelperText: "",
  birthDate: null,
  hireDate: new Date().toISOString().split("T")[0], //ex: 2000-10-02,
  // set the hireDate to current date as inital value
  gender: "",
  maritalStatus: "",
  city: "cityIcon",
  position: "", // the selected position from the positionsList
  classification: "sitemapIcon", // the selected classification from the classificationsList
  jobTitle: "", // the selected job title from the jobTitlesList
  positionsList: [], // all positions from DB
  classificationsList: [], // all classifications from DB
  jobTitlesList: [], // all jobtitles from DB
  startDate: new Date().toISOString().split("T")[0], //ex: 2000-10-02,
  // set the startDate to current date as inital value
  endDate: null,

  valid: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // this is validted automatically by the library
    username: true,  //assume it is a valid username (not taken)
    // no need to validate dates.
    gender: "",
    maritalStatus: "",
    city: "",
  },
};

const infoReducer = (state: any, action: EmpAction) => {
  switch (action.type) {
    case EmpActionTypes.FIRST_NAME_UPDATED:
      return {
        ...state,
        firstName: action.value.trim(),
        valid: {
          ...state.valid,
          firstName: validateName(action.value),
        },
      };
    case EmpActionTypes.FIRST_NAME_BLURED:
      return {
        ...state,
        valid: { ...state.valid, firstName: validateName(state.firstName) },
      };
    case EmpActionTypes.MIDDLE_NAME_UPDATED:
      return {
        ...state,
        middleName: action.value.trim(),
        valid: {
          ...state.valid,
          middleName: validateMiddleName(action.value),
        },
      };
    case EmpActionTypes.MIDDLE_NAME_BLURED:
      return {
        ...state,
        valid: {
          ...state.valid,
          middleName: validateMiddleName(state.middleName),
        },
      };
    case EmpActionTypes.LAST_NAME_UPDATED:
      return {
        ...state,
        lastName: action.value.trim(),
        valid: {
          ...state.valid,
          lastName: validateName(action.value),
        },
      };
    case EmpActionTypes.LAST_NAME_BLURED:
      return {
        ...state,
        valid: { ...state.valid, lastName: validateName(state.lastName) },
      };
    case EmpActionTypes.EMAIL_UPDATED:
      return {
        ...state,
        email: action.value.trim(),
        valid: {
          ...state.valid,
          email: validateEmail(action.value),
        },
      };
    case EmpActionTypes.EMAIL_BLURED:
      return {
        ...state,
        valid: { ...state.valid, email: validateEmail(state.email) },
      };
    case EmpActionTypes.PHONE_UPDATED:
      return {
        ...state,
        phoneNumber: action.value?.trim(),
        valid: {
          ...state.valid,
          phoneNumber: validatePhoneNumber(action.value),
        },
      };
    case EmpActionTypes.PHONE_BLURED:
      return {
        ...state,
        valid: {
          ...state.valid,
          phoneNumber: validatePhoneNumber(state.phoneNumber),
        },
      };
    case EmpActionTypes.USERNAME_UPDATED: // onChange event
      return {
        ...state,
        username: action.value?.trim(), // onChange, we want to update the username value
      };
    case EmpActionTypes.USERNAME_BLURED: // onBlur event
      return {
        ...state,
        usernameHelperText: action.value.helperText, //onBlur, we hit a request to the server to decide wheter the username is valid or not, then we should update the helperText
        valid: {
          ...state.valid,
          username: !action.value.isTaken, //if taken then the valid.username = false
        },
      };
    case EmpActionTypes.BIRTHDATE_UPDATED:
      return { ...state, birthDate: action.value?.trim() };
    case EmpActionTypes.HIREDATE_UPDATED:
      return { ...state, hireDate: action.value?.trim() };
    case EmpActionTypes.GENDER_UPDATED:
      return { ...state, gender: action.value };
    case EmpActionTypes.MARITAL_STATUS_UPDATED:
      return { ...state, maritalStatus: action.value };
    case EmpActionTypes.CITY_UPDATED:
      return { ...state, city: action.value };
    case EmpActionTypes.POSITION_SELECTED:
      return { ...state, position: action.value };
    case EmpActionTypes.CLASSIFICATION_SELECTED:
      return { ...state, classification: action.value };
    case EmpActionTypes.JOBTITLE_SELECTED:
      return { ...state, jobTitle: action.value };
    case EmpActionTypes.LISTS_FETCHED_FROM_DB:
      return {
        ...state,
        positionsList: action.value.allPositions,
        classificationsList: action.value.allClassifications,
        jobTitlesList: action.value.allJobTitles,
      };
    case EmpActionTypes.STARTDATE_UPDATED:
      return { ...state, startDate: action.value?.trim() };
    case EmpActionTypes.ENDDATE_UPDATED:
      return { ...state, endDate: action.value?.trim() };
    case EmpActionTypes.CLEAR_ALL_FIELDS:
      return {
        ...initialState,
        positionsList: state.positionsList,
        classificationsList: state.classificationsList,
        jobTitlesList: state.jobTitlesList,
      };
    default:
      return initialState;
  }
};

const useInformation = () => {

  const [formIsValid, setFormIsValid] = useState<Boolean>(false);
  const [state, dispatch] = useReducer(infoReducer, initialState);

  useEffect(() => {
    axiosInstance().get(`${process.env.REACT_APP_API_URL}employee/positions`)
      .then(response => {
        console.log(response.data);
        dispatch({ type: EmpActionTypes.LISTS_FETCHED_FROM_DB, value: response.data })
      })
      .catch(error => console.log(error));
  }, []);

  // =========== Generate a username whenever one of the 3 fields changes: ======
  useEffect(() => {
    const { firstName, middleName, lastName } = state;
    let generatedUsername = "";
    if (firstName || lastName) {
      generatedUsername = `${firstName}.${lastName}`.toLowerCase();
      generatedUsername = generatedUsername.replace(/\s+/g, ''); //remove spaces if any
      dispatch({ type: EmpActionTypes.USERNAME_UPDATED, value: generatedUsername });
    }
  }, [state.firstName, state.lastName])

  return { formIsValid, setFormIsValid, state, dispatch, EmpActionTypes };

  /* useInformation() is a custom hook function that returns 
     - formIsValid: boolean state.
     - state: a state object that contians all states needed for the form.
     - dispatch: reducer function invoked to update the `state`
     - EmpActionTypes: all possible actions to tell the dispatch() which state should be updated.
  */
};
export default useInformation;
