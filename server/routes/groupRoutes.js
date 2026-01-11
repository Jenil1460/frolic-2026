import express from 'express';
import {
  getGroupsByEvent,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/event/:eventId').get(getGroupsByEvent);
router.route('/').post(protect, createGroup);
router
  .route('/:id')
  .get(getGroupById)
  .put(protect, admin, updateGroup)
  .delete(protect, admin, deleteGroup);

export default router;
