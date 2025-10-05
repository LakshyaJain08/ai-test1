# AI-Test1 - PII Cleaner & Analyzer

## Overview

This repository contains an AI-powered solution for detecting and masking Personally Identifiable Information (PII) in documents, performing OCR text extraction, and analyzing AWS IAM policies for security vulnerabilities.

## 🚀 Quick Start

```bash
cd pii-cleaner
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application.

## 📋 Features

### 1. PII Detection & Cleansing
- Extract text from images and PDFs using OCR (Optical Character Recognition)
- Automatically detect PII including emails, phone numbers, SSN, credit cards, names, and AWS credentials
- Mask sensitive information with appropriate placeholders
- Download cleaned documents and detection reports

### 2. IAM Policy Analyzer
- Analyze AWS IAM policies for security risks
- Get risk classifications (High/Medium/Low)
- Receive actionable security recommendations
- Detect overly permissive policies and dangerous permissions

### 3. Privacy-First Design
- All processing happens client-side in your browser
- No data is uploaded to any server
- Your sensitive documents never leave your device

## 📖 Documentation

- **[Solution Walkthrough](./SOLUTION_WALKTHROUGH.md)** - Comprehensive guide to the solution architecture and features
- **[Application README](./pii-cleaner/README.md)** - Detailed usage instructions and technical documentation

## 🛠️ Technologies

- React 19 + Vite
- Tesseract.js (OCR)
- PDF.js (PDF Processing)
- Modern JavaScript (ES6+)

## 📁 Project Structure

```
ai-test1/
├── pii-cleaner/              # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/            # Utility functions
│   │   └── ...
│   ├── package.json
│   └── README.md
├── SOLUTION_WALKTHROUGH.md   # Solution documentation
└── README.md                 # This file
```

## 🎯 Requirements Met

✅ **Cleanse**: Mask/remove PII from diverse files  
✅ **Analyze**: OCR text extraction and IAM policy interpretation  
✅ **Deliverables**: Solution walkthrough and working prototype (UI demo)

## 🔒 Security

This application is designed with security and privacy as top priorities:
- Client-side only processing
- No data transmission to servers
- No data storage or caching
- Open source and auditable

## 📦 Build

```bash
cd pii-cleaner
npm run build
```

Production files will be in `pii-cleaner/dist/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📝 License

MIT License - See LICENSE file for details

---

Built with React and modern web technologies for secure, privacy-first document processing.