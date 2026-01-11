import Winner from '../models/Winner.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get winners by event
// @route   GET /api/winners/event/:eventId
// @access  Public
export const getWinnersByEvent = async (req, res, next) => {
  try {
    const winners = await Winner.findOne({ event: req.params.eventId })
      .populate({
        path: 'first second third',
        populate: {
          path: 'groupLeader participants',
          select: 'fullName email'
        }
      });
    sendSuccess(res, winners, 'Winners for event fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Declare winners for an event
// @route   POST /api/winners
// @access  Admin
export const declareWinners = async (req, res, next) => {
  try {
    const { event, first, second, third } = req.body;

    const winner = new Winner({
      event,
      first,
      second,
      third,
    });

    const createdWinner = await winner.save();
    sendSuccess(res, createdWinner, 'Winners declared successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update winners for an event
// @route   PUT /api/winners/:id
// @access  Admin
export const updateWinners = async (req, res, next) => {
  try {
    const { first, second, third } = req.body;
    
    const winner = await Winner.findById(req.params.id);

    if (winner) {
      winner.first = first || winner.first;
      winner.second = second || winner.second;
      winner.third = third || winner.third;
      
      const updatedWinner = await winner.save();
      sendSuccess(res, updatedWinner, 'Winners updated successfully');
    } else {
      return sendError(res, 'Winner entry not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
