import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  updateUserVerification,
  deleteUser,
  exportUsers
} from '../controllers/adminUserController.js';

import { getActivityLogs } from '../controllers/activityLogController.js';

const router = express.Router();

router.use(protect, admin);

router.get('/users', getUsers);
router.get('/users/export', exportUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/verify', updateUserVerification);
router.delete('/users/:id', deleteUser);

router.get('/activity-logs', getActivityLogs);

export default router;
