import React, { FC, Fragment, createRef, LegacyRef, RefObject } from 'react'
// ========== Our CSS Stylings: ==========================
// import AddEmployeeCSS from "./css/AddEmployee.module.css";
import "../css/AddEmployee.css";
// // Using Styled-Components to apply <body> bacjaground image only on this page:
// import styled, { createGlobalStyle } from 'styled-components';
// ===== MUI ICONS: ======================================
// ========== FontAwesome Icons: =================================
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap, faUserTie, faToolbox } from '@fortawesome/free-solid-svg-icons';
// ================= MUI Form Components: ==================
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// =========== MUI Datepicker: ===============================
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// ======== REACT MULTISELECT DROPDOWN with search feature ==========
import Multiselect from "multiselect-react-dropdown";


type Props = {
    state: any;
    dispatch: any;
    EmpActionTypes: any;
    positionsMultiSelectRef: RefObject<Multiselect>,
    jobTitlesMultiSelectRef: RefObject<Multiselect>,
}

const EmployeePositionInfo: FC<Props> = ({
    state, dispatch,
    EmpActionTypes, positionsMultiSelectRef, jobTitlesMultiSelectRef }: Props) => {

    return (
        <Fragment>
            {/* ======================= Now Assign Position to the Employee ============= */}
            {/* ============== 1. Position MultiSelect with Search Feature ========= */}
            <div className='position-multiselect'>
                <FontAwesomeIcon icon={faToolbox} className="jobtitle-icon" />
                <Multiselect
                    ref={positionsMultiSelectRef}
                    selectionLimit={1}
                    // singleSelect={true}
                    // showCheckbox={true}
                    displayValue="description"
                    options={state.positionsList} // Array of options to display in the dropdown
                    onSelect={(selectedList, selectedItem) => {
                        dispatch({ type: EmpActionTypes.POSITION_SELECTED, value: selectedList[0]?.id });
                        // console.log(selectedList);
                        // console.log(selectedList[0].id);
                        // setRecipients(selectedList);
                        // console.log(selectedList);
                        // console.log("the item", selectedItem);
                    }}
                    onRemove={(selectedList, selectedItem) => {
                        dispatch({ type: EmpActionTypes.POSITION_SELECTED, value: "" });
                        // console.log(selectedList);
                        // console.log(selectedList[0]);
                        // setRecipients(selectedList);
                        // console.log(selectedList);
                        // console.log("the item", selectedItem);
                    }}
                    placeholder="Assign a position"
                    closeIcon="cancel"
                    closeOnSelect={true}
                    // showCheckbox={true}
                    // singleSelect={true}
                    // disable={true}
                    // hidePlaceholder={true}
                    // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                    style={{
                        chips: {
                            // background: "#676767",
                            // color: "#FFF"
                            margin: 0,
                            fontSize: "15px",
                        },
                        multiselectContainer: {
                            color: "black",
                        },
                        searchBox: { // To change search box element look
                            // minHeight: "50px",
                            // minHeight: "57px",
                            overflow: "atuo",
                            padding: "16.5px 14px 16.5px 40px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            paddingLeft: "40px", //keep space for the icon which I added
                            // justifyContent: "center",
                            // backgroundColor: "#dfdfdf",
                            // border: "1px solid #dfdfdf"
                        },
                        inputField: { // To change input field position or margin
                            // margin: "5px",
                        },
                        optionContainer: { // To change css for option container 
                            // border: "2px solid",
                            borderColor: "#dfdfdf"
                        },
                        // groupHeading: { // To chanage group heading style

                        //   }
                    }}
                    // loading="true"
                    // loadingMessage="Please Wait until recipients list is ready.."
                    keepSearchTerm={true}
                />
            </div>
            {/* =============== 2. Classification: ==================== */}
            <FormControl className="classification-select">
                <InputLabel id="classification-select">Classification within position</InputLabel>
                <Select
                    name="classficiation"
                    labelId="classification-select"
                    id="classification-select"
                    value={state.classification}
                    label="Classification within position"
                    // defaultValue="subordinate"
                    onChange={(e) => {
                        // console.log(e.target.value);// ex: responsible
                        dispatch({
                            type: EmpActionTypes.CLASSIFICATION_SELECTED,
                            value: e.target.value,
                        });
                    }}
                >
                    <MenuItem value="sitemapIcon" disabled>
                        <div style={{ color: "#777" }}>
                            <FontAwesomeIcon icon={faSitemap} />
                        </div>
                    </MenuItem>
                    {
                        state.classificationsList.map((classf: any) => (
                            <MenuItem key={classf.id} value={classf.name}>{classf.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {/* ============== 3. Jobtitle MultiSelect with Search Feature ========= */}
            <div className='jobtitle-multiselect'>
                <FontAwesomeIcon icon={faUserTie} className="jobtitle-icon" />
                <Multiselect
                    ref={jobTitlesMultiSelectRef}
                    selectionLimit={1}
                    // singleSelect={true}
                    // showCheckbox={true}
                    displayValue="title"
                    options={state.jobTitlesList} // Array of options to display in the dropdown
                    onSelect={(selectedList, selectedItem) => {
                        dispatch({ type: EmpActionTypes.JOBTITLE_SELECTED, value: selectedList[0]?.id });
                        // console.log(selectedList);
                        // console.log("the item", selectedItem);
                    }}
                    onRemove={(selectedList, selectedItem) => {
                        dispatch({ type: EmpActionTypes.JOBTITLE_SELECTED, value: "" });
                        // console.log(selectedList);
                        // console.log("the item", selectedItem);
                    }}
                    placeholder="Specify a job title"
                    closeIcon="cancel"
                    closeOnSelect={true}
                    // showCheckbox={true}
                    // singleSelect={true}
                    // disable={true}
                    // hidePlaceholder={true}
                    // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                    style={{
                        chips: {
                            // background: "#676767",
                            // color: "#FFF"
                            margin: 0,
                            fontSize: "15px",
                        },
                        multiselectContainer: {
                            color: "black",
                        },
                        searchBox: { // To change search box element look
                            // minHeight: "50px",
                            // minHeight: "57px",
                            overflow: "atuo",
                            padding: "16.5px 14px 16.5px 40px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            paddingLeft: "40px", //keep space for the icon which I added
                            // justifyContent: "center",
                            // backgroundColor: "#dfdfdf",
                            // border: "1px solid #dfdfdf"
                        },
                        inputField: { // To change input field position or margin
                            // margin: "5px",
                        },
                        optionContainer: { // To change css for option container 
                            // border: "2px solid",
                            borderColor: "#dfdfdf"
                        },
                        // groupHeading: { // To chanage group heading style

                        //   }
                    }}
                    // loading="true"
                    // loadingMessage="Please Wait until recipients list is ready.."
                    keepSearchTerm={true}
                />
            </div>
            {/* ========================== Position Start Date ========================== */}
            <LocalizationProvider dateAdapter={AdapterDateFns} className="start-date">
                <DesktopDatePicker
                    label="Start Date"
                    inputFormat="dd-MM-yyyy"
                    value={state.startDate}
                    onChange={(event) => {
                        // dispatch({ type: EmpActionTypes.BIRTHDATE_UPDATED, value: event });
                        // here we pass all the event, there's no event.target here.

                        // console.log(event); // Thu Oct 19 2000 03:00:00 GMT+0300 (Eastern European Summer Time)
                        let isoStringYMD = null;
                        if (event !== null) {
                            let d = new Date(event);
                            isoStringYMD = d.toISOString().split("T")[0]; //ex: 2000-10-02
                        }
                        // console.log(d.toISOString()); //2000-10-19T00:00:00.000Z
                        // console.log(d.toISOString().split("T")[0]); //2000-10-19

                        dispatch({ type: EmpActionTypes.STARTDATE_UPDATED, value: isoStringYMD });
                        // console.log(isoStringYMD);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            {/* ========================== Position End Date ========================== */}
            <LocalizationProvider dateAdapter={AdapterDateFns} className="end-date">
                <DesktopDatePicker
                    label="End Date (if determined)"
                    inputFormat="dd-MM-yyyy"
                    value={state.endDate}
                    onChange={(event) => {
                        // dispatch({ type: EmpActionTypes.BIRTHDATE_UPDATED, value: event });
                        // here we pass all the event, there's no event.target here.

                        // console.log(event); // Thu Oct 19 2000 03:00:00 GMT+0300 (Eastern European Summer Time)
                        let isoStringYMD = null;
                        if (event !== null) {
                            let d = new Date(event);
                            isoStringYMD = d.toISOString().split("T")[0]; //ex: 2000-10-02
                        }
                        // console.log(d.toISOString()); //2000-10-19T00:00:00.000Z
                        // console.log(d.toISOString().split("T")[0]); //2000-10-19

                        dispatch({ type: EmpActionTypes.ENDDATE_UPDATED, value: isoStringYMD });
                        // console.log(isoStringYMD);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </Fragment>
    )
}

export default EmployeePositionInfo