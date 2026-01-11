import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Edit2, Trash2, Calendar, MapPin, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Table from '../../components/admin/Table';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import './EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '', 
        description: '', 
        fees: 0,
        minParticipants: 1, 
        maxParticipants: 1, 
        maxGroups: 1, 
        location: '',
        prizes: { first: '', second: '', third: '' }, 
        eventDate: '', 
        registrationEndDate: ''
    });
    const [files, setFiles] = useState([]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const eventsRes = await adminAPI.getEvents();

            if (eventsRes.success) {
                setEvents(eventsRes.data);
            } else {
                throw new Error(eventsRes.message || 'Failed to fetch events');
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpenModal = (event = null) => {
        setIsModalOpen(true);
        if (event) {
            setIsEditing(true);
            setSelectedEvent(event);
            setFormData({
                name: event.name, 
                description: event.description, 
                fees: event.fees, 
                minParticipants: event.minParticipants,
                maxParticipants: event.maxParticipants, 
                maxGroups: event.maxGroups, 
                location: event.location,
                prizes: event.prizes || { first: '', second: '', third: '' }, 
                eventDate: new Date(event.eventDate).toISOString().split('T')[0], 
                registrationEndDate: new Date(event.registrationEndDate).toISOString().split('T')[0]
            });
        } else {
            setIsEditing(false);
            setSelectedEvent(null);
            setFormData({
                name: '', 
                description: '', 
                fees: 0,
                minParticipants: 1, 
                maxParticipants: 1, 
                maxGroups: 1, 
                location: '',
                prizes: { first: '', second: '', third: '' }, 
                eventDate: '', 
                registrationEndDate: ''
            });
        }
        setFiles([]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('prize.')) {
            const prizeName = name.split('.')[1];
            setFormData(prev => ({ ...prev, prizes: { ...prev.prizes, [prizeName]: value } }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (key === 'prizes') {
                data.append('prizes[first]', formData.prizes.first);
                data.append('prizes[second]', formData.prizes.second);
                data.append('prizes[third]', formData.prizes.third);
            } else {
                data.append(key, formData[key]);
            }
        });

        for (let i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        try {
            let response;
            if (isEditing) {
                response = await adminAPI.updateEvent(selectedEvent._id, data);
            } else {
                response = await adminAPI.createEvent(data);
            }

            if (response.success) {
                showSuccess(`Event ${isEditing ? 'updated' : 'created'} successfully`);
                fetchEvents();
                handleCloseModal();
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || `Failed to ${isEditing ? 'update' : 'create'} event.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await adminAPI.deleteEvent(id);
                if(response.success) {
                    showSuccess('Event deleted successfully');
                    fetchEvents();
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                showError(err.message || 'Failed to delete event.');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
            </div>
        );
    }

    const columns = [
        { header: 'Name', accessor: 'name' },
        { 
            header: 'Location', 
            render: (event) => (
                <span className="event-location">
                    <MapPin size={14} /> {event.location || 'N/A'}
                </span>
            )
        },
        { 
            header: 'Fees', 
            render: (event) => (
                <span className="event-fees">
                    <DollarSign size={14} /> ${event.fees}
                </span>
            )
        },
        { 
            header: 'Participants', 
            render: (event) => (
                <span className="event-participants">
                    {event.minParticipants} - {event.maxParticipants}
                </span>
            )
        },
        { 
            header: 'Event Date', 
            render: (event) => new Date(event.eventDate).toLocaleDateString()
        },
        { 
            header: 'Actions', 
            render: (event) => (
                <div className="action-buttons">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Edit2}
                        onClick={() => handleOpenModal(event)}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDelete(event._id)}
                    >
                        Delete
                    </Button>
                </div>
            )
        },
    ];

    return (
        <div className="event-management">
            <Card 
                title="Event Management" 
                subtitle={`Total ${events.length} events`}
                action={
                    <Button 
                        variant="primary" 
                        icon={Plus}
                        onClick={() => handleOpenModal()}
                    >
                        Add Event
                    </Button>
                }
            >
                <Table columns={columns} data={events} />
            </Card>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                title={`${isEditing ? 'Edit' : 'Add'} Event`}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Event Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                className="form-input"
                                required 
                                placeholder="Enter event name"
                            />
                        </div>
                        
                        <div className="form-group full-width">
                            <label className="form-label">Description</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleInputChange} 
                                className="form-textarea"
                                required
                                placeholder="Enter event description"
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <MapPin size={16} /> Location
                            </label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleInputChange} 
                                className="form-input"
                                placeholder="Enter location"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <DollarSign size={16} /> Registration Fees
                            </label>
                            <input 
                                type="number" 
                                name="fees" 
                                value={formData.fees} 
                                onChange={handleInputChange} 
                                className="form-input"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Users size={16} /> Min Participants
                            </label>
                            <input 
                                type="number" 
                                name="minParticipants" 
                                value={formData.minParticipants} 
                                onChange={handleInputChange} 
                                className="form-input"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Users size={16} /> Max Participants
                            </label>
                            <input 
                                type="number" 
                                name="maxParticipants" 
                                value={formData.maxParticipants} 
                                onChange={handleInputChange} 
                                className="form-input"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Max Groups</label>
                            <input 
                                type="number" 
                                name="maxGroups" 
                                value={formData.maxGroups} 
                                onChange={handleInputChange} 
                                className="form-input"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={16} /> Event Date
                            </label>
                            <input 
                                type="date" 
                                name="eventDate" 
                                value={formData.eventDate} 
                                onChange={handleInputChange} 
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Calendar size={16} /> Registration End Date
                            </label>
                            <input 
                                type="date" 
                                name="registrationEndDate" 
                                value={formData.registrationEndDate} 
                                onChange={handleInputChange} 
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">
                                <ImageIcon size={16} /> Event Images (up to 5)
                            </label>
                            <input 
                                type="file" 
                                name="images" 
                                onChange={handleFileChange} 
                                className="form-input"
                                accept="image/*"
                                multiple
                            />
                            {isEditing && selectedEvent?.images && selectedEvent.images.length > 0 && (
                                <div className="current-images">
                                    <p className="current-images-label">Current Images:</p>
                                    <div className="image-preview-grid">
                                        {selectedEvent.images.map((img, idx) => (
                                            <img key={idx} src={img} alt={`Event ${idx + 1}`} className="preview-image" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Prize Details</label>
                            <div className="prize-fields">
                                <div className="form-group">
                                    <label className="form-label-small">1st Prize</label>
                                    <input 
                                        type="text" 
                                        name="prize.first" 
                                        value={formData.prizes.first} 
                                        onChange={handleInputChange} 
                                        className="form-input"
                                        placeholder="e.g., $500"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label-small">2nd Prize</label>
                                    <input 
                                        type="text" 
                                        name="prize.second" 
                                        value={formData.prizes.second} 
                                        onChange={handleInputChange} 
                                        className="form-input"
                                        placeholder="e.g., $300"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label-small">3rd Prize</label>
                                    <input 
                                        type="text" 
                                        name="prize.third" 
                                        value={formData.prizes.third} 
                                        onChange={handleInputChange} 
                                        className="form-input"
                                        placeholder="e.g., $200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Save Changes' : 'Create Event'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventManagement;