# Quick Start Guide

Get up and running with the AI File Cleansing and Analysis System in minutes!

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

### Option 1: Using the Run Script (Recommended)

**Linux/macOS:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```bash
run.bat
```

The script will automatically:
- Create a virtual environment
- Install all dependencies
- Start the Flask server

### Option 2: Manual Installation

1. **Create a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start the server:**
```bash
python src/api/app.py
```

## Using the Application

1. **Open your browser:**
   Navigate to `http://localhost:5000`

2. **Upload a file:**
   - Click the upload area or drag & drop a file
   - Supported formats: PDF, Word, Excel, PowerPoint, Images, Text files

3. **Configure options:**
   - Enter client name to mask (optional)
   - Select processing options (cleanse PII, remove logos, analyze)

4. **Process the file:**
   - Click "Cleanse File" to remove sensitive information
   - Click "Analyze File" to extract security insights
   - Click "Cleanse & Analyze" for complete workflow

5. **Download results:**
   - View results on screen
   - Download cleaned files and analysis reports

## Quick Test

Test the system with the provided sample file:

```bash
# Upload the sample file
curl -X POST -F "file=@tests/sample_data.txt" http://localhost:5000/api/upload

# Cleanse the file
curl -X POST -H "Content-Type: application/json" \
  -d '{"filename": "sample_data.txt", "client_name": "SecureTest"}' \
  http://localhost:5000/api/cleanse

# Analyze the file
curl -X POST -H "Content-Type: application/json" \
  -d '{"filename": "sample_data.txt"}' \
  http://localhost:5000/api/analyze
```

## What the System Does

### File Cleansing
- **Masks PII:** Emails, phone numbers, SSN, credit cards, addresses
- **Removes client info:** Company names, logos
- **Preserves utility:** Technical content remains readable

### File Analysis
- **Extracts text:** From PDFs, images (OCR), Office documents
- **Detects security content:** IAM policies, firewall rules, IDS/IPS logs
- **Generates insights:** Structured analysis and statistics

## Example Output

**Input:**
```
Contact: john.doe@company.com
Phone: (555) 123-4567
SSN: 123-45-6789
```

**After Cleansing:**
```
Contact: *****@company.com
Phone: *********4567
SSN: *******6789
```

## Troubleshooting

**Server won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed
- Try `pip install -r requirements.txt` again

**File upload fails:**
- Check file size (max 16MB)
- Verify file format is supported
- Ensure uploads/ directory exists

**OCR not working:**
- Install Tesseract OCR:
  - Ubuntu: `sudo apt-get install tesseract-ocr`
  - macOS: `brew install tesseract`
  - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Review [SOLUTION_DESIGN.md](SOLUTION_DESIGN.md) for architecture details
- Run tests: `python tests/test_basic.py`

## Support

For issues or questions, please check the README or create an issue on GitHub.

---

Happy cleansing! 🔒✨
