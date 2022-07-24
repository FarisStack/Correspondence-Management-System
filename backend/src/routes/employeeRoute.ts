import { Router } from 'express';
const router = Router(); // Create Express Router
import { Request, Response } from 'express';
// =========== CONTROLLERS =====================
import {
    checkUsernameExists,
    fetchPositions,
    addEmployee,
    updateLastLoginPositionId,
    getUserAvatar,
    getEmployeeRecord
}
    from '../controllers/employeeController';

import {
    informationOfEmployee, 
    updateEmployeeInfo, 
    updateEmployeePositionsTable,
    getEmployeePositions,
    getAllEmployees, 
    updateImageOfEmployee, 
    changePassword
} 
from '../controllers/updateEmployeeController';

// ========= express-VALIDATORS: =================
import employeeValidator from '../validators/employeeValidator';
// ============ Middlewares: ========================
import { validateAccessToken } from '../middlewares/tokenValidation';
import handleValidation from '../middlewares/requestValidation';
import { validateAccountActivationToken } from '../middlewares/tokenValidation';



router.post("/checkUsernameExists", validateAccessToken, checkUsernameExists);
router.get("/positions", validateAccessToken, fetchPositions);
router.post(
    '/add', // add new employee by the admin page
    validateAccessToken, // 2nd arg: validateAccessToken middleware function
    employeeValidator.checkAddUser(), //3rd arg: express-validator function
    handleValidation, //4th arg: handle errors received from express-validator function 
    addEmployee // 5th arg: controller function
);
router.put(
    "/updateLastLoginPositionId",
    validateAccessToken, // 2nd arg: validateAccessToken middleware function
    employeeValidator.checkEmployeeCurrentPositionId(), //3rd arg: express-validator function
    handleValidation, //4th arg: handle errors received from express-validator function 
    updateLastLoginPositionId // 5th arg: controller function
);
router.get(
    "/avatar",
    validateAccessToken, // 2nd arg: validateAccessToken middleware function
    getUserAvatar // 3rd arg: controller function
);
router.get(
    "/",
    validateAccessToken, // 2nd arg: validateAccessToken middleware function
    getEmployeeRecord
)

// ------ Hamadneh Update Employee --------------
router.get("/initializeUpdateForm", validateAccessToken, informationOfEmployee);
router.put("/update", validateAccessToken, updateEmployeeInfo);
router.put("/updateEmployeePositions", validateAccessToken, updateEmployeePositionsTable);

router.get("/all", validateAccessToken, getAllEmployees);
router.put("/updateEmployeeAvatar", validateAccessToken, updateImageOfEmployee);
router.get("/employeePositions/:employeeId", validateAccessToken, getEmployeePositions);
router.put("/change-password", validateAccessToken, changePassword);

export default router; //export the router