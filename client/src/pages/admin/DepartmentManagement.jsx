import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, Building2 } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Table from '../../components/admin/Table';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    
    // State for modal and forms
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', institute: '' });
    const [file, setFile] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [deptsRes, instRes] = await Promise.all([
                adminAPI.getDepartments(),
                adminAPI.getInstitutes()
            ]);

            if (deptsRes.success && instRes.success) {
                setDepartments(deptsRes.data);
                setInstitutes(instRes.data);
            } else {
                throw new Error(deptsRes.message || instRes.message || 'Failed to fetch data');
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (department = null) => {
        setIsModalOpen(true);
        if (department) {
            setIsEditing(true);
            setSelectedDepartment(department);
            setFormData({ name: department.name, description: department.description, institute: department.institute._id });
        } else {
            setIsEditing(false);
            setSelectedDepartment(null);
            setFormData({ name: '', description: '', institute: '' });
        }
        setFile(null);
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
        data.append('institute', formData.institute);
        if (file) {
            data.append('image', file);
        }

        try {
            let response;
            if (isEditing) {
                response = await adminAPI.updateDepartment(selectedDepartment._id, data);
            } else {
                response = await adminAPI.createDepartment(data);
            }

            if (response.success) {
                showSuccess(`Department ${isEditing ? 'updated' : 'created'} successfully`);
                fetchData();
                handleCloseModal();
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || `Failed to ${isEditing ? 'update' : 'create'} department.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                const response = await adminAPI.deleteDepartment(id);
                if (response.success) {
                    showSuccess('Department deleted successfully');
                    fetchData();
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                showError(err.message || 'Failed to delete department.');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading departments...</p>
            </div>
        );
    }

    const columns = [
        { 
            header: 'Image', 
            render: (dept) => (
                <img src={dept.image} alt={dept.name} className="table-image" />
            )
        },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Institute', 
            render: (dept) => dept.institute?.name || 'N/A'
        },
        { 
            header: 'Actions', 
            render: (dept) => (
                <div className="action-buttons">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Edit2}
                        onClick={() => handleOpenModal(dept)}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDelete(dept._id)}
                    >
                        Delete
                    </Button>
                </div>
            )
        },
    ];

    return (
        <div className="department-management">
            <Card 
                title="Department Management" 
                subtitle={`Total ${departments.length} departments`}
                action={
                    <Button 
                        variant="primary" 
                        icon={Plus}
                        onClick={() => handleOpenModal()}
                    >
                        Add Department
                    </Button>
                }
            >
                <Table columns={columns} data={departments} />
            </Card>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                title={`${isEditing ? 'Edit' : 'Add'} Department`}
                size="md"
            >
                <form onSubmit={handleSubmit} className="department-form">
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
                            <Building2 size={16} /> Institute
                        </label>
                        <select 
                            name="institute" 
                            value={formData.institute} 
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Institute</option>
                            {institutes.map(inst => (
                                <option key={inst._id} value={inst._id}>{inst.name}</option>
                            ))}
                        </select>
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
                        {isEditing && selectedDepartment?.image && (
                            <div className="image-preview">
                                <img src={selectedDepartment.image} alt="Current" />
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Save Changes' : 'Create Department'}
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

export default DepartmentManagement;
