#!/bin/bash
# Startup script for AI File Cleansing and Analysis System

echo "=================================="
echo "AI File Cleansing and Analysis System"
echo "=================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f ".dependencies_installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch .dependencies_installed
else
    echo "Dependencies already installed."
fi

# Create necessary directories
mkdir -p uploads output

echo ""
echo "Starting Flask application..."
echo "Access the application at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the application
python src/api/app.py
