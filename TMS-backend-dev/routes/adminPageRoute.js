import express from 'express';
import authMiddleWare from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import checkSuspended from '../middlewares/suspendedMiddleware.js';
import { userProfileController, userProfileUpdateController } from '../controllers/userProfile.js';
import { getUsers, getAllTasksAdmin, toggleUserStatus, updateUserRole, deleteUser } from '../controllers/adminControllers.js';
import { markTaskVerified, adminDeleteTask } from '../controllers/taskControllers.js';

const router = express.Router();

// requires login only
router.use(authMiddleWare);
// requires login AND admin role
router.use(adminMiddleware);

router.get('/profile/:id', userProfileController);

// requires login, admin role AND active account
router.use(checkSuspended);

router.put('/update-profile/:id', userProfileUpdateController);
router.get('/users', getUsers);
router.get("/tasks", getAllTasksAdmin);
router.patch("/toggle-user/:userId", toggleUserStatus);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/delete/:userId", deleteUser);

// admin task management routes
router.patch("/task/:taskId/verify", markTaskVerified);
router.delete("/task/:taskId", adminDeleteTask);

export default router