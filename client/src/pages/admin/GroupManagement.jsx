import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import './GroupManagement.css'; 

const GroupManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                setError('Failed to fetch events.');
            }
        };
        fetchEvents();
    }, []);

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
                    setError('Failed to fetch groups.');
                } finally {
                    setLoading(false);
                }
            };
            fetchGroups();
        } else {
            setGroups([]);
        }
    }, [selectedEvent]);

    const handleStatusChange = async (groupId, field, value) => {
        try {
            const res = await adminAPI.updateGroup(groupId, { [field]: value });
            if (res.success) {
                const updatedGroups = groups.map(g => g._id === groupId ? res.data : g);
                setGroups(updatedGroups);
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            setError('Failed to update group status.');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            try {
                const res = await adminAPI.deleteGroup(id);
                if (res.success) {
                    const updatedGroups = groups.filter(g => g._id !== id);
                    setGroups(updatedGroups);
                } else {
                    throw new Error(res.message);
                }
            } catch (err) {
                setError(err.message || 'Failed to delete group.');
            }
        }
    };

    return (
        <div className="group-management">
            <h1>Group Management</h1>
            <div className="event-selector">
                <label>Select an Event: </label>
                <select onChange={(e) => setSelectedEvent(e.target.value)} value={selectedEvent}>
                    <option value="">-- Select Event --</option>
                    {events.map(event => (
                        <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                </select>
            </div>
            {error && <div className="error">{error}</div>}
            {loading ? <div className="loading">Loading groups...</div> : (
                <table className="groups-table">
                    <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Group Leader</th>
                            <th>Participants</th>
                            <th>Payment Done</th>
                            <th>Present</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.groupLeader?.fullName}</td>
                                <td>{group.participants.length}</td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={group.isPaymentDone} 
                                        onChange={(e) => handleStatusChange(group._id, 'isPaymentDone', e.target.checked)}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={group.isPresent} 
                                        onChange={(e) => handleStatusChange(group._id, 'isPresent', e.target.checked)}
                                    />
                                </td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleDelete(group._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GroupManagement;
