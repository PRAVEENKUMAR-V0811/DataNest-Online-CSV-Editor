import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical, FiTrash, FiDownload, FiSave, FiPlus, FiFilter, FiUpload } from 'react-icons/fi';
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
    const dropdownRefs = useRef({});

    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [rangeStart, setRangeStart] = useState(null);
    const [rangeEnd, setRangeEnd] = useState(null);
    const inputRefs = useRef([]);


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


    const toggleFilterInput = () => {
        if (Object.keys(filters).length === 0) {
            // Enable all filters
            const allFilters = {};
            columns.forEach((_, index) => {
                allFilters[index] = '';
            });
            setFilters(allFilters);
        } else {
            // Disable all filters
            setFilters({});
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

    const focusCell = ({ row, col }) => {
        const input = inputRefs.current[row]?.[col];
        if (input) input.focus();
    };

    useEffect(() => {
        focusCell(selectedCell);
    }, [selectedCell]);

    const isInRange = (row, col) => {
        if (!rangeStart || !rangeEnd) return false;
        const rowMin = Math.min(rangeStart.row, rangeEnd.row);
        const rowMax = Math.max(rangeStart.row, rangeEnd.row);
        const colMin = Math.min(rangeStart.col, rangeEnd.col);
        const colMax = Math.max(rangeStart.col, rangeEnd.col);
        return row >= rowMin && row <= rowMax && col >= colMin && col <= colMax;
    };

    const handleKeyDown = (e, row, col) => {
    let nextRow = row;
    let nextCol = col;

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
        nextRow = (row + 1) % rows.length;
    } else if (e.key === 'ArrowUp') {
        nextRow = (row - 1 + rows.length) % rows.length;
    } else if (e.key === 'ArrowRight') {
        nextCol = (col + 1) % columns.length;
    } else if (e.key === 'ArrowLeft') {
        nextCol = (col - 1 + columns.length) % columns.length;
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        const updated = [...rows];

        if (rangeStart && rangeEnd) {
            // If there's a selected range, clear all those cells
            for (let r = 0; r < rows.length; r++) {
                for (let c = 0; c < columns.length; c++) {
                    if (isInRange(r, c)) {
                        updated[r][c + 1] = '';
                    }
                }
            }
        } else {
            // Delete last character from current cell's text
            const currentVal = updated[row][col + 1];
            updated[row][col + 1] = currentVal ? currentVal.slice(0, -1) : '';
        }

        setRows(updated);
        return;
    } else {
        // If key is not handled, do nothing
        return;
    }

    e.preventDefault();
    setSelectedCell({ row: nextRow, col: nextCol });
    setRangeStart(null);
    setRangeEnd(null);
};


    const handleMouseDown = (row, col) => {
        setSelectedCell({ row, col });
        setRangeStart({ row, col });
        setRangeEnd(null);
    };

    const handleMouseOver = (row, col) => {
        if (rangeStart) {
            setRangeEnd({ row, col });
        }
    };

    const handleMouseUp = () => {
        if (rangeStart && rangeEnd === null) {
            setRangeEnd(rangeStart); // single-cell select
        }
    };



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
                <button
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center gap-2"
                    onClick={toggleFilterInput}
                >
                    <FiFilter /> Filter
                </button>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[600px] border border-gray-300 rounded">
                <table className="table-auto w-full border-collapse text-center">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1 text-center">S.No</th>
                            {columns.map((col, index) => (
                                <th key={index} className="border px-2 py-1 text-center relative">
                                    {col}
                                    <button
                                        onClick={() => setMenuOpenIndex(index)}
                                        className="absolute top-1 right-1"
                                    >
                                        <FiMoreVertical />
                                    </button>
                                    {menuOpenIndex === index && (
                                        <div ref={(ref) => dropdownRefs.current[index] = ref} className="absolute bg-white border shadow p-2 z-10 right-0">
                                            <button onClick={() => handleDeleteColumn(index)} className="flex items-center text-sm">
                                                <FiTrash className="mr-1" /> Delete Column
                                            </button>
                                        </div>
                                    )}
                                    {filters[index] !== undefined && (
                                        <input
                                            className="w-full text-sm border mt-1"
                                            placeholder="Filter"
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
                            <tr key={rowIndex}>
                                {row.map((cell, colIndex) => {
                                    const actualCol = colIndex - 1;

                                    if (colIndex === 0) {
                                        return (
                                            <td key={colIndex} className="border px-2 py-1">{cell}</td>
                                        );
                                    }

                                    if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];

                                    const isSelected = selectedCell.row === rowIndex && selectedCell.col === actualCol;
                                    const isHighlighted = isInRange(rowIndex, actualCol);

                                    return (
                                        <td
                                            key={colIndex}
                                            onMouseDown={() => handleMouseDown(rowIndex, actualCol)}
                                            onMouseOver={(e) => {
                                                if (e.buttons === 1) handleMouseOver(rowIndex, actualCol);
                                            }}
                                            onMouseUp={handleMouseUp}
                                            className={`border p-0 ${isHighlighted || isSelected ? 'bg-blue-100' : ''}`}
                                        >
                                            <input
                                                ref={(el) => inputRefs.current[rowIndex][actualCol] = el}
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleCellChange(e.target.value, rowIndex, actualCol)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, actualCol)}
                                                className="w-full px-2 py-1 outline-none bg-transparent"
                                            />
                                        </td>
                                    );
                                })}
                                <td className="border px-2 py-1 ">
                                    <button onClick={() => handleDeleteRow(rowIndex)} title="Delete Row">
                                        <FiTrash className="text-red-600"/>
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