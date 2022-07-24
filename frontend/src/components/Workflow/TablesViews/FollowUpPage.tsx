import { useState, useEffect } from "react";
// ------------------- Components ------------------
import WorkflowsTable from "./WorkflowsTable";
import SearchAccordion from "../Search/SearchAccordion";
// ------------------- CSS Styling ------------------
import classes from "./css/WorkflowsPage.module.css";
// ------------------- API Functions ------------------
import axiosInstance from "../../../api/axios";
// ------------------- react-router-dom ------------------
// ------------------ TS Types -----------------------------
import { FolderType } from "../../../interfaces/SearchWorkflow";



const FollowupPage = () => {


    const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
    // ------------- States for the Search Box ---------------
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [folder, setFolder] = useState<FolderType>(FolderType.FollowUp);
    const [filterBy, setFilterBy] = useState<string>("");
    const [filterPayload, setFilterPayload] = useState<any>({});
    // ------------- States for the Table (Inbox/Follow-up/CC) ---------------
    const [workflows, setWorkflows] = useState<Array<any>>([]);
    const [pinnedWorkflows, setPinnedWorkflows] = useState<Array<any>>([]);
    const [unpinnedWorkflows, setUnpinnedWorkflows] = useState<Array<any>>([]);
    // ----- For table pagination: -----
    const [page, setPage] = useState<number>(0); //for pagination (initially, we are at page index 0)
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalNumOfRows, setTotalNumOfRows] = useState(-1);
    const [userEmpPosId, setUserEmpPosId] = useState(-1);


    const populateTable = (url: string) => {
        axiosInstance().get(url).then((response: any) => {
            const { workflowsList, myEmpPositionId, allMatchedWorkflowsCount } = response.data;
            setWorkflows(workflowsList);
            setTotalNumOfRows(allMatchedWorkflowsCount); //1
            if (allMatchedWorkflowsCount <= page * rowsPerPage) {
                setPage(0);
            }
            setUserEmpPosId(myEmpPositionId);
            console.log("workflows: ", workflowsList);

            // The result set `workflowsList` comes from the database already ordered (sorted) by `isPinned` and `createdAt`, but we want to separate the pinned from the unpinned so that when the user tries to pin a new record, we re-order the records:
            const pinnedList = workflowsList.filter((workflow: any) => workflow.isPinned === 1);
            const unpinnedList = workflowsList.filter((workflow: any) => workflow.isPinned === 0);
            setPinnedWorkflows(pinnedList);
            setUnpinnedWorkflows(unpinnedList);
            console.log("pinnedWorkflows: ", pinnedList);
            console.log("unpinnedWorkflows: ", unpinnedList);
        });
    }
    const handleSearchBtnClick = () => {
        console.log("--------- Search BTN Clicked: ---------");
        let url = `workflow/table?folder=${folder}&filterBy=${filterBy}&page=${page}&rowsPerPage=${rowsPerPage}`;
        // folder will be added in the forEach below:

        console.log("FILTER PAYLOAD: ", filterPayload);
        let queries = "";
        Object.entries(filterPayload).forEach(
            ([key, value]) => {
                if (key !== "folder") {
                    console.log(key, value);
                    queries += `&${key}=${value}`;
                }
            }
        );

        url = `${url}${queries}`;
        console.log("URL: ", url);
        populateTable(url);
    }
    const handleResetBtnClick = () => {
        console.log("--------- Reset BTN Clicked: ---------");
        setPage(0);
        let url = `workflow/table?folder=${folder}&page=0&rowsPerPage=${rowsPerPage}`;
        console.log("URL: ", url);
        populateTable(url);
    }



    useEffect(() => {
        handleSearchBtnClick();
    }, [page, rowsPerPage]);

    useEffect(() => {
        console.log("filterPayload: ", filterPayload);
    }, [filterPayload]);

    return (
        <div className={classes["page-container"]}>
            <section className="search-accordion" style={{ marginBottom: "2.5rem" }}>
                <SearchAccordion
                    isExpanded={isFilterExpanded}
                    setIsExpanded={setIsFilterExpanded}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    filterBy={filterBy}
                    setFilterBy={setFilterBy}
                    folder={folder}
                    setFolder={setFolder}
                    filterPayload={filterPayload}
                    setFilterPayload={setFilterPayload}
                    handleSearchBtnClick={handleSearchBtnClick}
                    handleResetBtnClick={handleResetBtnClick}
                />
            </section>

            <WorkflowsTable
                caption={folder}
                // isThisArchive={false}
                isFilterExpanded={isFilterExpanded}
                setIsFilterExpanded={setIsFilterExpanded}
                workflows={workflows}
                setWorkflows={setWorkflows}
                pinnedWorkflows={pinnedWorkflows}
                setPinnedWorkflows={setPinnedWorkflows}
                unpinnedWorkflows={unpinnedWorkflows}
                setUnpinnedWorkflows={setUnpinnedWorkflows}
                // ---- for TablePagination
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalNumOfRows={totalNumOfRows}
                userEmpPosId={userEmpPosId}
            />
        </div>
    );
};
export default FollowupPage;
