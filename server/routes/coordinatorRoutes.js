import express from 'express';
import { getCoordinators, assignCoordinator } from '../controllers/coordinatorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getCoordinators);
router.route('/:id/assign').patch(protect, admin, assignCoordinator);

export default router;
