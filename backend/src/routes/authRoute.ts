import { Router } from 'express';
const router = Router(); // Create Express Router
import { Request, Response } from 'express';
// =========== CONTROLLERS =====================
import {
    loginUser,
    logoutUser,
    activateAccount,
    forgotPassword,
    forgotPasswordFaris,
    verifyResetPassword,
    resetPassword,
    verifyCodeToResetForgottenPassword
}
    from '../controllers/authController';
// ========= express-VALIDATORS: =================
import authValidator from '../validators/authValidator';
// ============ Middlewares: ========================
import handleValidation from '../middlewares/requestValidation';
import {
    validateAccessToken,
    validateAccountActivationToken
} from '../middlewares/tokenValidation';
// =============== Our Database Connection Object: =============
import db from '../models/index';

router.get("/verifyToken", validateAccessToken, async (req, res) => {
    // Get info regarding whether the user is authenticated or not
    // The program reaches here only if the middleware function allowed the request to pass to 
    // this point by calling the next() function:
    // console.log("req.user: " + JSON.stringify(req.user, undefined, 4)); // req.user is contains the decoded jwt payload received from the middleware function `validateAccessToken`
    return res.json({
        user: req.user, // req.user is an object contains the decoded payload from jwt
        tokenVerified: true,
        statusCode: 200,
    });
});
router.post(
    '/login',
    authValidator.checkLoginUser(), //2nd arg: express-validator function
    handleValidation, //3rd arg: handle errors received from express-validator function 
    loginUser
);
router.post('/verification', verifyCodeToResetForgottenPassword);
router.post('/forgot-password', forgotPassword);
// ----------- Faris Forgot Password ------------------
router.post('/forgot-password-faris', forgotPasswordFaris);
router.put('/reset-password', resetPassword);
router.post('/verify-reset-password', verifyResetPassword);


router.delete('/logout', logoutUser);

router.patch(
    '/activate',
    validateAccountActivationToken, //middleware function
    activateAccount //controller function
)


export default router; //export the router