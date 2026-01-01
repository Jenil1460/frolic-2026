import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { sendSuccess } from '../utils/response.js';

// GET /api/admin/activity-logs
export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ action: regex }, { 'details.name': regex }, { 'details.email': regex }];
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('admin', 'fullName email')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, { logs, page: parseInt(page), totalPages, total }, 'Activity logs fetched');
  } catch (error) {
    next(error);
  }
};
