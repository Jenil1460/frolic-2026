import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Table from '../../components/admin/Table';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import './InstituteManagement.css';

const InstituteManagement = () => {
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    
    // State for modal and forms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [file, setFile] = useState(null);

    const fetchInstitutes = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getInstitutes();
            if (response.success) {
                setInstitutes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch institutes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const handleOpenModal = (institute = null) => {
        setIsModalOpen(true);
        if (institute) {
            setIsEditing(true);
            setSelectedInstitute(institute);
            setFormData({ name: institute.name, description: institute.description });
        } else {
            setIsEditing(false);
            setSelectedInstitute(null);
            setFormData({ name: '', description: '' });
        }
        setFile(null); // Reset file input
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (file) {
            data.append('image', file);
        }

        try {
            let response;
            if (isEditing) {
                response = await adminAPI.updateInstitute(selectedInstitute._id, data);
            } else {
                response = await adminAPI.createInstitute(data);
            }

            if (response.success) {
                showSuccess(`Institute ${isEditing ? 'updated' : 'created'} successfully`);
                fetchInstitutes();
                handleCloseModal();
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || `Failed to ${isEditing ? 'update' : 'create'} institute.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this institute?')) {
            try {
                const response = await adminAPI.deleteInstitute(id);
                if (response.success) {
                    showSuccess('Institute deleted successfully');
                    fetchInstitutes();
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                showError(err.message || 'Failed to delete institute.');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading institutes...</p>
            </div>
        );
    }

    const columns = [
        { 
            header: 'Image', 
            render: (institute) => (
                <img src={institute.image} alt={institute.name} className="table-image" />
            )
        },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Actions', 
            render: (institute) => (
                <div className="action-buttons">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Edit2}
                        onClick={() => handleOpenModal(institute)}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDelete(institute._id)}
                    >
                        Delete
                    </Button>
                </div>
            )
        },
    ];

    return (
        <div className="institute-management">
            <Card 
                title="Institute Management" 
                subtitle={`Total ${institutes.length} institutes`}
                action={
                    <Button 
                        variant="primary" 
                        icon={Plus}
                        onClick={() => handleOpenModal()}
                    >
                        Add Institute
                    </Button>
                }
            >
                <Table columns={columns} data={institutes} />
            </Card>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                title={`${isEditing ? 'Edit' : 'Add'} Institute`}
                size="md"
            >
                <form onSubmit={handleSubmit} className="institute-form">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            className="form-input"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            className="form-textarea"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <ImageIcon size={16} /> Image
                        </label>
                        <input 
                            type="file" 
                            name="image" 
                            onChange={handleFileChange} 
                            className="form-input"
                            accept="image/*"
                        />
                        {isEditing && selectedInstitute?.image && (
                            <div className="image-preview">
                                <img src={selectedInstitute.image} alt="Current" />
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Save Changes' : 'Create Institute'}
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

export default InstituteManagement;
