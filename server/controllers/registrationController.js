import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const registerForEvent = async (req, res, next) => {
  try {
    const user = req.user; // protect middleware sets req.user
    const eventId = req.params.id;

    if (!user) return sendError(res, 'Authentication required', 401);
    if (user.role !== 'Student') return sendError(res, 'Only students can register for events', 403);

    const event = await Event.findById(eventId);
    if (!event) return sendError(res, 'Event not found', 404);

    // Check registration end date
    if (event.registrationEndDate && new Date() > new Date(event.registrationEndDate)) {
      return sendError(res, 'Registration period has ended', 400);
    }

    // Prevent duplicate registration
    const existing = await Registration.findOne({ eventId, userId: user._id });
    if (existing) return sendError(res, 'Already registered for this event', 400);

    const registration = await Registration.create({ eventId, userId: user._id });

    sendSuccess(res, { registrationId: registration._id }, 'Registered (pending payment)', 201);
  } catch (error) {
    next(error);
  }
};

export const checkRegistrationStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const eventId = req.params.id;

    if (!user) return sendError(res, 'Authentication required', 401);
    const existing = await Registration.findOne({ eventId, userId: user._id });
    sendSuccess(res, { registered: !!existing, registrationId: existing?._id || null, paymentStatus: existing?.paymentStatus || null }, 'Registration status fetched');
  } catch (error) {
    next(error);
  }
};

export const listMyRegistrations = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'Authentication required', 401);

    const regs = await Registration.find({ userId: user._id }).populate('eventId');
    sendSuccess(res, regs.map(r => ({
      id: r._id,
      event: r.eventId,
      paymentStatus: r.paymentStatus,
      status: r.status,
      createdAt: r.createdAt,
      transactionId: r.transactionId
    })), 'User registrations fetched');
  } catch (error) {
    next(error);
  }
};
