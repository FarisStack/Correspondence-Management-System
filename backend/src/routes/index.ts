import express from 'express';
const router = express.Router(); // Create Express Router

// Import all used routes 

import authRoute from './authRoute';
import profileRoute from './profileRoute';
import employeeRoute from './employeeRoute';
import workflowRoute from './workflowRoute';
import actionRoute from './actionRoute';
import fileDownloadRoute from './fileDownloadRoute';
import positionRoute from "./positionRoute";
import chatRoute from './chat/chatRoute';
import userRoute from './chat/userRoute';
import messageRoute from './chat/messageRoute';

// Import the needed controllers
import { indexWelcome } from '../controllers/indexController';

router.get('/', indexWelcome);


router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/employee', employeeRoute);
router.use('/workflow', workflowRoute);
router.use('/action', actionRoute);
router.use('/downloadFile', fileDownloadRoute);
router.use('/positions', positionRoute);
router.use('/chat', chatRoute);
router.use('/chat-user', userRoute);
router.use('/message', messageRoute);

export default router; //export the router