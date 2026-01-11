import User from '../models/User.js';
import Institute from '../models/Institute.js';
import Department from '../models/Department.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all coordinators with pagination and filtering
// @route   GET /api/admin/coordinators
// @access  Admin
export const getCoordinators = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const q = req.query.q || '';

        // 1. Create an assignment map
        const institutes = await Institute.find({ coordinator: { $ne: null } }).populate('coordinator', '_id');
        const departments = await Department.find({ coordinator: { $ne: null } }).populate('coordinator', '_id');
        
        const assignmentMap = new Map();
        institutes.forEach(i => assignmentMap.set(i.coordinator._id.toString(), i.name));
        departments.forEach(d => assignmentMap.set(d.coordinator._id.toString(), d.name));

        // 2. Query for coordinators
        const query = {
            role: { $in: ['Institute Coordinator', 'Department Coordinator', 'Event Coordinator'] }
        };
        if (q) {
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
            ];
        }

        const total = await User.countDocuments(query);
        const coordinators = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // Use lean for better performance

        // 3. Add assignment to each coordinator
        const coordinatorsWithAssignment = coordinators.map(c => ({
            ...c,
            assignment: assignmentMap.get(c._id.toString()) || 'N/A'
        }));

        const data = {
            coordinators: coordinatorsWithAssignment,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };

        sendSuccess(res, data, 'Coordinators fetched successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Assign a coordinator to an institute or department
// @route   PATCH /api/admin/coordinators/:id/assign
// @access  Admin
export const assignCoordinator = async (req, res, next) => {
    try {
        const { assignmentType, assignmentId } = req.body;
        const coordinatorId = req.params.id;

        const coordinator = await User.findById(coordinatorId);
        if (!coordinator) {
            return sendError(res, 'Coordinator not found', 404);
        }

        // Before assigning, un-assign from any previous role
        await Institute.updateMany({ coordinator: coordinatorId }, { $unset: { coordinator: "" } });
        await Department.updateMany({ coordinator: coordinatorId }, { $unset: { coordinator: "" } });

        if (assignmentType === 'institute') {
            await Institute.findByIdAndUpdate(assignmentId, { coordinator: coordinatorId });
        } else if (assignmentType === 'department') {
            await Department.findByIdAndUpdate(assignmentId, { coordinator: coordinatorId });
        } else if (assignmentType === 'none') {
            // Just un-assign
        }
        else {
            return sendError(res, 'Invalid assignment type', 400);
        }

        sendSuccess(res, {}, 'Coordinator assignment updated successfully');
    } catch (error) {
        next(error);
    }
};
