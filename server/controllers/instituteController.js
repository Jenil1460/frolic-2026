import Institute from '../models/Institute.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all institutes
// @route   GET /api/institutes
// @access  Public
export const getInstitutes = async (req, res, next) => {
  try {
    const institutes = await Institute.find().populate('coordinator', 'fullName email');
    sendSuccess(res, institutes, 'Institutes fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get institute by ID
// @route   GET /api/institutes/:id
// @access  Public
export const getInstituteById = async (req, res, next) => {
  try {
    const institute = await Institute.findById(req.params.id).populate('coordinator', 'fullName email');
    if (institute) {
      sendSuccess(res, institute, 'Institute fetched successfully');
    } else {
      return sendError(res, 'Institute not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create an institute
// @route   POST /api/institutes
// @access  Admin
export const createInstitute = async (req, res, next) => {
  try {
    const { name, description, coordinator } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
        return sendError(res, 'Image is required', 400);
    }

    const institute = new Institute({
      name,
      description,
      image,
      coordinator,
    });

    const createdInstitute = await institute.save();
    sendSuccess(res, createdInstitute, 'Institute created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an institute
// @route   PUT /api/institutes/:id
// @access  Admin
export const updateInstitute = async (req, res, next) => {
  try {
    const { name, description, coordinator } = req.body;
    
    const institute = await Institute.findById(req.params.id);

    if (institute) {
      institute.name = name || institute.name;
      institute.description = description || institute.description;
      institute.coordinator = coordinator || institute.coordinator;
      
      if(req.file){
        institute.image = req.file.path;
      }

      const updatedInstitute = await institute.save();
      sendSuccess(res, updatedInstitute, 'Institute updated successfully');
    } else {
      return sendError(res, 'Institute not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an institute
// @route   DELETE /api/institutes/:id
// @access  Admin
export const deleteInstitute = async (req, res, next) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (institute) {
      await institute.deleteOne();
      sendSuccess(res, null, 'Institute removed successfully');
    } else {
      return sendError(res, 'Institute not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
