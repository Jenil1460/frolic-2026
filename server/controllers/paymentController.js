import Registration from '../models/Registration.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendRegistrationEmail } from '../utils/mailer.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// POST /api/payments/demo-upi
export const demoUPIPayment = async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) return sendError(res, 'registrationId is required', 400);

    const registration = await Registration.findById(registrationId);
    if (!registration) return sendError(res, 'Registration not found', 404);

    if (registration.paymentStatus === 'PAID') return sendError(res, 'Already paid', 400);

    // Simulate processing
    const transactionId = `TXN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

    registration.transactionId = transactionId;
    registration.paymentStatus = 'PAID';
    registration.status = 'CONFIRMED';

    await registration.save();

    // Send email to user
    const user = await User.findById(registration.userId);
    const event = await Event.findById(registration.eventId);

    if (user && event) {
      await sendRegistrationEmail({
        to: user.email,
        studentName: user.fullName,
        eventName: event.name,
        transactionId,
        registrationStatus: registration.status
      });
    }

    sendSuccess(res, { transactionId, registrationId: registration._id }, 'Payment successful');
  } catch (error) {
    next(error);
  }
};
