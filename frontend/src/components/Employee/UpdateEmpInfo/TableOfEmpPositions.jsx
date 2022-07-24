import { useState, useEffect, useParams } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, MenuItem, Button, TextField, Select,
    InputAdornment, Box
}
    from "@mui/material";

import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSitemap,
    faUserTie,
    faToolbox,
} from "@fortawesome/free-solid-svg-icons";

// ========== Our CSS Stylings: =========================
import classes from "../css/InfoPage.module.css";

import axiosInstance from "../../../api/axios";

import { v4 as uuidv4 } from 'uuid'; //for generating unique ids

// ---------------- Redux Toolkit -------------------------
import { useSelector, useDispatch } from "react-redux";
import { LoginState, loginSuccess, loginFail } from '../../../store/slices/loginSlice';
import { setSnackbar, ISeverity, IVariant } from "../../../store/slices/snackbarSlice";
import { RootState } from "../../../store";

const TableOfEmpPositions = ({ employeeId, isAdmin }) => {
    // console.log("isAdmin: ", isAdmin);

    const dispatch = useDispatch();

    const [myEmpPositions, setMyEmpPositions] = useState([]);
    const [myEmpPositionsInitial, setMyEmpPositionsInitial] = useState([]);

    const [allPositionsList, setAllPositionsList] = useState([]);

    const [allJobTitlesList, setAllJobTitlesList] = useState([]);

    const [allClassificationsList, setAllClassificationsList] = useState([
        { name: "responsible" },
        { name: "subordinate" },
        { name: "secretary" },
    ]);

    useEffect(() => {
        axiosInstance()
            .get(`/employee/employeePositions/${employeeId}`)
            .then((response) => {
                const { myEmployeePositions, allPositions, allJobTitles } = response.data;
                setMyEmpPositions(myEmployeePositions);
                setMyEmpPositionsInitial(myEmployeePositions); //will be needed to reset the table
                setAllPositionsList(allPositions);
                setAllJobTitlesList(allJobTitles);
                console.log(myEmployeePositions);
            })
            .catch(error => console.log(error));
    }, []);

    const submitTable = async () => {
        try {
            const response = await axiosInstance().put(`/employee/updateEmployeePositions`, {
                myEmpPositions,
                employeeId, //employeeId for the employee whose positions will be updated
            });

            setMyEmpPositions(response.data.myEmpPositions);
            setMyEmpPositionsInitial(response.data.myEmpPositions);

            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.SUCCESS,
                    snackbarVariant: IVariant.STANDARD,
                    vertical: "top",
                    snackbarMessage: response.data.message,
                })
            );
        }
        catch (error) {
            console.log(error);
            dispatch(
                setSnackbar({
                    snackbarOpen: true,
                    snackbarType: ISeverity.ERROR,
                    snackbarVariant: IVariant.FILLED,
                    vertical: "top",
                    snackbarMessage: error?.response?.data?.message,
                })
            );
        }
    }

    const resetTable = () => {
        setMyEmpPositions(myEmpPositionsInitial);
        console.log("resetted List to: ", myEmpPositionsInitial);
    }

    const addRowOnTable = () => {
        const uniqueID = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

        const startDate = new Date();
        const isoStart = startDate.toISOString().split("T")[0];

        const endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        const isoEnd = endDate.toISOString().split("T")[0];

        console.log("isoStart: ", isoStart);
        console.log("isoEnd: ", isoEnd);

        const updatedList = [
            ...myEmpPositions,
            {
                "recordId": uniqueID,
                "positionId": null,
                "classification": null,
                "jobTitleId": null,
                "startDate": isoStart,
                "endDate": isoEnd,
                "description": null,
                "title": null,
                "isNew": true,
                "isUpdated": false,
                "isDeleted": false,
            }
        ];

        setMyEmpPositions(updatedList);
        console.log("updated List after adding: ", updatedList);
    }

    const deleteRowOnTable = (recordId) => {

        //if item.isNew, then it doesn't exist in the database. So, I can delete it permanently now.
        const filteredList = myEmpPositions.filter(
            (item) => item.recordId != recordId || item.isNew == false
        );
        console.log("filteredList: ", filteredList);

        // otherwise if it isNew == false, then it is in the database, I cannot delete it now. Just mark it as isDeleted: true then it will be deleted later from the database.
        const updatedList = filteredList.map((item) => {
            if (item.recordId == recordId) return { ...item, isDeleted: true };
            return item; //else, return item as is.
        });

        setMyEmpPositions(updatedList);
        console.log("deleting recordId: ", recordId);
        console.log("updatedList after deleting: ", updatedList)
    };


const changeJobTitle = (recordId, selectedOption) => {
    // recordId: the ID of the object to be changed.
    // selectedOption: the object the user has selected from the AutoComplete list
    console.log(recordId, selectedOption);

    const updatedList = myEmpPositions.map((item) => {
        if (item.recordId == recordId) {
            console.log(`update recordId: ${recordId} to ${selectedOption.title}`)
            return {
                ...item,
                jobTitleId: selectedOption.id,
                title: selectedOption.title,
                isUpdated: true
            };
        }
        return item; //else return the object as is
    });
    setMyEmpPositions(updatedList);
    console.log("Updated list  = ", updatedList);
}

const changePosition = (recordId, selectedOption) => {
    // recordId: the ID of the object to be changed.
    // selectedOption: the object the user has selected from the AutoComplete list
    console.log(recordId, selectedOption);

    const updatedList = myEmpPositions.map((item) => {
        if (item.recordId == recordId) {
            console.log(`update recordId: ${recordId} to ${selectedOption.description}`)
            return {
                ...item,
                positionId: selectedOption.id,
                description: selectedOption.description,
                isUpdated: true
            };
        }
        return item; //else return the object as is
    });
    setMyEmpPositions(updatedList);
    console.log("Updated list  = ", updatedList);
}

const changeClassification = (recordId, e) => {
    // recordId: the ID of the object to be changed.
    // e: event

    const updatedList = myEmpPositions.map((item) => {
        if (item.recordId == recordId) {
            console.log(`update recordId: ${recordId} to ${e.target.value}`)
            return {
                ...item,
                classification: e.target.value,
                isUpdated: true
            };
        }
        return item; //else return the object as is
    });
    setMyEmpPositions(updatedList);
    console.log("Updated list  = ", updatedList);
}

const changeStartDate = (recordId, e) => {
    // recordId: the ID of the object to be changed.
    // e: event

    const updatedList = myEmpPositions.map((item) => {
        if (item.recordId == recordId) {
            console.log(`update recordId: ${recordId} to ${e.target.value}`)
            return {
                ...item,
                startDate: e.target.value,
                isUpdated: true
            };
        }
        return item; //else return the object as is
    });
    setMyEmpPositions(updatedList);
    console.log("Updated list  = ", updatedList);
}

const changeEndDate = (recordId, e) => {
    // recordId: the ID of the object to be changed.
    // e: event

    const updatedList = myEmpPositions.map((item) => {
        if (item.recordId == recordId) {
            console.log(`update recordId: ${recordId} to ${e.target.value}`)
            return {
                ...item,
                endDate: e.target.value,
                isUpdated: true
            };
        }
        return item; //else return the object as is
    });
    setMyEmpPositions(updatedList);
    console.log("Updated list  = ", updatedList);
}


return (
    <TableContainer className={classes["tableContainer"]}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell align="right">Position</TableCell>
                    <TableCell align="right">Classification</TableCell>
                    <TableCell align="right">Job Title</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {myEmpPositions.map(myEmpPos => {
                    if (myEmpPos.isDeleted == false)
                        return (
                            <TableRow key={myEmpPos.recordId}>
                                <TableCell align="right" width="30%">
                                    <Autocomplete
                                        disabled={!isAdmin}
                                        disablePortal
                                        name="position"
                                        id="position"
                                        options={allPositionsList}
                                        getOptionLabel={(option) => option?.description || "Please select a position"}
                                        value={myEmpPos}
                                        onChange={(e, selectedOption) => {
                                            changePosition(myEmpPos.recordId, selectedOption);
                                        }}
                                        renderOption={(props, option) => {
                                            // props: The props to apply on the li element.
                                            // option: The option to render.
                                            // state: The state of the component.
                                            return (
                                                <>
                                                    {
                                                        <Box
                                                            component="li"
                                                            key={option.recordId}
                                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                            {...props}
                                                        >
                                                            <div style={{ fontSize: "14px" }}>
                                                                {option.description}
                                                            </div>
                                                        </Box>
                                                    }
                                                </>
                                            )
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Position"
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell align="right" width="10%">
                                    <Select
                                        fullWidth
                                        name="classification"
                                        labelId="classification-select"
                                        id="classification-select"
                                        value={myEmpPos.classification}
                                        // defaultValue="subordinate"
                                        onChange={(e) => changeClassification(myEmpPos.recordId, e)}
                                        disabled={!isAdmin}
                                    >
                                        <MenuItem value="sitemapIcon" disabled>
                                            <div style={{ color: "#777" }}>
                                                <FontAwesomeIcon icon={faSitemap} />
                                            </div>
                                        </MenuItem>
                                        {
                                            allClassificationsList.map((item) => (
                                                <MenuItem
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </TableCell>
                                <TableCell align="right" width="30%">
                                    <Autocomplete
                                        disabled={!isAdmin}
                                        disablePortal
                                        name="Job Title"
                                        id="jobtitle"
                                        options={allJobTitlesList}
                                        getOptionLabel={(option) => option?.title || "Please select a title"}
                                        value={myEmpPos}
                                        onChange={(e, selectedOption) => {
                                            changeJobTitle(myEmpPos.recordId, selectedOption);
                                        }}
                                        renderOption={(props, option) => {
                                            // props: The props to apply on the li element.
                                            // option: The option to render.
                                            // state: The state of the component.
                                            return (
                                                <>
                                                    {
                                                        <Box
                                                            component="li"
                                                            key={option.recordId}
                                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                            {...props}
                                                        >
                                                            <div style={{ fontSize: "14px" }}>
                                                                {option.title}
                                                            </div>
                                                        </Box>
                                                    }
                                                </>
                                            )
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Job Title"
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell align="right" width="2%">
                                    <TextField
                                        value={myEmpPos.startDate}
                                        onChange={(e) => changeStartDate(myEmpPos.recordId, e)}
                                        disabled={!isAdmin}
                                        name="startDate"
                                        className={classes["hireDate"]}
                                        id="startDate"
                                        type="date"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" />,
                                        }}
                                    />
                                </TableCell>

                                <TableCell align="right" width="2%">
                                    <TextField
                                        value={myEmpPos.endDate == null ? "9999-12-31" : myEmpPos.endDate}
                                        onChange={(e) => changeEndDate(myEmpPos.recordId, e)}
                                        disabled={!isAdmin}
                                        name="endDate"
                                        className={classes["hireDate"]}
                                        id="endDate"
                                        type="date"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" />,
                                        }}
                                    />
                                </TableCell>
                                {true &&
                                    (<TableCell align="right">
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            variant="contained"
                                            color="error"
                                            disabled={!isAdmin}
                                            onClick={() => deleteRowOnTable(myEmpPos.recordId)}>
                                        </Button>
                                    </TableCell>)
                                }
                            </TableRow>
                        )
                })}
            </TableBody>
        </Table>
        <span
            style={{ display: "inline-block", margin: "10px 0", color: "#777" }}
        >Note: When end date is: 31-Dec-999, this means the position has no specified end date</span>
        <br />
        <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}
        >
            <Button
                variant="contained"
                color="primary"
                style={{ width: "30%" }}
                disabled={!isAdmin}
                onClick={submitTable}
            >
                Save table changes
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                style={{ width: "30%" }}
                disabled={!isAdmin}
                onClick={addRowOnTable}
            >
                Assign New Position
            </Button>
            <Button
                variant="text"
                color="warning"
                style={{ width: "30%" }}
                disabled={!isAdmin}
                onClick={resetTable}
            >
                Reset table
            </Button>
        </div>
    </TableContainer >
)
}

export default TableOfEmpPositions