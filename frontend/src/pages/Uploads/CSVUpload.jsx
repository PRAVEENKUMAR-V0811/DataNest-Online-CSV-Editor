import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import Papa from 'papaparse';
import CSVViewer from '../Views/CSVViewer';
import toast from 'react-hot-toast';

const CSVUpload = () => {
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [fileName, setFileName] = useState(''); // New state for file name

  const handleFile = (file) => {
    if (!file || file.size > 300 * 1024 * 1024) {
      toast.error("File must be less than 300MB");
      return;
    }

    setLoading(true);
    toast.loading("Processing file...", { id: 'loadingToast' });

    setTimeout(() => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
          setFileName(file.name);  // Save the uploaded file name here
          setLoading(false);
          toast.dismiss('loadingToast');
          toast.success("File loaded successfully!");
        },
        error: () => {
          toast.dismiss('loadingToast');
          toast.error("Error parsing file");
          setLoading(false);
        },
      });
    }, 2000);
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {!csvData && (
        <div
          className="border-2 border-dashed border-gray-300 bg-gray-50 p-10 rounded-xl cursor-pointer hover:border-purple-400 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <FiUploadCloud className="text-4xl text-purple-500 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-600">Drag & drop your CSV file</p>
          <p className="text-sm text-gray-500">or click to browse (max 300MB)</p>
          <input
            id="fileInput"
            type="file"
            accept=".csv,.tsv,.txt"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-purple-700">Processing file...</p>
        </div>
      )}

      {csvData && !loading && (
        <CSVViewer data={csvData} initialFilename={fileName} />
      )}
    </div>
  );
};

export default CSVUpload;
