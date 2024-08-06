import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableDisplay = ({ tableName }) => {
  const [data, setData] = useState([]);
  const [riskyCount, setRiskyCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getTableData/${tableName}?page=${currentPage}&limit=100`);
        // console.log(response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setTotalPages(response.data.totalPages || 0);
          setTotalCount(response.data.totalRows);
          setRiskyCount(response.data.summary.risky || 0);
        } else {
          console.error('Invalid data structure:', response.data);
          setData([]); // Reset data to prevent errors in rendering
          setTotalPages(0); // Ensure totalPages is reset if data is invalid
          setTotalCount(0);
          setRiskyCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, [tableName, currentPage]);

  const handleImageClick = (url, event) => {
    if (!url) {
      event.preventDefault();
      alert('No image available');
    }
  };

  const renderPaginationButtons = () => {
    let buttons = [];
    if (totalPages > 0) { // Only render buttons if totalPages is greater than 0
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            disabled={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    }
    return buttons;
  };

  const safeCount = totalCount - riskyCount;

  return (
    <div className="table-display-container">
      <h2 className="sticky-table-name">Table: {tableName}</h2>
      <p>
        There are {safeCount} safe pallet locations.
      </p>
      <div className="scroll-view">
        <table>
            <thead className="sticky-header">
            <tr>
                <th>Location ID</th>
                <th>Risk Level</th>
                <th>Last Updated</th>
                <th>Image URL</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} className={item.risk_level ? 'risky' : 'safe'}>
                <td>{item.location_id}</td>
                <td>{item.risk_level ? 'Risky' : 'Safe'}</td>
                <td>{item.last_updated}</td>
                <td>
                  <a 
                    href={item.image_url || '#'}
                    onClick={(e) => handleImageClick(item.image_url, e)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Image
                  </a>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>  
      <div className="pagination-container">
        <div className="pagination-controls">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
        <div className="page-buttons-container">
            <div className="page-buttons">
                {renderPaginationButtons()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TableDisplay;