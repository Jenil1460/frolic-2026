import express from 'express';
import {
  getDepartments,
  getDepartmentsByInstitute,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getDepartments).post(protect, admin, upload.single('image'), createDepartment);
router.route('/institute/:instituteId').get(getDepartmentsByInstitute);
router
  .route('/:id')
  .get(getDepartmentById)
  .put(protect, admin, upload.single('image'), updateDepartment)
  .delete(protect, admin, deleteDepartment);

export default router;
