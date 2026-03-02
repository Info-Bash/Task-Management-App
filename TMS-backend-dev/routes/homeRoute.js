import express from 'express';
import homeController from '../controllers/home.js';
import authMiddleWare from '../middlewares/authMiddleware.js';
import checkSuspended from '../middlewares/suspendedMiddleware.js';
import { userProfileController, userProfileUpdateController } from '../controllers/userProfile.js';
import { createTask, getAllUserTasks, deleteTask, deleteMultipleTasks, markTaskCompleted, editTask } from '../controllers/taskControllers.js';

const router = express.Router();

// requires login only
router.use(authMiddleWare);

router.get('/home', homeController);
router.get('/profile/:id', userProfileController);

// requires login AND active account
router.use(checkSuspended);

router.put('/update-profile/:id', userProfileUpdateController);
router.post('/create-task', createTask);
router.get('/tasks', getAllUserTasks);
router.delete("/delete-task/:id", deleteTask);
router.delete("/delete-multiple-tasks", deleteMultipleTasks);
router.patch("/mark-completed/:id", markTaskCompleted);
router.patch("/edit-task/:id", editTask);

export default router