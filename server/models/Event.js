import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  fees: { type: Number, default: 0 },
  minParticipants: { type: Number, default: 1 },
  maxParticipants: { type: Number, default: 1 },
  maxGroups: { type: Number, default: 1 },
  location: { type: String, trim: true },
  prizes: {
    first: { type: String, default: '' },
    second: { type: String, default: '' },
    third: { type: String, default: '' },
  },
  images: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  eventDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
