import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
// --------------- MUI Components -----------------------
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// --------------------- MUI DatePicker: ---------------------
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
// --------------------- MUI ICONS: ---------------------
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// --------------------- CSS ------------------
import classes from "./css/SearchArea.module.css";
// --------------------- TS Interfaces & Types ------------------
import { WorkflowType, WorkflowPriority } from "../../../interfaces/Workflow";
import { FolderType, FilterByOptions, EmployeeAs } from "../../../interfaces/SearchWorkflow";
// ----------------- axios ---------------------------
import axiosInstance from "../../../api/axios";
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';


type Props = {}
// ----------- Enums -----------------

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


type SearchAreaProps = {
  isSearching: boolean;
  setIsSearching: Function;
  filterBy: string;
  setFilterBy: Function;
  folder: string;
  setFolder: Function;
  filterPayload: any;
  setFilterPayload: Function;
  handleSearchBtnClick: Function;
  handleResetBtnClick: Function;
}

const SearchArea = (
  { isSearching, setIsSearching, filterBy, setFilterBy, folder, setFolder,
    filterPayload, setFilterPayload, handleSearchBtnClick, handleResetBtnClick }
    : SearchAreaProps
) => {

  useEffect(() => {
    axiosInstance().get(`/workflow/getEmployeesListToSearchBy`).then((response: any) => {
      const { peopleList } = response.data;
      console.log("peopleList: ", peopleList);
      setEmpList(peopleList);
    }).catch((error: any) => console.log(error));
  }, []);



  // const [folder, setFolder] = useState<FolderType>(FolderType.All);
  const [keyword, setKeyword] = useState<string>("");
  const [serial, setSerial] = useState<number>(0);
  const [workflowType, setWorkflowType] = useState<WorkflowType>(WorkflowType.INTERNAL_CORRESPONDENCE);
  const [workflowPriority, setWorkflowPriority] = useState<WorkflowPriority>(WorkflowPriority.MEDIUM);
  // ------------- Search by Employee ----------------------------------
  const [empList, setEmpList] = useState<Array<any>>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>({});
  const [employeeAs, setEmployeeAs] = useState<EmployeeAs>(EmployeeAs.Either);
  const [empPosId, setEmpPosId] = useState<number>(-1);
  // ------------- Search by Date ----------------------------------
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(new Date());


  const handleFolder = (e: SelectChangeEvent<typeof folder>) => {
    const f = e.target.value;
    console.log(f);
    setFolder(f as FolderType);
    setFilterPayload({ ...filterPayload, folder: f });
  };
  const handleFilterByChange = (e: SelectChangeEvent<typeof filterBy>) => {
    const fBy = e.target.value
    console.log(fBy);
    setFilterBy(fBy);

    // ---- In order to change the filterPayload object:
    switch (fBy) {
      case FilterByOptions.Employee:
        const f = filterPayload["folder"];
        setFilterPayload({ folder, wantedEmpPosId: empPosId, employeeAs })
        break;
      case FilterByOptions.Date:
        setFilterPayload({ folder, toDate: new Date(), fromDate: new Date() })
        break;
      case FilterByOptions.Keyword:
        setFilterPayload({ folder, keyword });
        break;
      case FilterByOptions.WorkflowSerial:
        setFilterPayload({ folder, workflowSerial: serial });
        break;
      case FilterByOptions.WorkflowType:
        setFilterPayload({ folder, workflowType: workflowType });
        break;
      case FilterByOptions.WorkflowPriority:
        setFilterPayload({ folder, priority: workflowPriority });
        break;
    }

  };
  const handleKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword);
    console.log(keyword);

    const folder = filterPayload["folder"]; //don't forget the folder entry'
    setFilterPayload({ folder, keyword });
  }
  const handleSerial = (e: ChangeEvent<HTMLInputElement>) => {
    const serial = +e.target.value;
    setSerial(serial);
    console.log(serial);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    setFilterPayload({ folder, workflowSerial: serial });
  }
  const handleWorkflowType = (e: SelectChangeEvent<typeof workflowType>) => {
    const wType = e.target.value as WorkflowType;
    console.log(wType);
    setWorkflowType(wType);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    setFilterPayload({ folder, workflowType: wType });
  };
  const handleWorkflowPriority = (e: SelectChangeEvent<typeof workflowPriority>) => {
    const wPriority = e.target.value as WorkflowPriority;
    console.log(wPriority);
    setWorkflowPriority(wPriority);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    setFilterPayload({ folder, priority: wPriority });
  };
  const handleEmployeeSelect = (selectedValue: any) => {
    setSelectedEmp(selectedValue);
    setEmpPosId(+selectedValue.empPositionId);
    console.log(selectedValue);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    const employeeAs = filterPayload["employeeAs"]; //don't forget the employeeAs if exists
    setFilterPayload({
      wantedEmpPosId: selectedValue.empPositionId,
      employeeAs, folder
    });
  }
  const handleEmployeeAs = (event: ChangeEvent<HTMLInputElement>) => {
    const employeeAs = event.target.value;
    setEmployeeAs(employeeAs as EmployeeAs);
    console.log(employeeAs);

    const wantedEmpPosId = filterPayload["wantedEmpPosId"]; //don't forget this if exists
    const folder = filterPayload["folder"]; //don't forget the folder entry
    setFilterPayload({ folder, employeeAs, wantedEmpPosId });
  };
  const handleDateFrom = (newValue: Date | null) => {
    console.log(newValue); //prints a Date
    setDateFrom(newValue);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    const toDate = filterPayload["toDate"]; //save this entry only
    setFilterPayload({ folder, toDate, fromDate: newValue });
  }
  const handleDateTo = (newValue: Date | null) => {
    console.log(newValue); //prints a Date
    setDateTo(newValue);

    const folder = filterPayload["folder"]; //don't forget the folder entry
    const fromDate = filterPayload["fromDate"]; //save this entry only
    setFilterPayload({ folder, fromDate, toDate: newValue });
  }
  const resetAll = () => {
    console.log("------------ RESET FILTERS ---------------- ");
    setFilterBy("");
    setFilterPayload({ folder: FolderType.All });
    setIsSearching(false); //I want to stop searching and reset all


    setFolder(FolderType.Inbox);
    setKeyword("");
    setSerial(0);
    setEmpPosId(-1);
    setDateFrom(new Date());
    setDateTo(new Date());
  }


  return (
    <section className={classes["search-area-grid"]}>
      <Typography
        component="p"
        variant="subtitle1"
        className={classes.heading}
        style={{ borderBottom: "1rem" }}
        color="default"
      >
        Please specify how you want to filter the workflows table
      </Typography>
      {/* -------------- Select `Folder` ------------------- */}
      <FormControl className={classes["folder"]}>
        <InputLabel id="label-folder">Folder</InputLabel>
        <Select
          // style={{ width: "400px" }}
          labelId="label-folder"
          id="folder-select"
          value={folder}
          label="Folder"
          onChange={handleFolder}
        >
          <MenuItem value={FolderType.All}>All</MenuItem>
          <MenuItem value={FolderType.Inbox}>Inbox</MenuItem>
          <MenuItem value={FolderType.FollowUp}>Follow-up</MenuItem>
          <MenuItem value={FolderType.Cc}>CC</MenuItem>
        </Select>
      </FormControl>

      {/* -------------- Select `Filter by` ------------------- */}
      <FormControl className={classes["filter-by"]}>
        <InputLabel id="label-filter-by">Filter by</InputLabel>
        <Select
          // style={{ width: "400px" }}
          labelId="label-filter-by"
          id="filterBy-select"
          value={filterBy}
          label="Filter by"
          onChange={handleFilterByChange}
        >
          <MenuItem value={FilterByOptions.Keyword}>Keyword</MenuItem>
          <MenuItem value={FilterByOptions.WorkflowSerial}>Workflow's Serial</MenuItem>
          <MenuItem value={FilterByOptions.WorkflowType}>Workflow's Type</MenuItem>
          <MenuItem value={FilterByOptions.WorkflowPriority}>Workflow's Priority</MenuItem>
          <MenuItem value={FilterByOptions.Employee}>Specific Employee</MenuItem>
          <MenuItem value={FilterByOptions.Date}>Date From/To</MenuItem>
        </Select>
      </FormControl>
      {/* -------------- TextField for "Keyword" ------------------- */}
      {filterBy === FilterByOptions.Keyword && (
        <TextField
          className={classes["visible-field"]}
          id="keyword-textfield"
          type="text"
          label="Keyword"
          placeholder="Will search through the workflows' subjects"
          value={keyword}
          onChange={handleKeyword}
        />

      )}
      {/* -------------- TextField for "Workflow's Serial" ------------------- */}
      {filterBy === FilterByOptions.WorkflowSerial && (
        <TextField
          className={classes["visible-field"]}
          id="serial-textfield"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          label="Workflow's Serial"
          value={serial}
          onChange={handleSerial}
        />
      )}
      {/* -------------- TextField for "Workflow's Type" ------------------- */}
      {filterBy === FilterByOptions.WorkflowType && (
        <FormControl className={classes["visible-field"]}>
          <InputLabel id="label-workflow-type">Workflow's Type</InputLabel>
          <Select
            labelId="label-workflow-type"
            id="workflow-type-select"
            value={workflowType}
            label="Workflow's Type"
            onChange={handleWorkflowType}
          >
            {
              workflowTypes.map((element: WorkflowType) => (
                <MenuItem key={element} value={element}>{element}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      )}
      {/* -------------- TextField for "Workflow's Priority" ------------------- */}
      {filterBy === FilterByOptions.WorkflowPriority && (
        <FormControl className={classes["visible-field"]}>
          <InputLabel id="label-workflow-priority">Workflow's Priority</InputLabel>
          <Select
            labelId="label-workflow-priority"
            id="workflow-priority-select"
            value={workflowPriority}
            label="Workflow's Priority"
            onChange={handleWorkflowPriority}
          >
            {
              workflowPriorities.map((element: WorkflowPriority) => (
                <MenuItem key={element} value={element}>{element}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      )}
      {/* -------------- Autocomplete for "Employee" ------------------- */}
      {filterBy === FilterByOptions.Employee && (
        <Autocomplete
          className={classes["visible-field"]}
          id="employee-autoSelect"
          autoComplete={true}
          autoHighlight={true}
          options={empList}
          getOptionLabel={(option: any) => {
            return (
              `${option.fullName} (${option.jobTitle}: ${option.position})` ?? option
            )
          }}
          //getOptionLabel is used to fill the input (and the list box options if renderOption is not provided).
          renderOption={(props, option) => (
            <Box
              key={option.fullName}
              component="li"
              {...props}
              style={{ padding: "15px 10px" }}
            >
              {option.fullName} ({option.jobTitle}: {option.position})
            </Box>
          )}
          // value={selectedEmp}
          onChange={(event: any, selectedValue: any) => {
            handleEmployeeSelect(selectedValue);
          }}
          renderInput={(params) => <TextField {...params} label="Employee" />}

        />
      )}
      {/* -------------- RadioButton for "Employee As" ------------------- */}
      {filterBy === FilterByOptions.Employee && empPosId !== -1 && (
        <FormControl
          className={classes["employee-as"]}
        >
          <FormLabel id="employee-turn-radio-buttons-group">Search for the employee as</FormLabel>
          <RadioGroup
            row
            aria-labelledby="employee-turn-radio-buttons-group"
            name="employeeAs"
            value={employeeAs}
            onChange={handleEmployeeAs}
          >
            <FormControlLabel
              value={EmployeeAs.Either}
              control={<Radio />}
              label="Sender or Consignee"
            />
            <FormControlLabel
              value={EmployeeAs.Sender}
              control={<Radio />}
              label="Sender"
            />
            <FormControlLabel
              value={EmployeeAs.Consignee}
              control={<Radio />}
              label="Consignee"
            />
          </RadioGroup>
        </FormControl>
      )}
      {/* -------------- "Date From/To" ------------------- */}
      {filterBy === FilterByOptions.Date && (
        <Fragment>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              maxDate={dateTo}
              label="From date"
              mask={'__-__-____'}
              // disableMaskedInput={true}
              inputFormat="dd-MM-yyyy"
              value={dateFrom}
              onChange={(newValue) => {
                console.log(newValue);
                handleDateFrom(newValue);
              }}
              renderInput={(params) => <TextField {...params} helperText={params?.inputProps?.placeholder} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="to date"
              minDate={dateFrom}  //minDate
              disableFuture      // maxDate is today
              mask={'__-__-____'}
              // disableMaskedInput={true}
              inputFormat="dd-MM-yyyy"
              value={dateTo}
              onChange={(newValue) => {
                handleDateTo(newValue);
              }}
              renderInput={(params) => <TextField {...params} helperText={params?.inputProps?.placeholder} />}
            />
          </LocalizationProvider>
        </Fragment>
      )}
      {/* -------------- "Search" Button ------------------- */}
      <Button
        className={classes["btns-search-and-reset"]}
        // disabled={filterBy === "" ? true : false}
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={() => handleSearchBtnClick()}
      >
        Search
      </Button>
      {/* -------------- "Reset" Button ------------------- */}
      <Button
        className={classes["btns-search-and-reset"]}
        disabled={filterBy === "" ? true : false}
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={() => {
          resetAll();
          handleResetBtnClick();
        }}
      >
        Reset
      </Button>
    </section>
  )
}

export default SearchArea