import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Shield, UserX, UserCheck, Trash2, Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Table from '../../components/admin/Table';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/ToastContainer';
import useDebounce from '../../hooks/useDebounce';
import { useUserActions } from '../../hooks/useUserActions';
import Pagination from '../../components/admin/Pagination';
import './UserManagement.css';

const ROLE_OPTIONS = ["Student", "Institute Coordinator", "Department Coordinator", "Event Coordinator", "Admin"];

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();
    const { handleRoleChange, handleStatusToggle, handleVerifyToggle } = useUserActions(users, setUsers);

    // Filters and pagination
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const params = { page, limit, q: debouncedQuery, role: roleFilter };
            const response = await adminAPI.fetchAdminUsers(params);
            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
                setCurrentPage(response.data.pagination.page);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [debouncedQuery, roleFilter]);

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleModalClose = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            const response = await adminAPI.deleteUserByAdmin(selectedUser._id);
            if (response.success) {
                showSuccess('User deleted successfully');
                fetchUsers(currentPage); // Refresh current page
                handleModalClose();
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to delete user.');
        }
    };

    const handleExport = async () => {
        // Implementation for this will be done later
        showSuccess('Export functionality coming soon!');
    };

    const columns = [
        {
            header: 'User',
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
        { 
            header: 'Verification', 
            render: (user) => (
                <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                    {user.isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                </span>
            )
        },
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
                     <Button 
                        variant={user.isActive ? 'warning' : 'success'} 
                        size="sm"
                        onClick={() => handleStatusToggle(user._id, !user.isActive)}
                    >
                        {user.isActive ? 'Block' : 'Unblock'}
                    </Button>
                    {!user.isVerified && (
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleVerifyToggle(user._id, true)}
                        >
                            Verify
                        </Button>
                    )}
                    <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDeleteClick(user)}
                    />
                </div>
            )
        },
    ];

    return (
        <div className="user-management">
            <Card 
                title="Registrations" 
                subtitle={pagination ? `A list of all users in the system. Total: ${pagination.total}` : ''}
            >
                <div className="controls-bar">
                    <input 
                        placeholder="Search by name or email..." 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        className="search-input" 
                    />
                    <div className="filters">
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="role-filter">
                            <option value="">All Roles</option>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Button variant="secondary" onClick={handleExport}>Export to Excel</Button>
                    </div>
                </div>

                <Table columns={columns} data={users} loading={loading} />
                {pagination && <Pagination {...pagination} onPageChange={handlePageChange} />}
            </Card>
            
            <Modal
                isOpen={isDeleteModalOpen && selectedUser}
                onClose={handleModalClose}
                title={`Delete User: ${selectedUser?.fullName}`}
                size="sm"
            >
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                    <div className="form-actions">
                        <Button type="button" variant="danger" onClick={handleDeleteUser}>Confirm Delete</Button>
                        <Button type="button" variant="ghost" onClick={handleModalClose}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;
