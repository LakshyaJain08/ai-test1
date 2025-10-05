"""
Flask API for File Cleansing and Analysis System
"""
import os
import sys
from flask import Flask, request, jsonify, render_template, send_file
from werkzeug.utils import secure_filename
import json

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from src.cleansing.pii_detector import PIIDetector
from src.cleansing.image_cleaner import ImageCleaner
from src.analysis.text_extractor import TextExtractor
from src.analysis.security_analyzer import SecurityAnalyzer

app = Flask(__name__, 
            template_folder='../../templates',
            static_folder='../../static')

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')
OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), '../../output')
ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'txt'
}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize modules
pii_detector = PIIDetector()
image_cleaner = ImageCleaner()
text_extractor = TextExtractor()
security_analyzer = SecurityAnalyzer()


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Render main page"""
    return render_template('index.html')


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    return jsonify({
        'success': True,
        'filename': filename,
        'filepath': filepath
    })


@app.route('/api/cleanse', methods=['POST'])
def cleanse_file():
    """Cleanse a file by removing PII and sensitive information"""
    data = request.get_json()
    
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = data['filename']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Determine file type
        _, ext = os.path.splitext(filename.lower())
        
        # Extract text first
        extraction_result = text_extractor.extract_text(filepath)
        
        if not extraction_result['success']:
            return jsonify({'error': extraction_result['text']}), 500
        
        text = extraction_result['text']
        
        # Cleanse text
        client_name = data.get('client_name', None)
        
        # Mask PII
        masked_text, masked_items = pii_detector.mask_pii(text)
        
        # Mask client info
        if client_name:
            masked_text = pii_detector.mask_client_info(masked_text, client_name)
        
        # For images, also clean the image file
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif']
        if ext in image_extensions:
            output_image_path = os.path.join(
                app.config['OUTPUT_FOLDER'],
                f"cleaned_{filename}"
            )
            image_cleaner.clean_image(filepath, output_image_path, method='blur')
        
        # Save cleaned text
        output_text_path = os.path.join(
            app.config['OUTPUT_FOLDER'],
            f"cleaned_{os.path.splitext(filename)[0]}.txt"
        )
        
        with open(output_text_path, 'w', encoding='utf-8') as f:
            f.write(masked_text)
        
        return jsonify({
            'success': True,
            'original_text_length': len(text),
            'cleaned_text_length': len(masked_text),
            'masked_items_count': len(masked_items),
            'masked_items': masked_items,
            'cleaned_text': masked_text[:500] + ('...' if len(masked_text) > 500 else ''),
            'output_file': os.path.basename(output_text_path)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_file():
    """Analyze a file and extract security insights"""
    data = request.get_json()
    
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = data['filename']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Extract text
        extraction_result = text_extractor.extract_text(filepath)
        
        if not extraction_result['success']:
            return jsonify({'error': extraction_result['text']}), 500
        
        text = extraction_result['text']
        
        # Analyze security content
        security_analysis = security_analyzer.analyze(text)
        
        # Detect PII (for reporting purposes)
        pii_findings = pii_detector.detect_pii(text)
        
        # Create comprehensive report
        report = {
            'file_info': {
                'filename': filename,
                'file_type': extraction_result['file_type'],
                'text_length': len(text),
                'line_count': text.count('\n') + 1
            },
            'extraction': {
                'success': extraction_result['success'],
                'extracted_text_preview': text[:1000] + ('...' if len(text) > 1000 else '')
            },
            'pii_detection': {
                'total_pii_found': len(pii_findings),
                'findings_by_type': {}
            },
            'security_analysis': security_analysis
        }
        
        # Group PII findings by type
        for finding in pii_findings:
            pii_type = finding['type']
            if pii_type not in report['pii_detection']['findings_by_type']:
                report['pii_detection']['findings_by_type'][pii_type] = 0
            report['pii_detection']['findings_by_type'][pii_type] += 1
        
        # Save report
        report_path = os.path.join(
            app.config['OUTPUT_FOLDER'],
            f"analysis_{os.path.splitext(filename)[0]}.json"
        )
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        return jsonify({
            'success': True,
            'report': report,
            'report_file': os.path.basename(report_path)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/process', methods=['POST'])
def process_file():
    """Complete workflow: cleanse and analyze"""
    data = request.get_json()
    
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filename = data['filename']
    
    # First cleanse
    cleanse_response = cleanse_file()
    if cleanse_response[1] != 200:  # Check status code
        return cleanse_response
    
    cleanse_data = cleanse_response[0].get_json()
    
    # Then analyze
    analyze_response = analyze_file()
    if analyze_response[1] != 200:
        return analyze_response
    
    analyze_data = analyze_response[0].get_json()
    
    return jsonify({
        'success': True,
        'cleansing': cleanse_data,
        'analysis': analyze_data
    })


@app.route('/api/download/<filename>')
def download_file(filename):
    """Download processed file"""
    filepath = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(filepath, as_attachment=True)


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'File Cleansing and Analysis API'
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
