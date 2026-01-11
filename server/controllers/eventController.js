import Event from '../models/Event.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    sendSuccess(res, events, 'Events fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      sendSuccess(res, event, 'Event fetched successfully');
    } else {
      return sendError(res, 'Event not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      name,
      description,
      fees,
      minParticipants,
      maxParticipants,
      maxGroups,
      location,
      isPublished,
      eventDate,
      registrationEndDate,
    } = req.body;

    // Handle prizes object
    const prizes = {
      first: req.body['prizes[first]'] || '',
      second: req.body['prizes[second]'] || '',
      third: req.body['prizes[third]'] || '',
    };

    // Map uploaded files to URLs (support different multer/cloudinary props)
    const uploaded = req.files && req.files.length > 0 ? req.files.map(f => f.path || f.secure_url || f.url).filter(Boolean) : [];

    const eventData = {
      name,
      description,
      fees: fees || 0,
      minParticipants: minParticipants || 1,
      maxParticipants: maxParticipants || 1,
      maxGroups: maxGroups || 1,
      location,
      prizes,
      images: uploaded,
      image: uploaded.length > 0 ? uploaded[0] : null,
      isPublished: isPublished || false,
      eventDate,
      registrationEndDate,
    };

    const event = new Event(eventData);

    const createdEvent = await event.save();
    sendSuccess(res, createdEvent, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Admin
export const updateEvent = async (req, res, next) => {
  try {
    const {
        name,
        description,
        fees,
        minParticipants,
        maxParticipants,
        maxGroups,
        location,
        isPublished,
        eventDate,
        registrationEndDate,
    } = req.body;
    
    const event = await Event.findById(req.params.id);

    if (event) {
        event.name = name || event.name;
        event.description = description || event.description;
        event.fees = fees !== undefined ? fees : event.fees;
        event.minParticipants = minParticipants || event.minParticipants;
        event.maxParticipants = maxParticipants || event.maxParticipants;
        event.maxGroups = maxGroups || event.maxGroups;
        event.location = location || event.location;
        
        // Handle prizes object
        if (req.body['prizes[first]'] !== undefined) {
          event.prizes = {
            first: req.body['prizes[first]'] || '',
            second: req.body['prizes[second]'] || '',
            third: req.body['prizes[third]'] || '',
          };
        }
        
        event.isPublished = isPublished !== undefined ? isPublished : event.isPublished;
        event.eventDate = eventDate || event.eventDate;
        event.registrationEndDate = registrationEndDate || event.registrationEndDate;

      if(req.files && req.files.length > 0){
        const uploaded = req.files.map(f => f.path || f.secure_url || f.url).filter(Boolean);
        // Replace images array with newly uploaded images
        event.images = uploaded;
        // Keep backward-compatible single image
        event.image = uploaded.length > 0 ? uploaded[0] : event.image;
      }

      const updatedEvent = await event.save();
      sendSuccess(res, updatedEvent, 'Event updated successfully');
    } else {
      return sendError(res, 'Event not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      sendSuccess(res, null, 'Event removed successfully');
    } else {
      return sendError(res, 'Event not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
