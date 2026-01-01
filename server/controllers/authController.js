import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists with this email', 400);
    }

    // Validate role - only Student or Coordinator roles allowed during registration
    const allowedRoles = ['Student', 'Event Coordinator', 'Department Coordinator', 'Institute Coordinator'];
    let userRole = 'Student'; // Default role
    
    if (role && allowedRoles.includes(role)) {
      userRole = role;
    } else if (role === 'Admin') {
      return sendError(res, 'Cannot register as Admin. Contact system administrator.', 403);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
    };

    const user = await User.create(userData);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    const data = {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };

    sendSuccess(res, data, 'Registered Successfully', 201);

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 400);
    }
    
    if (!user.isActive) {
      return sendError(res, 'Your account is deactivated. Please contact admin.', 403);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    const data = {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
    
    sendSuccess(res, data, 'Login successful');

  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      
      const updatedUser = await user.save();
      
      const data = {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone
      };

      sendSuccess(res, data, 'Profile updated successfully');

    } else {
      return sendError(res, 'User not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
