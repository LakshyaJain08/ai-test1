@echo off
REM Startup script for AI File Cleansing and Analysis System (Windows)

echo ==================================
echo AI File Cleansing and Analysis System
echo ==================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist ".dependencies_installed" (
    echo Installing dependencies...
    pip install -r requirements.txt
    type nul > .dependencies_installed
) else (
    echo Dependencies already installed.
)

REM Create necessary directories
if not exist "uploads" mkdir uploads
if not exist "output" mkdir output

echo.
echo Starting Flask application...
echo Access the application at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the application
python src\api\app.py

pause
