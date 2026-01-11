import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  updateUserVerification,
  deleteUser,
  exportUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Updated routes to match API calls
router.route('/').get(protect, admin, getUsers);
router.route('/export').get(protect, admin, exportUsers);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);
router.route('/:id/role').patch(protect, admin, updateUserRole);
router.route('/:id/status').patch(protect, admin, updateUserStatus);
router.route('/:id/verify').patch(protect, admin, updateUserVerification);
router.route('/:id/verification').patch(protect, admin, updateUserVerification);

export default router;
