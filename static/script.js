// Global variables
let uploadedFilename = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const cleanseBtn = document.getElementById('cleanseBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const processBtn = document.getElementById('processBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const loadingIndicator = document.getElementById('loadingIndicator');

// File upload handler
fileInput.addEventListener('change', handleFileSelect);

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect();
    }
});

// Button click handlers
cleanseBtn.addEventListener('click', () => handleCleanse());
analyzeBtn.addEventListener('click', () => handleAnalyze());
processBtn.addEventListener('click', () => handleProcess());

function handleFileSelect() {
    const file = fileInput.files[0];
    
    if (!file) {
        return;
    }

    // Display file info
    fileInfo.innerHTML = `
        <strong>Selected File:</strong> ${file.name}<br>
        <strong>Size:</strong> ${formatFileSize(file.size)}<br>
        <strong>Type:</strong> ${file.type || 'Unknown'}
    `;
    fileInfo.classList.remove('hidden');

    // Upload file
    uploadFile(file);
}

async function uploadFile(file) {
    showLoading();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            uploadedFilename = data.filename;
            enableButtons();
            showMessage('File uploaded successfully!', 'success');
        } else {
            showMessage('Upload failed: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Upload error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleCleanse() {
    if (!uploadedFilename) {
        showMessage('Please upload a file first', 'warning');
        return;
    }

    showLoading();
    resultsSection.classList.add('hidden');

    const clientName = document.getElementById('clientName').value;

    try {
        const response = await fetch('/api/cleanse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: uploadedFilename,
                client_name: clientName || null
            })
        });

        const data = await response.json();

        if (data.success) {
            displayCleanseResults(data);
        } else {
            showMessage('Cleansing failed: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Cleansing error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleAnalyze() {
    if (!uploadedFilename) {
        showMessage('Please upload a file first', 'warning');
        return;
    }

    showLoading();
    resultsSection.classList.add('hidden');

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: uploadedFilename
            })
        });

        const data = await response.json();

        if (data.success) {
            displayAnalysisResults(data);
        } else {
            showMessage('Analysis failed: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Analysis error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleProcess() {
    if (!uploadedFilename) {
        showMessage('Please upload a file first', 'warning');
        return;
    }

    showLoading();
    resultsSection.classList.add('hidden');

    const clientName = document.getElementById('clientName').value;

    try {
        // First cleanse
        const cleanseResponse = await fetch('/api/cleanse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: uploadedFilename,
                client_name: clientName || null
            })
        });

        const cleanseData = await cleanseResponse.json();

        // Then analyze
        const analyzeResponse = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: uploadedFilename
            })
        });

        const analyzeData = await analyzeResponse.json();

        if (cleanseData.success && analyzeData.success) {
            displayCombinedResults(cleanseData, analyzeData);
        } else {
            showMessage('Processing failed', 'error');
        }
    } catch (error) {
        showMessage('Processing error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function displayCleanseResults(data) {
    let html = '<div class="result-section">';
    html += '<h3>🧹 Cleansing Results</h3>';
    html += `<div class="result-item">
                <span class="result-label">Original Text Length:</span>
                <span class="result-value">${data.original_text_length} characters</span>
             </div>`;
    html += `<div class="result-item">
                <span class="result-label">Cleaned Text Length:</span>
                <span class="result-value">${data.cleaned_text_length} characters</span>
             </div>`;
    html += `<div class="result-item">
                <span class="result-label">Items Masked:</span>
                <span class="result-value">${data.masked_items_count}</span>
             </div>`;

    if (data.masked_items && data.masked_items.length > 0) {
        html += '<div class="result-item"><strong>Masked Items:</strong><br>';
        const itemsByType = {};
        data.masked_items.forEach(item => {
            if (!itemsByType[item.type]) {
                itemsByType[item.type] = [];
            }
            itemsByType[item.type].push(item);
        });

        for (const [type, items] of Object.entries(itemsByType)) {
            html += `<span class="badge badge-info">${type}: ${items.length}</span> `;
        }
        html += '</div>';
    }

    html += `<div class="result-item">
                <strong>Cleaned Text Preview:</strong>
                <pre>${escapeHtml(data.cleaned_text)}</pre>
             </div>`;

    if (data.output_file) {
        html += `<div class="result-item">
                    <a href="/api/download/${data.output_file}" class="btn btn-primary">
                        📥 Download Cleaned File
                    </a>
                 </div>`;
    }

    html += '</div>';

    resultsContent.innerHTML = html;
    resultsSection.classList.remove('hidden');
}

function displayAnalysisResults(data) {
    let html = '<div class="result-section">';
    html += '<h3>🔍 Analysis Results</h3>';

    const report = data.report;

    // File info
    html += '<div class="result-item"><h4>File Information</h4>';
    html += `<p><strong>Filename:</strong> ${report.file_info.filename}</p>`;
    html += `<p><strong>Type:</strong> ${report.file_info.file_type}</p>`;
    html += `<p><strong>Text Length:</strong> ${report.file_info.text_length} characters</p>`;
    html += `<p><strong>Lines:</strong> ${report.file_info.line_count}</p>`;
    html += '</div>';

    // PII Detection
    html += '<div class="result-item"><h4>PII Detection</h4>';
    html += `<p><strong>Total PII Found:</strong> <span class="badge badge-warning">${report.pii_detection.total_pii_found}</span></p>`;
    if (Object.keys(report.pii_detection.findings_by_type).length > 0) {
        html += '<p><strong>By Type:</strong></p>';
        for (const [type, count] of Object.entries(report.pii_detection.findings_by_type)) {
            html += `<span class="badge badge-info">${type}: ${count}</span> `;
        }
    }
    html += '</div>';

    // Security Analysis
    const secAnalysis = report.security_analysis;

    // IAM Policies
    if (secAnalysis.iam_policies.found) {
        html += '<div class="result-item"><h4>IAM Policy Analysis</h4>';
        html += `<p><strong>Components Found:</strong> ${secAnalysis.iam_policies.summary.total_components_found}</p>`;
        html += `<p><strong>Has Allow Effect:</strong> ${secAnalysis.iam_policies.summary.has_allow_effect ? 'Yes' : 'No'}</p>`;
        html += `<p><strong>Has Deny Effect:</strong> ${secAnalysis.iam_policies.summary.has_deny_effect ? 'Yes' : 'No'}</p>`;
        html += '</div>';
    }

    // Firewall Rules
    if (secAnalysis.firewall_rules.found && secAnalysis.firewall_rules.rules.length > 0) {
        html += '<div class="result-item"><h4>Firewall Rules Analysis</h4>';
        const summary = secAnalysis.firewall_rules.summary;
        html += `<p><strong>Total Rules:</strong> ${summary.total_rules}</p>`;
        html += `<p><strong>Allow Rules:</strong> <span class="badge badge-success">${summary.allow_rules}</span></p>`;
        html += `<p><strong>Deny Rules:</strong> <span class="badge badge-danger">${summary.deny_rules}</span></p>`;
        if (summary.protocols_used && summary.protocols_used.length > 0) {
            html += `<p><strong>Protocols:</strong> ${summary.protocols_used.join(', ')}</p>`;
        }
        html += '</div>';
    }

    // IDS/IPS Logs
    if (secAnalysis.ids_ips_logs.found && secAnalysis.ids_ips_logs.alerts.length > 0) {
        html += '<div class="result-item"><h4>IDS/IPS Logs Analysis</h4>';
        const summary = secAnalysis.ids_ips_logs.summary;
        html += `<p><strong>Total Alerts:</strong> ${summary.total_alerts}</p>`;
        html += '<p><strong>Severity Breakdown:</strong></p>';
        html += `<span class="badge badge-danger">Critical: ${summary.severity_breakdown.critical}</span> `;
        html += `<span class="badge badge-warning">High: ${summary.severity_breakdown.high}</span> `;
        html += `<span class="badge badge-info">Medium: ${summary.severity_breakdown.medium}</span> `;
        html += `<span class="badge badge-success">Low: ${summary.severity_breakdown.low}</span>`;
        html += `<p><strong>Unique Sources:</strong> ${summary.unique_sources}</p>`;
        html += `<p><strong>Unique Destinations:</strong> ${summary.unique_destinations}</p>`;
        html += '</div>';
    }

    // Extracted text preview
    html += '<div class="result-item"><h4>Extracted Text Preview</h4>';
    html += `<pre>${escapeHtml(report.extraction.extracted_text_preview)}</pre>`;
    html += '</div>';

    if (data.report_file) {
        html += `<div class="result-item">
                    <a href="/api/download/${data.report_file}" class="btn btn-primary">
                        📥 Download Full Report (JSON)
                    </a>
                 </div>`;
    }

    html += '</div>';

    resultsContent.innerHTML = html;
    resultsSection.classList.remove('hidden');
}

function displayCombinedResults(cleanseData, analyzeData) {
    let html = '';
    
    // Cleansing section
    html += '<div class="result-section">';
    html += '<h3>🧹 Cleansing Results</h3>';
    html += `<p><strong>Items Masked:</strong> <span class="badge badge-info">${cleanseData.masked_items_count}</span></p>`;
    html += '</div>';

    // Analysis section
    const report = analyzeData.report;
    html += '<div class="result-section">';
    html += '<h3>🔍 Analysis Results</h3>';
    html += `<p><strong>PII Found:</strong> <span class="badge badge-warning">${report.pii_detection.total_pii_found}</span></p>`;

    if (report.security_analysis.iam_policies.found) {
        html += '<p><span class="badge badge-success">IAM Policies Detected</span></p>';
    }
    if (report.security_analysis.firewall_rules.found) {
        html += '<p><span class="badge badge-success">Firewall Rules Detected</span></p>';
    }
    if (report.security_analysis.ids_ips_logs.found) {
        html += '<p><span class="badge badge-success">IDS/IPS Logs Detected</span></p>';
    }

    html += '</div>';

    // Download links
    html += '<div class="result-section">';
    html += '<h3>📥 Downloads</h3>';
    if (cleanseData.output_file) {
        html += `<a href="/api/download/${cleanseData.output_file}" class="btn btn-primary">Download Cleaned File</a> `;
    }
    if (analyzeData.report_file) {
        html += `<a href="/api/download/${analyzeData.report_file}" class="btn btn-secondary">Download Analysis Report</a>`;
    }
    html += '</div>';

    resultsContent.innerHTML = html;
    resultsSection.classList.remove('hidden');
}

function enableButtons() {
    cleanseBtn.disabled = false;
    analyzeBtn.disabled = false;
    processBtn.disabled = false;
}

function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showMessage(message, type) {
    // Simple alert for now
    alert(message);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
