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
  image: { type: String },
  images: { type: [String], default: [] },
  isPublished: { type: Boolean, default: false },
  eventDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
}, { timestamps: true });

// Ensure image field mirrors first image in images array for backward compatibility
eventSchema.pre('save', function (next) {
  if ((!this.image || this.image === '') && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
