import { useState } from 'react';
import FileUploader from './components/FileUploader';
import TextDisplay from './components/TextDisplay';
import IAMAnalyzer from './components/IAMAnalyzer';
import { OCRProcessor } from './utils/ocrProcessor';
import { PIIDetector } from './utils/piiDetector';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('pii-cleaner');
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [maskedText, setMaskedText] = useState('');
  const [detectedPII, setDetectedPII] = useState({});
  const [progress, setProgress] = useState(0);

  const ocrProcessor = new OCRProcessor();
  const piiDetector = new PIIDetector();

  const handleFileSelect = async (file) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Extract text using OCR
      const extractedText = await ocrProcessor.processFile(file, (prog) => {
        setProgress(Math.round(prog));
      });
      
      setOriginalText(extractedText);
      
      // Detect PII
      const detected = piiDetector.detectPII(extractedText);
      setDetectedPII(detected);
      
      // Mask PII
      const masked = piiDetector.maskPII(extractedText);
      setMaskedText(masked);
      
      setProgress(100);
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error processing file: ' + error.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = (type) => {
    let content = '';
    let filename = '';
    
    switch (type) {
      case 'original':
        content = originalText;
        filename = 'original-text.txt';
        break;
      case 'masked':
        content = maskedText;
        filename = 'masked-text.txt';
        break;
      case 'report':
        content = piiDetector.generateReport(detectedPII);
        filename = 'pii-report.txt';
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔒 AI-Powered PII Cleaner & Analyzer</h1>
        <p className="app-subtitle">
          Extract text from documents, detect and mask sensitive information, analyze IAM policies
        </p>
      </header>

      <div className="tab-navigation">
        <button
          className={`nav-tab ${activeTab === 'pii-cleaner' ? 'active' : ''}`}
          onClick={() => setActiveTab('pii-cleaner')}
        >
          📄 PII Cleaner & OCR
        </button>
        <button
          className={`nav-tab ${activeTab === 'iam-analyzer' ? 'active' : ''}`}
          onClick={() => setActiveTab('iam-analyzer')}
        >
          🔐 IAM Policy Analyzer
        </button>
      </div>

      <main className="app-content">
        {activeTab === 'pii-cleaner' && (
          <div className="pii-cleaner-section">
            <div className="section-description">
              <h2>PII Detection & Cleansing</h2>
              <p>
                Upload images or PDF files to extract text using OCR, detect personally identifiable
                information (PII), and generate masked versions with PII removed.
              </p>
              <div className="features-list">
                <div className="feature-item">✓ OCR text extraction from images and PDFs</div>
                <div className="feature-item">✓ Automatic PII detection (emails, phones, SSN, etc.)</div>
                <div className="feature-item">✓ Secure PII masking and removal</div>
                <div className="feature-item">✓ Downloadable reports</div>
              </div>
            </div>

            <FileUploader
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
            />

            {progress > 0 && progress < 100 && (
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{progress}% Complete</p>
              </div>
            )}

            {originalText && (
              <TextDisplay
                originalText={originalText}
                maskedText={maskedText}
                detectedPII={detectedPII}
                onDownload={handleDownload}
              />
            )}
          </div>
        )}

        {activeTab === 'iam-analyzer' && (
          <div className="iam-analyzer-section">
            <IAMAnalyzer />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React, Tesseract.js, and PDF.js | 
          Secure, client-side processing - your data never leaves your browser
        </p>
      </footer>
    </div>
  );
}

export default App;
