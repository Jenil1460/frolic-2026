import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import './Reports.css';

const Reports = () => {
    const [events, setEvents] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedInstitute, setSelectedInstitute] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [eventReport, setEventReport] = useState(null);
    const [instituteReport, setInstituteReport] = useState(null);
    const [departmentReport, setDepartmentReport] = useState(null);
    const [winnerReport, setWinnerReport] = useState([]);
    
    const [loading, setLoading] = useState({
        event: false, institute: false, department: false, winner: false
    });
    
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [eventsRes, instRes, deptRes] = await Promise.all([
                    adminAPI.getEvents(),
                    adminAPI.getInstitutes(),
                    adminAPI.getDepartments()
                ]);
                if (eventsRes.success) setEvents(eventsRes.data);
                if (instRes.success) setInstitutes(instRes.data);
                if (deptRes.success) setDepartments(deptRes.data);
            } catch (error) {
                setError("Failed to fetch initial data");
            }
        };
        fetchInitialData();
    }, []);

    const fetchEventReport = async () => {
        if (!selectedEvent) return;
        setLoading(prev => ({...prev, event: true}));
        try {
            const res = await adminAPI.getEventReport(selectedEvent);
            if (res.success) setEventReport(res.data);
            else throw new Error(res.message);
        } catch (error) { setError(error.message); }
        setLoading(prev => ({...prev, event: false}));
    };

    const fetchInstituteReport = async () => {
        if (!selectedInstitute) return;
        setLoading(prev => ({...prev, institute: true}));
        try {
            const res = await adminAPI.getInstituteReport(selectedInstitute);
            if (res.success) setInstituteReport(res.data);
            else throw new Error(res.message);
        } catch (error) { setError(error.message); }
        setLoading(prev => ({...prev, institute: false}));
    };
    
    const fetchDepartmentReport = async () => {
        if (!selectedDepartment) return;
        setLoading(prev => ({...prev, department: true}));
        try {
            const res = await adminAPI.getDepartmentReport(selectedDepartment);
            if (res.success) setDepartmentReport(res.data);
            else throw new Error(res.message);
        } catch (error) { setError(error.message); }
        setLoading(prev => ({...prev, department: false}));
    };

    const fetchWinnerReport = async () => {
        setLoading(prev => ({...prev, winner: true}));
        try {
            const res = await adminAPI.getWinnerReport();
            if (res.success) setWinnerReport(res.data);
            else throw new Error(res.message);
        } catch (error) { setError(error.message); }
        setLoading(prev => ({...prev, winner: false}));
    };


    return (
        <div className="reports-page">
            <h1>Reports</h1>
            {error && <div className="error">{error}</div>}
            
            <div className="report-section">
                <h2>Event-wise Report</h2>
                <select onChange={e => setSelectedEvent(e.target.value)}>
                    <option value="">Select Event</option>
                    {events.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                </select>
                <button onClick={fetchEventReport} disabled={loading.event}>
                    {loading.event ? 'Generating...' : 'Generate'}
                </button>
                {eventReport && <div>
                    <h3>Report for {eventReport.event}</h3>
                    <p>Groups: {eventReport.groupsCount}</p>
                    <p>Participants: {eventReport.participantsCount}</p>
                    <p>Payments Collected: ${eventReport.paymentsCollected}</p>
                </div>}
            </div>

            <div className="report-section">
                <h2>Institute-wise Summary</h2>
                <select onChange={e => setSelectedInstitute(e.target.value)}>
                    <option value="">Select Institute</option>
                    {institutes.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                </select>
                <button onClick={fetchInstituteReport} disabled={loading.institute}>
                    {loading.institute ? 'Generating...' : 'Generate'}
                </button>
                {instituteReport && <div>
                    <h3>Summary for {instituteReport.institute}</h3>
                    <p>Events: {instituteReport.eventsCount}</p>
                    <p>Groups: {instituteReport.groupsCount}</p>
                    <p>Participants: {instituteReport.participantsCount}</p>
                </div>}
            </div>

            <div className="report-section">
                <h2>Department-wise Participation</h2>
                 <select onChange={e => setSelectedDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <button onClick={fetchDepartmentReport} disabled={loading.department}>
                    {loading.department ? 'Generating...' : 'Generate'}
                </button>
                {departmentReport && <div>
                     <h3>Participation for {departmentReport.department}</h3>
                    <p>Events: {departmentReport.eventsCount}</p>
                    <p>Groups: {departmentReport.groupsCount}</p>
                    <p>Participants: {departmentReport.participantsCount}</p>
                </div>}
            </div>

            <div className="report-section">
                <h2>Winner Summary</h2>
                <button onClick={fetchWinnerReport} disabled={loading.winner}>
                    {loading.winner ? 'Generating...' : 'Generate Winner Report'}
                </button>
                {winnerReport.length > 0 && <table>
                    <thead><tr><th>Event</th><th>1st</th><th>2nd</th><th>3rd</th></tr></thead>
                    <tbody>
                    {winnerReport.map(w => (
                        <tr key={w._id}>
                            <td>{w.event?.name}</td>
                            <td>{w.first?.name}</td>
                            <td>{w.second?.name}</td>
                            <td>{w.third?.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>}
            </div>
        </div>
    );
};

export default Reports;
