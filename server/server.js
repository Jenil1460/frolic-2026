import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";

import instituteRoutes from "./routes/instituteRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from './config/db.js';
import reportRoutes from "./routes/reportRoutes.js";
import coordinatorRoutes from './routes/coordinatorRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

// Connect to MongoDB
connectDB();

// Global error handlers to log uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const app = express();

// CORS configuration
// If CLIENT_URL is set, only allow that origin. Otherwise allow any origin (useful when frontend is served from same host).
const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (no origin) and same-origin requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/coordinators", coordinatorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/payments', paymentRoutes);

// Serve frontend in production or provide a root health check
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const clientIndex = path.join(clientBuildPath, 'index.html');

if (process.env.NODE_ENV === 'production' && fs.existsSync(clientIndex)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(clientIndex);
  });
} else {
  if (process.env.NODE_ENV === 'production' && !fs.existsSync(clientIndex)) {
    console.warn(`Client build not found at ${clientIndex} — static serving disabled. Build client with 'cd client && npm run build' and redeploy.`);
  }

  // Simple health check for environments where frontend is served separately
  app.get('/', (req, res) => res.send('API is running'));
}

// Diagnostic ping endpoint
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

// Not found middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
