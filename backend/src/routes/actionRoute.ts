import { Router } from 'express';
const router = Router(); // Create Express Router
// ========= express-VALIDATORS: =================
import workflowValidator from '../validators/workflowValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../middlewares/tokenValidation';
import handleValidation from '../middlewares/requestValidation';

// Import the needed controllers
import {
    getActionsByWorkflowId,
    getToWhomCanIRespondWithNewAction,
    createNewAction,
    uploadNewActionFiles
} from '../controllers/workflowController';


// ---- `Actions for a Specific Workflow` ----
router.get("/getActionsByWorkflowId", validateAccessToken, getActionsByWorkflowId);
router.get("/toWhomCanIRespondWithNewAction", validateAccessToken, getToWhomCanIRespondWithNewAction);
// ---- `Create New Action to an existing Workflow` ----:
router.post(
    '/create',
    validateAccessToken, //2nd arg: terminate the request if user is not logged in
    workflowValidator.checkCreateAction(), //3rd arg: express-validator function
    handleValidation, //4th arg: handle errors received from express-validator function 
    createNewAction
);
router.post('/create/uploadFiles', validateAccessToken, uploadNewActionFiles);


export default router; //export the router