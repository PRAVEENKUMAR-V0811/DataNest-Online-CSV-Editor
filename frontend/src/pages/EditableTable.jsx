import React, { useState, useRef, useEffect } from 'react';

const EditableTable = ({ rows = 5, cols = 5 }) => {
  const [data, setData] = useState(Array(rows).fill().map(() => Array(cols).fill('')));
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const inputRefs = useRef([]);

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

    if (e.key === 'Enter' || e.key === 'ArrowDown') nextRow = (row + 1) % rows;
    else if (e.key === 'ArrowUp') nextRow = (row - 1 + rows) % rows;
    else if (e.key === 'ArrowRight') nextCol = (col + 1) % cols;
    else if (e.key === 'ArrowLeft') nextCol = (col - 1 + cols) % cols;
    else if (e.key === 'Backspace') {
      e.preventDefault();
      const updated = [...data];
      if (rangeStart && rangeEnd) {
        // Clear all cells in range
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (isInRange(r, c)) updated[r][c] = '';
          }
        }
      } else {
        updated[row][col] = '';
      }
      setData(updated);
      return;
    } else {
      return;
    }

    e.preventDefault();
    setSelectedCell({ row: nextRow, col: nextCol });
    setRangeStart(null);
    setRangeEnd(null);
  };

  const handleChange = (e, row, col) => {
    const updated = [...data];
    updated[row][col] = e.target.value;
    setData(updated);
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
    <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
      <tbody>
        {data.map((rowData, row) => (
          <tr key={row}>
            {rowData.map((cell, col) => {
              const isSelected = selectedCell.row === row && selectedCell.col === col;
              const isHighlighted = isInRange(row, col);

              if (!inputRefs.current[row]) inputRefs.current[row] = [];

              return (
                <td
                  key={col}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseOver={(e) => {
                    if (e.buttons === 1) handleMouseOver(row, col);
                  }}
                  onMouseUp={handleMouseUp}
                  style={{
                    border: '1px solid #ccc',
                    padding: 0,
                    backgroundColor: isHighlighted || isSelected ? '#cce5ff' : 'transparent',
                  }}
                >
                  <input
                    ref={(el) => (inputRefs.current[row][col] = el)}
                    type="text"
                    value={cell}
                    onChange={(e) => handleChange(e, row, col)}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    style={{
                      width: '100px',
                      height: '30px',
                      border: 'none',
                      outline: 'none',
                      textAlign: 'center',
                      background: 'transparent',
                    }}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
