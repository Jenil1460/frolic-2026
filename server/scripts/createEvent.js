import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const event = await Event.create({
      name: 'Future Demo Event',
      description: 'Event for testing payment',
      fees: 10,
      minParticipants: 1,
      maxParticipants: 10,
      maxGroups: 1,
      location: 'Demo Hall',
      images: [],
      isPublished: true,
      eventDate: new Date('2026-12-15'),
      registrationEndDate: new Date('2026-12-10')
    });
    console.log('Created event', event._id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();