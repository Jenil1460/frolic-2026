import React from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick, emptyMessage = 'No data available' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="admin-table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="admin-table-header-cell">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`admin-table-row ${onRowClick ? 'admin-table-row-clickable' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="admin-table-cell">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="admin-table-mobile-cards">
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="admin-table-mobile-card"
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="admin-table-mobile-card-row">
                <div>
                  <div className="admin-table-mobile-label">{column.header}</div>
                  <div className="admin-table-mobile-value">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Table;