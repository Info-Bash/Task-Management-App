import express from 'express';
import regisController from '../controllers/registration.js';
import loginController from '../controllers/login.js';

const router = express.Router();

// Routes for user registration and login 
router.post('/registration', regisController);
router.post('/login', loginController);

export default router;