import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical, FiTrash, FiDownload, FiSave, FiPlus, FiHome, FiFilter, FiChevronUp, FiChevronDown, FiUserPlus, FiUploadCloud, FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import logo from "../../assets/logo2.png";

const defaultColumns = Array.from({ length: 8 }, (_, i) => `Column ${i + 1}`);
const defaultRows = Array.from({ length: 100 }, (_, rowIndex) => [
    rowIndex + 1,
    ...Array(8).fill(''),
]);

const CSVEditor = () => {
    const [fileName, setFileName] = useState('Untitled');
    const [columns, setColumns] = useState(defaultColumns);
    const [rows, setRows] = useState(defaultRows);
    const [menuOpenIndex, setMenuOpenIndex] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState(null);
    const dropdownRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuOpenIndex !== null &&
                dropdownRefs.current[menuOpenIndex] &&
                !dropdownRefs.current[menuOpenIndex].contains(event.target)
            ) {
                setMenuOpenIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpenIndex]);

    const goHome = () => {
        window.location.href = '/';
    };

    const goDashboard = () => {
        window.location.href = '/dashboard';
    };

    const handleAddColumn = () => {
        setColumns([...columns, `Column ${columns.length + 1}`]);
        setRows(rows.map((row) => [...row, '']));
        toast.success("New column added");
    };

    const handleAddRow = () => {
        setRows([...rows, [rows.length + 1, ...Array(columns.length).fill('')]]);
        toast.success("New row added");
    };

    const handleDeleteColumn = (index) => {
        const newColumns = [...columns];
        newColumns.splice(index, 1);
        setColumns(newColumns);

        const newRows = rows.map((row) => {
            const newRow = [...row];
            newRow.splice(index + 1, 1);
            return newRow;
        });
        setRows(newRows);

        setMenuOpenIndex(null);
        toast.error(`Deleted column ${index + 1}`);
    };

    const handleDeleteRow = (rowIndex) => {
        const updatedRows = [...rows];
        updatedRows.splice(rowIndex, 1); // Remove the row

        // Recompute S.No for all rows
        const reindexedRows = updatedRows.map((row, index) => [index + 1, ...row.slice(1)]);

        setRows(reindexedRows);
        toast.error("Row deleted");
    };


    const handleSave = () => {
        localStorage.setItem(
            `${fileName}.csv`,
            JSON.stringify({ columns, rows })
        );
        toast.success('File saved locally!');
    };

    const handleDownload = () => {
        let filteredRows = rows;
        
        toast.success(`${fileName}.csv downloaded`);
        Object.entries(filters).forEach(([colIndexStr, filterVal]) => {
            const colIndex = parseInt(colIndexStr);
            if (filterVal) {
                filteredRows = filteredRows.filter((row) =>
                    row[colIndex + 1].toString().toLowerCase().includes(filterVal.toLowerCase())
                );
            }
        }
    );

        if (sortConfig) {
            filteredRows = [...filteredRows].sort((a, b) => {
                const aVal = a[sortConfig.index + 1];
                const bVal = b[sortConfig.index + 1];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const csvContent = [
            columns.join(','),
            ...filteredRows.map((row) => row.slice(1).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCellChange = (value, rowIndex, colIndex) => {
        const updatedRows = [...rows];

        // Prevent editing S.No (colIndex === 0 is S.No, which should never be editable)
        if (colIndex === -1) return;

        updatedRows[rowIndex][colIndex + 1] = value; // +1 because index 0 is S.No
        setRows(updatedRows);
    };


    const handleSortAsc = (index) => {
        setSortConfig({ index, direction: 'asc' });
        setMenuOpenIndex(null);
    };
    const handleSortDesc = (index) => {
        setSortConfig({ index, direction: 'desc' });
        setMenuOpenIndex(null);
    };

    const toggleFilterInput = (index) => {
        if (filters[index] === undefined) {
            setFilters({ ...filters, [index]: '' });
        } else {
            const newFilters = { ...filters };
            delete newFilters[index];
            setFilters(newFilters);
        }
    };

    const handleFilterChange = (index, val) => {
        setFilters({ ...filters, [index]: val });
    };

    let displayedRows = rows;
    Object.entries(filters).forEach(([colIndexStr, filterVal]) => {
        const colIndex = parseInt(colIndexStr);
        if (filterVal) {
            displayedRows = displayedRows.filter((row) =>
                row[colIndex + 1].toString().toLowerCase().includes(filterVal.toLowerCase())
            );
        }
    });

    if (sortConfig) {
        displayedRows = [...displayedRows].sort((a, b) => {
            const aVal = a[sortConfig.index + 1];
            const bVal = b[sortConfig.index + 1];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return (
        <div className="p-4 w-full max-w-full">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Logo */}
                <img
                    src={logo}
                    alt="Logo"
                    className="w-8 h-8 cursor-pointer"
                    onClick={goHome}
                    title="Go to Home"
                />

                {/* Filename input */}
                <input
                    className="w-48 truncate text-sm sm:text-base font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 rounded"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                    }}
                    placeholder="File name"
                />

                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm cursor-pointer"
                    title="Save File"
                >
                    <FiSave /> Save
                </button>

                {/* Download button */}
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm cursor-pointer"
                    title="Download CSV"
                >
                    <FiDownload /> Download
                </button>

                {/* Dashboard button */}
                <button
                    onClick={goDashboard}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm cursor-pointer"
                    title="Go to Dashboard"
                >
                    <FiUpload /> Upload Existing File
                </button>
            </div>


            {/* Add column and row */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleAddColumn}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition cursor-pointer"
                    title="Add Column"
                >
                    <FiPlus /> Add Column
                </button>
                <button
                    onClick={handleAddRow}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition cursor-pointer"
                    title="Add Row"
                >
                    <FiPlus /> Add Row
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[600px] border border-gray-300 rounded">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="border border-gray-300 px-2 py-1 sticky bg-gray-200 z-10">S.No</th>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 px-2 py-1 relative bg-gray-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <input
                                            className="w-full bg-transparent focus:outline-none text-sm font-semibold"
                                            value={col}
                                            onChange={(e) => {
                                                const newCols = [...columns];
                                                newCols[index] = e.target.value;
                                                setColumns(newCols);
                                            }}
                                        />
                                        <div
                                            ref={(el) => (dropdownRefs.current[index] = el)}
                                            className="relative"
                                        >
                                            <button
                                                onClick={() =>
                                                    setMenuOpenIndex(menuOpenIndex === index ? null : index)
                                                }
                                                className="p-1 hover:bg-gray-200 rounded"
                                                aria-label="Open column menu"
                                            >
                                                <FiMoreVertical />
                                            </button>
                                            {menuOpenIndex === index && (
                                                <div className="absolute top-6 right-0 bg-white border border-gray-300 rounded shadow-md z-30 w-44 absolute z-50 ">
                                                    <ul className="text-left text-sm">
                                                        <li
                                                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center gap-2"
                                                            onClick={() => handleSortAsc(index)}
                                                        >
                                                            <FiChevronUp /> Sort Asc
                                                        </li>
                                                        <li
                                                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center gap-2"
                                                            onClick={() => handleSortDesc(index)}
                                                        >
                                                            <FiChevronDown /> Sort Desc
                                                        </li>
                                                        <li
                                                            className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center gap-2"
                                                            onClick={() => toggleFilterInput(index)}
                                                        >
                                                            <FiFilter /> Filter
                                                        </li>
                                                        <li
                                                            className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-600 flex items-center gap-2"
                                                            onClick={() => handleDeleteColumn(index)}
                                                        >
                                                            <FiTrash /> Delete Column
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Show filter input below header if active */}
                                    {filters[index] !== undefined && (
                                        <input
                                            type="text"
                                            placeholder={`Filter ${columns[index]}`}
                                            className="w-full border border-gray-300 mt-1 rounded px-1 text-xs"
                                            value={filters[index]}
                                            onChange={(e) => handleFilterChange(index, e.target.value)}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="border border-gray-300 px-2 py-1 bg-white z-10 text-center">
                                    {row[0]}
                                </td>
                                {columns.map((_, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent focus:outline-none text-sm"
                                            value={row[colIndex + 1]}
                                            onChange={(e) =>
                                                handleCellChange(e.target.value, rowIndex, colIndex)
                                            }
                                        />
                                    </td>
                                ))}
                                <td className="border border-gray-300 px-2 py-1 text-center">
                                    <button
                                        onClick={() => handleDeleteRow(rowIndex)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete Row"
                                    >
                                        <FiTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CSVEditor;