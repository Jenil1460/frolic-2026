import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Card from '../../components/admin/Card';
import Table from '../../components/admin/Table';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Pagination from '../../components/admin/Pagination';
import { useToast } from '../../components/admin/ToastContainer';
import { useUserActions } from '../../hooks/useUserActions';
import useDebounce from '../../hooks/useDebounce';
import './CoordinatorManagement.css';

const ROLE_OPTIONS = ["Institute Coordinator", "Department Coordinator", "Event Coordinator"];

const CoordinatorManagement = () => {
    const [coordinators, setCoordinators] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    const { handleRoleChange, handleStatusToggle } = useUserActions(coordinators, setCoordinators);

    // Filters
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    // Assign Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    const [assignmentType, setAssignmentType] = useState('institute');
    const [assignmentId, setAssignmentId] = useState('');
    const [institutes, setInstitutes] = useState([]);
    const [departments, setDepartments] = useState([]);

    const fetchCoordinators = async (page) => {
        setLoading(true);
        try {
            const params = { page, limit, q: debouncedQuery };
            const response = await adminAPI.getCoordinators(params);
            if (response.success) {
                setCoordinators(response.data.coordinators);
                setPagination(response.data.pagination);
                setCurrentPage(response.data.pagination.page);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch coordinators.');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstitutesAndDepartments = async () => {
        try {
            const instRes = await adminAPI.getInstitutes();
            if (instRes.success) setInstitutes(instRes.data);
            const deptRes = await adminAPI.getDepartments();
            if (deptRes.success) setDepartments(deptRes.data);
        } catch (err) {
            showError(err.message || 'Failed to fetch institutes/departments.');
        }
    };

    useEffect(() => {
        fetchCoordinators(1);
    }, [debouncedQuery]);

    useEffect(() => {
        fetchInstitutesAndDepartments();
    }, []);
    
    const handlePageChange = (page) => {
        fetchCoordinators(page);
    };

    const handleAssignClick = (coordinator) => {
        setSelectedCoordinator(coordinator);
        setIsAssignModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAssignModalOpen(false);
        setSelectedCoordinator(null);
        setAssignmentType('institute');
        setAssignmentId('');
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCoordinator) return;
        try {
            const res = await adminAPI.assignCoordinator(selectedCoordinator._id, { assignmentType, assignmentId });
            if (res.success) {
                showSuccess('Coordinator assignment updated successfully.');
                fetchCoordinators(currentPage);
                handleModalClose();
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to assign coordinator.');
        }
    };

    const columns = [
        {
            header: 'Coordinator',
            render: (user) => (
                <div className="user-profile-cell">
                    <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.fullName}`} alt="avatar" className="avatar" />
                    <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                        <span className="user-email">{user.email}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Role', 
            render: (user) => (
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="role-select">
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            )
        },
        { header: 'Assigned To', accessor: 'assignment' },
        {
            header: 'Status',
            render: (user) => (
                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                </span>
            )
        },
        {
            header: 'Actions',
            render: (user) => (
                <div className="actions-cell">
                    <Button variant="primary" size="sm" onClick={() => handleAssignClick(user)}>
                        Assign
                    </Button>
                    <Button 
                        variant={user.isActive ? 'warning' : 'success'} 
                        size="sm"
                        onClick={() => handleStatusToggle(user._id, !user.isActive)}
                    >
                        {user.isActive ? 'Block' : 'Unblock'}
                    </Button>
                </div>
            )
        },
    ];

    return (
        <div className="coordinator-management">
            <Card 
                title="Coordinators Management" 
                subtitle={pagination ? `Assign coordinators to institutes and departments. Total: ${pagination.total}`: ''}
            >
                <div className="controls-bar">
                    <input 
                        placeholder="Search by name or email..." 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        className="search-input" 
                    />
                </div>

                <Table columns={columns} data={coordinators} loading={loading} />
                {pagination && <Pagination {...pagination} onPageChange={handlePageChange} />}
            </Card>

            <Modal
                isOpen={isAssignModalOpen}
                onClose={handleModalClose}
                title={`Assign ${selectedCoordinator?.fullName}`}
            >
                <form onSubmit={handleAssignSubmit}>
                    <div className="form-group">
                        <label>Assignment Type</label>
                        <select value={assignmentType} onChange={(e) => setAssignmentType(e.target.value)} className="form-select">
                            <option value="institute">Institute</option>
                            <option value="department">Department</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    {assignmentType !== 'none' && (
                        <div className="form-group">
                            <label>Assign To</label>
                            <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} className="form-select">
                                <option value="">Select...</option>
                                {assignmentType === 'institute' ? (
                                    institutes.map(i => <option key={i._id} value={i._id}>{i.name}</option>)
                                ) : (
                                    departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)
                                )}
                            </select>
                        </div>
                    )}
                    <div className="form-actions">
                        <Button type="submit" variant="primary">Update Assignment</Button>
                        <Button type="button" variant="ghost" onClick={handleModalClose}>Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CoordinatorManagement;
