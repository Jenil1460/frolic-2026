import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Calendar, Users, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import Table from '../../components/admin/Table';
import { useToast } from '../../components/admin/ToastContainer';
import './RegistrationManagement.css';

const RegistrationManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await adminAPI.getEvents();
                if (res.success) {
                    setEvents(res.data);
                } else {
                    throw new Error(res.message);
                }
            } catch (err) {
                showError('Failed to fetch events.');
            }
        };
        fetchEvents();
    }, [showError]);

    useEffect(() => {
        if (selectedEvent) {
            const fetchGroups = async () => {
                setLoading(true);
                try {
                    const res = await adminAPI.getGroupsByEvent(selectedEvent);
                    if (res.success) {
                        setGroups(res.data);
                    } else {
                        throw new Error(res.message);
                    }
                } catch (err) {
                    showError('Failed to fetch registrations.');
                } finally {
                    setLoading(false);
                }
            };
            fetchGroups();
        } else {
            setGroups([]);
        }
    }, [selectedEvent, showError]);

    const handleStatusChange = async (groupId, field, value) => {
        try {
            const res = await adminAPI.updateGroup(groupId, { [field]: value });
            if (res.success) {
                const updatedGroups = groups.map(g => g._id === groupId ? res.data : g);
                setGroups(updatedGroups);
                showSuccess(`${field === 'isPaymentDone' ? 'Payment' : 'Attendance'} status updated`);
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            showError('Failed to update status.');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                const res = await adminAPI.deleteGroup(id);
                if (res.success) {
                    const updatedGroups = groups.filter(g => g._id !== id);
                    setGroups(updatedGroups);
                    showSuccess('Registration deleted successfully');
                } else {
                    throw new Error(res.message);
                }
            } catch (err) {
                showError(err.message || 'Failed to delete registration.');
            }
        }
    };

    const columns = [
        { header: 'Group Name', accessor: 'name' },
        { 
            header: 'Group Leader', 
            render: (group) => group.groupLeader?.fullName || 'N/A'
        },
        { 
            header: 'Participants', 
            render: (group) => (
                <span className="participant-count">
                    <Users size={14} /> {group.participants.length}
                </span>
            )
        },
        { 
            header: 'Payment', 
            render: (group) => (
                <label className="status-toggle">
                    <input 
                        type="checkbox" 
                        checked={group.isPaymentDone} 
                        onChange={(e) => handleStatusChange(group._id, 'isPaymentDone', e.target.checked)}
                    />
                    <span className={`status-badge ${group.isPaymentDone ? 'status-paid' : 'status-pending'}`}>
                        {group.isPaymentDone ? <><CheckCircle size={14} /> Paid</> : <><XCircle size={14} /> Pending</>}
                    </span>
                </label>
            )
        },
        { 
            header: 'Attendance', 
            render: (group) => (
                <label className="status-toggle">
                    <input 
                        type="checkbox" 
                        checked={group.isPresent} 
                        onChange={(e) => handleStatusChange(group._id, 'isPresent', e.target.checked)}
                    />
                    <span className={`status-badge ${group.isPresent ? 'status-present' : 'status-absent'}`}>
                        {group.isPresent ? <><CheckCircle size={14} /> Present</> : <><XCircle size={14} /> Absent</>}
                    </span>
                </label>
            )
        },
        { 
            header: 'Actions', 
            render: (group) => (
                <Button 
                    variant="danger" 
                    size="sm" 
                    icon={Trash2}
                    onClick={() => handleDelete(group._id)}
                >
                    Delete
                </Button>
            )
        },
    ];

    return (
        <div className="registration-management">
            <Card 
                title="Registration Management" 
                subtitle="Manage event registrations and track attendance"
            >
                <div className="event-selector">
                    <Calendar size={20} />
                    <label>Select Event:</label>
                    <select 
                        onChange={(e) => setSelectedEvent(e.target.value)} 
                        value={selectedEvent}
                        className="form-select"
                    >
                        <option value="">-- Select Event --</option>
                        {events.map(event => (
                            <option key={event._id} value={event._id}>{event.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading registrations...</p>
                    </div>
                ) : selectedEvent ? (
                    <div className="registrations-table-container">
                        <div className="stats-summary">
                            <div className="stat-item">
                                <span className="stat-label">Total Registrations</span>
                                <span className="stat-value">{groups.length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Payments Completed</span>
                                <span className="stat-value">{groups.filter(g => g.isPaymentDone).length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Present</span>
                                <span className="stat-value">{groups.filter(g => g.isPresent).length}</span>
                            </div>
                        </div>
                        <Table columns={columns} data={groups} emptyMessage="No registrations found for this event" />
                    </div>
                ) : (
                    <div className="empty-state">
                        <Calendar size={48} />
                        <p>Please select an event to view registrations</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegistrationManagement;