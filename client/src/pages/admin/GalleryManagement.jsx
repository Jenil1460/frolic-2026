import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import './GalleryManagement.css';

const GalleryManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getEvents();
            if (response.success) {
                setEvents(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewGallery = (event) => {
        setSelectedEvent(event);
        setGalleryImages(event.images || []);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setGalleryImages([]);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className="gallery-management">
            <Card 
                title="Gallery Management" 
                subtitle="Manage event images and galleries"
            >
                <div className="gallery-grid">
                    {events.map(event => (
                        <div key={event._id} className="gallery-event-card">
                            <div className="gallery-event-image">
                                {event.images && event.images.length > 0 ? (
                                    <img src={event.images[0]} alt={event.name} />
                                ) : (
                                    <div className="gallery-event-placeholder">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="gallery-event-overlay">
                                    <span className="image-count">
                                        <ImageIcon size={16} /> {event.images?.length || 0} Images
                                    </span>
                                </div>
                            </div>
                            <div className="gallery-event-content">
                                <h3>{event.name}</h3>
                                <p className="gallery-event-date">
                                    {new Date(event.eventDate).toLocaleDateString()}
                                </p>
                                <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => handleViewGallery(event)}
                                >
                                    View Gallery
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="empty-state">
                        <ImageIcon size={48} />
                        <p>No events found</p>
                    </div>
                )}
            </Card>

            <Modal 
                isOpen={isModalOpen && selectedEvent} 
                onClose={handleCloseModal}
                title={`${selectedEvent?.name} - Gallery`}
                size="lg"
            >
                <div className="gallery-modal-content">
                    {galleryImages.length > 0 ? (
                        <div className="gallery-images-grid">
                            {galleryImages.map((image, index) => (
                                <div key={index} className="gallery-image-item">
                                    <img src={image} alt={`${selectedEvent.name} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-gallery">
                            <Upload size={48} />
                            <p>No images in this gallery</p>
                            <p className="empty-gallery-hint">
                                Images can be uploaded when creating or editing an event
                            </p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default GalleryManagement;