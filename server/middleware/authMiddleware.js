import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Not authorized, no token", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return sendError(res, "User not found", 401);
    }

    next();
  } catch (error) {
    sendError(res, "Not authorized, token failed", 401);
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    sendError(res, "Not authorized as an admin", 403);
  }
};

export const coordinator = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role.includes('Coordinator'))) {
    next();
  } else {
    sendError(res, "Not authorized as a coordinator", 403);
  }
};