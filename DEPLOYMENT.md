# Deployment Guide

## Production Deployment Options for AI File Cleansing and Analysis System

This guide covers various deployment scenarios from development to production environments.

---

## 🚀 Quick Development Setup

### Local Development
```bash
# Clone repository
git clone https://github.com/LakshyaJain08/ai-test1.git
cd ai-test1

# Use automated setup
./run.sh  # Linux/macOS
# or
run.bat   # Windows

# Access at http://localhost:5000
```

---

## 🏭 Production Deployment

### Option 1: Standalone Server with Gunicorn

#### 1. Install Production Dependencies
```bash
pip install gunicorn
```

#### 2. Create Gunicorn Configuration
Create `gunicorn_config.py`:
```python
import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 120
keepalive = 2

# Logging
accesslog = './logs/access.log'
errorlog = './logs/error.log'
loglevel = 'info'
```

#### 3. Run with Gunicorn
```bash
gunicorn -c gunicorn_config.py src.api.app:app
```

---

### Option 2: Docker Deployment

#### Create Dockerfile
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install production server
RUN pip install gunicorn

# Copy application
COPY . .

# Create necessary directories
RUN mkdir -p uploads output logs

# Expose port
EXPOSE 8000

# Run with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "-w", "4", "--timeout", "120", "src.api.app:app"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/uploads
      - ./output:/app/output
      - ./logs:/app/logs
    environment:
      - FLASK_ENV=production
    restart: unless-stopped
```

#### Build and Run
```bash
docker-compose up -d
```

---

### Option 3: Nginx Reverse Proxy

#### 1. Install Nginx
```bash
sudo apt-get update
sudo apt-get install nginx
```

#### 2. Configure Nginx
Create `/etc/nginx/sites-available/fileprocessing`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Max upload size
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    location /static {
        alias /path/to/ai-test1/static;
        expires 30d;
    }
}
```

#### 3. Enable and Restart
```bash
sudo ln -s /etc/nginx/sites-available/fileprocessing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 4: Cloud Deployment (AWS)

#### EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Open port 80, 443

2. **Install Dependencies**
```bash
sudo apt-get update
sudo apt-get install -y python3-pip nginx tesseract-ocr git
```

3. **Deploy Application**
```bash
git clone https://github.com/LakshyaJain08/ai-test1.git
cd ai-test1
pip3 install -r requirements.txt
pip3 install gunicorn
```

4. **Create Systemd Service**
Create `/etc/systemd/system/fileprocessing.service`:
```ini
[Unit]
Description=File Processing Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-test1
Environment="PATH=/home/ubuntu/.local/bin"
ExecStart=/home/ubuntu/.local/bin/gunicorn -b 127.0.0.1:8000 -w 4 src.api.app:app

[Install]
WantedBy=multi-user.target
```

5. **Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable fileprocessing
sudo systemctl start fileprocessing
```

---

### Option 5: Heroku Deployment

#### 1. Create Heroku Files

**Procfile:**
```
web: gunicorn src.api.app:app
```

**runtime.txt:**
```
python-3.11.0
```

**Aptfile** (for Tesseract):
```
tesseract-ocr
tesseract-ocr-eng
```

#### 2. Add Buildpacks
```bash
heroku buildpacks:add --index 1 heroku-community/apt
heroku buildpacks:add --index 2 heroku/python
```

#### 3. Deploy
```bash
git push heroku main
```

---

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file:
```bash
# Flask
FLASK_APP=src.api.app
FLASK_ENV=production
SECRET_KEY=your-secret-key-here

# File Upload
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=/app/uploads
OUTPUT_FOLDER=/app/output

# Tesseract (if custom path)
TESSERACT_CMD=/usr/bin/tesseract

# Logging
LOG_LEVEL=INFO
```

Load in application:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

## 📊 Monitoring & Logging

### Application Logging

Add to `app.py`:
```python
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
handler = RotatingFileHandler('logs/app.log', maxBytes=10000000, backupCount=5)
handler.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
)
handler.setFormatter(formatter)
app.logger.addHandler(handler)
```

### Health Check Endpoint
Already implemented at `/health`

### Monitoring with Prometheus
```python
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)
```

---

## 🔒 Security Hardening

### 1. HTTPS/SSL

#### Let's Encrypt (Certbot)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Rate Limiting
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)
```

### 3. Authentication (Optional)
```python
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

@app.route('/api/upload')
@auth.login_required
def upload():
    # ... existing code
```

### 4. CORS Configuration
```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-domain.com"]
    }
})
```

---

## 🗄️ Database Integration (Optional)

For tracking uploads and processing history:

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///files.db'
db = SQLAlchemy(app)

class FileUpload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    upload_time = db.Column(db.DateTime)
    status = db.Column(db.String(50))
```

---

## 📈 Scaling Strategies

### Horizontal Scaling

1. **Load Balancer**
   - AWS ELB
   - Nginx load balancing
   - HAProxy

2. **Multiple App Instances**
```yaml
# docker-compose.yml
services:
  app1:
    build: .
    ports:
      - "8001:8000"
  app2:
    build: .
    ports:
      - "8002:8000"
```

### Vertical Scaling

- Increase CPU/RAM
- Use worker threads
- Optimize OCR processing

### Async Processing

```python
from celery import Celery

celery = Celery(app.name, broker='redis://localhost:6379/0')

@celery.task
def process_file_async(filename):
    # Processing logic
    pass
```

---

## 🧪 Testing Deployment

### Smoke Tests
```bash
# Health check
curl http://localhost:8000/health

# Upload test
curl -X POST -F "file=@test.txt" http://localhost:8000/api/upload

# Performance test
ab -n 100 -c 10 http://localhost:8000/
```

---

## 📋 Maintenance

### Backup Strategy
```bash
# Backup outputs
tar -czf backup-$(date +%Y%m%d).tar.gz output/

# Cleanup old files
find uploads/ -mtime +7 -delete
find output/ -mtime +30 -delete
```

### Updates
```bash
git pull origin main
pip install -r requirements.txt --upgrade
sudo systemctl restart fileprocessing
```

---

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :8000
kill -9 <PID>
```

**Permission denied:**
```bash
chmod +x run.sh
chown -R user:user uploads/ output/
```

**Tesseract not found:**
```bash
which tesseract
export TESSERACT_CMD=/usr/bin/tesseract
```

**Memory issues:**
```bash
# Increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📞 Support

For deployment issues:
1. Check application logs: `logs/app.log`
2. Check system logs: `sudo journalctl -u fileprocessing`
3. Verify dependencies: `pip list`
4. Test connectivity: `curl http://localhost:8000/health`

---

## ✅ Deployment Checklist

- [ ] Install system dependencies (Python, Tesseract)
- [ ] Clone repository
- [ ] Install Python packages
- [ ] Configure environment variables
- [ ] Set up production server (Gunicorn)
- [ ] Configure reverse proxy (Nginx)
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Document deployment details
- [ ] Set up maintenance schedule

---

**Recommended Production Stack:**
- **OS:** Ubuntu 22.04 LTS
- **Web Server:** Nginx
- **App Server:** Gunicorn
- **Python:** 3.11+
- **Monitoring:** Prometheus + Grafana
- **SSL:** Let's Encrypt

This provides a robust, scalable, and secure deployment for production use.
