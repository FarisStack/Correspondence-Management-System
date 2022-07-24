import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar, ISeverity, IVariant } from "../../store/slices/snackbarSlice";

type Props = {}

const ResetPassword = (props: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { accountId, token } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [resetting, setResetting] = useState<boolean>(false);
    const [employeeRecord, setEmployeeRecord] = useState<any>();
    const [decodedToken, setDecodedToken] = useState<any>();
    const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}auth/verify-reset-password`, {
            accountId: accountId, token
        })
            .then((response: any) => {
                console.log(response.data);
                const { message, verified, employeeRecord, decodedToken } = response.data;
                if (verified) {
                    setIsTokenVerified(true);
                    setDecodedToken(decodedToken);
                    setEmployeeRecord(employeeRecord);
                }
            })
            .catch((error: any) => console.log(error))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSubmit = async () => {

        if (password == "" || password2 == "") {
            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.WARNING,
                    snackbarVariant: IVariant.STANDARD,
                    vertical: "top",
                    snackbarMessage: "Please fill all fields",
                })
            );
        }
        else if (password !== password2) {
            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.WARNING,
                    snackbarVariant: IVariant.STANDARD,
                    vertical: "top",
                    snackbarMessage: "Confirm password field must match the password field",
                })
            );
        }
        else {
            setResetting(true);
            axios.put(`${process.env.REACT_APP_API_URL}auth/reset-password`, {
                accountId: decodedToken.accountId, newPassword: password
            }).then((response: any) => {
                console.log(response.data);
                const { message, success } = response.data;
                dispatch(
                    setSnackbar({
                        snackbarOpen: true,
                        snackbarType: ISeverity.SUCCESS,
                        snackbarVariant: IVariant.STANDARD,
                        vertical: "top",
                        snackbarMessage: message,
                    })
                );

                if (success) navigate("/login")
            })
                .catch((error: any) => console.log(error))
                .finally(() => {
                    setResetting(false);
                });
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh"
            }}
        >{
                loading
                    ? <h1>Verifying token...</h1>
                    : isTokenVerified
                        ? (
                            <>
                                <h1>Reset My Password</h1>

                                <TextField
                                    id="password"
                                    label="Password"
                                    variant="standard"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                />
                                <TextField
                                    id="password2"
                                    label="Confirm password"
                                    variant="standard"
                                    value={password2}
                                    onChange={(e: any) => setPassword2(e.target.value)}
                                />

                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={resetting}
                                >
                                    {resetting ? "Resetting.." : "Reset password"}
                                </Button>
                            </>
                        )
                        : (
                            <>
                            <h1>Invalid token</h1>
                            <Button
                                onClick={() => navigate("/")}
                            >
                                Return
                            </Button>
                            </>
                        )}
        </div>
    )
}

export default ResetPassword