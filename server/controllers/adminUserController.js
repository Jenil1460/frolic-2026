import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import ExcelJS from 'exceljs';
import { sendSuccess, sendError } from '../utils/response.js';

const buildFilter = (query) => {
  const filter = {};

  if (query.q) {
    const regex = new RegExp(query.q.trim(), 'i');
    filter.$or = [ { fullName: regex }, { email: regex } ];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.isVerified !== undefined) {
    filter.isVerified = query.isVerified === 'true';
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  return filter;
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = buildFilter(req.query);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, { users, page: parseInt(page), totalPages, total }, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) return sendError(res, 'Role is required', 400);

    const user = await User.findById(id);
    if (!user) return sendError(res, 'User not found', 404);

    const old = user.role;
    user.role = role;
    await user.save();

    await ActivityLog.create({
      admin: req.user._id,
      action: 'update_role',
      target: 'User',
      targetId: user._id,
      details: { oldRole: old, newRole: role }
    });

    sendSuccess(res, { _id: user._id, role: user.role }, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) return sendError(res, 'isActive is required', 400);

    const user = await User.findById(id);
    if (!user) return sendError(res, 'User not found', 404);

    const old = user.isActive;
    user.isActive = isActive;
    await user.save();

    await ActivityLog.create({
      admin: req.user._id,
      action: 'update_status',
      target: 'User',
      targetId: user._id,
      details: { oldStatus: old, newStatus: isActive }
    });

    sendSuccess(res, { _id: user._id, isActive: user.isActive }, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/verify
export const updateUserVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (isVerified === undefined) return sendError(res, 'isVerified is required', 400);

    const user = await User.findById(id);
    if (!user) return sendError(res, 'User not found', 404);

    const old = user.isVerified;
    user.isVerified = isVerified;
    await user.save();

    await ActivityLog.create({
      admin: req.user._id,
      action: 'update_verification',
      target: 'User',
      targetId: user._id,
      details: { oldStatus: old, newStatus: isVerified }
    });

    sendSuccess(res, { _id: user._id, isVerified: user.isVerified }, 'User verification updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return sendError(res, 'User not found', 404);

    await user.deleteOne();

    await ActivityLog.create({
      admin: req.user._id,
      action: 'delete_user',
      target: 'User',
      targetId: user._id,
      details: { email: user.email, name: user.fullName }
    });

    sendSuccess(res, {}, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/export
export const exportUsers = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const users = await User.find(filter).select('-password').sort('-createdAt');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Verified', key: 'isVerified', width: 12 },
      { header: 'Active', key: 'isActive', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 24 }
    ];

    users.forEach(u => {
      sheet.addRow({
        name: u.fullName,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified ? 'Yes' : 'No',
        isActive: u.isActive ? 'Active' : 'Blocked',
        createdAt: u.createdAt.toISOString()
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
