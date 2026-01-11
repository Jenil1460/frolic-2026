import React from 'react';
import './Pagination.css';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="admin-pagination">
      <button className="pagination-btn" onClick={prev} disabled={page === 1}>Prev</button>
      <span className="pagination-info">Page {page} of {totalPages}</span>
      <button className="pagination-btn" onClick={next} disabled={page === totalPages}>Next</button>
    </div>
  );
};

export default Pagination;
