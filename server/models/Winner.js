import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
  first: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  second: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  third: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
}, { timestamps: true });

const Winner = mongoose.model('Winner', winnerSchema);

export default Winner;
