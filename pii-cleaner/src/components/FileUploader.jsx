import { useState } from 'react';
import './FileUploader.css';

function FileUploader({ onFileSelect, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="file-uploader">
      <form
        className={`upload-form ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="file-input"
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={isProcessing}
          className="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          <div className="upload-icon">📁</div>
          <p className="upload-text">
            {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
          </p>
          <p className="upload-hint">
            Supports: Images (PNG, JPG, etc.) and PDF files
          </p>
        </label>
      </form>
      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Processing file...</p>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
