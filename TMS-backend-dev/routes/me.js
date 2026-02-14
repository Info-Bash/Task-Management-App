import express from 'express';
import meController from '../controllers/meController.js';
import authMiddleWare from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/me', authMiddleWare, meController);

export default router