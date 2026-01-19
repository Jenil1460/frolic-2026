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

// Event registration
import { registerForEvent, checkRegistrationStatus, listMyRegistrations } from '../controllers/registrationController.js';
router.get('/my-events', protect, listMyRegistrations);
router.post('/:id/register', protect, registerForEvent);
router.get('/:id/registration-status', protect, checkRegistrationStatus);

router
  .route('/:id')
  .get(getEventById)
  .put(protect, admin, upload.array('images', 5), updateEvent)
  .delete(protect, admin, deleteEvent);

export default router;
