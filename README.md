# AI File Cleansing and Analysis System

## 🔒 Cyber Security File Processing Solution

An automated AI-powered solution for cleansing and analyzing diverse file formats for Security Consultants. This system removes sensitive information (PII, client logos, names) and extracts security insights from various document types.

## 📋 Problem Statement

Security consultants work with sensitive client files containing:
- Personal Identifiable Information (PII)
- Client logos and names
- Security configurations (IAM policies, firewall rules, IDS/IPS logs)
- Data in diverse formats (PDFs, Office documents, images, etc.)

This solution automates:
1. **File Cleansing**: Removes/masks PII, client names, and logos
2. **File Analysis**: Extracts text from multiple formats using OCR and parsing
3. **Security Analysis**: Identifies and analyzes security-related content

## 🚀 Features

### File Cleansing Workflow
- ✅ PII Detection and Masking (emails, phone numbers, SSN, credit cards, addresses)
- ✅ Client name and logo removal/blurring
- ✅ Support for text and image files
- ✅ Configurable masking strategies

### File Analysis Workflow
- ✅ **Multi-format text extraction**:
  - Images (JPG, PNG, BMP, TIFF) - OCR using Tesseract
  - PDF documents
  - Word documents (.docx)
  - Excel spreadsheets (.xlsx)
  - PowerPoint presentations (.pptx)
  - Plain text files
  
- ✅ **Security content analysis**:
  - IAM Policy detection and parsing
  - Firewall rule identification
  - IDS/IPS log analysis
  
- ✅ **Automated insights generation**:
  - PII detection statistics
  - Security component extraction
  - Structured report generation

### User Interface
- ✅ Web-based UI for file upload and processing
- ✅ Drag-and-drop file support
- ✅ Real-time processing feedback
- ✅ Download processed files and reports
- ✅ Comprehensive results visualization

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- Tesseract OCR (for image text extraction)

### Install Tesseract OCR

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download and install from: https://github.com/UB-Mannheim/tesseract/wiki

### Install Python Dependencies

1. Clone the repository:
```bash
git clone https://github.com/LakshyaJain08/ai-test1.git
cd ai-test1
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

## 🎯 Usage

### Starting the Application

1. Navigate to the project directory:
```bash
cd ai-test1
```

2. Run the Flask application:
```bash
python src/api/app.py
```

3. Open your browser and navigate to:
```
http://localhost:5000
```

### Using the Web Interface

1. **Upload a File**:
   - Click the upload area or drag & drop a file
   - Supported formats: PDF, Word, Excel, PowerPoint, Images, Text

2. **Configure Options**:
   - Enter client name to mask (optional)
   - Select cleansing and analysis options

3. **Process the File**:
   - **Cleanse**: Remove PII and sensitive information
   - **Analyze**: Extract and analyze security content
   - **Cleanse & Analyze**: Complete workflow

4. **View Results**:
   - See detected PII, masked items, and security insights
   - Download cleaned files and analysis reports

### Backend API Usage

The system provides REST APIs for programmatic access:

#### Upload File
```bash
curl -X POST -F "file=@document.pdf" http://localhost:5000/api/upload
```

#### Cleanse File
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename": "document.pdf", "client_name": "Acme Corp"}' \
  http://localhost:5000/api/cleanse
```

#### Analyze File
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename": "document.pdf"}' \
  http://localhost:5000/api/analyze
```

#### Download Processed File
```bash
curl -O http://localhost:5000/api/download/cleaned_document.txt
```

## 📁 Project Structure

```
ai-test1/
├── src/
│   ├── cleansing/
│   │   ├── pii_detector.py      # PII detection and masking
│   │   └── image_cleaner.py     # Logo removal from images
│   ├── analysis/
│   │   ├── text_extractor.py    # Multi-format text extraction
│   │   └── security_analyzer.py # Security content analysis
│   └── api/
│       └── app.py               # Flask API
├── static/
│   ├── style.css                # UI styles
│   └── script.js                # Frontend logic
├── templates/
│   └── index.html               # Web interface
├── uploads/                     # Uploaded files (gitignored)
├── output/                      # Processed files (gitignored)
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## 🔍 Supported File Formats

| Category | Formats | Processing Method |
|----------|---------|-------------------|
| Images | .jpg, .jpeg, .png, .bmp, .tiff | OCR (Tesseract) + Logo blurring |
| PDF | .pdf | Text extraction (PyPDF2) |
| Word | .docx | Document parsing (python-docx) |
| Excel | .xlsx | Spreadsheet parsing (openpyxl) |
| PowerPoint | .pptx | Slide content extraction (python-pptx) |
| Text | .txt | Direct reading |

## 🔐 Security Features

### PII Detection
The system detects and masks:
- Email addresses
- Phone numbers
- Social Security Numbers (SSN)
- Credit card numbers
- IP addresses
- Physical addresses
- Dates

### Security Analysis
Identifies and analyzes:
- **IAM Policies**: Effect, Action, Resource, Principal
- **Firewall Rules**: Rule numbers, actions, protocols, ports, IPs
- **IDS/IPS Logs**: Timestamps, severity, alerts, signatures, source/dest IPs

## 🧪 Testing

### Manual Testing

1. Prepare test files with sample data
2. Upload through the web interface
3. Verify PII is properly masked
4. Check analysis results for accuracy

### Sample Test Data

Create test files containing:
- Sample PII (fake emails, phone numbers)
- IAM policy JSON snippets
- Firewall rule configurations
- IDS/IPS log entries

## 🚧 Limitations

- Logo detection uses heuristic-based approach (corners and header regions)
- OCR accuracy depends on image quality
- Large files (>16MB) are rejected
- Processing time varies by file size and complexity
- Advanced PII detection would benefit from ML models (Presidio is included but basic regex is used for simplicity)

## 🔮 Future Enhancements

- [ ] Advanced ML-based logo detection
- [ ] Enhanced PII detection using Presidio/spaCy
- [ ] Support for more file formats (scanned PDFs, CSV, etc.)
- [ ] Batch file processing
- [ ] User authentication and file management
- [ ] Cloud storage integration
- [ ] Advanced security analysis (vulnerability detection, compliance checking)
- [ ] Export reports in multiple formats (PDF, CSV, etc.)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a demonstration system for cyber security file processing. For production use, additional security hardening, scalability improvements, and comprehensive testing would be required.