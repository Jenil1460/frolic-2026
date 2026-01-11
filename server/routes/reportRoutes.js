import express from 'express';
import {
  getEventReport,
  getInstituteReport,
  getDepartmentReport,
  getWinnerReport,
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/event/:eventId').get(protect, admin, getEventReport);
router.route('/institute/:instituteId').get(protect, admin, getInstituteReport);
router.route('/department/:departmentId').get(protect, admin, getDepartmentReport);
router.route('/winners').get(protect, admin, getWinnerReport);

export default router;
