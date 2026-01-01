import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import ExcelJS from 'exceljs';

// @desc    Get all users with pagination, search, and filtering
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const q = req.query.q || '';
    const role = req.query.role || '';

    const query = {};
    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit);

    const data = {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    sendSuccess(res, data, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Export users to Excel
// @route   GET /api/admin/users/export
// @access  Admin
export const exportUsers = async (req, res, next) => {
    try {
        const { q, role } = req.query;

        const query = {};
        if (q) {
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
            ];
        }
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select('-password');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header: 'Full Name', key: 'fullName', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Role', key: 'role', width: 20 },
            { header: 'Verified', key: 'isVerified', width: 15 },
            { header: 'Status', key: 'isActive', width: 15 },
            { header: 'Registered At', key: 'createdAt', width: 20 },
        ];

        users.forEach(user => {
            worksheet.addRow({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified ? 'Yes' : 'No',
                isActive: user.isActive ? 'Active' : 'Blocked',
                createdAt: user.createdAt.toDateString(),
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'users.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      sendSuccess(res, user, 'User fetched successfully');
    } else {
      return sendError(res, 'User not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (isActive)
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user verification status (isVerified)
// @route   PATCH /api/admin/users/:id/verify
// @access  Admin
export const updateUserVerification = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user, 'User verification status updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, {}, 'User removed successfully');
  } catch (error) {
    next(error);
  }
};
