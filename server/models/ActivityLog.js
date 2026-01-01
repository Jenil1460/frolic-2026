import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object },
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);
