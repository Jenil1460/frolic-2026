import express from 'express';
import { demoUPIPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/demo-upi', protect, demoUPIPayment);

export default router;
