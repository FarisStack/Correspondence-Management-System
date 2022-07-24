import React, { useEffect } from 'react'
// =============== Imports for <FormFields /> =====================
import { useState } from 'react';
// ================ Material UI: =========================
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';

// ------------ Utils (helpers) Functions: -----------------
import { prepareSelectedConsignees, colorizeBasedOnConsigneeType } from "../../utils/ConsigneesUtils";

// ------ TS Interfaces ------------------
import { ConsigneeTypes } from "../../../../interfaces/Workflow_Participants";


import {
    TextField,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Box
} from '@mui/material';
// ================================================
// =============== Our Styles ======================
import classes from '../css/FormFields.module.css';
import { fontSize } from '@mui/system';


type FormFieldsProps = {
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


const FormFields = ({
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
                    renderOption={(props, option) => {
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

            {/* ------------------ CC Autocomplete ------------------ */}
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
        </div >
    )
}

export default FormFields