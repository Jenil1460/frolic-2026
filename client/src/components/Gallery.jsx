import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { adminAPI } from '../utils/api';
import './Gallery.css';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeaturedGalleries();
  }, []);

  const fetchFeaturedGalleries = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFeaturedGalleries();
      console.log('Featured Gallery response:', response);
      
      if (response.success && response.data) {
        setGalleries(response.data);
      } else if (Array.isArray(response.data)) {
        setGalleries(response.data);
      } else {
        setGalleries([]);
      }
    } catch (err) {
      console.error('Failed to fetch featured galleries:', err);
      // Try fetching all galleries as fallback
      try {
        const allResponse = await adminAPI.getGalleries();
        console.log('All galleries fallback:', allResponse);
        if (allResponse.success && allResponse.data) {
          setGalleries(allResponse.data);
        }
      } catch (fallbackErr) {
        console.error('Failed to fetch all galleries:', fallbackErr);
        setGalleries([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(galleries.map(g => g.category))];
  const filteredGalleries = filter === 'all' 
    ? galleries 
    : galleries.filter(g => g.category === filter);

  const handleNextImage = () => {
    if (selectedGallery) {
      setSelectedImageIndex(
        (prev) => (prev + 1) % selectedGallery.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedGallery) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + selectedGallery.images.length) % selectedGallery.images.length
      );
    }
  };

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  if (galleries.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        {/* Header */}
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="gallery-title">Event Gallery</h2>
          <p className="gallery-subtitle">
            Relive the best moments from our past events
          </p>
        </motion.div>

        {/* Filter */}
        {categories.length > 1 && (
          <motion.div
            className="gallery-filters"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid */}
        <motion.div
          className="gallery-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {filteredGalleries.map((gallery, index) => (
            <motion.div
              key={gallery._id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="gallery-item-image">
                {gallery.images && gallery.images.length > 0 ? (
                  <>
                    <img
                      src={gallery.images[0].url}
                      alt={gallery.title}
                      className="item-img"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-overlay-content">
                        <motion.button
                          className="zoom-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedGallery(gallery);
                            setSelectedImageIndex(0);
                          }}
                        >
                          <ZoomIn size={24} />
                        </motion.button>
                      </div>
                      <div className="image-count-badge">
                        {gallery.images.length} Photos
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-gallery-item">
                    <ZoomIn size={32} />
                  </div>
                )}
              </div>

              <div className="gallery-item-content">
                <h3 className="gallery-item-title">{gallery.title}</h3>
                {gallery.event && (
                  <p className="gallery-event-name">{gallery.event.name}</p>
                )}
                {gallery.description && (
                  <p className="gallery-item-description">
                    {gallery.description.substring(0, 80)}
                    {gallery.description.length > 80 ? '...' : ''}
                  </p>
                )}
                <div className="gallery-item-footer">
                  <span className="gallery-category">
                    {gallery.category.charAt(0).toUpperCase() + gallery.category.slice(1)}
                  </span>
                  <span className="gallery-views">{gallery.viewCount} views</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredGalleries.length === 0 && (
          <motion.div
            className="gallery-empty"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>No galleries found in this category</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedGallery && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedGallery(null)}
        >
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="lightbox-close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGallery(null)}
              aria-label="Close"
            >
              <X size={24} />
            </motion.button>

            {/* Main Image */}
            <div className="lightbox-image-container">
              <img
                src={selectedGallery.images[selectedImageIndex].url}
                alt={`${selectedGallery.title} ${selectedImageIndex + 1}`}
                className="lightbox-image"
              />

              {/* Navigation Buttons */}
              {selectedGallery.images.length > 1 && (
                <>
                  <motion.button
                    className="lightbox-nav lightbox-nav-prev"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                  <motion.button
                    className="lightbox-nav lightbox-nav-next"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                </>
              )}
            </div>

            {/* Info Section */}
            <div className="lightbox-info">
              <div className="lightbox-title-section">
                <h3 className="lightbox-title">{selectedGallery.title}</h3>
                {selectedGallery.description && (
                  <p className="lightbox-description">{selectedGallery.description}</p>
                )}
              </div>

              {/* Thumbnails */}
              {selectedGallery.images.length > 1 && (
                <div className="lightbox-thumbnails">
                  {selectedGallery.images.map((image, index) => (
                    <motion.button
                      key={index}
                      className={`thumbnail ${
                        index === selectedImageIndex ? 'active' : ''
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Image Info */}
              <div className="lightbox-image-info">
                <span className="image-counter">
                  {selectedImageIndex + 1} / {selectedGallery.images.length}
                </span>
                {selectedGallery.images[selectedImageIndex].caption && (
                  <span className="image-caption">
                    {selectedGallery.images[selectedImageIndex].caption}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
