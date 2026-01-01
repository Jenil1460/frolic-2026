import Institute from '../models/Institute.js';
import Department from '../models/Department.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import { sendSuccess } from '../utils/response.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Admin
export const getStats = async (req, res, next) => {
  try {
    const totalInstitutes = await Institute.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();

    // Efficiently calculate total participants using aggregation
    const participantData = await Group.aggregate([
        { $project: { participantsCount: { $size: "$participants" } } },
        { $group: { _id: null, totalParticipants: { $sum: "$participantsCount" } } }
    ]);
    const totalParticipants = participantData.length > 0 ? participantData[0].totalParticipants : 0;

    const totalPaymentsDone = await Group.countDocuments({ isPaymentDone: true });
    
    const eventsCompleted = await Event.countDocuments({ eventDate: { $lt: new Date() } });
    const upcomingEvents = await Event.countDocuments({ eventDate: { $gte: new Date() } });

    const stats = {
      totalInstitutes,
      totalDepartments,
      totalEvents,
      totalUsers,
      totalGroups,
      totalParticipants,
      totalPaymentsDone,
      eventsCompleted,
      upcomingEvents,
    };
    
    sendSuccess(res, stats, 'Dashboard statistics fetched successfully');

  } catch (error) {
    next(error);
  }
};
