import React, { useEffect } from 'react'
// =============== Imports for <FormFields /> =====================
import { useState } from 'react';
// ================ Material UI: =========================
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';

import {
    TextField,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Box
} from '@mui/material';
// ================================================
// ------------- MUI Colors ------------------------
import { red, blue, indigo, pink, green, orange, brown } from '@mui/material/colors';

// =============== Our Styles ======================
import classes from './css/FormFields.module.css';
import { fontSize } from '@mui/system';

// ------ TS Interfaces ------------------
import { WorkflowType, WorkflowPriority } from "../../../interfaces/Workflow";
import { ConsigneeTypes } from "../../../interfaces/Workflow_Participants";

// ------------ Utils (helpers) Functions: -----------------
import {prepareSelectedConsignees, colorizeBasedOnConsigneeType} from "../utils/ConsigneesUtils";


type FormFieldsProps = {
    workflowType: any;
    setWorkflowType: any;
    workflowPriority: any;
    setWorkflowPriority: any;
    subject: any;
    setSubject: any;
    recipients: any;
    setRecipients: any;
    cc: any;
    setCc: any;
    listOfConsignees: any;
    setListOfConsignees: any;
    recipientsIDs: any;
    setRecipientsIDs: any;
    ccIDS: any;
    setCcIDs: any;
}

const workflowTypes: Array<WorkflowType> = [
    WorkflowType.INTERNAL_CORRESPONDENCE,
    WorkflowType.EXTERNAL_CORRESPONDENCE_INCOMING,
    WorkflowType.EXTERNAL_CORRESPONDENCE_OUTGOING,
    WorkflowType.LETTER,
    WorkflowType.DECISION,
    WorkflowType.REPORT,
    WorkflowType.INSTRUCTIONS,
    WorkflowType.INVITATION,
];

const workflowPriorities: Array<WorkflowPriority> = [
    WorkflowPriority.URGENT,
    WorkflowPriority.HIGH,
    WorkflowPriority.MEDIUM,
    WorkflowPriority.LOW,
];



const FormFields = ({
    workflowType,
    setWorkflowType,
    workflowPriority,
    setWorkflowPriority,
    subject,
    setSubject,
    recipients,
    setRecipients,
    cc,
    setCc,
    listOfConsignees,
    setListOfConsignees,
    recipientsIDs,
    setRecipientsIDs,
    ccIDS,
    setCcIDs,
}: FormFieldsProps) => {


    return (
        // <form className="form-fields" action="" autoComplete='off'>
        <div className={classes.formFieldsGrid}>

            {/* ================== Workflow's Type (Single Select) ================== */}
            <div className={classes["workflow-type"]}>
                <FormControl
                    required
                    fullWidth
                >
                    <InputLabel id="workflow-type-label">Workflow's Type</InputLabel>
                    <Select
                        name="workflowType"
                        value={workflowType}
                        // type="text"
                        variant="outlined"
                        // autoWidth
                        labelId="workflow-type-label"
                        id="workflow-type-select"
                        // value={workflowType} // this is a state (useState)
                        label="Workflow's Type"
                        onChange={(e) => setWorkflowType(e.target.value)}
                    >
                        {
                            workflowTypes.map(elem => (
                                <MenuItem key={elem} value={`${elem}`}>{elem}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <div className={classes["workflow-priority"]}>
                <FormControl
                    required
                    fullWidth
                >
                    <InputLabel id="workflow-priority-label">Workflow's Priority</InputLabel>
                    <Select
                        name="workflowPriority"
                        value={workflowPriority}
                        variant="outlined"
                        labelId="workflow-priority-label"
                        id="priority-select"
                        label="Workflow's Priority"
                        onChange={(e) => setWorkflowPriority(e.target.value)}
                    >
                        {
                            workflowPriorities.map(elem => (
                                <MenuItem key={elem} value={`${elem}`}>{elem}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>

            {/* ------------------ Recipients Autocomplete ------------------ */}
            <div className={classes["recipients-autocomplete"]}>
                <Autocomplete
                    groupBy={(option) => option.consigneeType}
                    // type="text"
                    value={recipients}
                    multiple
                    limitTags={5} //You can use the limitTags prop to limit the number of displayed options when not focused.
                    // size="small"
                    id="tags-recipients"
                    options={listOfConsignees}
                    getOptionLabel={(option) => `${option.name}  (${option.jobTitle}: ${option.position})`}
                    // defaultValue={[top100Films[13]]}
                    filterSelectedOptions
                    renderOption={(props, option: any) => {
                        // props: The props to apply on the li element.
                        // option: The option to render.
                        // state: The state of the component.

                        return (
                            <>
                                {
                                    !ccIDS.includes(option.id) && (
                                        <Box
                                            component="li"
                                            key={option.name}
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...props}
                                        >
                                            <div
                                                style={{ fontSize: "1rem" }}
                                            // key={option.name}
                                            >
                                                <div
                                                    style={{
                                                        color: colorizeBasedOnConsigneeType(option)
                                                    }}
                                                >
                                                    <strong>{option.name}</strong>
                                                </div>
                                                {option.consigneeType !== ConsigneeTypes.CUSTOM_GROUP && (
                                                    <div style={{ fontSize: "14px" }}>
                                                        ({option.jobTitle}: {option.position})
                                                    </div>
                                                )}
                                            </div>
                                        </Box>
                                    )
                                }
                            </>
                        )
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            key={params.id}
                            label="Recipients"
                            placeholder="Recipients"
                        />
                    )}
                    onChange={(event, selectedOptions) => {
                        const selectedOptionsUNIQUE =
                            prepareSelectedConsignees(selectedOptions, listOfConsignees);
                        setRecipients(selectedOptionsUNIQUE);
                        console.log("selectedOptionsUNIQUE: ", selectedOptionsUNIQUE);
                        // const listOfRecipientsIDs = selectedOptions.map((opt: any) => opt.id);
                        // setRecipientsIDs(listOfRecipientsIDs);
                        // console.log(listOfRecipientsIDs);
                    }}
                />
            </div>

            <div className={classes["cc-autocomplete"]}>
                <Autocomplete
                    groupBy={(option) => option.consigneeType}
                    value={cc}
                    // type="text"
                    multiple
                    limitTags={5} //You can use the limitTags prop to limit the number of displayed options when not focused.
                    // size="small"
                    id="tags-cc"
                    options={listOfConsignees}
                    getOptionLabel={(option) => `${option.name}  (${option.jobTitle}: ${option.position})`}
                    // defaultValue={[top100Films[13]]}
                    filterSelectedOptions
                    renderOption={(props, option) => {
                        // props: The props to apply on the li element.
                        // option: The option to render.
                        // state: The state of the component.
                        return (
                            <>
                                {
                                    !recipientsIDs.includes(option.id) && (
                                        <Box
                                            component="li"
                                            key={option.name}
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...props}
                                        >
                                            <div
                                                style={{ fontSize: "1rem" }}
                                            // key={option.name}
                                            >
                                                <div
                                                    style={{
                                                        color: colorizeBasedOnConsigneeType(option)
                                                    }}
                                                >
                                                    <strong>{option.name}</strong>
                                                </div>
                                                {option.consigneeType !== ConsigneeTypes.CUSTOM_GROUP && (
                                                    <div style={{ fontSize: "14px" }}>
                                                        ({option.jobTitle}: {option.position})
                                                    </div>
                                                )}
                                            </div>
                                        </Box>
                                    )
                                }
                            </>
                        )
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            // key={params.id}
                            label="CC"
                            placeholder="CC"
                        />
                    )}
                    onChange={(event, selectedOptions) => {
                        const selectedOptionsUNIQUE =
                            prepareSelectedConsignees(selectedOptions, listOfConsignees);
                        setCc(selectedOptionsUNIQUE);
                        console.log("selectedOptionsUNIQUE: ", selectedOptionsUNIQUE);
                        // const listOfCcIDs = selectedOptions.map((opt: any) => opt.id);
                        // setCcIDs(listOfCcIDs);
                        // console.log(listOfCcIDs);
                    }}
                />
            </div>

            <div className={classes["workflow-subject"]}>
                <TextField
                    name="subject"
                    type="text"
                    value={subject}
                    fullWidth
                    multiline
                    // error={subjectError.isError}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    id="subject"
                    label="Subject"
                    variant="outlined"
                />
            </div>
        </div >
    )
}

export default FormFields