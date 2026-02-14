import express from 'express';
import homeController from '../controllers/home.js';
import authMiddleWare from '../middlewares/authMiddleware.js';
import { userProfileController, userProfileUpdateController } from '../controllers/userProfile.js';
import { createTask, getAllUserTasks, deleteTask, deleteMultipleTasks, markTaskCompleted, editTask } from '../controllers/taskControllers.js';

const router = express.Router();


router.get('/home', authMiddleWare, homeController);
router.get('/profile/:id', authMiddleWare, userProfileController);
router.put('/update-profile/:id', authMiddleWare, userProfileUpdateController);
router.post('/create-task', authMiddleWare, createTask);
router.get('/user-tasks', authMiddleWare, getAllUserTasks);
router.delete("/delete-task/:id", authMiddleWare, deleteTask);
router.delete("/delete-multiple-tasks", authMiddleWare, deleteMultipleTasks);
router.patch("/mark-completed/:id", authMiddleWare, markTaskCompleted);
router.patch("/edit-task/:id", authMiddleWare, editTask);



export default router