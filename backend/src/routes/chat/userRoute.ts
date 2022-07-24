import { Router } from 'express';
const router = Router(); // Create Express Router
// ========= express-VALIDATORS: =================
import workflowValidator from '../../validators/workflowValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../../middlewares/tokenValidation';
import handleValidation from '../../middlewares/requestValidation';

// Import the needed controllers
import {
    getAllUsers, whoSawThisMessage
} from '../../controllers/chat/userController';


router.get("/", validateAccessToken, getAllUsers)
router.get("/seenBy", whoSawThisMessage);

export default router; //export the router