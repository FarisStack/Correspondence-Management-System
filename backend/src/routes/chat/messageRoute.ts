import { Router } from 'express';
const router = Router(); // Create Express Router
// ========= express-VALIDATORS: =================
import workflowValidator from '../../validators/workflowValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../../middlewares/tokenValidation';
import handleValidation from '../../middlewares/requestValidation';

// Import the needed controllers
import {
    sendMessage,
    getAllMessages,
    setIsSeen,
    // whoSawThisMessage
} from '../../controllers/chat/messageController';


// For sending a message:
router.post("/", validateAccessToken, sendMessage);
router.get("/:chatId", validateAccessToken, getAllMessages);
router.patch("/setIsSeen", validateAccessToken, setIsSeen);

// For fetching all messages of a channel(chat):

export default router; //export the router