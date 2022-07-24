import React from 'react'
// ----------------- MUI Components ------------------------
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
// ----------------- MUI ICONS ------------------------
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import FindInPageIcon from '@mui/icons-material/FindInPage';
// ----------------- Components ------------------------
import SearchArea from "./SearchArea";
// ------------------- TS Types/Enums/Interfaces -------------------
import { TableTypes, tableNames } from "../../../interfaces/Workflow";
import { FolderType } from "../../../interfaces/SearchWorkflow";

type SearchAreaProps = {
    title?: string;
    isExpanded: boolean;
    setIsExpanded: Function;
    isSearching: boolean;
    setIsSearching: Function;
    filterBy: string;
    setFilterBy: Function;
    folder: FolderType;
    setFolder: Function;
    filterPayload: any;
    setFilterPayload: Function;
    handleSearchBtnClick: Function;
    handleResetBtnClick: Function;
}

const SearchAccordion = (props: SearchAreaProps) => {

    React.useEffect(() => {
        console.log("Search Accordion");
    }, []);

    return (
        <div>
            <Accordion
                expanded={props.isExpanded}
            >
                <AccordionSummary
                    onClick={() => props.setIsExpanded(!props.isExpanded)}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography
                        component="h2"
                        variant="subtitle1"
                        style={{ fontWeight: "600", textTransform: "uppercase" }}
                        color="primary"
                    >
                        <span
                            style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center"
                            }}
                        >
                            <FindInPageIcon color="primary" /> {props.title ? props.title : `Search Box`}
                        </span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SearchArea
                        {...props}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default SearchAccordion