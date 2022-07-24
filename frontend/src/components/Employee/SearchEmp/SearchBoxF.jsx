import React, { useState } from "react";
import classes from "../css/SearchBox.module.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DiscountSharpIcon from "@mui/icons-material/DiscountSharp";
import InputAdornment from "@mui/material/InputAdornment";
import NumbersSharpIcon from "@mui/icons-material/NumbersSharp";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Formik, Form } from "formik";

import { v4 as uuidv4 } from 'uuid'; //install @types/uuid if it exists

const SearchBoxF = ({ setSearchButton, setSearchedInformation, DepartmentOption }) => {

    const [formIsValid, setFormIsValid] = useState(true);
    const initialValues = {
        email: "",
        name: "",
        department: "",
        city: "",
        gender: "",
        phoneNumber: "",
        maritalStatus: "",
        hireDate: ""
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                enableReinitialize
                // validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                    if (
                        values.email !== "" ||
                        values.department !== "" ||
                        values.name !== "" ||
                        values.city !== "" ||
                        values.gender !== "" ||
                        values.maritalStatus !== "" ||
                        values.phoneNumber !== "" ||
                        values.hireDate != ""
                    ) {
                        setSearchedInformation(values);
                        setSearchButton("search");
                    }
                }}
                onReset={() => {
                    setSearchButton("normal");
                }}
                onChange={(e, { handleChange }) => {
                    handleChange(e);
                }}
            >
                {(formik) => {
                    return (
                        <Form className={classes.Form}>

                            {/* ========================== Employee Name ========================= */}
                            <div className={classes.name}>
                                <TextField
                                    fullWidth
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className={classes.textField}
                                    name="name"
                                    id="name"
                                    label="Employee Name"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <NumbersSharpIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />{" "}
                            </div>
                            {/* ========================== phoneNumber ========================= */}
                            <div className={classes.phoneNumber}>
                                <TextField
                                    // style={{ width: "100%" }}
                                    fullWidth
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    className={classes.textField}
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    label="Phone"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            {/* ========================== Email ========================= */}
                            <div className={classes.email}>
                                <TextField
                                    fullWidth
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    className={classes.textField}
                                    name="email"
                                    id="email"
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <NumbersSharpIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            <div
                                className={classes.department}
                                style={{ width: "100%" }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="workflowType-select">Position</InputLabel>
                                    <Select
                                        fullWidth
                                        name="department"
                                        labelId="department-select"
                                        id="department-select"
                                        value={formik.values.department}
                                        label="Department"
                                        defaultValue="DiscountSharpIcon"
                                        onChange={formik.handleChange}
                                        className={classes.department}
                                    >
                                        <MenuItem value="DiscountSharpIcon" disabled selected>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: "#777",
                                                }}
                                            >
                                                <DiscountSharpIcon />
                                            </div>
                                        </MenuItem>
                                        {DepartmentOption.map((element) => (
                                            <MenuItem
                                                key={uuidv4()}
                                                value={element.value}
                                            >
                                                {element.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            {/* ========================== marital Status ========================= */}
                            <div className={classes.maritalStatus}>
                                <FormControl className="typeOfEmployee-radio">
                                    <FormLabel id="typeOfEmployee-radio-btn">
                                        maritalStatus
                                    </FormLabel>
                                    <RadioGroup
                                        style={{ color: "#565656" }}
                                        row //To lay out the buttons horizontally, set the row prop
                                        aria-labelledby="typeOfEmployee-radio-btn"
                                        name="maritalStatus"
                                        defaultValue="SINGLE"
                                        id="maritalStatus"
                                        value={formik.values.maritalStatus}
                                        onChange={formik.handleChange}
                                    >

                                        <FormControlLabel
                                            value="single"
                                            control={<Radio />}
                                            label="SINGLE"
                                        />
                                        <FormControlLabel
                                            value="married"
                                            control={<Radio />}
                                            label="MARRIED"
                                        />
                                        <FormControlLabel
                                            value="divorced"
                                            control={<Radio />}
                                            label="DIVORCED"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            {/* ========================== City ========================= */}
                            <div
                                className={classes.city}
                                style={{ width: "100% !important" }}
                            >
                                <FormControl
                                    fullWidth
                                    className={classes.city}
                                >
                                    <InputLabel id="workflowType-select">City</InputLabel>
                                    <Select
                                        fullWidth
                                        name="city"
                                        labelId="city-select"
                                        id="city-select"
                                        value={formik.values.city}
                                        label="city"
                                        defaultValue="DiscountSharpIcon"
                                        onChange={formik.handleChange}
                                        className={classes.city}
                                    >
                                        <MenuItem value="DiscountSharpIcon" disabled selected>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: "#777",
                                                }}
                                            >
                                                <DiscountSharpIcon />
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
                            </div>
                            {/* ========================== hireDate ========================= */}
                            <TextField
                                value={formik.values.hireDate}
                                onChange={formik.handleChange}
                                className={classes.hireDate}

                                name="hireDate"
                                id="hireDate"
                                label="Hire Date"
                                type="date"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                            />
                            {/* ========================== Gender RadioBtn ========================= */}
                            <div className={classes.gender}>
                                <FormControl className="gender-radio">
                                    <FormLabel id="gender-radio-btn">Gender</FormLabel>
                                    <RadioGroup
                                        style={{ color: "#565656" }}
                                        row //To lay out the buttons horizontally, set the row prop
                                        aria-labelledby="gender-radio-btn"
                                        defaultValue="male"
                                        name="gender"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                    >
                                        {" "}
                                        <FormControlLabel
                                            value="male"
                                            control={<Radio />}
                                            label="Male"
                                        />
                                        <FormControlLabel
                                            value="female"
                                            control={<Radio />}
                                            label="Female"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            {/* ========================== Button ========================= */}

                            {/* ========================== Search Button ========================= */}

                            <div
                                style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}
                                className={classes.searchButtons}
                            >
                                <div>
                                    <Button
                                        disabled={!formIsValid}
                                        variant="contained"
                                        className={classes.searchButt}
                                        startIcon={<SearchIcon />}
                                        type="submit"
                                        onClick={formik.handle_submit}
                                    >
                                        Search
                                    </Button>
                                </div>
                                {/* ========================== Reset Button ========================= */}
                                <div>
                                    <Button
                                        disabled={!formIsValid}
                                        variant="outlined"
                                        type="reset"
                                        className={classes.resetButt}
                                        endIcon={<RestartAltIcon />}
                                        onClick={formik.handle_reset}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>

        </>
    );
};

export default SearchBoxF;


