import Event from '../models/Event.js';
import Group from '../models/Group.js';
import Institute from '../models/Institute.js';
import Department from '../models/Department.js';
import Winner from '../models/Winner.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Event-wise report
// @route   GET /api/reports/event/:eventId
// @access  Admin
export const getEventReport = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if(!event) return sendError(res, 'Event not found', 404);

        const groups = await Group.find({ event: eventId });
        const groupsCount = groups.length;
        const participantsCount = groups.reduce((acc, group) => acc + group.participants.length, 0);
        const paymentsCollected = await Group.countDocuments({ event: eventId, isPaymentDone: true }) * event.fees;

        const report = {
            event: event.name,
            groupsCount,
            participantsCount,
            paymentsCollected,
        };

        sendSuccess(res, report, 'Event report generated successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Institute-wise summary
// @route   GET /api/reports/institute/:instituteId
// @access  Admin
export const getInstituteReport = async (req, res, next) => {
    try {
        const instituteId = req.params.instituteId;
        const institute = await Institute.findById(instituteId);
        if(!institute) return sendError(res, 'Institute not found', 404);

        const events = await Event.find({ institute: instituteId });
        const eventIds = events.map(e => e._id);

        const groups = await Group.find({ event: { $in: eventIds } });
        const groupsCount = groups.length;
        const participantsCount = groups.reduce((acc, group) => acc + group.participants.length, 0);

        const report = {
            institute: institute.name,
            eventsCount: events.length,
            groupsCount,
            participantsCount,
        };

        sendSuccess(res, report, 'Institute summary generated successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Department-wise event participation
// @route   GET /api/reports/department/:departmentId
// @access  Admin
export const getDepartmentReport = async (req, res, next) => {
    try {
        const departmentId = req.params.departmentId;
        const department = await Department.findById(departmentId);
        if(!department) return sendError(res, 'Department not found', 404);

        const events = await Event.find({ department: departmentId });
        const eventIds = events.map(e => e._id);

        const groups = await Group.find({ event: { $in: eventIds } });
        const groupsCount = groups.length;
        const participantsCount = groups.reduce((acc, group) => acc + group.participants.length, 0);

        const report = {
            department: department.name,
            eventsCount: events.length,
            groupsCount,
            participantsCount,
        };
        
        sendSuccess(res, report, 'Department participation report generated successfully');

    } catch (error) {
        next(error);
    }
};

// @desc    Winner summary
// @route   GET /api/reports/winners
// @access  Admin
export const getWinnerReport = async (req, res, next) => {
    try {
        const winners = await Winner.find()
            .populate('event', 'name')
            .populate({
                path: 'first second third',
                select: 'name'
            });

        sendSuccess(res, winners, 'Winner summary generated successfully');

    } catch (error) {
        next(error);
    }
};
