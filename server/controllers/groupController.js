import Group from '../models/Group.js';
import Event from '../models/Event.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all groups for an event
// @route   GET /api/groups/event/:eventId
// @access  Public
export const getGroupsByEvent = async (req, res, next) => {
  try {
    const groups = await Group.find({ event: req.params.eventId })
      .populate('groupLeader', 'fullName email')
      .populate('participants', 'fullName email');
    sendSuccess(res, groups, 'Groups for event fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Public
export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('groupLeader', 'fullName email')
      .populate('participants', 'fullName email');
    if (group) {
      sendSuccess(res, group, 'Group fetched successfully');
    } else {
      return sendError(res, 'Group not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a group
// @route   POST /api/groups
// @access  Authenticated user
export const createGroup = async (req, res, next) => {
  try {
    const { name, event: eventId, participants } = req.body;
    const groupLeader = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
        return sendError(res, 'Event not found', 404);
    }

    if (participants.length < event.minParticipants || participants.length > event.maxParticipants) {
        return sendError(res, `Number of participants must be between ${event.minParticipants} and ${event.maxParticipants}`, 400);
    }

    const group = new Group({
      name,
      event: eventId,
      groupLeader,
      participants,
    });

    const createdGroup = await group.save();
    sendSuccess(res, createdGroup, 'Group created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a group (payment, attendance)
// @route   PUT /api/groups/:id
// @access  Admin
export const updateGroup = async (req, res, next) => {
  try {
    const { isPaymentDone, isPresent } = req.body;
    
    const group = await Group.findById(req.params.id);

    if (group) {
      if (isPaymentDone !== undefined) {
        group.isPaymentDone = isPaymentDone;
      }
      if (isPresent !== undefined) {
        group.isPresent = isPresent;
      }
      
      const updatedGroup = await group.save();
      sendSuccess(res, updatedGroup, 'Group updated successfully');
    } else {
      return sendError(res, 'Group not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Admin
export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      await group.deleteOne();
      sendSuccess(res, null, 'Group removed successfully');
    } else {
      return sendError(res, 'Group not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
