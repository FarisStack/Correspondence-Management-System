import classes from "../css/ChangePassword.module.css";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';

// --------------- Icons -------------------
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from "@mui/icons-material/LockReset";


import axiosInstance from "../../../api/axios";

import { Formik, Form } from "formik";
import * as Yup from "yup";

// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar, ISeverity, IVariant } from "../../../store/slices/snackbarSlice";

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose} />;
};


const ModalOverlay = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };
    const validate = Yup.object({
        currentPassword: Yup.string().required("Required"),
        newPassword: Yup.string().required("Required"),
        confirmNewPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("newPassword"), null], "Confirm password field must match new password field"),
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={(values, { resetForm }) => {

                setLoading(true);
                axiosInstance().put("/employee/change-password", {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                })
                    .then((response) => {
                        const { statusCode, message } = response.data;

                        dispatch(
                            setSnackbar({
                                snackbarOpen: true,
                                snackbarType:
                                    statusCode == 403
                                        ? ISeverity.WARNING
                                        : ISeverity.SUCCESS,
                                snackbarVariant: IVariant.STANDARD,
                                vertical: "top",
                                snackbarMessage: message,
                            })
                        );

                        setLoading(false);

                        if (statusCode == 200) resetForm();
                    })
                    .catch((error) => console.log(error));
            }}
        >
            {(formik) => (
                <Form
                    className={classes.modal}
                    onSubmit={formik.handleSubmit}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            props.onClose();
                        }
                    }}
                >
                    <header className={classes.header}>
                        <LockResetIcon className={classes.icon} />
                        <h2> Change Password</h2>
                        <Tooltip
                            title={showPassword ? "Hide passwords" : "Reveal passwords"}
                            arrow
                        >
                            <IconButton
                                size="large"
                                sx={{
                                    display: "flex", width: "60px", height: "60px"
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword
                                    ? <Visibility
                                        sx={{ fontSize: "2.2rem", color: "#3f51b5" }}
                                    />
                                    : <VisibilityOff sx={{ fontSize: "2.2rem" }} />
                                }
                            </IconButton>
                        </Tooltip>
                    </header>
                    <div className={classes.modalBody}>
                        <TextField
                            value={formik.values.currentPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                Boolean(formik.touched.currentPassword) &&
                                Boolean(formik.errors.currentPassword)
                            }
                            helperText={
                                Boolean(formik.touched.currentPassword) &&
                                    Boolean(formik.errors.currentPassword)
                                    ? formik.errors.currentPassword
                                    : ""
                            }
                            // required
                            // className={classes["current-password"]}
                            id="currentPassword"
                            label="Current Password"
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            variant="outlined"
                            InputProps={{}}
                        />

                        {/* <FormControl
                            // sx={{ m: 1, width: '25ch' }}
                            variant="outlined"
                            helperText="aaa"
                        >
                            <InputLabel
                                htmlFor="outlined-adornment-password"
                            >
                                Current Password
                            </InputLabel>
                            <OutlinedInput
                                helperText={"SSSSS"}
                                id="outlined-adornment-password"
                                name="currentPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    Boolean(formik.touched.currentPassword) &&
                                    Boolean(formik.errors.currentPassword)
                                }
                                // helperText={
                                //     Boolean(formik.touched.currentPassword) &&
                                //         Boolean(formik.errors.currentPassword)
                                //         ? formik.errors.currentPassword
                                //         : ""
                                // }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Current Password"
                            />
                        </FormControl> */}

                        <TextField
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                Boolean(formik.touched.newPassword) &&
                                Boolean(formik.errors.newPassword)
                            }
                            helperText={
                                Boolean(formik.touched.newPassword) &&
                                    Boolean(formik.errors.newPassword)
                                    ? formik.errors.newPassword
                                    : ""
                            }
                            // required
                            // className={classes["new-password"]}
                            id="newPassword"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            name="newPassword"
                            variant="outlined"
                            InputProps={{}}
                        />

                        <TextField
                            value={formik.values.confirmNewPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                Boolean(formik.touched.confirmNewPassword) &&
                                Boolean(formik.errors.confirmNewPassword)
                            }
                            helperText={
                                Boolean(formik.touched.confirmNewPassword) &&
                                    Boolean(formik.errors.confirmNewPassword)
                                    ? formik.errors.confirmNewPassword
                                    : ""
                            }
                            // required
                            // className={classes["confirm-new-password"]}
                            id="confirmNewPassword"
                            label="Confirm New Password"
                            type={showPassword ? 'text' : 'password'}
                            name="confirmNewPassword"
                            variant="outlined"
                            InputProps={{}}
                        />
                    </div>
                    <div className={classes.actions}>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={loading ? true : false}
                            // className={classes.button}
                            type="submit"
                            onClick={formik.handleSubmit}
                        >
                            Update password
                        </Button>
                        <Button
                            color="primary"
                            variant="outlined"
                            disabled={loading ? true : false}
                            // className={classes["button--alt"]}
                            type="reset"
                            onClick={props.onClose}
                        >
                            Close
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

const ChangePassword = (props) => {
    return (
        <div className={classes.reset}>
            <Backdrop onClose={props.onClose} />
            <ModalOverlay onClose={props.onClose} id={props.id} getPassword={props.getPassword} />
        </div>
    );
};
export default ChangePassword;
