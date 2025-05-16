import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiDownload,
  FiX,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiMoreVertical,
  FiArrowDown,
  FiArrowUp,
  FiEye,
  FiSave,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CSVRow = ({ rowIndex, rowData, columns, onCellChange, onDelete }) => {
  return (
    <tr className="hover:bg-gray-100">
      {columns.map((col) => (
        <td key={col} className="border-b border-gray-300 px-4 py-3 whitespace-nowrap max-w-xs">
          <input
            type="text"
            value={rowData[col] ?? ''}
            onChange={(e) => onCellChange(rowIndex, col, e.target.value)}
            className="w-full border-none focus:outline-none bg-transparent text-gray-700"
          />
        </td>
      ))}
      <td className="border-b border-gray-300 px-4 py-3 text-center">
        <button onClick={() => onDelete(rowIndex)} className="text-red-500 hover:text-red-700">
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

const CSVViewer = ({ data, initialFilename, onSave }) => {
  const [tableData, setTableData] = useState(data);
  const [filename, setFilename] = useState(initialFilename);
  const [editingFilename, setEditingFilename] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [dropdownOpenFor, setDropdownOpenFor] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const sortedData = useMemo(() => {
    if (!sortConfig) return tableData;

    const { column, direction } = sortConfig;

    return [...tableData].sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tableData, sortConfig]);


useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpenFor(null);
    }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

useEffect(() => {
  setCurrentPage(1);
}, [filters, sortConfig, hiddenColumns]);



  if (!tableData || tableData.length === 0) {
    return <p className="text-center text-red-700 font-bold mt-4 text-4xl">No data found! Get started by hitting the '+ Create New File' button below</p>;
  }

  let columns = Object.keys(tableData[0]).filter((col) => !hiddenColumns.includes(col));


  const filteredData = sortedData.filter((row) =>
    columns.every((col) =>
      filters[col] ? (row[col]?.toString().toLowerCase().includes(filters[col].toLowerCase())) : true
    )
  );

  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const pageStartIndex = (currentPage - 1) * rowsPerPage;
  const pageEndIndex = Math.min(pageStartIndex + rowsPerPage, totalRows);
  const paginatedData = filteredData.slice(pageStartIndex, pageEndIndex);

  const handleCellChange = (rowIndex, columnKey, value) => {
    const actualIndex = pageStartIndex + rowIndex;
    const updatedData = [...tableData];
    updatedData[actualIndex] = { ...updatedData[actualIndex], [columnKey]: value };
    setTableData(updatedData);
  };

  const handleDeleteRow = (rowIndex) => {
    const actualIndex = pageStartIndex + rowIndex;
    setTableData(tableData.filter((_, idx) => idx !== actualIndex));
  };

  const handleAddRow = () => {
    const emptyRow = {};
    Object.keys(tableData[0]).forEach((col) => (emptyRow[col] = ''));
    setTableData([...tableData, emptyRow]);
     toast.success("New row added");
  };

  const handleFilterChange = (col, value) => {
    setFilters((prev) => ({ ...prev, [col]: value }));
  };

  const saveFilename = () => {
    if (filename.trim() === '') return;
    setEditingFilename(false);
    toast.success("File Name Saved");
  };

const handleDownload = () => {
  if (!tableData || tableData.length === 0) {
    return;
  }

  const csvRows = [];
  const allColumns = Object.keys(tableData[0]);
  csvRows.push(allColumns.join(','));

  filteredData.forEach((row) => {
    const vals = allColumns.map(
      (col) => `"${(row[col] ?? '').toString().replace(/"/g, '""')}"`
    );
    csvRows.push(vals.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  let fileToDownload = filename.trim() === '' ? 'untitled.csv' : filename.trim();
  if (!fileToDownload.toLowerCase().endsWith('.csv')) {
    fileToDownload += '.csv';
  }

  a.download = fileToDownload;

  // Append to DOM for Firefox compatibility
  document.body.appendChild(a);

  a.click();

  // Remove the element after clicking
  document.body.removeChild(a);

  // Delay revoking URL to ensure download starts
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);

  toast.success(`${fileToDownload} downloaded`);
};


  const toggleDropdown = (col) => {
    setDropdownOpenFor((prev) => (prev === col ? null : col));
  };

  

  const sortByAsc = (col) => {
    setSortConfig({ column: col, direction: 'asc' });
    setDropdownOpenFor(null);
  };

  const sortByDesc = (col) => {
    setSortConfig({ column: col, direction: 'desc' });
    setDropdownOpenFor(null);
  };

  const toggleFilter = () => {
    setFilterActive((prev) => !prev);
    setDropdownOpenFor(null);
  };

  const hideColumn = (col) => {
    setHiddenColumns((prev) => [...prev, col]);
    setDropdownOpenFor(null);
  };


  const goNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const onChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSave = () => {
    if (onSave) onSave(tableData);
    toast.success("File Saved Sucessfully");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center">
    <div className="w-full md:min-w-[1200px] sm:min-w-[1200px] p-6 bg-white rounded shadow-md text-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {editingFilename ? (
            <>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onBlur={saveFilename}
                onKeyDown={(e) => e.key === 'Enter' && saveFilename()}
                autoFocus
                className="border border-gray-300 rounded px-2 py-1 text-gray-700"
              />
              <button onClick={saveFilename} className="text-blue-600 hover:underline cursor-pointer">
                Save
              </button>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold">{filename || 'untitled.csv'}</span>
              <button
                onClick={() => setEditingFilename(true)}
                className="ml-1 text-gray-500 hover:text-gray-800"
                title="Edit filename"
              >
                <FiEdit2 />
              </button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm cursor-pointer"
            title="Download CSV"
          >
            <FiDownload />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handleClose}
            className="text-gray-700 hover:text-gray-900 font-semibold cursor-pointer"
            title="Exit viewer"
          >
            Exit <FiX className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex justify-between items-center mb-2 text-sm font-semibold text-blue-700">
        <div className="flex space-x-6">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className="flex items-center space-x-1 hover:underline cursor-pointer"
            title="Toggle Filters"
          >
            <FiFilter />
            <span>FILTERS</span>
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
            title="Save changes"
          >
            <FiSave />
            <span>Save</span>
          </button>
          <button
            onClick={handleAddRow}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
            title="Add Row"
          >
            + Add Row
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[420px] border border-gray-300 rounded">
        <table className="border-collapse w-full">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border-b border-gray-300 px-4 py-3 relative max-w-[160px]">
                  <div className="flex items-center justify-between" ref={dropdownRef}>
                    <span className="truncate">{col}</span>
                    <div className="relative cursor-pointer">
                      <button
                        onClick={() => toggleDropdown(col)}
                        className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        <FiMoreVertical />
                      </button>
                      {dropdownOpenFor === col && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10 cursor-pointer">
                        <button onClick={() => sortByAsc(col)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <FiArrowUp className="inline mr-2" /> Sort Ascending
                        </button>
                        <button onClick={() => sortByDesc(col)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <FiArrowDown className="inline mr-2" /> Sort Descending
                        </button>
                        <button onClick={toggleFilter} className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <FiFilter className="inline mr-2" /> Toggle Filter
                        </button>
                        <button onClick={() => hideColumn(col)} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                          <FiEye className="inline mr-2" /> Hide Column
                        </button>
                      </div>
                      )}
                    </div>
                  </div>
                  {filterActive && (
                    <input
                      type="text"
                      value={filters[col] || ''}
                      onChange={(e) => handleFilterChange(col, e.target.value)}
                      placeholder="Filter..."
                      className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    />
                  )}  
                </th>
              ))}
              <th className="border-b border-gray-300 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <CSVRow
                key={rowIndex}
                rowIndex={rowIndex}
                rowData={row}
                columns={columns}
                onCellChange={handleCellChange}
                onDelete={handleDeleteRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
<div className="flex justify-between items-center mt-3 text-sm text-gray-700">
  <div>
    Rows per page:{' '}
    <select value={rowsPerPage} onChange={onChangeRowsPerPage} className="border rounded px-2 py-1">
      {[10, 25, 50, 100].map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  </div>
  <div>
    <button
      onClick={goPrevPage}
      disabled={currentPage === 1}
      className="px-3 py-1 mr-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={goNextPage}
      disabled={currentPage === totalPages}
      className="px-3 py-1 ml-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</div>

    </div>
    </div>
  );
};

export default CSVViewer;