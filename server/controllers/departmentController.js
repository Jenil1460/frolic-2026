import Department from '../models/Department.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('institute', 'name')
      .populate('coordinator', 'fullName email');
    sendSuccess(res, departments, 'Departments fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get departments by institute
// @route   GET /api/departments/institute/:instituteId
// @access  Public
export const getDepartmentsByInstitute = async (req, res, next) => {
    try {
      const departments = await Department.find({ institute: req.params.instituteId })
        .populate('institute', 'name')
        .populate('coordinator', 'fullName email');
      sendSuccess(res, departments, 'Departments for institute fetched successfully');
    } catch (error) {
      next(error);
    }
  };

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('institute', 'name')
      .populate('coordinator', 'fullName email');
    if (department) {
      sendSuccess(res, department, 'Department fetched successfully');
    } else {
      return sendError(res, 'Department not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Admin
export const createDepartment = async (req, res, next) => {
  try {
    const { name, description, institute, coordinator } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
        return sendError(res, 'Image is required', 400);
    }

    const department = new Department({
      name,
      description,
      institute,
      image,
      coordinator,
    });

    const createdDepartment = await department.save();
    sendSuccess(res, createdDepartment, 'Department created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Admin
export const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, institute, coordinator } = req.body;
    
    const department = await Department.findById(req.params.id);

    if (department) {
      department.name = name || department.name;
      department.description = description || department.description;
      department.institute = institute || department.institute;
      department.coordinator = coordinator || department.coordinator;
      
      if(req.file){
        department.image = req.file.path;
      }

      const updatedDepartment = await department.save();
      sendSuccess(res, updatedDepartment, 'Department updated successfully');
    } else {
      return sendError(res, 'Department not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Admin
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      await department.deleteOne();
      sendSuccess(res, null, 'Department removed successfully');
    } else {
      return sendError(res, 'Department not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
