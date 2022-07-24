import React, { FC, Fragment } from 'react'
// ========== Our CSS Stylings: ==========================
// import AddEmployeeCSS from "./css/AddEmployee.module.css";
import "../css/AddEmployee.css";
// ===== MUI ICONS: ======================================
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// ================= MUI Form Components: ==================
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// =========== MUI Datepicker: ===============================
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// =========== material-ui-phone-number ===============================
import MuiPhoneNumber from 'material-ui-phone-number';


type Props = {
    state: any;
    dispatch: any;
    EmpActionTypes: any;
    checkUsernameTaken: Function;
}

const EmployeeBasicInfo: FC<Props> = ({
    state, dispatch,
    EmpActionTypes, checkUsernameTaken
}: Props) => {

    return (
        <Fragment>
            <h1 className="main-heading">
                Add New Employee
                <PersonAddAltTwoToneIcon style={{ fontSize: "50px" }} />
            </h1>
            {/* ========================== First Name ========================== */}
            <TextField
                value={state.firstName}
                onChange={(e) => {
                    // console.log(e.target.value);
                    dispatch({
                        type: EmpActionTypes.FIRST_NAME_UPDATED,
                        value: e.target.value,
                    });
                }}
                onBlur={() => dispatch({ type: EmpActionTypes.FIRST_NAME_BLURED })}
                error={state.valid.firstName !== ""}
                helperText={state.valid.firstName}
                required
                className="first-name"
                id="first-name"
                label="First Name"
                type="text"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><PersonIcon /></InputAdornment>
                    ),
                }}
            />
            {/* ========================== Middle Name ========================== */}
            <TextField
                value={state.middleName}
                onChange={(e) => {
                    // console.log(e.target.value);
                    dispatch({
                        type: EmpActionTypes.MIDDLE_NAME_UPDATED,
                        value: e.target.value,
                    });
                }}
                onBlur={() => dispatch({ type: EmpActionTypes.MIDDLE_NAME_BLURED })}
                error={state.valid.middleName !== ""}
                helperText={state.valid.middleName}
                required
                className="middle-name"
                id="middle-name"
                label="Middle Name"
                type="text"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><EscalatorWarningIcon /></InputAdornment>
                    ),
                }}
            />
            {/* ========================== Last Name (Family Name)========================== */}
            <TextField
                value={state.lastName}
                onChange={(e) => {
                    // console.log(e.target.value);
                    dispatch({
                        type: EmpActionTypes.LAST_NAME_UPDATED,
                        value: e.target.value,
                    });
                }}
                onBlur={() => dispatch({ type: EmpActionTypes.LAST_NAME_BLURED })}
                error={state.valid.lastName !== ""}
                helperText={state.valid.lastName}
                required
                className="last-name"
                id="last-name"
                label="Family Name"
                type="text"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><FamilyRestroomIcon /></InputAdornment>
                    ),
                }}
            />
            {/* ========================== Email ========================== */}
            <TextField
                value={state.email}
                onChange={(e) => {
                    // console.log(e.target.value);
                    dispatch({
                        type: EmpActionTypes.EMAIL_UPDATED,
                        value: e.target.value,
                    });
                }}
                onBlur={() => dispatch({ type: EmpActionTypes.EMAIL_BLURED })}
                error={state.valid.email !== ""}
                helperText={state.valid.email}
                required
                className="personal-email"
                id="email-address"
                label="Personal Email Address"
                type="email"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><EmailIcon /></InputAdornment>
                    ),
                }}
            />
            {/* ========================== Phone Number ========================== */}
            {/* <TextField
        value={state.phoneNumber}
        onChange={(e) => {
          console.log(e.target.value);
          dispatch({
            type: EmpActionTypes.PHONE_UPDATED,
            value: e.target.value,
          });
        }}
        onBlur={() => dispatch({ type: EmpActionTypes.PHONE_BLURED })}
        error={state.valid.phoneNumber === false}
        helperText={
          state.valid.phoneNumber === false
            ? `Mobile number can't be empty`
            : false
        }
        required
        id="phone-number"
        label="Mobile Number"
        type="text"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><PhoneIphoneIcon /></InputAdornment>
          ),
        }}
      /> */}
            {/* ========================== MuiPhoneNumber ========================== */}
            <MuiPhoneNumber
                label="Mobile Number"
                defaultCountry={'ps'}
                // excludeCountries={["il"]}
                value={state.phoneNumber}
                onChange={(e) => {
                    // console.log(e); // here it is event, not event.target.value
                    dispatch({
                        type: EmpActionTypes.PHONE_UPDATED,
                        value: e, //e, not e.target.value
                    });
                }}
                onBlur={(e) => {
                    dispatch({
                        type: EmpActionTypes.PHONE_BLURED,
                        value: e, //e, not e.target.value
                    });
                }}
                variant="outlined"
                className="phone-number"
                error={state.valid.phoneNumber !== ""}
                helperText={state.valid.phoneNumber}
            // value={mobileNumber}
            />
            {/* =========== react-phone-number-input =============================== */}
            {/* <PhoneInput
        placeholder="Enter phone number"
        value={value}
        onChange={(e) => {
          console.log(e);
          setValue(e);
        }}
      /> */}
            {/* ========================== Username ========================== */}
            <TextField
                value={state.username}
                onChange={(e) => {
                    // console.log(e.target.value);
                    // ========= Now update the username value and helperText: ===
                    dispatch({
                        type: EmpActionTypes.USERNAME_UPDATED,
                        value: e.target.value,
                    });
                }}
                onBlur={(e) => checkUsernameTaken(e, state, dispatch)}
                error={state.username !== "" && state.valid.username === false}
                helperText={state.usernameHelperText}
                required
                className="username"
                id="username"
                label="Generated Username"
                type="text"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><DriveFileRenameOutlineIcon /></InputAdornment>
                    ),
                }}
            />
            {/* ========================== Date of Birth ========================== */}
            <LocalizationProvider dateAdapter={AdapterDateFns} className="birth-date">
                <DesktopDatePicker
                    label="Birthdate"
                    inputFormat="dd-MM-yyyy"
                    value={state.birthDate}
                    onChange={(event) => {
                        // console.log(event);
                        // dispatch({ type: EmpActionTypes.BIRTHDATE_UPDATED, value: event });
                        // here we pass all the event, there's no event.target here.

                        // console.log(event); // Thu Oct 19 2000 03:00:00 GMT+0300 (Eastern European Summer Time)
                        let isoStringYMD = null;
                        if (event !== null) {
                            let d = new Date(event);
                            isoStringYMD = d.toISOString().split("T")[0]; //ex: 2000-10-02
                        }
                        // else, store null as a value instead of defaulting the value to 1970-01-01
                        // console.log(d.toISOString()); //2000-10-19T00:00:00.000Z
                        // console.log(d.toISOString().split("T")[0]); //2000-10-19

                        dispatch({ type: EmpActionTypes.BIRTHDATE_UPDATED, value: isoStringYMD });
                        // console.log(isoStringYMD);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            {/* ========================== Hire Date ========================== */}
            <LocalizationProvider dateAdapter={AdapterDateFns} className="hire-date">
                <DesktopDatePicker
                    label="Hire Date"
                    inputFormat="dd-MM-yyyy"
                    value={state.hireDate}
                    onChange={(event) => {
                        let isoStringYMD = null;
                        if (event !== null) {
                            let d = new Date(event);
                            isoStringYMD = d.toISOString().split("T")[0]; //ex: 2000-10-02
                        }
                        dispatch({ type: EmpActionTypes.HIREDATE_UPDATED, value: isoStringYMD });
                        // console.log(isoStringYMD);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            {/* ========================== Gender RadioBtn ========================= */}
            <FormControl className="gender-radio">
                <FormLabel id="gender-radio-btn">Gender</FormLabel>
                <RadioGroup
                    style={{ color: "#565656" }}
                    row //To lay out the buttons horizontally, set the row prop
                    aria-labelledby="gender-radio-btn"
                    defaultValue="male"
                    name="gender"
                    value={state.gender}
                    onChange={(e) => {
                        // console.log(e.target.value);
                        dispatch({
                            type: EmpActionTypes.GENDER_UPDATED,
                            value: e.target.value,
                        });
                    }}
                >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
            </FormControl>
            {/* ========================== Marital Status RadioBtn ========================= */}
            <FormControl className="marital-status-radio">
                <FormLabel id="marital-status-radio-btn">Marital Status</FormLabel>
                <RadioGroup
                    style={{ color: "#565656" }}
                    row //To lay out the buttons horizontally, set the row prop
                    aria-labelledby="marital-status-radio-btn"
                    defaultValue="single"
                    name="maritalStatus"
                    value={state.maritalStatus}
                    onChange={(e) => {
                        // console.log(e.target.value);
                        dispatch({
                            type: EmpActionTypes.MARITAL_STATUS_UPDATED,
                            value: e.target.value,
                        });
                    }}
                >
                    <FormControlLabel value="single" control={<Radio />} label="Single" />
                    <FormControlLabel value="married" control={<Radio />} label="Married" />
                    <FormControlLabel value="divorced" control={<Radio />} label="Divorced" />
                </RadioGroup>
            </FormControl>
            {/* ========================== City Select ========================= */}
            <FormControl className="city-select">
                <InputLabel id="city-select">City</InputLabel>
                <Select
                    name="city"
                    labelId="city-select"
                    id="city-select"
                    value={state.city}
                    label="City"
                    defaultValue="Tulkarm"
                    onChange={(e) => {
                        // console.log(e.target.value);// ex: Jenin
                        dispatch({
                            type: EmpActionTypes.CITY_UPDATED,
                            value: e.target.value,
                        });
                    }}
                >

                    <MenuItem value="cityIcon" disabled>
                        <div style={{ display: 'flex', alignItems: 'center', color: "#777" }}>
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
        </Fragment>
    )
}

export default EmployeeBasicInfo