import React, { useState } from "react";
// ------------------- MUI ICONS -------------------
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import AttachmentIcon from '@mui/icons-material/Attachment';
// ------------------- react-icons -------------------------
import { IoMdMailUnread } from "react-icons/io";
import GoMailRead from "react-icons/go";
import { MdOutlineMarkEmailRead, MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md";
import { RiMailUnreadLine, RiMailUnreadFill } from "react-icons/ri";
import { GiPin } from "react-icons/gi";
import { GrAttachment } from "react-icons/gr";
import { FaArchive } from "react-icons/fa";

// ------------------- MUI IconButton -------------------
import IconButton from '@mui/material/IconButton';
// ---------------- MUI Components --------------------
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
// ----------------------
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from '@mui/material/Toolbar';
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
// ----------------------
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// ----------------- Our CSS Styles --------------------
import classes from "./css/WorkflowsTable.module.css";
// ----------------- Helper Components --------------------
import { EnhancedTableToolbarProps, EnhancedTableToolbar } from "./Helpers"
import Checkbox from "@mui/material/Checkbox";
// ----------------- Config --------------------
import { uploadsURL } from "../../../env";
// ----------------- Helper Functions --------------------
import { getMyCustomDate, getMyCustomTime } from "../utils/helpers";
// ----------------- react-router-dom --------------------
import { useNavigate, useParams } from "react-router-dom";
// ------------------- API Functions ------------------
import axiosInstance from "../../../api/axios";
// ------------------- Snackbar Notification Alert: -------------------
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setSnackbar } from "../../../store/slices/snackbarSlice";


// ------------- Variables -------------------
let pinnedWorkflows: Array<any> = [];
let unpinnedWorkflows: Array<any> = [];


const WorkflowsTable = ({
    workflows, setWorkflows,
    pinnedWorkflows, setPinnedWorkflows,
    unpinnedWorkflows, setUnpinnedWorkflows,
    page, setPage, rowsPerPage, setRowsPerPage, totalNumOfRows,
    userEmpPosId, caption,
    isFilterExpanded, setIsFilterExpanded, isThisArchive
}: any) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // `selected` is an array which stores all records selected by the user.
    const [selected, setSelected] = React.useState<readonly number[]>([]); //for clicking on the rows to select them.

    const handleChangePage = (event: unknown, newPage: number) => {
        console.log("Page has changed: ", newPage);
        setPage(newPage); //change the page index to a new index value.
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0); // reset the table to view records from the first page (page of index 0)

        console.log("rowsPerPage has changed: ", +event.target.value);
    };

    // ------------ For clicking records to select them: --------------------
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const handleRowSelect = (event: any, id: number) => {
        event.stopPropagation();

        // to handle when the user clicks on a specific row: 
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = []; //initially empty array

        if (selectedIndex === -1) {
            // then the row is not previously selected, so add it to the selected list:
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            // then the row was selected before clicking, and the row is the first row in the `selected` array, so now after clicking on the row, we should remove the row from the `selected` array:
            newSelected = newSelected.concat(selected.slice(1)); //slice the first element
        } else if (selectedIndex === selected?.length - 1) {
            // then the row was selected before clicking, and the row is the last row in the `selected` array, now after clicking on the row, we should remove the row from the `selected` array:
            newSelected = newSelected.concat(selected.slice(0, -1)); //slice the last element
        } else if (selectedIndex > 0) {
            // then the row was selected before clicking, and the row is neither the first nor the last element in the `selected` array, now after clicking on the row, we should remove the row from the selected array:
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        console.log("newSelected: ", newSelected);
    };
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>, rows: Array<any>) => {
        if (event.target.checked) {
            // this means the checkbox is checked, so:
            const newSelecteds: readonly number[] = rows.map((row) => row.actionId);
            setSelected(newSelecteds);
            return;
        }
        // else, the checkbox is unchecked, so let's un-select all records:
        setSelected([]);
    };
    // ------------------------------------
    const handleRowClick = (event: any, row: any) => {
        // console.log("clicked row");
        const workflowId = row.id;
        console.log("workflowId: ", row.id);
        console.log("actionId: ", row.actionId);
        navigate(`/actions/${workflowId}?cameFromActionId=${row.actionId}`);
    }
    // ------------------------------------
    const handlePinRecord = (e: any) => {
        e.stopPropagation(); //to prevent event bubbling (when clicking on the pin icon, don't trigger the onClick event to the whole TableRow)
        e.preventDefault();
        console.log('currentTarget: ', e.currentTarget.id);
        const actionId: number = +e.currentTarget.id; //each pin icon has an `id={row.actionId}`

        axiosInstance().patch("/workflow/table/pinRecord", {
            actionId,
            empPositionId: userEmpPosId
        }).then((response: any) => {
            console.log(response.data);
            dispatch(setSnackbar({
                snackbarOpen: true,
                snackbarMessage: response.data.message,
                snackbarType: response.data.type,
                // horizontal: "right",
            }));
        }).catch((error: any) => console.log(error?.message));

        // ----- setting the workflows state to update the UI: -----
        const updatedWorkflows: Array<any> = workflows.map((workflow: any) => {
            if (Number(workflow.actionId) === actionId) {
                return { ...workflow, isPinned: Number(!workflow.isPinned) };
                // MySQL stores booleans as TINYINT(1), so true means 1 and false means 0
            }
            return workflow;
        });
        // ---- Wait, 🐸 don't setWorkflows(updatedWorkflows) here, wait until we re-sort 
        // the list of `updatedWorkflows` to show all the pinned on the top: 

        // ---- SORTING `updatedWorkflows` DESC by `createdAt` date: --------
        updatedWorkflows.sort(
            (a: any, b: any) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA < dateB ? 1 : -1; // for DESC order
            }
        );
        // setWorkflows(updatedWorkflows); //set the workflows state to update the UI
        // No need to order by isPinned, because I will separate them in 2 lists:

        // ----------- Separating `updatedWorkflows` into 2 lists: --------------------
        const pinnedList = updatedWorkflows.filter(
            (updatedWorkflow: any) => updatedWorkflow.isPinned === Number(true)
        );
        const unpinnedList = updatedWorkflows.filter(
            (updatedWorkflow: any) => updatedWorkflow.isPinned === Number(false)
        );

        setPinnedWorkflows(pinnedList);
        setUnpinnedWorkflows(unpinnedList);
        // Now we are ready to set the `workflows` state to update the UI:
        setWorkflows([...pinnedList, ...unpinnedList]);
    };
    
    const moveToOrFromArchive = () => {
        // Here we don't receive the `actionId` by clicking on a specific record.
        // Instead, we make use of the list of selected records:

        let isMoveTo = true;
        if (caption === "Archive") {
            isMoveTo = false; //then the function will move actions from archive, not to it
        }
        axiosInstance().patch(`/workflow/table/moveToOrFromArchive?isMoveTo=${isMoveTo}`, {
            actionsIds: selected, // pass the `selected` list which stores the ids (actionsIds) of all selected records to be archived.
            empPositionId: userEmpPosId
        }).then((response: any) => {
            console.log(response.data);
            dispatch(setSnackbar({
                snackbarOpen: true,
                snackbarMessage: response.data.message,
                snackbarType: response.data.type,
                autoHideDuration: 3000,
                // horizontal: "right",
            }));
            setSelected([]); //clear the selected records
        }).catch((error: any) => console.log(error?.message));
    }

    const toggleFilterExpansion = () => {
        setIsFilterExpanded(true);
        // window.scrollTo(x, y);
        window[`scrollTo`]({ top: 0, behavior: 'smooth' });
    }


    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            {workflows?.length > 0 ? (
                <>
                    <EnhancedTableToolbar
                        numSelected={selected?.length}
                        tableCaption={caption}
                        toggleFilterExpansion={toggleFilterExpansion}
                        moveToOrFromArchive={moveToOrFromArchive}
                    />

                    <TableContainer className={classes.tableContainer}>
                        <Table className={classes.table} aria-label={`${caption} table`}>
                            <TableHead>
                                <TableRow>
                                    {/* ----- Checkbox to `select all rows` ----- */}
                                    <TableCell
                                        padding="checkbox"
                                        className={classes.tableHeaderCell}
                                    >
                                        <Tooltip title={`${selected?.length === workflows?.length ? `unselect` : `select`} all`} arrow>
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                style={{ color: "#fff" }}
                                                indeterminate={selected?.length > 0 && selected?.length < workflows?.length}
                                                checked={workflows?.length > 0 && selected?.length === workflows?.length}
                                                onChange={(e) => handleSelectAllClick(e, workflows)}
                                                inputProps={{
                                                    'aria-label': 'select all workflows',
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    {/* ---------- `Read/Unread` icon ---------- */}
                                    <TableCell className={classes.tableHeaderCell}>
                                        <Tooltip title="is read?" arrow>
                                            <span><MarkAsUnreadIcon /></span>
                                        </Tooltip>
                                    </TableCell>
                                    {/* ---------- `Pin/Unpin` icon` ---------- */}
                                    <TableCell className={`${classes.tableHeaderCell} ${classes.isSeenIcon}`}>
                                        <Tooltip title="Pin/Unpin" arrow>
                                            <span><GiPin style={{ fontSize: "1.3rem" }} /></span>
                                        </Tooltip>
                                    </TableCell>
                                    {/* ---------- `Workflow's Subject` Column ---------- */}
                                    <TableCell
                                        className={`${classes.tableHeaderCell}`}>
                                        Subject
                                    </TableCell>
                                    {/* ------- `Workflow's Sender's Info` Column (`From`) ------ */}
                                    <TableCell
                                        className={`${classes.tableHeaderCell}`}>
                                        From
                                    </TableCell>
                                    {/* ---------- Action `createdAt` Column ---------- */}
                                    <TableCell className={classes.tableHeaderCell}>Date</TableCell>
                                    {/* ---------- `#of Attachment's` icon ---------- */}
                                    <TableCell
                                        className={`${classes.tableHeaderCell} ${classes.attachmentsIcon}`}
                                    >
                                        <Tooltip title="attachments count" arrow>
                                            <span><AttachmentIcon /></span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workflows.map((row: any, index: number) => {
                                    const isItemSelected = isSelected(row.actionId);
                                    const labelId = `inbox-table-record-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            key={row.actionId}
                                            hover
                                            selected={isItemSelected}
                                            sx={{
                                                backgroundColor: isItemSelected 
                                                ? "#E3EEFA" 
                                                : row.isSeen 
                                                ? "white" 
                                                : "lightcyan",
                                                "&:hover": {
                                                    backgroundColor: isItemSelected 
                                                    ? "#E3EEFA !important" 
                                                    : row.isSeen 
                                                    ? "#F5F5F5 !important" 
                                                    : "#D1FFFF !important",
                                                }
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Tooltip title={`${selected.indexOf(row.actionId) === -1 ? `select` : `unselect`} record`} arrow>
                                                    <Checkbox
                                                        onChange={(event) => handleRowSelect(event, +row.actionId)}
                                                        size="small"
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                            {/* --------- 👀 isSeen Workflow Record --------- */}
                                            <TableCell className={classes.isSeenIcon}>
                                                {
                                                    row.isSeen ? (
                                                        <Tooltip title="read ✅" arrow>
                                                            <span><MdOutlineMarkEmailRead /></span>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="unread ❌" arrow>
                                                            <span><MdMarkEmailUnread /></span>
                                                        </Tooltip>
                                                    )
                                                }
                                            </TableCell>
                                            {/* --------- 👀 End isSeen Workflow Record --------- */}
                                            {/* --------- 📌Pin Workflow Record --------- */}
                                            <TableCell className={classes.isPinnedIcon}>
                                                {row.isPinned ? (
                                                    <Tooltip title="unpin" arrow>
                                                        <span>
                                                            <PushPinIcon
                                                                id={row.actionId}
                                                                onClick={handlePinRecord}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="pin" arrow>
                                                        <span>
                                                            <PushPinOutlinedIcon
                                                                id={row.actionId}
                                                                onClick={handlePinRecord}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                            {/* --------- 📌End Pin Workflow Record --------- */}

                                            {/* --------- Workflow's Subject --------- */}
                                            <TableCell
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => handleRowClick(e, row)}
                                                className={classes.alignLeft}
                                            >
                                                <Typography
                                                    color="primary"
                                                    variant="subtitle1"
                                                    style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                >
                                                    {row.subject}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                    style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                >
                                                    {row.workflowType} (priority: {row.priority})
                                                </Typography>
                                            </TableCell>
                                            {/* --------- End Workflow's Subject --------- */}
                                            {/* --------- Sender's Info `From` --------- */}
                                            <TableCell
                                                className={classes.alignLeft}
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => handleRowClick(e, row)}
                                            >
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                // style={{ columnGap: "15px" }}
                                                >
                                                    <Grid
                                                        item
                                                        xs={12} md={5} lg={3}
                                                        className={classes.avatarContainer}
                                                    >
                                                        <Avatar
                                                            className={classes.avatar}
                                                            variant="rounded"
                                                            alt={`Photo of ${row.senderFullName}`}
                                                            src={`${row.senderAvatar !== undefined && `${uploadsURL}/avatars/${row.senderAvatar}`}`}
                                                        >
                                                            {row.senderFullName.charAt(0)}
                                                        </Avatar>
                                                    </Grid>

                                                    <Grid item xs={12} md={7} lg={9}>
                                                        <Typography
                                                            className={classes.senderName}
                                                            variant="subtitle1"
                                                            color="primary"
                                                            style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                        >
                                                            {row.senderFullName}
                                                        </Typography>
                                                        <Typography
                                                            color="#333"
                                                            variant="body1"
                                                            style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                        >
                                                            {row.senderJobTitle}
                                                        </Typography>
                                                        <Typography
                                                            color="textSecondary"
                                                            variant="body2"
                                                            style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                        >
                                                            ({row.senderPosition})
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            {/* --------- End Sender's Info `From` --------- */}
                                            {/* --------- Workflow's Sent Date (createdAt) --------- */}
                                            <TableCell
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => handleRowClick(e, row)}
                                            >
                                                <Typography
                                                    color="primary"
                                                    variant="subtitle1"
                                                    style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                >
                                                    {new Date(row.createdAt).toLocaleString("en-us", { day: "2-digit", month: "long", year: "numeric", })}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                    style={{ fontWeight: `${row.isSeen ? ("normal") : ("700")}` }}
                                                >
                                                    {getMyCustomTime(row.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            {/* --------- End Workflow's Date Info --------- */}
                                            {/* ------- 🧷 Workflow's Attachments Count ------- */}
                                            <TableCell>
                                                <Tooltip title="attachments count">
                                                    <Chip
                                                        // label={`${row.attachmentsCount}_${row.actionId}`}
                                                        label={`${row.attachmentsCount}`}
                                                        variant="filled"
                                                        color="primary"
                                                        size="small"
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                            {/* ------- 🧷 End Workflow's Attachments Count ------ */}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[2, 5, 10, 20]}
                        component="div"
                        count={totalNumOfRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <Typography
                    sx={{
                        padding: "15px",
                    }}
                    variant="h4"
                    color="primary"
                >
                    Your {caption} is empty
                </Typography>
            )}
        </Paper>
    );
};

export default WorkflowsTable;