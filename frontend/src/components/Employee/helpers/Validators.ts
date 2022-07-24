import axios from "axios";
import axiosInstance from "../../../api/axios";
import { EmpActionTypes } from "../hooks/useInformation";
// --------------------------------------------------------------
export const validateName = (name: string): string => {
    let message = "";
    const letters = /^[a-z\s\-]+$/i; //allow letters and space and dash (-) example: Noor-Eddeen

    if (name === "") {
        message = "Empty field"
    }
    else if (!name.match(letters)) {
        message = "Only letters and spaces are allowed";
    }
    else if (name.trim().length < 2) {
        message = "Name must be 2 letters minimum";
    }
    else if (name.trim().length > 15) {
        message = "Name must be 15 letters minimum";
    }
    return message;
};
export const validateMiddleName = (name: string): string => {
    let message = "";
    const letters = /^[a-z\s\-]+$/i; //allow letters and space and dash (-) example: Noor-Eddeen

    if (name === "") {
        message = "Empty field"
    }
    else if (!name.match(letters)) {
        message = "Only letters and spaces are allowed";
    }
    else if (name.trim().length < 1) {
        message = "Name must be 1 letter(s) minimum";
    }
    else if (name.trim().length > 15) {
        message = "Name must be 15 letters minimum";
    }
    return message;
};
// --------------------------------------------------------------
export const validateEmail = (emailAddress: string): string => {
    let message = "";
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAddress === "") {
        message = "Empty field"
    }
    else if (!emailAddress.match(regexEmail)) {
        message = "Invalid Email, must contain @ and dot";
    }
    return message;
}
// --------------------------------------------------------------
export const validatePhoneNumber = (phoneNumber: string) => {
    let message = "";
    if (phoneNumber.length < 8) {
        message = "Too short number";
    }
    else if (phoneNumber.length > 18) {
        message = "Maximum length of phone number is 15 digits";
    }
    return message;
}
// ---------------- checkUsernameTaken needs to access the server: --------------
export const checkUsernameTaken = (e: any, state: any, dispatch: any) => {
    // =========== Check if username taken: =====================
    axiosInstance().post(`${process.env.REACT_APP_API_URL}employee/checkUsernameExists`, {
        username: state.username
    })
        .then(response => {
            let isTaken = response.data.taken;
            let msg: string = "";
            if (state.username !== "") {
                msg = isTaken ? "Username is taken! ☹️" : "Valid username ✅";
            }
            dispatch({
                type: EmpActionTypes.USERNAME_BLURED,
                value: {
                    isTaken,
                    helperText: msg
                }
            });
            // console.log(isTaken, msg);
        })
        .catch(error => {
            console.log(error);
            // setResponseMsg("error!");
        })
}
// --------------------------------------------------------------
export const validateAllBeforeSubmit = (state: any): boolean => {
    // console.log("I will validate this:", state);
    const v = state.valid;
    let isValid = true;

    const { username, birthDate, hireDate, startDate, position, classification, jobTitle,
        city, gender, maritalStatus } = state;


    // Check the helperText Message:
    if (v.firstName !== "" || v.middleName !== "" || v.lastName !== "" || v.email !== "" || v.phoneNumber) {
        isValid = false;
    }
    // Check the value itself:
    else if (gender === "" || maritalStatus === "") {
        isValid = false;
    }
    else if (!birthDate || !hireDate || !startDate) {
        isValid = false;
        // endDate can be null (undefined)
    }
    else if (position === "" || jobTitle === "") {
        isValid = false;
    }
    else if (classification === "" || classification === "sitemapIcon") {
        isValid = false;
    }
    else if (city === "" || city === "cityIcon") {
        isValid = false;
    }
    else if (username === "" || v.username === false) {
        isValid = false;
    }
    return isValid;
}
