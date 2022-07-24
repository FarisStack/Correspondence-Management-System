import { Router } from 'express';

const router = Router(); // Create Express Router
// --------------- Middlewares --------------------------------
import { validateAccessToken } from '../middlewares/tokenValidation';

// =========== CONTROLLERS =====================

import { getPositions, addPositions } from '../controllers/positionController';

router.get("/", getPositions);
router.post("/", addPositions);
// router.post("add", getPositions);
router.get("/", validateAccessToken, getPositions);
router.post("/", validateAccessToken, addPositions);

export default router; //export the router


