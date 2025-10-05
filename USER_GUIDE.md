# User Guide - AI File Cleansing and Analysis System

## 🎯 Introduction

Welcome to the AI File Cleansing and Analysis System! This guide will walk you through using the system to cleanse sensitive information and extract security insights from your files.

---

## 🚀 Getting Started

### Step 1: Start the Application

**Linux/macOS:**
```bash
./run.sh
```

**Windows:**
```bash
run.bat
```

**Manual Start:**
```bash
python src/api/app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Running on http://10.1.0.78:5000
```

### Step 2: Open Your Browser

Navigate to: **http://localhost:5000**

---

## 📁 Using the Web Interface

### The Main Screen

When you first open the application, you'll see:

1. **Upload Area** (top) - Drop files here or click to select
2. **Processing Options** (middle) - Configure what you want to do
3. **Action Buttons** (bottom) - Start processing
4. **Results Area** (appears after processing) - View and download results

---

## 📤 Uploading Files

### Method 1: Drag and Drop
1. Drag a file from your file manager
2. Drop it onto the upload area
3. File information will appear below

### Method 2: Click to Select
1. Click anywhere in the upload area
2. Select a file from the file picker dialog
3. File information will appear below

### Supported File Types
- **Documents:** PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx)
- **Images:** JPG, PNG, BMP, TIFF
- **Text:** Plain text (.txt)

### File Size Limit
Maximum file size: **16MB**

---

## ⚙️ Processing Options

### Client Name (Optional)
- Enter the client's name to automatically mask it throughout the document
- Example: "Acme Corp" will be replaced with `[CLIENT_NAME]`
- Leave blank if not needed

### Remove PII (Checkbox)
✓ **Checked (Default):** Detect and mask personally identifiable information
- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers
- IP addresses
- Physical addresses

### Remove Logos (Checkbox)
✓ **Checked (Default):** Blur or mask logos in images
- Applies to image files only
- Uses intelligent detection for common logo positions

### Analyze Security Content (Checkbox)
✓ **Checked (Default):** Extract and analyze security-related content
- IAM policies
- Firewall rules
- IDS/IPS logs

---

## 🎬 Processing Your File

### Option 1: Cleanse Only
**Button:** 🧹 Cleanse File

**What it does:**
- Detects and masks all PII
- Removes client information
- Blurs logos in images
- Saves cleaned version

**When to use:**
- You only need to anonymize the file
- No analysis required
- Quick turnaround needed

### Option 2: Analyze Only
**Button:** 🔍 Analyze File

**What it does:**
- Extracts text from the file
- Detects PII (for reporting)
- Analyzes security content
- Generates detailed report

**When to use:**
- You want insights without modifying the file
- Need to understand what's in the document
- Want security configuration analysis

### Option 3: Complete Workflow
**Button:** ⚡ Cleanse & Analyze

**What it does:**
- Performs both cleansing and analysis
- Generates both cleaned file and analysis report
- Most comprehensive option

**When to use:**
- Need both anonymized file and insights
- Complete documentation required
- Best for security assessments

---

## 📊 Understanding Results

### Cleansing Results

After cleansing, you'll see:

**Statistics:**
- **Original Text Length:** Size of input
- **Cleaned Text Length:** Size of output
- **Items Masked:** Number of PII items found and masked

**Masked Items Breakdown:**
Each PII type is shown with count:
- `email: 3` - Three email addresses masked
- `phone: 2` - Two phone numbers masked
- `ssn: 1` - One SSN masked
- etc.

**Preview:**
First 500 characters of the cleaned text

**Example Output:**
```
Contact: *****@example.com
Phone: *********4567
SSN: *******6789
Address: ****************
```

### Analysis Results

After analysis, you'll see:

#### 1. File Information
- Filename
- File type
- Total text length
- Number of lines

#### 2. PII Detection Summary
- Total PII items found
- Breakdown by type (email, phone, SSN, etc.)

#### 3. Security Analysis

**IAM Policies:**
- Number of policies found
- Allow/Deny effects detected
- Actions and resources identified

**Firewall Rules:**
- Total rules count
- Allow vs. Deny rules
- Protocols used (TCP, UDP, ICMP)
- Ports and IP ranges

**IDS/IPS Logs:**
- Total alerts
- Severity breakdown (Critical, High, Medium, Low)
- Unique attack sources
- Unique targets

#### 4. Extracted Text
Preview of the full extracted text (first 1000 characters)

---

## 💾 Downloading Results

### Download Options

After processing, you'll see download buttons:

**📥 Download Cleaned File**
- Format: Plain text (.txt)
- Contains: Anonymized version of your document
- Filename: `cleaned_[original_name].txt`

**📥 Download Analysis Report**
- Format: JSON
- Contains: Complete analysis with all details
- Filename: `analysis_[original_name].json`

**📥 Download Cleaned Image** (for images)
- Format: Same as original
- Contains: Image with logos blurred/masked
- Filename: `cleaned_[original_name].[ext]`

### Where Are Files Saved?

Files are saved in the `output/` directory:
```
ai-test1/
└── output/
    ├── cleaned_mydocument.txt
    ├── analysis_mydocument.json
    └── cleaned_myimage.jpg
```

---

## 💡 Tips and Best Practices

### For Best Results

1. **File Quality:**
   - Use high-resolution images for better OCR
   - Ensure PDFs contain text (not just scanned images)
   - Clean, well-formatted documents work best

2. **Client Name:**
   - Enter the exact name as it appears in the document
   - Case-insensitive matching is used
   - Multiple variations will be caught

3. **Processing Options:**
   - Start with all options enabled
   - Disable specific options if not needed
   - Re-process if results aren't as expected

4. **File Size:**
   - Keep files under 16MB
   - Split large files if needed
   - Compress images before upload

### Common Use Cases

#### Use Case 1: Client Report Sanitization
```
1. Upload client report (PDF/Word)
2. Enter client name: "TechCorp"
3. Enable: ✓ Remove PII, ✓ Remove Logos
4. Click: Cleanse File
5. Download: cleaned_report.txt
```

#### Use Case 2: Security Configuration Analysis
```
1. Upload firewall config (text file)
2. Leave client name blank
3. Enable: ✓ Analyze Security Content
4. Click: Analyze File
5. Review: Firewall rules breakdown
```

#### Use Case 3: Incident Report Processing
```
1. Upload IDS/IPS logs (text file)
2. Enable: ✓ Remove PII, ✓ Analyze
3. Click: Cleanse & Analyze
4. Download: Both cleaned file and report
```

#### Use Case 4: Presentation Anonymization
```
1. Upload slides (PowerPoint)
2. Enter client name
3. Enable: ✓ Remove PII
4. Click: Cleanse File
5. Download: cleaned_presentation.txt
```

---

## 🔍 Reading the Analysis Report

The JSON report contains structured data:

```json
{
  "file_info": {
    "filename": "document.txt",
    "file_type": ".txt",
    "text_length": 1729,
    "line_count": 60
  },
  "pii_detection": {
    "total_pii_found": 28,
    "findings_by_type": {
      "email": 2,
      "phone": 2,
      "ssn": 1,
      "ip_address": 17
    }
  },
  "security_analysis": {
    "iam_policies": {...},
    "firewall_rules": {...},
    "ids_ips_logs": {...}
  }
}
```

### Using the JSON Report

**In Python:**
```python
import json

with open('output/analysis_document.json', 'r') as f:
    report = json.load(f)

print(f"Found {report['pii_detection']['total_pii_found']} PII items")
print(f"Detected {len(report['security_analysis']['firewall_rules']['rules'])} firewall rules")
```

**In JavaScript:**
```javascript
fetch('output/analysis_document.json')
  .then(response => response.json())
  .then(data => {
    console.log('PII found:', data.pii_detection.total_pii_found);
    console.log('Firewall rules:', data.security_analysis.firewall_rules.rules.length);
  });
```

---

## 🐛 Troubleshooting

### Problem: File Upload Fails

**Possible Causes:**
- File too large (>16MB)
- Unsupported file format
- Network connectivity issue

**Solutions:**
- Check file size: `ls -lh myfile.pdf`
- Verify file type is supported
- Try a smaller test file first

### Problem: No PII Detected

**Possible Causes:**
- PII might be in unexpected format
- Document is scanned image (OCR needed)
- Language not supported

**Solutions:**
- Check if file is text-based
- Enable OCR for images
- Review PII formats in FEATURES.md

### Problem: Processing Takes Too Long

**Possible Causes:**
- Large file size
- High-resolution image requiring OCR
- Complex document structure

**Solutions:**
- Wait patiently (can take 30-60s for large files)
- Reduce image resolution
- Split into smaller files

### Problem: Can't Access Web Interface

**Possible Causes:**
- Server not started
- Port 5000 already in use
- Firewall blocking

**Solutions:**
```bash
# Check if server is running
curl http://localhost:5000/health

# Try different port
FLASK_RUN_PORT=8000 python src/api/app.py

# Check for port conflicts
lsof -i :5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows
```

---

## 🔒 Privacy & Security

### Your Data is Safe

- **Local Processing:** All processing happens on your machine
- **No Cloud Uploads:** Files never leave your system
- **Temporary Storage:** Files stored only during processing
- **No External APIs:** No third-party services involved

### Recommended Practices

1. **Delete Processed Files:** Clean up `uploads/` and `output/` regularly
2. **Don't Share Output:** Treat cleaned files as sensitive
3. **Review Results:** Always verify masking is complete
4. **Secure the Server:** Use authentication in production

---

## 📞 Getting Help

### Resources

1. **README.md** - Full documentation
2. **QUICKSTART.md** - Quick setup
3. **FEATURES.md** - Feature details
4. **SOLUTION_DESIGN.md** - Technical architecture
5. **DEPLOYMENT.md** - Production deployment

### Testing the System

Use the provided sample file:
```bash
# Test upload
curl -X POST -F "file=@tests/sample_data.txt" http://localhost:5000/api/upload

# Test processing
curl -X POST -H "Content-Type: application/json" \
  -d '{"filename": "sample_data.txt"}' \
  http://localhost:5000/api/cleanse
```

### Health Check

Verify the system is working:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "File Cleansing and Analysis API"
}
```

---

## 🎓 Next Steps

### Advanced Usage

1. **API Integration:** Use the REST API in your applications
2. **Batch Processing:** Process multiple files via scripts
3. **Custom Workflows:** Extend the system for specific needs
4. **Production Deployment:** Deploy to cloud or server

### Learning More

- Study the code in `src/` directory
- Read technical design in SOLUTION_DESIGN.md
- Explore deployment options in DEPLOYMENT.md
- Run tests: `python tests/test_basic.py`

---

## ✨ Summary

The AI File Cleansing and Analysis System makes it easy to:

1. **Upload** diverse file formats
2. **Cleanse** sensitive information automatically
3. **Analyze** security content intelligently
4. **Download** results in useful formats

Simple, powerful, and privacy-focused!

---

**Happy Processing! 🔒✨**

For questions or issues, check the documentation or create an issue on GitHub.
