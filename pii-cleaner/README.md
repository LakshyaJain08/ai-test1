# 🔒 AI-Powered PII Cleaner & Analyzer

A comprehensive React-based web application for detecting and masking Personally Identifiable Information (PII) in documents, performing OCR text extraction, and analyzing AWS IAM policies for security risks.

## 🌟 Features

### 1. PII Detection & Cleansing
- **OCR Text Extraction**: Extract text from images (PNG, JPG, etc.) and PDF documents
- **Automatic PII Detection**: Identifies multiple types of sensitive information:
  - Email addresses
  - Phone numbers
  - Social Security Numbers (SSN)
  - Credit card numbers
  - Names
  - IP addresses
  - URLs
  - AWS Access Keys
  - AWS Secret Keys
- **Secure PII Masking**: Automatically masks detected PII with appropriate placeholders
- **Downloadable Reports**: Export original text, masked text, and PII detection reports

### 2. IAM Policy Analyzer
- **Security Risk Assessment**: Analyzes AWS IAM policies for potential security vulnerabilities
- **Risk Classification**: Categorizes risks as High, Medium, or Low severity
- **Detailed Recommendations**: Provides actionable security recommendations
- **Policy Validation**: Checks for common security issues:
  - Wildcard permissions (`*`)
  - Overly permissive actions
  - Missing conditions
  - Dangerous permissions

### 3. Privacy-First Design
- **Client-Side Processing**: All processing happens in your browser
- **No Data Upload**: Your sensitive documents never leave your device
- **Secure by Design**: No server-side storage or transmission of data

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pii-cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📖 Usage

### PII Cleaner & OCR

1. **Upload a File**: 
   - Drag and drop an image or PDF file
   - Or click to browse and select a file

2. **Processing**: 
   - The app will automatically extract text using OCR
   - Detect PII in the extracted text
   - Generate a masked version

3. **Review Results**:
   - View the original extracted text
   - See the masked version with PII removed
   - Review the PII detection report

4. **Download**:
   - Download any of the three versions as text files

### IAM Policy Analyzer

1. **Enter IAM Policy**:
   - Paste your AWS IAM policy JSON
   - Or load the example policy to test

2. **Analyze**:
   - Click "Analyze Policy"
   - View risk assessment and summary

3. **Review Findings**:
   - Check identified security risks
   - Read recommendations for improvement
   - Understand policy structure

## 🛠️ Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tesseract.js** - OCR engine for text extraction
- **PDF.js** - PDF rendering and processing
- **Modern JavaScript** - ES6+ features

## 📁 Project Structure

```
pii-cleaner/
├── src/
│   ├── components/
│   │   ├── FileUploader.jsx      # File upload component
│   │   ├── FileUploader.css
│   │   ├── TextDisplay.jsx       # Text display and tabs
│   │   ├── TextDisplay.css
│   │   ├── IAMAnalyzer.jsx       # IAM policy analyzer
│   │   └── IAMAnalyzer.css
│   ├── utils/
│   │   ├── piiDetector.js        # PII detection logic
│   │   ├── ocrProcessor.js       # OCR processing
│   │   └── iamAnalyzer.js        # IAM policy analysis
│   ├── App.jsx                   # Main app component
│   ├── App.css
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔒 Security & Privacy

This application is designed with privacy and security as top priorities:

- **No Server Communication**: All processing happens locally in the browser
- **No Data Storage**: Nothing is stored or cached
- **Open Source**: Fully transparent code you can audit
- **Client-Side Only**: No backend or database required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Use Cases

- **Data Privacy Compliance**: Mask PII before sharing documents
- **Document Processing**: Extract and clean text from scanned documents
- **Security Auditing**: Analyze IAM policies for security risks
- **Research**: Process documents while protecting privacy
- **DevOps**: Check IAM configurations before deployment

## 🚧 Future Enhancements

- Support for more document formats (DOCX, PPTX)
- Additional PII patterns (passport numbers, driver's licenses)
- Batch processing of multiple files
- Custom PII patterns
- Export to various formats (JSON, CSV)
- More cloud policy types (Azure, GCP)

## 📧 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

Built with ❤️ using React and modern web technologies
