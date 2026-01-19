import Gallery from '../models/Gallery.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Get all galleries
export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ isPublished: true })
      .populate('event', 'name eventDate')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, galleries, 'Galleries fetched successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Get featured galleries for landing page
export const getFeaturedGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ isPublished: true, featured: true })
      .populate('event', 'name eventDate')
      .limit(6)
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, galleries, 'Featured galleries fetched successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Get gallery by ID
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('event', 'name eventDate')
      .populate('createdBy', 'name email');

    if (!gallery) {
      return sendError(res, 'Gallery not found', 404);
    }

    sendSuccess(res, gallery, 'Gallery fetched successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Create new gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, category, event, featured } = req.body;
    const userId = req.user.id;

    if (!title) {
      return sendError(res, 'Title is required', 400);
    }

    const gallery = new Gallery({
      title,
      description,
      category,
      event,
      featured: featured || false,
      createdBy: userId,
      images: [],
    });

    await gallery.save();
    await gallery.populate('createdBy', 'name email');

    sendSuccess(res, gallery, 'Gallery created successfully', 201);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Update gallery
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, event, featured, isPublished } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (event !== undefined) updateData.event = event;
    if (featured !== undefined) updateData.featured = featured;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const gallery = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('event', 'name eventDate')
      .populate('createdBy', 'name email');

    if (!gallery) {
      return sendError(res, 'Gallery not found', 404);
    }

    sendSuccess(res, gallery, 'Gallery updated successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Add images to gallery
export const addImagesToGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // Array of { url, caption }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return sendError(res, 'Images array is required', 400);
    }

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return sendError(res, 'Gallery not found', 404);
    }

    const newImages = images.map(img => ({
      url: img.url,
      caption: img.caption || '',
      uploadedAt: new Date(),
    }));

    gallery.images.push(...newImages);
    await gallery.save();

    sendSuccess(res, gallery, 'Images added successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Remove image from gallery
export const removeImageFromGallery = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return sendError(res, 'Gallery not found', 404);
    }

    if (imageIndex < 0 || imageIndex >= gallery.images.length) {
      return sendError(res, 'Invalid image index', 400);
    }

    gallery.images.splice(imageIndex, 1);
    await gallery.save();

    sendSuccess(res, gallery, 'Image removed successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return sendError(res, 'Gallery not found', 404);
    }

    sendSuccess(res, null, 'Gallery deleted successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

// Get galleries by category
export const getGalleriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const galleries = await Gallery.find({ isPublished: true, category })
      .populate('event', 'name eventDate')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, galleries, 'Galleries fetched successfully', 200);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
