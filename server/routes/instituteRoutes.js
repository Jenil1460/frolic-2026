import express from 'express';
import {
  getInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
  deleteInstitute,
} from '../controllers/instituteController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getInstitutes).post(protect, admin, upload.single('image'), createInstitute);
router
  .route('/:id')
  .get(getInstituteById)
  .put(protect, admin, upload.single('image'), updateInstitute)
  .delete(protect, admin, deleteInstitute);

export default router;
