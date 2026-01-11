import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  groupLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPaymentDone: { type: Boolean, default: false },
  isPresent: { type: Boolean, default: false },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;
