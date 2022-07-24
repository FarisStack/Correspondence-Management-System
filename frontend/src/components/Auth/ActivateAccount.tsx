import React, { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";

import FeelingBlue from "./svg/feeling_blue.svg";
import AccessAccount from "./svg/activated.svg";

type Props = {}

const ActivateAccount: FC<Props> = (props: any) => {

    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [activated, setActivated] = useState(false);
    const [responseMsg, setResponseMsg] = useState("Activating..")

    useEffect(() => {
        // console.log(token);
        setLoading(true);
        axios.patch(`${process.env.REACT_APP_API_URL}auth/activate`, { token })
            .then(response => {
                console.log(response.data);
                setResponseMsg(response.data.msg);
                setActivated(response.data.activated);
            })
            .catch(error => {
                console.log(error);
                setResponseMsg("error!");
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    return (
        <>
            {loading
                ? (<Box>Verifying token...</Box>)
                : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            height: "100vh",
                        }}
                    >
                        <h1>Account Activation</h1>
                        <p>{responseMsg}</p>
                        <img
                            src={activated ? AccessAccount : FeelingBlue}
                            alt="failed to activate"
                            style={{ height: "40%" }}
                        />
                    </Box>)
            }
        </>
    )
}
export default ActivateAccount;