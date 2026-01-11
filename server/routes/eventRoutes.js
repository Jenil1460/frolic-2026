import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getEvents).post(protect, admin, upload.array('images', 5), createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, admin, upload.array('images', 5), updateEvent)
  .delete(protect, admin, deleteEvent);

// Event registration
import { registerForEvent, checkRegistrationStatus } from '../controllers/registrationController.js';
router.post('/:id/register', protect, registerForEvent);
router.get('/:id/registration-status', protect, checkRegistrationStatus);

export default router;
