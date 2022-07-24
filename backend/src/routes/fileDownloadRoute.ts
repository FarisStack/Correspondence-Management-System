import { Request, Response, NextFunction, Router } from 'express';
const router = Router(); // Create Express Router
import path from "path";
// ========= express-VALIDATORS: =================
import workflowValidator from '../validators/workflowValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../middlewares/tokenValidation';
import handleValidation from '../middlewares/requestValidation';

router.get("/", validateAccessToken, (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.query; // for ex: 22_25_1649887379401.jpg
        res.download(`public/actions_attachments/${fileName}`);
    }
    catch (error) {
        next(error);
    }
});


export default router; //export the router