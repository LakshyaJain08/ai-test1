import { useState } from 'react';
import './TextDisplay.css';

function TextDisplay({ originalText, maskedText, detectedPII, onDownload }) {
  const [activeTab, setActiveTab] = useState('original');

  const renderPIIReport = () => {
    if (!detectedPII || Object.keys(detectedPII).length === 0) {
      return <p className="no-pii">✓ No PII detected in the text.</p>;
    }

    return (
      <div className="pii-report">
        <h3>Detected PII:</h3>
        {Object.entries(detectedPII).map(([type, items]) => (
          <div key={type} className="pii-category">
            <h4>{type.toUpperCase()}</h4>
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="text-display">
      <div className="tab-controls">
        <button
          className={`tab-button ${activeTab === 'original' ? 'active' : ''}`}
          onClick={() => setActiveTab('original')}
        >
          Original Text
        </button>
        <button
          className={`tab-button ${activeTab === 'masked' ? 'active' : ''}`}
          onClick={() => setActiveTab('masked')}
        >
          Masked Text
        </button>
        <button
          className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          PII Report
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'original' && (
          <div className="text-container">
            <div className="text-header">
              <h3>Original Extracted Text</h3>
              <button onClick={() => onDownload('original')} className="download-btn">
                Download
              </button>
            </div>
            <pre className="text-content">{originalText || 'No text extracted yet.'}</pre>
          </div>
        )}

        {activeTab === 'masked' && (
          <div className="text-container">
            <div className="text-header">
              <h3>Masked Text (PII Removed)</h3>
              <button onClick={() => onDownload('masked')} className="download-btn">
                Download
              </button>
            </div>
            <pre className="text-content">{maskedText || 'Process a file to see masked text.'}</pre>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="text-container">
            <div className="text-header">
              <h3>PII Detection Report</h3>
              <button onClick={() => onDownload('report')} className="download-btn">
                Download
              </button>
            </div>
            <div className="report-content">
              {renderPIIReport()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextDisplay;
