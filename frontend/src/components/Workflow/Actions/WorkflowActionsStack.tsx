import React, { useState, useEffect, Fragment, EffectCallback, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';

import { useParams, Link, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
// ------------------- MUI Components -----------------------
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps, } from '@mui/material/AccordionSummary'; import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from "@mui/material/Chip";
import Divider from '@mui/material/Divider';
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';

// ------------------- MUI Colors -----------------------
import { red, teal, pink, blueGrey } from '@mui/material/colors';

// ---------------- My Components ----------------------
import { Accordion, AccordionSummary } from "./HelperComponents/CustomizedAccordion";
import CreateAction from "./NewAction/CreateAction";
import SplitButton from "./HelperComponents/SplitButton";
import HelpDialog from "./HelperComponents/HelpDialog";
// ---------------- ICONS -------------------------------
import HelpIcon from '@mui/icons-material/Help';
import { MdOutlinePostAdd, MdOutlineMarkEmailRead, MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md"
// ----------------- Our CSS -------------------------
import classes from "./css/workflowActionsStack.module.css";
// ------------------- API Functions ------------------
import { getActionsByWorkflowId } from "../api/actionsAPI";
// -------------- Javascript File Download --------------
// Javascript function to trigger browser to save data to file as if it was downloaded.
import fileDownload from "js-file-download";

// ------------- Helper Functions (Utils) ----------------
import { handleDownload, getMyCustomDateTime, stringToColor } from "../utils/helpers";
import { goToNewAction } from "../utils/scrollUtils";

import axiosInstance from "../../../api/axios";

import { setSnackbar, ISeverity } from "../../../store/slices/snackbarSlice";
import { RootState } from "../../../store/index";
import { useDispatch } from 'react-redux';

const colorsPalette = {
    sender: "#f0f4c3",
    consignee: "#c2eafc",
    neither: "#fff",
}

const WorkflowActionsStack = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { workflowId } = useParams(); //Returns an object of key/value pairs of the dynamic params from the current URL
    // 👀👀👀👀👀👀👀👀👀👀👀 isSeen 👀👀👀👀👀👀👀👀👀👀👀👀👀
    // In addition to workflowId, remember that this page is reached when the user clicks on a record in his/her inbox, follow-up, or CC page. And the user may be involved in multiple actions of the same workflow, so when the user clicks on a record from his inbox for example, we want to update the "isSeen" status for the clicked record only, not for all actions regarding the workflow. That's why we want to know the actionId of the clicked table record:
    const queryParams = new URLSearchParams(window.location.search);
    const cameFromActionId = queryParams.get("cameFromActionId");
    // 👀👀👀👀👀👀👀👀👀👀👀 End isSeen 👀👀👀👀👀👀👀👀👀👀👀👀👀


    // ------ Help Dialog: ------
    const [isHelpDialogOpen, setHelpDialogOpen] = React.useState<boolean>(false);

    const [workflowInfo, setWorkflowInfo] = useState<any>({});
    const [workflowActions, setWorkflowActions] = useState<Array<any>>([]);
    const [allActionsAttachments, setAllActionsAttachments] = useState<Array<any>>([]);
    const [myEmployeePositionId, setMyEmployeePositionId] = useState<number>(-1);
    const [isNewActionAccordionExpanded, setExpandedNewActionAccordion] = useState<boolean>(false);
    // ----------
    const [forbidden, setForbidden] = useState<Boolean>(true);
    const [message, setMessage] = useState<string>("");
    const newActionRef: React.RefObject<any> = useRef<any>(null);
    const componentRef: React.RefObject<any> = useRef<any>(null); //to print the page

    useEffect((): ReturnType<EffectCallback> => {
        let mounted = true;
        getActionsByWorkflowId({
            workflowId, cameFromActionId, mounted, setForbidden, setMessage,
            setWorkflowInfo, setWorkflowActions, setAllActionsAttachments, setMyEmployeePositionId
        });

        return () => { mounted = false }; //cleanup function
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleCloseHelpDialog = () => {
        setHelpDialogOpen(false)
    }

    const handleScrollToNewAction = () => {
        setExpandedNewActionAccordion(true);
        goToNewAction(newActionRef);
    }

    const moveToArchive = () => {
        let isMoveTo = true;
        axiosInstance().patch(`/workflow/table/moveToOrFromArchive?isMoveTo=${isMoveTo}`, {
            actionsIds: [cameFromActionId], 
        }).then((response: any) => {
            console.log(response.data);
            dispatch(setSnackbar({
                snackbarOpen: true,
                snackbarMessage: response.data.message,
                snackbarType: response.data.type,
                autoHideDuration: 3000,
                // horizontal: "right",
            }));
        }).catch((error: any) => console.log(error?.message));
    }

    return (
        <div
            className={classes["page-container"]}
            ref={componentRef} // give this div a ref to print all its content
        >
            <header className={classes["page-header"]}>
                <h1
                // className={classes["workflow-title"]}
                >
                    Sequence of Actions on this Workflow
                </h1>
                {/* ---- Button Group ---- */}
                <div
                    className={classes["split-button-group"]}
                >
                    <SplitButton
                        handleScrollToNewAction={handleScrollToNewAction}
                        handlePrint={handlePrint}
                        moveToArchive={moveToArchive}
                    />
                </div>
            </header>
            {/* ---- End Button Group ---- */}
            <Paper className={classes["paper-style"]}>
                {/* ---- Icon to show Help (If the user wants to know colors' meaning) ---- */}
                <Tooltip title="Colors' meaning">
                    <IconButton
                        className={classes["color-help-button"]}
                        size="large"
                        onClick={() => setHelpDialogOpen(true)}
                    >
                        <HelpIcon sx={{ fontSize: "2.3rem" }} />
                    </IconButton>
                </Tooltip>
                <HelpDialog
                    open={isHelpDialogOpen}
                    onClose={handleCloseHelpDialog}
                />
                {/* --End Icon to show Help (If the user wants to know colors' meaning) -- */}


                {forbidden
                    ? <p style={{ color: "#ff5722", fontSize: "1.5rem" }}>{message}</p>
                    : (
                        <>
                            <div className={classes["workflow-info"]}>
                                <p>
                                    {workflowInfo.workflowType} - {workflowInfo.id}
                                </p>
                                <h3>
                                    {workflowInfo.subject}
                                </h3>
                            </div>
                            <section className={classes.actionsContainer}>
                                {workflowActions
                                    .slice(0)
                                    .reverse()
                                    .map((action) => (
                                        <Accordion
                                            key={action.id}
                                            // onChange={handleChange("panel1")}
                                            className={classes.Accordion}
                                        >
                                            <AccordionSummary
                                                style={{ backgroundColor: `${action.iAmMentioned ? colorsPalette["consignee"] : action.empPositionId == myEmployeePositionId && colorsPalette["sender"]}` }}
                                                // expandIcon={<ExpandMoreIcon />}
                                                aria-controls={action.id.toString()}
                                                // identifies the element (or elements) whose contents or presence are controlled by the current element.
                                                id={action.actionId.toString()}
                                            // className={classes.summary}
                                            >
                                                <div className={classes.summary}>
                                                    <div className={classes["senderInfo"]}>
                                                        <Avatar
                                                            // src={`${action.avatar !== undefined && `${uploadsURL}/avatars/${action.avatar}`}`}
                                                            src={`${action.avatar !== undefined && `${process.env.REACT_APP_UPLOADS_URL}avatars/${action.avatar}`}`}
                                                            alt={`Photo of ${action.fullName}`}
                                                            // sx={{ bgcolor: stringToColor(action.fullName) }}
                                                            sx={{ bgcolor: blueGrey[700] }}
                                                        >
                                                            {action.fullName.charAt(0)}
                                                        </Avatar>
                                                        <Typography>
                                                            {action.fullName} ({action.jobTitle})
                                                        </Typography>
                                                    </div>
                                                    <Typography>
                                                        {getMyCustomDateTime(action.createdAt)}
                                                    </Typography>
                                                </div>
                                            </AccordionSummary>

                                            {/* ---------- Recipients Section ---------- */}
                                            <AccordionDetails>
                                                <section className={classes["consignees-section"]}>
                                                    <div
                                                        className={classes["Faris-heading"]}
                                                    >
                                                        <h4>Sent to</h4>
                                                    </div>
                                                    <div className={classes["consignees-stack"]}>
                                                        {action.recipientsList.map((recipient: any) => (
                                                            <Chip
                                                                key={recipient.id}
                                                                style={{ backgroundColor: "white", height: "50px" }}
                                                                variant="outlined"
                                                                avatar={
                                                                    <Avatar
                                                                        alt={recipient.fullName}
                                                                        src={`${recipient.avatar !== undefined && `${process.env.REACT_APP_UPLOADS_URL}/avatars/${recipient.avatar}`}`}
                                                                        style={{ height: "40px", width: "40px", marginLeft: "5px" }}
                                                                        // sx={{ bgcolor: stringToColor(recipient.fullName) }}
                                                                        sx={{ bgcolor: blueGrey[700], color: "#fff !important" }}
                                                                    // variant="rounded"
                                                                    >
                                                                        {recipient.fullName.charAt(0)}
                                                                    </Avatar>
                                                                }
                                                                label={
                                                                    <div
                                                                        className={classes.chipConsigneeInfo}
                                                                    >
                                                                        <Typography
                                                                            component="span"
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                color: "#333"
                                                                            }}
                                                                        >
                                                                            {`${recipient.fullName} (${recipient.jobTitle}: ${recipient.position})`}
                                                                        </Typography>

                                                                        {recipient.isSeen
                                                                            ? (
                                                                                <Tooltip title="read" arrow>
                                                                                    <span className={classes.isSeenIcon}><MdOutlineMarkEmailRead /></span>
                                                                                </Tooltip>
                                                                            )
                                                                            : (
                                                                                <Tooltip title="unread" arrow>
                                                                                    <span className={classes.isSeenIcon}><MdMarkEmailUnread /></span>
                                                                                </Tooltip>
                                                                            )
                                                                        }
                                                                    </div>
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                </section>
                                            </AccordionDetails>

                                            {/* ---------- CC Section ---------- */}
                                            {
                                                action.ccList.length > 0 && (
                                                    <AccordionDetails>
                                                        <section className={classes["consignees-section"]}>
                                                            <div
                                                                className={classes["Faris-heading"]}
                                                            >
                                                                <h4>CC</h4>
                                                            </div>
                                                            <div className={classes["consignees-stack"]}>
                                                                {action.ccList.map((cc: any) => (
                                                                    <Chip
                                                                        key={cc.id}
                                                                        style={{ backgroundColor: "white", height: "50px" }}
                                                                        variant="outlined"
                                                                        avatar={
                                                                            <Avatar
                                                                                alt={cc.fullName}
                                                                                src={`${cc.avatar !== undefined && `${process.env.REACT_APP_UPLOADS_URL}/avatars/${cc.avatar}`}`}
                                                                                style={{ height: "40px", width: "40px", marginLeft: "5px" }}
                                                                                // sx={{ bgcolor: stringToColor(cc.fullName) }}
                                                                                sx={{ bgcolor: blueGrey[700], color: "#fff !important" }}
                                                                            >
                                                                                {cc.fullName.charAt(0)}
                                                                            </Avatar>
                                                                        }
                                                                        label={
                                                                            <div
                                                                                className={classes.chipConsigneeInfo}
                                                                            >
                                                                                <Typography
                                                                                    component="span"
                                                                                    variant="subtitle1"
                                                                                    sx={{
                                                                                        color: "#333"
                                                                                    }}
                                                                                >
                                                                                    {`${cc.fullName} (${cc.jobTitle}: ${cc.position})`}
                                                                                </Typography>

                                                                                {cc.isSeen
                                                                                    ? (
                                                                                        <Tooltip title="read" arrow>
                                                                                            <span className={classes.isSeenIcon}><MdOutlineMarkEmailRead /></span>
                                                                                        </Tooltip>
                                                                                    )
                                                                                    : (
                                                                                        <Tooltip title="unread" arrow>
                                                                                            <span className={classes.isSeenIcon}><MdMarkEmailUnread /></span>
                                                                                        </Tooltip>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        }
                                                                    />
                                                                ))}
                                                            </div>
                                                        </section>
                                                    </AccordionDetails>
                                                )
                                            }
                                            {/* <hr /> */}
                                            <Divider variant="middle" style={{ marginTop: "14px", marginBottom: "5px" }}>
                                                <Chip
                                                    label={<h2>Content</h2>}
                                                    style={{ fontFamily: "Nunito, sans-serif", fontWeight: "bold" }}
                                                />
                                            </Divider>
                                            {/* ---------- Action's Message Content ---------- */}
                                            <AccordionDetails>
                                                <p
                                                    // style={{padding: "10px"}}
                                                    dangerouslySetInnerHTML={{ __html: action.content }}
                                                />
                                            </AccordionDetails>

                                            {/* ---------- Action's Attachments Section ---------- */}
                                            {
                                                action.attachments.length > 0 && (
                                                    <Fragment>
                                                        <Divider variant="middle" style={{ marginTop: "14px", marginBottom: "10px" }}>
                                                            <Chip
                                                                label={<h2>Attachments</h2>}
                                                                style={{ fontFamily: "Nunito, sans-serif", fontWeight: "bold" }}
                                                            />
                                                        </Divider>
                                                        <AccordionDetails>
                                                            <div className={classes["attachments-stack"]}>
                                                                {action.attachments.map((attachment: any) => (
                                                                    <Chip
                                                                        key={attachment.id}
                                                                        style={{ height: "50px" }}
                                                                        size="medium"
                                                                        // style={{ backgroundColor: "white", }}
                                                                        avatar={<Avatar
                                                                            alt={attachment.fileName}
                                                                            src={getProperThumbnail(attachment)}
                                                                            variant="rounded"
                                                                            style={{ height: "40px", width: "40px", marginLeft: "7px" }}
                                                                        />}
                                                                        // label={<a href={`http://localhost:5000/static/actions_attachments/${attachment.fileName}`} target="_blank">{`${attachment.description} (${(attachment.size / 1024).toFixed(2)} KBytes.)`}</a>}
                                                                        label={`${attachment.description} (${(attachment.size / 1024).toFixed(2)} KBytes.)`}
                                                                        clickable={true}
                                                                        color="default"
                                                                        onClick={(e) => handleDownload(e, attachment)}
                                                                        variant="outlined"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </AccordionDetails>
                                                    </Fragment>
                                                )
                                            }
                                        </Accordion>
                                    ))}

                                {/* -------- Start Section for reply/create new action -------- */}
                                <div
                                    className={classes.replyAccordionContainer}
                                    ref={newActionRef} id="new-action"
                                >
                                    <Accordion
                                        expanded={isNewActionAccordionExpanded}
                                        // onChange={handleChange("panel1")}
                                        className={classes.Accordion}
                                    >
                                        <AccordionSummary
                                            onClick={() => setExpandedNewActionAccordion(!isNewActionAccordionExpanded)}
                                        // expandIcon={<ExpandMoreIcon />}
                                        >
                                            <div
                                                className={classes.summaryForReplyAccordion}
                                            >
                                                <Typography variant="h5">
                                                    New Action / Forward / Reply
                                                </Typography>
                                                <MdOutlinePostAdd />
                                            </div>
                                        </AccordionSummary>

                                        {/* ----- Section to show all attachments on this workflow ----- */}
                                        <AccordionDetails>
                                            {
                                                allActionsAttachments.length > 0 && (
                                                    <Fragment>
                                                        <Divider variant="middle" style={{ marginTop: "14px", marginBottom: "10px" }}>
                                                            <Chip
                                                                className={classes.allAttachmentsDivider}
                                                                label={<h2>All attachments on this workflow</h2>}
                                                                style={{ fontFamily: "Nunito, sans-serif", fontWeight: "bold" }}
                                                            />
                                                        </Divider>
                                                        {/* --- Here I will show All Attachments on this Workflow (From all actions) --- */}
                                                        <AccordionDetails>
                                                            <div className={classes["attachments-stack"]}>
                                                                {allActionsAttachments.map((attachment: any) => (
                                                                    <Chip
                                                                        key={attachment.id}
                                                                        style={{ height: "50px" }}
                                                                        size="medium"
                                                                        // style={{ backgroundColor: "white", }}
                                                                        avatar={<Avatar
                                                                            alt={attachment.fileName}
                                                                            src={getProperThumbnail(attachment)}
                                                                            variant="rounded"
                                                                            style={{ height: "40px", width: "40px", marginLeft: "7px" }}
                                                                        />}
                                                                        label={`${attachment.description} (${(attachment.size / 1024).toFixed(2)} KBytes.)`}
                                                                        clickable={true}
                                                                        color="default"
                                                                        onClick={(e) => handleDownload(e, attachment)}
                                                                        variant="outlined"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </AccordionDetails>
                                                        {/* ----------- End `All Attachments on this Workflow` section ----------- */}
                                                    </Fragment>
                                                )
                                            }
                                        </AccordionDetails>
                                        {/* ----- End Section to show all attachments on this workflow ----- */}

                                        <AccordionDetails>
                                            <CreateAction
                                                workflowId={workflowId}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                {/* -------- End Section for reply/create new action -------- */}
                            </section>
                        </>
                    )
                }
            </Paper>
        </div>
    );
}

const getProperThumbnail = (attachment: any) => {
    const mimeType = attachment.fileType; //ex: application/pdf
    const tempArr: Array<any> = attachment.description.split(".");
    const fileExtension = tempArr[tempArr.length - 1]; //sometimes I need to refer to the extension 

    const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mpeg', 'mp2t', '3gpp', '3gpp2'];
    const docTypes = ['msword', 'doc', 'docx', 'rtf', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const [type, subtype] = mimeType.split('/'); // ex: type: "application", subtype: "pdf"

    if (imageTypes.includes(subtype)) {
        // then the file is an image, so return its dataURL to be shown on the browser
        return `http://localhost:5000/static/actions_attachments/${attachment.fileName}`
    }
    else if (docTypes.includes(subtype) || docTypes.includes(fileExtension)) {
        return "https://i.imgur.com/3o1fJ7R.png";
        // return "../../../../public/images/docImage.png";
    }
    else if (['pdf'].includes(subtype)) {
        return "https://i.imgur.com/oRMlYfk.png";
        // return "../../../../public/images/pdf.png";
    }
    else if (videoTypes.includes(subtype)) {
        return "https://i.imgur.com/U4AzWU3.png";
        // return "../../../../public/images/video.png"
    }
    else if (type === "text") {
        // for ex: text/json, text/csv, text/css, text/javascript, text/html, ...
        return "https://i.imgur.com/BtWCADl.png";
        // return "../../../../public/images/textSlash.png"
    }
    return "https://i.imgur.com/mB2nYfw.png";
}

export default WorkflowActionsStack;
