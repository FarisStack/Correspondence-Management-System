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
import SearchBoxF from "./SearchBoxF";
// ------------------- TS Types/Enums/Interfaces -------------------


const SearchAccordion = (props: any) => {

    React.useEffect(() => {
        console.log("Search Accordion");
    }, []);

    return (
        <div
            style={{ width: "100%", display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
            <Accordion
                expanded={props.isExpanded}
                sx={{ width: "95%" }}
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
                            <FindInPageIcon color="primary" /> Search Box
                        </span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SearchBoxF
                        {...props}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default SearchAccordion