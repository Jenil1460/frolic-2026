import express from 'express';
import {
  getWinnersByEvent,
  declareWinners,
  updateWinners,
} from '../controllers/winnerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/event/:eventId').get(getWinnersByEvent);
router.route('/').post(protect, admin, declareWinners);
router.route('/:id').put(protect, admin, updateWinners);

export default router;
