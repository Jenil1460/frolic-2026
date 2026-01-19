import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Trash2, Image as ImageIcon, Upload, Edit2, X, Check } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import './GalleryManagement.css';

const GalleryManagement = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'event',
        event: '',
        featured: false,
    });
    const [newImages, setNewImages] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileCaptions, setFileCaptions] = useState([]);
    const [createSelectedFiles, setCreateSelectedFiles] = useState([]);
    const [createFileCaptions, setCreateFileCaptions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchGalleries();
        fetchEvents();
    }, []);

    const fetchGalleries = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getGalleries();
            console.log('Galleries response:', response);
            if (response.success && response.data) {
                console.log('Galleries data:', response.data);
                setGalleries(response.data);
            } else if (Array.isArray(response.data)) {
                setGalleries(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch galleries');
            }
        } catch (err) {
            console.error('Error fetching galleries:', err);
            showError(err.message || 'Failed to fetch galleries.');
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await adminAPI.getEvents();
            if (response.success) {
                setEvents(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    };

    const handleViewGallery = (gallery) => {
        setSelectedGallery(gallery);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGallery(null);
        setNewImages([]);
        setSelectedFiles([]);
        setFileCaptions([]);
        setCreateSelectedFiles([]);
        setCreateFileCaptions([]);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreateSelectedFiles([]);
        setCreateFileCaptions([]);
    };

    const handleCreateGallery = async () => {
        try {
            if (!formData.title.trim()) {
                showError('Gallery title is required');
                return;
            }

            const response = await adminAPI.createGallery({
                ...formData,
                event: formData.event || undefined,
            });

            if (response.success) {
                showSuccess('Gallery created successfully!');

                // Upload images if any were selected
                if (createSelectedFiles.length > 0) {
                    try {
                        setIsUploading(true);
                        const formDataUpload = new FormData();
                        createSelectedFiles.forEach(file => {
                            formDataUpload.append('images', file);
                        });
                        formDataUpload.append('captions', JSON.stringify(createFileCaptions));

                        const uploadResponse = await adminAPI.uploadImagesToGallery(response.data._id, formDataUpload);

                        if (uploadResponse.success) {
                            showSuccess('Images uploaded successfully!');
                        } else {
                            showError('Gallery created but failed to upload images');
                        }
                    } catch (uploadErr) {
                        console.error('Upload error:', uploadErr);
                        showError('Gallery created but failed to upload images');
                    } finally {
                        setIsUploading(false);
                    }
                }

                // Reset form and close modal
                setFormData({
                    title: '',
                    description: '',
                    category: 'event',
                    event: '',
                    featured: false,
                });
                setCreateSelectedFiles([]);
                setCreateFileCaptions([]);
                setIsCreateModalOpen(false);
                fetchGalleries();
            }
        } catch (err) {
            showError(err.message || 'Failed to create gallery');
        }
    };

    const handleUpdateGallery = async () => {
        try {
            if (!selectedGallery._id) return;

            const response = await adminAPI.updateGallery(selectedGallery._id, {
                title: selectedGallery.title,
                description: selectedGallery.description,
                category: selectedGallery.category,
                featured: selectedGallery.featured,
                isPublished: selectedGallery.isPublished,
            });

            if (response.success) {
                showSuccess('Gallery updated successfully!');
                setGalleries(galleries.map(g => g._id === selectedGallery._id ? response.data : g));
            }
        } catch (err) {
            showError(err.message || 'Failed to update gallery');
        }
    };

    const handleAddImages = async () => {
        try {
            if (newImages.length === 0) {
                showError('Please add at least one image');
                return;
            }

            const response = await adminAPI.addImagesToGallery(selectedGallery._id, newImages);

            if (response.success) {
                showSuccess('Images added successfully!');
                setSelectedGallery(response.data);
                setGalleries(galleries.map(g => g._id === selectedGallery._id ? response.data : g));
                setNewImages([]);
                setImageUrl('');
                setImageCaption('');
            }
        } catch (err) {
            showError(err.message || 'Failed to add images');
        }
    };

    const handleAddImageUrl = () => {
        if (!imageUrl.trim()) {
            showError('Please enter an image URL');
            return;
        }

        setNewImages([...newImages, {
            url: imageUrl,
            caption: imageCaption,
        }]);

        setImageUrl('');
        setImageCaption('');
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            if (!isValid) {
                showError(`${file.name} is not a valid image file`);
            }
            return isValid;
        });

        if (validFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...validFiles]);
            setFileCaptions(prev => [...prev, ...new Array(validFiles.length).fill('')]);
        }

        // Reset input
        e.target.value = '';
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setFileCaptions(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileCaptionChange = (index, value) => {
        setFileCaptions(prev => {
            const newCaptions = [...prev];
            newCaptions[index] = value;
            return newCaptions;
        });
    };

    const handleCreateFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => {
            const isValid = file.type.startsWith('image/');
            if (!isValid) {
                showError(`${file.name} is not a valid image file`);
            }
            return isValid;
        });

        if (validFiles.length > 0) {
            setCreateSelectedFiles(prev => [...prev, ...validFiles]);
            setCreateFileCaptions(prev => [...prev, ...new Array(validFiles.length).fill('')]);
        }

        // Reset input
        e.target.value = '';
    };

    const handleRemoveCreateFile = (index) => {
        setCreateSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setCreateFileCaptions(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateFileCaptionChange = (index, value) => {
        setCreateFileCaptions(prev => {
            const newCaptions = [...prev];
            newCaptions[index] = value;
            return newCaptions;
        });
    };

    const handleUploadFiles = async () => {
        try {
            if (selectedFiles.length === 0) {
                showError('Please select at least one file');
                return;
            }

            setIsUploading(true);

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });
            formData.append('captions', JSON.stringify(fileCaptions));

            const response = await adminAPI.uploadImagesToGallery(selectedGallery._id, formData);

            if (response.success) {
                showSuccess('Images uploaded successfully!');
                setSelectedGallery(response.data);
                setGalleries(galleries.map(g => g._id === selectedGallery._id ? response.data : g));
                setSelectedFiles([]);
                setFileCaptions([]);
            }
        } catch (err) {
            showError(err.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async (imageIndex) => {
        try {
            const response = await adminAPI.removeImageFromGallery(selectedGallery._id, imageIndex);

            if (response.success) {
                showSuccess('Image removed successfully!');
                setSelectedGallery(response.data);
                setGalleries(galleries.map(g => g._id === selectedGallery._id ? response.data : g));
            }
        } catch (err) {
            showError(err.message || 'Failed to remove image');
        }
    };

    const handleDeleteGallery = async (galleryId) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
            try {
                const response = await adminAPI.deleteGallery(galleryId);

                if (response.success) {
                    showSuccess('Gallery deleted successfully!');
                    setGalleries(galleries.filter(g => g._id !== galleryId));
                    handleCloseModal();
                }
            } catch (err) {
                showError(err.message || 'Failed to delete gallery');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading galleries...</p>
            </div>
        );
    }

    return (
        <div className="gallery-management">
            <Card 
                title="Gallery Management" 
                subtitle="Manage event galleries and images"
            >
                <div className="gallery-management-header">
                    <Button 
                        variant="primary"
                        size="md"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={20} /> Create New Gallery
                    </Button>
                </div>

                <div className="gallery-grid">
                    {galleries.map(gallery => (
                        <div key={gallery._id} className="gallery-card">
                            <div className="gallery-card-image">
                                {gallery.images && gallery.images.length > 0 && gallery.images[0]?.url ? (
                                    <img 
                                        src={gallery.images[0].url} 
                                        alt={gallery.title}
                                        onError={(e) => {
                                            console.error('Image failed to load:', gallery.images[0].url);
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                                        }}
                                    />
                                ) : (
                                    <div className="gallery-card-placeholder">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="gallery-card-overlay">
                                    <div className="gallery-card-badges">
                                        <span className="image-count">
                                            <ImageIcon size={14} /> {gallery.images?.length || 0}
                                        </span>
                                        {gallery.featured && (
                                            <span className="featured-badge">Featured</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="gallery-card-content">
                                <h3>{gallery.title}</h3>
                                <p className="gallery-card-category">{gallery.category}</p>
                                <p className="gallery-card-views">{gallery.viewCount || 0} views</p>
                                <div className="gallery-card-actions">
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => handleViewGallery(gallery)}
                                    >
                                        <Edit2 size={16} /> Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handleDeleteGallery(gallery._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {galleries.length === 0 && (
                    <div className="empty-state">
                        <ImageIcon size={48} />
                        <p>No galleries found</p>
                        <Button 
                            variant="primary" 
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create Your First Gallery
                        </Button>
                    </div>
                )}
            </Card>

            {/* Create Gallery Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                title="Create New Gallery"
                size="md"
            >
                <div className="gallery-form">
                    <div className="form-group">
                        <label>Gallery Title *</label>
                        <input
                            type="text"
                            placeholder="Enter gallery title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter gallery description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-textarea"
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="form-select"
                            >
                                <option value="event">Event</option>
                                <option value="achievement">Achievement</option>
                                <option value="campus">Campus</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Event (Optional)</label>
                            <select
                                value={formData.event}
                                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                                className="form-select"
                            >
                                <option value="">Select an event</option>
                                {events.map(event => (
                                    <option key={event._id} value={event._id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            />
                            <span>Mark as Featured</span>
                        </label>
                    </div>

                    {/* File Upload Section for Create Gallery */}
                    <div className="form-group">
                        <label>Upload Images (Optional)</label>
                        <div className="upload-method">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleCreateFileSelect}
                                className="file-input"
                                id="create-gallery-file-input"
                            />
                            <label htmlFor="create-gallery-file-input" className="file-input-label">
                                <ImageIcon size={20} />
                                Choose Images
                            </label>
                        </div>

                        {createSelectedFiles.length > 0 && (
                            <div className="selected-files-preview">
                                <p className="preview-label">Selected Files ({createSelectedFiles.length})</p>
                                {createSelectedFiles.map((file, index) => (
                                    <div key={index} className="file-preview-item">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="file-preview-img"
                                        />
                                        <div className="file-preview-info">
                                            <p className="file-name">{file.name}</p>
                                            <input
                                                type="text"
                                                placeholder="Enter caption (optional)"
                                                value={createFileCaptions[index] || ''}
                                                onChange={(e) => handleCreateFileCaptionChange(index, e.target.value)}
                                                className="caption-input"
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveCreateFile(index)}
                                                className="remove-file-btn"
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <Button 
                            variant="primary" 
                            onClick={handleCreateGallery}
                            size="md"
                        >
                            Create Gallery
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCloseCreateModal}
                            size="md"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Gallery Modal */}
            <Modal 
                isOpen={isModalOpen && selectedGallery} 
                onClose={handleCloseModal}
                title={selectedGallery?.title}
                size="lg"
            >
                <div className="gallery-edit-content">
                    <div className="gallery-edit-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={selectedGallery?.title || ''}
                                onChange={(e) => setSelectedGallery({ ...selectedGallery, title: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={selectedGallery?.description || ''}
                                onChange={(e) => setSelectedGallery({ ...selectedGallery, description: e.target.value })}
                                className="form-textarea"
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={selectedGallery?.category || 'event'}
                                    onChange={(e) => setSelectedGallery({ ...selectedGallery, category: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="event">Event</option>
                                    <option value="achievement">Achievement</option>
                                    <option value="campus">Campus</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedGallery?.featured || false}
                                        onChange={(e) => setSelectedGallery({ ...selectedGallery, featured: e.target.checked })}
                                    />
                                    <span>Featured</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedGallery?.isPublished !== false}
                                    onChange={(e) => setSelectedGallery({ ...selectedGallery, isPublished: e.target.checked })}
                                />
                                <span>Published</span>
                            </label>
                        </div>

                        <Button 
                            variant="primary" 
                            onClick={handleUpdateGallery}
                            size="md"
                            className="update-btn"
                        >
                            <Check size={16} /> Save Changes
                        </Button>
                    </div>

                    <div className="gallery-edit-images">
                        <h4>Gallery Images ({selectedGallery?.images?.length || 0})</h4>

                        {selectedGallery?.images && selectedGallery.images.length > 0 ? (
                            <div className="images-list">
                                {selectedGallery.images.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img 
                                            src={image.url} 
                                            alt={image.caption || `Image ${index + 1}`}
                                            onError={(e) => {
                                                console.error('Modal: Image failed to load:', image.url);
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                                            }}
                                            onLoad={() => console.log('Modal: Image loaded successfully:', image.url)}
                                        />
                                        <div className="image-info">
                                            <p className="image-caption">{image.caption || 'No caption'}</p>
                                        </div>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemoveImage(index)}
                                            className="remove-image-btn"
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-images">No images yet</p>
                        )}

                        <div className="add-images-section">
                            <h5>Add Images</h5>
                            
                            {/* File Upload Section */}
                            <div className="upload-method">
                                <label className="upload-label">
                                    <Upload size={16} /> Upload from Computer
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="file-input"
                                    id="gallery-file-input"
                                    disabled={isUploading}
                                />
                                <label htmlFor="gallery-file-input" className="file-input-label">
                                    <ImageIcon size={20} />
                                    Choose Images
                                </label>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="selected-files-preview">
                                    <p className="preview-label">Selected Files ({selectedFiles.length})</p>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="file-preview-item">
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt={file.name}
                                                className="file-preview-img"
                                            />
                                            <div className="file-preview-info">
                                                <p className="file-name">{file.name}</p>
                                                <input
                                                    type="text"
                                                    placeholder="Enter caption (optional)"
                                                    value={fileCaptions[index] || ''}
                                                    onChange={(e) => handleFileCaptionChange(index, e.target.value)}
                                                    className="caption-input"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="remove-file-btn"
                                                disabled={isUploading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <Button 
                                        variant="primary" 
                                        onClick={handleUploadFiles}
                                        size="md"
                                        disabled={isUploading}
                                        className="upload-files-btn"
                                    >
                                        <Upload size={16} /> {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
                                    </Button>
                                </div>
                            )}

                            <div className="divider">
                                <span>OR</span>
                            </div>

                            <div className="url-method">
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Caption (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter image caption"
                                        value={imageCaption}
                                        onChange={(e) => setImageCaption(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {newImages.length > 0 && (
                                <div className="preview-images">
                                    <p className="preview-label">Images to add ({newImages.length})</p>
                                    {newImages.map((img, index) => (
                                        <div key={index} className="preview-item">
                                            <img 
                                                src={img.url} 
                                                alt={img.caption || `Preview ${index + 1}`}
                                                onError={(e) => {
                                                    console.error('Preview: Image failed to load:', img.url);
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                                                }}
                                                onLoad={() => console.log('Preview: Image loaded successfully:', img.url)}
                                            />
                                            <div className="preview-info">
                                                <p>{img.caption || 'No caption'}</p>
                                            </div>
                                            <button
                                                onClick={() => setNewImages(newImages.filter((_, i) => i !== index))}
                                                className="remove-preview-btn"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="add-image-actions">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleAddImageUrl}
                                    size="sm"
                                >
                                    <Plus size={16} /> Add Image
                                </Button>

                                {newImages.length > 0 && (
                                    <Button 
                                        variant="primary" 
                                        onClick={handleAddImages}
                                        size="sm"
                                    >
                                        <Upload size={16} /> Upload {newImages.length} Image(s)
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GalleryManagement;