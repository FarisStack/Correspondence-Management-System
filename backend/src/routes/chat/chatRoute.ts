import { Router } from 'express';
const router = Router(); // Create Express Router
import { Request, Response } from 'express';
// =========== CONTROLLERS =====================
import {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
    setNewAdmin
}
    from '../../controllers/chat/chatController';
// ========= express-VALIDATORS: =================
import chatValidator from '../../validators/chatValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../../middlewares/tokenValidation';
import handleValidation from '../../middlewares/requestValidation';
import { validateAccountActivationToken } from '../../middlewares/tokenValidation';

router.post(
    "/",
    chatValidator.checkAccessGroup(), // middleware function to validate request
    handleValidation, // middleware to terminate the request if it is not valid
    validateAccessToken, // middleware function to ensure the user is logged in
    accessChat // the controller function which is supposed to return the response
);
// 2. Fetching all the chats for this particular user: 👇
router.get("/", validateAccessToken, fetchChats);
// 3. Creating new Group Chat (Group Channel): 👇
router.post(
    "/group",
    chatValidator.checkCreateGroup(), // middleware function to validate request
    handleValidation, // middleware to terminate the request if it is not valid
    validateAccessToken, // middleware function to ensure the user is logged in
    createGroupChat // the controller function which is supposed to return the response
);
router.put("/rename", validateAccessToken, renameGroup);
router.put("/groupremove", validateAccessToken, removeFromGroup);
router.put("/groupadd", validateAccessToken, addToGroup);
router.put("/setNewAdmin", validateAccessToken, setNewAdmin);

export default router; //export the router