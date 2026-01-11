import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import './WinnerManagement.css'; 

const WinnerManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [groups, setGroups] = useState([]);
    const [winners, setWinners] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [firstPlace, setFirstPlace] = useState('');
    const [secondPlace, setSecondPlace] = useState('');
    const [thirdPlace, setThirdPlace] = useState('');

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
            const fetchEventData = async () => {
                setLoading(true);
                try {
                    const [groupsRes, winnersRes] = await Promise.all([
                        adminAPI.getGroupsByEvent(selectedEvent),
                        adminAPI.getWinnersByEvent(selectedEvent)
                    ]);
                    
                    if (groupsRes.success) {
                        setGroups(groupsRes.data);
                    } else {
                        throw new Error(groupsRes.message);
                    }

                    if (winnersRes.success && winnersRes.data) {
                        setWinners(winnersRes.data);
                        setFirstPlace(winnersRes.data.first._id);
                        setSecondPlace(winnersRes.data.second._id);
                        setThirdPlace(winnersRes.data.third._id);
                    } else {
                        setWinners(null);
                        setFirstPlace('');
                        setSecondPlace('');
                        setThirdPlace('');
                    }

                } catch (err) {
                    setError('Failed to fetch event data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchEventData();
        } else {
            setGroups([]);
            setWinners(null);
        }
    }, [selectedEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const winnerData = {
            event: selectedEvent,
            first: firstPlace,
            second: secondPlace,
            third: thirdPlace
        };

        try {
            let response;
            if (winners) { // If winners already exist, update them
                response = await adminAPI.updateWinners(winners._id, winnerData);
            } else { // Otherwise, declare new winners
                response = await adminAPI.declareWinners(winnerData);
            }

            if(response.success) {
                alert('Winners saved successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err.message || 'Failed to save winners.');
        }
    };

    return (
        <div className="winner-management">
            <h1>Winner Management</h1>
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
            {loading && <div className="loading">Loading...</div>}
            
            {selectedEvent && !loading && (
                <form onSubmit={handleSubmit} className="winner-form">
                    <div className="form-group">
                        <label>1st Place</label>
                        <select value={firstPlace} onChange={(e) => setFirstPlace(e.target.value)} required>
                            <option value="">Select Group</option>
                            {groups.map(group => (<option key={group._id} value={group._id}>{group.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>2nd Place</label>
                        <select value={secondPlace} onChange={(e) => setSecondPlace(e.target.value)} required>
                            <option value="">Select Group</option>
                            {groups.map(group => (<option key={group._id} value={group._id}>{group.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>3rd Place</label>
                        <select value={thirdPlace} onChange={(e) => setThirdPlace(e.target.value)} required>
                            <option value="">Select Group</option>
                            {groups.map(group => (<option key={group._id} value={group._id}>{group.name}</option>))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">Save Winners</button>
                </form>
            )}
        </div>
    );
};

export default WinnerManagement;
