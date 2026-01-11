import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Trophy, Calendar, Award } from 'lucide-react';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';
import { useToast } from '../../components/admin/ToastContainer';
import './ResultManagement.css';

const ResultManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [groups, setGroups] = useState([]);
    const [winners, setWinners] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

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
                showError('Failed to fetch events.');
            }
        };
        fetchEvents();
    }, [showError]);

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
                    showError('Failed to fetch event data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchEventData();
        } else {
            setGroups([]);
            setWinners(null);
        }
    }, [selectedEvent, showError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!firstPlace || !secondPlace || !thirdPlace) {
            showError('Please select all three winners');
            return;
        }

        if (firstPlace === secondPlace || firstPlace === thirdPlace || secondPlace === thirdPlace) {
            showError('Please select different groups for each position');
            return;
        }

        const winnerData = {
            event: selectedEvent,
            first: firstPlace,
            second: secondPlace,
            third: thirdPlace
        };

        try {
            let response;
            if (winners) {
                response = await adminAPI.updateWinners(winners._id, winnerData);
            } else {
                response = await adminAPI.declareWinners(winnerData);
            }

            if(response.success) {
                showSuccess('Winners saved successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            showError(err.message || 'Failed to save winners.');
        }
    };

    return (
        <div className="result-management">
            <Card 
                title="Result Management" 
                subtitle="Declare and manage event winners"
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

                {loading && (
                    <div className="admin-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                )}
                
                {selectedEvent && !loading && (
                    <form onSubmit={handleSubmit} className="winner-form">
                        <div className="winner-grid">
                            <div className="winner-card winner-first">
                                <div className="winner-header">
                                    <Trophy size={32} />
                                    <h3>1st Place</h3>
                                </div>
                                <select 
                                    value={firstPlace} 
                                    onChange={(e) => setFirstPlace(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="winner-card winner-second">
                                <div className="winner-header">
                                    <Award size={28} />
                                    <h3>2nd Place</h3>
                                </div>
                                <select 
                                    value={secondPlace} 
                                    onChange={(e) => setSecondPlace(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="winner-card winner-third">
                                <div className="winner-header">
                                    <Award size={24} />
                                    <h3>3rd Place</h3>
                                </div>
                                <select 
                                    value={thirdPlace} 
                                    onChange={(e) => setThirdPlace(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>{group.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <Button type="submit" variant="primary" icon={Trophy}>
                                {winners ? 'Update Winners' : 'Declare Winners'}
                            </Button>
                        </div>
                    </form>
                )}

                {!selectedEvent && !loading && (
                    <div className="empty-state">
                        <Trophy size={48} />
                        <p>Please select an event to declare winners</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ResultManagement;