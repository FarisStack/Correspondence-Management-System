import { Router } from 'express';
const router = Router(); // Create Express Router
import { validateAccessToken } from '../middlewares/tokenValidation';


router.get(
    '/',
    validateAccessToken,
    (req, res) => {
        res.json({
            msg: 'Welcome to profile',
            user: req.user,
            // authenticated: req.authenticated
        });
    });

export default router; //export the router