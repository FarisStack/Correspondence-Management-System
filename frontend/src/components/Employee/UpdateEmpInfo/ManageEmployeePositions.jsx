import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "../css/PersonalPage.module.css";
import Button from "@mui/material/Button";

// -------------- Our Components: --------------------
import TableOfEmpPositions from "./TableOfEmpPositions";
// -------------- End Our Components -------------------

import axiosInstance from "../../../api/axios";

// ---------- Redux Toolkit My Store -----------
import useAuth from '../../../store/hooks/useAuth';


const ManageEmployeePositions = () => {

    const authState = useAuth(); //returns `state.login` from our redux store
    const { employeeId } = useParams(); //returns object of all params, extract the id from the page's url 

    const [employeeName, setEmployeeName] = useState("");


    useEffect(() => {
        axiosInstance().get(`/employee/?employeeId=${employeeId}`)
        .then((response) => {
            const employeeRecord = response.data.employeeRecord;
            const fullName = `${employeeRecord.firstName} ${employeeRecord.lastName}`;
            setEmployeeName(fullName);
        })
        .catch((error) => console.log(error));
    }, [])

    return (
        <div className={classes.card}>
            <h2 style={{display: "block", textAlign: "center", padding: "25px 0px 0px 0px"}}>
                Currently Assigned Positions for: {employeeName}
            </h2>
            <TableOfEmpPositions
                // updateModeEnabled={true}
                employeeId={employeeId}
                isAdmin={authState?.user?.role == "admin"}
            />
        </div>
    );
};
export default ManageEmployeePositions;
