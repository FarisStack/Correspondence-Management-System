import React, { useEffect, useState } from "react";
// ========== Our CSS Stylings: =========================
// import BasicInfoCSS from "./css/BasicInfo.module.css";
import classes from "../css/InfoPage.module.css";
// Using Styled-Components to apply <body> bacjaground image only on this page:

// ===== MUI ICONS: ======================================
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import InputAdornment from "@mui/material/InputAdornment";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// ================= MUI Form Components: ==================
import Box from "@mui/material/Box"
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import GroupIcon from "@mui/icons-material/Group";
import WcIcon from "@mui/icons-material/Wc";
// // =========== MUI Datepicker: ===============================
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
// =========== material-ui-phone-number ===============================
import MuiPhoneNumber from "material-ui-phone-number";
// =========== react-phone-number-input ===============================
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
// ================ MUI Typography ==============================
import Typography from "@mui/material/Typography";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// ======== My Components: ===============================
import ChangePassword from "./ChangePassword";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSitemap,
    faUserTie,
    faToolbox,
} from "@fortawesome/free-solid-svg-icons";


// ======== REACT MULTISELECT DROPDOWN with search feature ==========
import Multiselect from "multiselect-react-dropdown";
import { Formik, Form } from "formik";
import * as Yup from "yup";


// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { LoginState, loginSuccess, loginFail } from '../../../store/slices/loginSlice';
import { setSnackbar, ISeverity, IVariant } from "../../../store/slices/snackbarSlice";
import { RootState } from "../../../store";


import axios from "axios";
import axiosInstance from "../../../api/axios";



const InformationPage = ({
    imagePreviewUrl, setImagePreviewUrl,
    updateModeEnabled, setUpdateModeEnabled,
    newAvatarFile, modalIsOpen, setModalIsOpen
}) => {
    
    const dispatch = useDispatch();


    const [initialValues, setInitialValues] = useState({
        firstName: "Ahmad",
        lastName: "Marei",
        middleName: "Othman",
        username: "A.O.MAREI",
        hireDate: "2022-03-25",
        email: "ahmadmarei1717@gmail.com",
        phoneNumber: "970596760535",
        birthDate: "2000-11-23",
        city: "Tulkarm",
        gender: "male",
        maritalStatus: "single"
    });

    useEffect(() => {
        axiosInstance()
            .get("employee/initializeUpdateForm")
            .then((response) => {
                const { initialValues } = response.data;
                console.log(initialValues);
                setInitialValues(initialValues);
                setImagePreviewUrl(`${process.env.REACT_APP_UPLOADS_URL}avatars/${initialValues.avatar}`);
            })
            .catch((error) => console.log(error));
    }, [])


    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validate = Yup.object({
        firstName: Yup.string()
            .max("15", "must be 15 characters or less")
            .required("Required"),
        lastName: Yup.string()
            .max(15, "must be 15 characters or less")
            .required("Required"),
        middleName: Yup.string()
            .max(15, "must be 15 characters or less")
            .required("Required"),
        username: Yup.string().required("Required"),
        hireDate: Yup.string().required("Required"),
        email: Yup.string().email("Email is invalid").required("Required"),
        // phoneNumber: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
        phoneNumber: Yup.string().required("Required"),
        birthDate: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        gender: Yup.string().required("Required"),
        maritalStatus: Yup.string().required("Required"),
    });

    const handleUpdateBtnClick = async (formikValues) => {
        try {
            console.log("SUBMIT");
            console.log(formikValues);
            const response = await axiosInstance().put("/employee/update", {
                theNewData: formikValues
            });

            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.SUCCESS,
                    snackbarVariant: IVariant.STANDARD,
                    vertical: "top",
                    snackbarMessage: "Your info has been updated",
                })
            );

            setInitialValues(formikValues);
            setUpdateModeEnabled(false);
            // ---- Now we will upload the avatar -----
            const formData = new FormData();
            formData.append("image", newAvatarFile);
            console.log("Now will upload axios: ");
            console.log(formData);
            axiosInstance().put(`employee/updateEmployeeAvatar`, formData,
                // { headers: { 'Content-Type': "multipart/form-data" } }
            ).then((response) => {
                console.log(response.data);
            }).catch((error) => console.log(error));
        }
        catch (error) {
            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.ERROR,
                    snackbarVariant: IVariant.STANDARD,
                    snackbarMessage: error.message,
                })
            );
        }
    }

    const closeChangePasswordPage = () => {
        setModalIsOpen(true);
    };

    const openChangePasswordPage = () => {
        setModalIsOpen(false);
    };


    // ------------------- Components for Rendering ----------------------
    const FirstMiddleLastName = ({ formik }) => {
        return (
            <>
                {/* ========================== First Name ========================== */}
                <TextField
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)
                    }
                    helpertext={
                        Boolean(formik.touched.firstName) && Boolean(formik.errors.firstName)
                            ? formik.errors.firstName
                            : ""
                    }
                    disabled={!updateModeEnabled}
                    name="firstName"
                    className={classes["first-name"]}
                    id="first-name"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    InputProps={{
                        className: classes["input-text-field"],
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {/* ========================== Middle Name ========================== */}
                <TextField
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.middleName) &&
                        Boolean(formik.errors.middleName)
                    }
                    helpertext={
                        Boolean(formik.touched.middleName) &&
                            Boolean(formik.errors.middleName)
                            ? formik.errors.middleName
                            : ""
                    }
                    disabled={!updateModeEnabled}
                    name="middleName"
                    className={classes["middle-name"]}
                    id="middle-name"
                    label="Middle Name"
                    type="text"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EscalatorWarningIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {/* ========================== Last Name (Family Name)========================== */}
                <TextField
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)
                    }
                    helpertext={
                        Boolean(formik.touched.lastName) && Boolean(formik.errors.lastName)
                            ? formik.errors.lastName
                            : ""
                    }
                    disabled={!updateModeEnabled}
                    name="lastName"
                    className={classes["last-name"]}
                    id="last-name"
                    label="Family Name"
                    type="text"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FamilyRestroomIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </>
        )
    }


    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validate}
            onReset={() => {
                setUpdateModeEnabled(false);
                console.log("Reset")
            }}
        >
            {(formik) => {
                return (
                    <Form onSubmit={formik.handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                                margin: "30px 0px 15px"
                            }}
                        // className={classes.actions}
                        >
                            {updateModeEnabled ? (
                                <>
                                    <Button
                                        // className={classes["button--alt"]}
                                        // type="submit"
                                        color="primary"
                                        variant="contained"
                                        onClick={() => handleUpdateBtnClick(formik.values)}
                                    >
                                        Update
                                    </Button>

                                    <Button
                                        // className={classes["button--alt"]}
                                        color="secondary"
                                        variant="outlined"
                                        onClick={() => {
                                            formik.handleReset();
                                            // Discard the new uploaded image (if any):
                                            setImagePreviewUrl(
                                                `${process.env.REACT_APP_UPLOADS_URL}avatars/${initialValues.avatar}`
                                            );
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    color="primary"
                                    variant="contained"
                                    // className={classes["button--alt"]}
                                    onClick={() => setUpdateModeEnabled(true)}
                                >
                                    Edit
                                    {/* <EditIcon
                                        fontSize="medium"
                                        className={classes["change-circle"]}
                                    /> */}
                                </Button>
                            )}
                        </Box>
                        {/* <label
                            htmlFor="photo-upload"
                            className={`${classes["custom-file-upload"]} fas`}
                        >
                            <div
                                className={`${classes["img-wrap"]} ${classes["img-upload"]} fa  fa-upload`}
                            >
                                <img id="photo-upload" src={imagePreviewUrl} />
                            </div>
                            <input
                                name='file'
                                id="photo-upload"
                                type="file"
                                onChange={photoUpload}
                            />
                        </label> */}
                        <div className={classes["basic-info-form"]}>
                            <FirstMiddleLastName formik={formik} />
                            {/* ========================== Username ========================== */}
                            <TextField
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    Boolean(formik.touched.username) && Boolean(formik.errors.username)
                                }
                                helpertext={
                                    Boolean(formik.touched.username) && Boolean(formik.errors.username)
                                        ? formik.errors.username
                                        : ""
                                }
                                disabled={!updateModeEnabled}
                                name="username"
                                className={classes["username"]}
                                id="username"
                                label="Generated username"
                                type="text"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DriveFileRenameOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/* ========================== Hire Date ========================== */}
                            <TextField
                                value={formik.values.hireDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    Boolean(formik.touched.hireDate) && Boolean(formik.errors.hireDate)
                                }
                                helpertext={
                                    Boolean(formik.touched.hireDate) && Boolean(formik.errors.hireDate)
                                        ? formik.errors.hireDate
                                        : ""
                                }
                                disabled={!updateModeEnabled}
                                name="hireDate"
                                className={classes["hireDate"]}
                                id="hireDate"
                                label="Hire Date"
                                type="date"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                            />

                        </div>
                        <div className={classes["basic-info-form2"]}>
                            {/* ========================== Email ========================== */}
                            <TextField
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                                helpertext={
                                    Boolean(formik.touched.email) && Boolean(formik.errors.email)
                                        ? formik.errors.email
                                        : ""
                                }
                                name="email"
                                disabled={!updateModeEnabled}
                                className={classes["personal-email"]}
                                id="email-address"
                                label="Personal Email Address"
                                type="email"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/* ========================== MuiPhoneNumber ========================== */}
                            {!updateModeEnabled ? (
                                <TextField
                                    disabled={!updateModeEnabled}
                                    value={formik.values.phoneNumber}
                                    name="phoneNumber"
                                    required
                                    className={classes["phone-number"]}
                                    id="phoneNumber"
                                    label="Phone Number"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalPhoneIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <MuiPhoneNumber
                                    label="Mobile Number"
                                    defaultCountry={"ps"}
                                    excludeCountries={["il"]}
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    name="phoneNumber"
                                    className={classes["phone-number"]}
                                    error={
                                        Boolean(formik.touched.phoneNumber) &&
                                        Boolean(formik.errors.phoneNumber)
                                    }
                                    helpertext={
                                        Boolean(formik.touched.phoneNumber) &&
                                            Boolean(formik.errors.phoneNumber)
                                            ? formik.errors.phoneNumber
                                            : ""
                                    }
                                />
                            )}
                            {/* ========================== Date of Birth ========================== */}
                            <TextField
                                value={formik.values.birthDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    Boolean(formik.touched.birthDate) && Boolean(formik.errors.birthDate)
                                }
                                helpertext={
                                    Boolean(formik.touched.birthDate) && Boolean(formik.errors.birthDate)
                                        ? formik.errors.birthDate
                                        : ""
                                }
                                disabled={!updateModeEnabled}
                                name="birthDate"
                                className={classes["birth-date"]}
                                id="birthDate"
                                label="Birth Date"
                                type="date"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                                }}
                            />
                            {/* ========================== City Select ========================= */}
                            {!updateModeEnabled ? (
                                <TextField
                                    value={formik.values.city}
                                    onBlur={formik.handleBlur}
                                    disabled={!updateModeEnabled}
                                    name="city"
                                    className={classes["city"]}
                                    id="city"
                                    label="City"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationCityIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <FormControl className={classes["city-select"]}>
                                    <InputLabel id="city-select">City</InputLabel>
                                    <Select
                                        name="city"
                                        labelId="city-select"
                                        id="city-select"
                                        value={formik.values.city}
                                        error={Boolean(formik.touched.city) && Boolean(formik.errors.city)}
                                        helpertext={
                                            Boolean(formik.touched.city) && Boolean(formik.errors.city)
                                                ? formik.errors.city
                                                : ""
                                        }
                                        label="City"
                                        defaultValue="Tulkarm"
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="cityIcon" disabled>
                                            <div
                                                style={{ display: "flex", alignItems: "center", color: "#777" }}
                                            >
                                                <LocationCityIcon />
                                            </div>
                                        </MenuItem>
                                        <MenuItem value="Tulkarm">Tulkarm</MenuItem>
                                        <MenuItem value="Jenin">Jenin</MenuItem>
                                        <MenuItem value="Nablus">Nablus</MenuItem>
                                        <MenuItem value="Tubas">Tubas</MenuItem>
                                        <MenuItem value="Ramallah">Ramallah</MenuItem>
                                        <MenuItem value="Bethlehem">Bethlehem</MenuItem>
                                    </Select>
                                </FormControl>
                            )}

                            {/* ========================== Gender RadioBtn ========================= */}
                            {!updateModeEnabled ? (
                                <TextField
                                    value={formik.values.gender}
                                    disabled={!updateModeEnabled}
                                    name="gender"
                                    className={classes["gender-radio"]}
                                    id="gender"
                                    label="Gender"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <WcIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <FormControl className={classes["gender-radio"]}>
                                    <FormLabel id="gender-radio-btn">Gender</FormLabel>
                                    <RadioGroup
                                        row //To lay out the buttons horizontally, set the row prop
                                        aria-labelledby="gender-radio-btn"
                                        defaultValue="male"
                                        name="gender"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            Boolean(formik.touched.gender) && Boolean(formik.errors.gender)
                                        }
                                        helpertext={
                                            Boolean(formik.touched.gender) && Boolean(formik.errors.city)
                                                ? formik.errors.gender
                                                : ""
                                        }
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel
                                            value="female"
                                            control={<Radio />}
                                            label="Female"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            )}
                            {/* ========================== Marital Status RadioBtn ========================= */}
                            {!updateModeEnabled ? (
                                <TextField
                                    value={formik.values.maritalStatus}
                                    disabled={!updateModeEnabled}
                                    name="maritalStatus"
                                    className={classes["marital-status-radio"]}
                                    id="maritalStatus"
                                    label="Marital Status"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <GroupIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                <FormControl className={classes["marital-status-radio"]}>
                                    <FormLabel id="marital-status-radio-btn">Marital Status</FormLabel>
                                    <RadioGroup
                                        row //To lay out the buttons horizontally, set the row prop
                                        aria-labelledby="marital-status-radio-btn"
                                        defaultValue="single"
                                        name="maritalStatus"
                                        value={formik.values.maritalStatus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <FormControlLabel
                                            value="single"
                                            control={<Radio />}
                                            label="Single"
                                        />
                                        <FormControlLabel
                                            value="married"
                                            control={<Radio />}
                                            label="Married"
                                        />
                                        <FormControlLabel
                                            value="divorced"
                                            control={<Radio />}
                                            label="Divorced"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            )}
                            {/* {!id ? (
                                <div className={classes["change-password"]}>
                                    <Button
                                        color="primary"
                                        disabled={!updateModeEnabled}
                                        variant="contained"
                                        className={classes.button}
                                        onClick={openChangePasswordPage}
                                        style={{ width: "100%", height: "100%" }}
                                    >
                                        Change password
                                    </Button>
                                    {!closeModel && (
                                        <ChangePassword
                                            onClose={closeChangePasswordPage}
                                            getPassword={"123456789"}
                                            employeeId={id}
                                        />
                                    )}
                                </div>) : null} */}
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};
export default InformationPage;
