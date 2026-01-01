import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import Card from '../../components/admin/Card';
import Table from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import useDebounce from '../../hooks/useDebounce';
import './ActivityLogs.css';
import { useToast } from '../../components/admin/ToastContainer';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await adminAPI.getActivityLogs({ q: debouncedQ, page: p, limit: 20 });
      if (res.success) {
        setLogs(res.data.logs);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const columns = [
    { header: 'Timestamp', render: (l) => new Date(l.createdAt).toLocaleString() },
    { header: 'Admin', render: (l) => l.admin?.fullName || 'System' },
    { header: 'Action', accessor: 'action' },
    { header: 'Target', render: (l) => `${l.target || ''} ${l.targetId || ''}` },
    { header: 'Details', render: (l) => JSON.stringify(l.details || {}) }
  ];

  return (
    <div className="activity-logs">
      <Card title="System Activity Logs" subtitle="Audit trail of admin actions">
        <div className="logs-header">
          <input placeholder="Search logs" value={q} onChange={(e) => setQ(e.target.value)} className="search-input" />
        </div>
        {loading ? <div>Loading...</div> : (
          <>
            <Table columns={columns} data={logs} emptyMessage="No logs found" />
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchLogs(p)} />
          </>
        )}
      </Card>
    </div>
  );
};

export default ActivityLogs;
