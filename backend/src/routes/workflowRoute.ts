import { Router } from 'express';
const router = Router(); // Create Express Router
// --------------- Validators --------------------------------
import workflowValidator from "../validators/workflowValidator";

// --------------- Middlewares --------------------------------
import { validateAccessToken } from '../middlewares/tokenValidation';
import handleValidation from '../middlewares/requestValidation';

// Import the needed controllers
// ----------- Workflow Controller -----------
import {
    createNewWorkflow,
    uploadNewWorkflowFiles,
    getToWhomCanISendNewWorkflow,
    getEmployeesListToSearchBy,
} from '../controllers/workflowController';

// ----------- Inbox Controller -----------
import {
    populateTable,
    toggleRecordPin,
    moveToOrFromArchive,
    searchBy
} from "../controllers/workflowTableController";

// ---- `Create New Workflow` ----:
router.post('/create', validateAccessToken, createNewWorkflow);
router.post('/create/uploadFiles', validateAccessToken, uploadNewWorkflowFiles);
router.get("/toWhomCanISendNewWorkflow", validateAccessToken, getToWhomCanISendNewWorkflow);

// ---- `View Workflow Table Page (Inbox, Follow-Up, CC)` ----:
router.get("/table", validateAccessToken, populateTable);
router.patch("/table/pinRecord", validateAccessToken, toggleRecordPin);
router.patch("/table/moveToOrFromArchive", validateAccessToken, moveToOrFromArchive);
router.get(
    "/searchBy",
    validateAccessToken, //2nd arg: middleware function to checkAccessToken
    workflowValidator.checkSearchBy(), //3rd arg: express-validator function
    handleValidation, //4th arg: handle errors received from express-validator function 
    searchBy
);
router.get("/getEmployeesListToSearchBy", validateAccessToken, getEmployeesListToSearchBy);
// router.get("/multiJoin", validateAccessToken, multiJoin);

export default router; //export the router