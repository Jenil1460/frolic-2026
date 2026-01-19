import express from 'express';
import {
  getAllGalleries,
  getFeaturedGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  addImagesToGallery,
  removeImageFromGallery,
  deleteGallery,
  getGalleriesByCategory,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedGalleries);
router.get('/category/:category', getGalleriesByCategory);
router.get('/:id', getGalleryById);
router.get('/', getAllGalleries);

// Protected routes (require authentication)
router.post('/', protect, createGallery);
router.put('/:id', protect, updateGallery);
router.post('/:id/images', protect, addImagesToGallery);
router.delete('/:id/images/:imageIndex', protect, removeImageFromGallery);
router.delete('/:id', protect, deleteGallery);

export default router;
