# API Reference

Complete REST API documentation for the AI File Cleansing and Analysis System.

---

## Base URL

```
http://localhost:5000
```

---

## Endpoints

### 1. Health Check

Check if the service is running.

**Endpoint:** `GET /health`

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "File Cleansing and Analysis API"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### 2. Upload File

Upload a file for processing.

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (required) - The file to upload

**Supported Formats:**
- Documents: `.pdf`, `.docx`, `.xlsx`, `.pptx`
- Images: `.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff`
- Text: `.txt`

**Max Size:** 16MB

**Request:**
```bash
curl -X POST \
  -F "file=@document.pdf" \
  http://localhost:5000/api/upload
```

**Response:**
```json
{
  "success": true,
  "filename": "document.pdf",
  "filepath": "/path/to/uploads/document.pdf"
}
```

**Status Codes:**
- `200 OK` - File uploaded successfully
- `400 Bad Request` - No file provided or invalid file type
- `413 Payload Too Large` - File exceeds size limit

---

### 3. Cleanse File

Remove PII and sensitive information from an uploaded file.

**Endpoint:** `POST /api/cleanse`

**Content-Type:** `application/json`

**Parameters:**
- `filename` (required) - Name of the uploaded file
- `client_name` (optional) - Client name to mask

**Request:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "document.pdf",
    "client_name": "Acme Corp"
  }' \
  http://localhost:5000/api/cleanse
```

**Response:**
```json
{
  "success": true,
  "original_text_length": 5420,
  "cleaned_text_length": 5420,
  "masked_items_count": 15,
  "masked_items": [
    {
      "type": "email",
      "original": "john@example.com",
      "masked": "*****@example.com"
    },
    {
      "type": "phone",
      "original": "(555) 123-4567",
      "masked": "*********4567"
    }
  ],
  "cleaned_text": "Sample text with *****@example.com...",
  "output_file": "cleaned_document.txt"
}
```

**Fields:**
- `success` - Whether the operation succeeded
- `original_text_length` - Length of original text
- `cleaned_text_length` - Length of cleaned text
- `masked_items_count` - Number of PII items masked
- `masked_items` - Array of masked items with details
- `cleaned_text` - Preview of cleaned text (first 500 chars)
- `output_file` - Filename of the cleaned output

**Status Codes:**
- `200 OK` - File cleansed successfully
- `400 Bad Request` - Missing filename or invalid request
- `404 Not Found` - File not found
- `500 Internal Server Error` - Processing error

---

### 4. Analyze File

Extract text and analyze security content.

**Endpoint:** `POST /api/analyze`

**Content-Type:** `application/json`

**Parameters:**
- `filename` (required) - Name of the uploaded file

**Request:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "document.pdf"
  }' \
  http://localhost:5000/api/analyze
```

**Response:**
```json
{
  "success": true,
  "report": {
    "file_info": {
      "filename": "document.pdf",
      "file_type": ".pdf",
      "text_length": 5420,
      "line_count": 120
    },
    "extraction": {
      "success": true,
      "extracted_text_preview": "Extracted text..."
    },
    "pii_detection": {
      "total_pii_found": 15,
      "findings_by_type": {
        "email": 3,
        "phone": 2,
        "ssn": 1,
        "ip_address": 9
      }
    },
    "security_analysis": {
      "iam_policies": {
        "found": true,
        "policies": [...],
        "summary": {
          "total_components_found": 4,
          "has_allow_effect": true,
          "has_deny_effect": false
        }
      },
      "firewall_rules": {
        "found": true,
        "rules": [...],
        "summary": {
          "total_rules": 5,
          "allow_rules": 3,
          "deny_rules": 2,
          "protocols_used": ["tcp", "udp"]
        }
      },
      "ids_ips_logs": {
        "found": true,
        "alerts": [...],
        "summary": {
          "total_alerts": 10,
          "severity_breakdown": {
            "critical": 2,
            "high": 3,
            "medium": 4,
            "low": 1
          }
        }
      }
    }
  },
  "report_file": "analysis_document.json"
}
```

**Status Codes:**
- `200 OK` - File analyzed successfully
- `400 Bad Request` - Missing filename
- `404 Not Found` - File not found
- `500 Internal Server Error` - Processing error

---

### 5. Process File (Complete Workflow)

Perform both cleansing and analysis in one request.

**Endpoint:** `POST /api/process`

**Content-Type:** `application/json`

**Parameters:**
- `filename` (required) - Name of the uploaded file
- `client_name` (optional) - Client name to mask

**Request:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "document.pdf",
    "client_name": "Acme Corp"
  }' \
  http://localhost:5000/api/process
```

**Response:**
```json
{
  "success": true,
  "cleansing": {
    "success": true,
    "masked_items_count": 15,
    "output_file": "cleaned_document.txt"
  },
  "analysis": {
    "success": true,
    "report": {...},
    "report_file": "analysis_document.json"
  }
}
```

**Status Codes:**
- `200 OK` - File processed successfully
- `400 Bad Request` - Missing filename
- `404 Not Found` - File not found
- `500 Internal Server Error` - Processing error

---

### 6. Download File

Download a processed file.

**Endpoint:** `GET /api/download/<filename>`

**Parameters:**
- `filename` (in URL) - Name of the file to download

**Request:**
```bash
curl -O http://localhost:5000/api/download/cleaned_document.txt
```

**Response:**
- File content as attachment

**Status Codes:**
- `200 OK` - File downloaded successfully
- `404 Not Found` - File not found

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Missing parameters, invalid file type |
| 404 | Not Found | File doesn't exist |
| 413 | Payload Too Large | File exceeds 16MB |
| 500 | Internal Server Error | Processing failure, system error |

---

## Usage Examples

### Python

```python
import requests
import json

# Base URL
BASE_URL = "http://localhost:5000"

# 1. Upload file
with open("document.pdf", "rb") as f:
    files = {"file": f}
    response = requests.post(f"{BASE_URL}/api/upload", files=files)
    upload_data = response.json()
    filename = upload_data["filename"]
    print(f"Uploaded: {filename}")

# 2. Cleanse file
cleanse_data = {
    "filename": filename,
    "client_name": "Acme Corp"
}
response = requests.post(
    f"{BASE_URL}/api/cleanse",
    json=cleanse_data
)
cleanse_result = response.json()
print(f"Masked {cleanse_result['masked_items_count']} items")

# 3. Analyze file
analyze_data = {"filename": filename}
response = requests.post(
    f"{BASE_URL}/api/analyze",
    json=analyze_data
)
analyze_result = response.json()
print(f"Found {analyze_result['report']['pii_detection']['total_pii_found']} PII items")

# 4. Download cleaned file
response = requests.get(
    f"{BASE_URL}/api/download/{cleanse_result['output_file']}"
)
with open("downloaded_cleaned.txt", "wb") as f:
    f.write(response.content)
print("Downloaded cleaned file")
```

### JavaScript (Node.js)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

async function processFile() {
  try {
    // 1. Upload file
    const formData = new FormData();
    formData.append('file', fs.createReadStream('document.pdf'));
    
    const uploadResponse = await axios.post(
      `${BASE_URL}/api/upload`,
      formData,
      { headers: formData.getHeaders() }
    );
    
    const filename = uploadResponse.data.filename;
    console.log(`Uploaded: ${filename}`);
    
    // 2. Cleanse file
    const cleanseResponse = await axios.post(
      `${BASE_URL}/api/cleanse`,
      {
        filename: filename,
        client_name: 'Acme Corp'
      }
    );
    
    console.log(`Masked ${cleanseResponse.data.masked_items_count} items`);
    
    // 3. Analyze file
    const analyzeResponse = await axios.post(
      `${BASE_URL}/api/analyze`,
      { filename: filename }
    );
    
    const piiCount = analyzeResponse.data.report.pii_detection.total_pii_found;
    console.log(`Found ${piiCount} PII items`);
    
    // 4. Download cleaned file
    const downloadResponse = await axios.get(
      `${BASE_URL}/api/download/${cleanseResponse.data.output_file}`,
      { responseType: 'stream' }
    );
    
    const writer = fs.createWriteStream('downloaded_cleaned.txt');
    downloadResponse.data.pipe(writer);
    
    console.log('Downloaded cleaned file');
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

processFile();
```

### cURL

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

# 1. Upload file
echo "Uploading file..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "file=@document.pdf" \
  ${BASE_URL}/api/upload)

FILENAME=$(echo $UPLOAD_RESPONSE | jq -r '.filename')
echo "Uploaded: $FILENAME"

# 2. Cleanse file
echo "Cleansing file..."
CLEANSE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"filename\": \"$FILENAME\", \"client_name\": \"Acme Corp\"}" \
  ${BASE_URL}/api/cleanse)

MASKED_COUNT=$(echo $CLEANSE_RESPONSE | jq -r '.masked_items_count')
OUTPUT_FILE=$(echo $CLEANSE_RESPONSE | jq -r '.output_file')
echo "Masked $MASKED_COUNT items"

# 3. Analyze file
echo "Analyzing file..."
ANALYZE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"filename\": \"$FILENAME\"}" \
  ${BASE_URL}/api/analyze)

PII_COUNT=$(echo $ANALYZE_RESPONSE | jq -r '.report.pii_detection.total_pii_found')
echo "Found $PII_COUNT PII items"

# 4. Download cleaned file
echo "Downloading cleaned file..."
curl -O ${BASE_URL}/api/download/${OUTPUT_FILE}
echo "Downloaded: $OUTPUT_FILE"
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

@app.route('/api/upload')
@limiter.limit("10 per minute")
def upload():
    # ...
```

---

## Authentication

Currently, no authentication is required (development mode).

For production, implement authentication:

```python
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    # Verify credentials
    return True

@app.route('/api/upload')
@auth.login_required
def upload():
    # ...
```

---

## CORS

For cross-origin requests:

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://example.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## Testing the API

### Unit Tests

```python
import unittest
from src.api.app import app

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_health_check(self):
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')
    
    def test_upload_file(self):
        with open('test.txt', 'rb') as f:
            response = self.app.post(
                '/api/upload',
                data={'file': f},
                content_type='multipart/form-data'
            )
        self.assertEqual(response.status_code, 200)
```

### Integration Tests

Use Postman or similar tools to test the complete workflow.

---

## Best Practices

1. **Always upload files first** before cleansing or analyzing
2. **Check file size** before uploading (max 16MB)
3. **Verify file format** is supported
4. **Handle errors gracefully** in client code
5. **Clean up old files** periodically from uploads/ and output/
6. **Use HTTPS** in production
7. **Implement authentication** for production deployments
8. **Set up rate limiting** to prevent abuse

---

## Support

For API issues or questions:
- Check the logs in the Flask console
- Verify the health endpoint: `GET /health`
- Review the error response for details
- Consult the main README.md for troubleshooting

---

**API Version:** 1.0  
**Last Updated:** 2024  
**Base Implementation:** Flask 3.0
