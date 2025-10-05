"""
Text Extraction Module
Extracts text from various file formats including images, PDFs, Office documents
"""
import os
from typing import Dict, Optional
from PIL import Image
import pytesseract
import PyPDF2
from docx import Document
import openpyxl
from pptx import Presentation


class TextExtractor:
    """Extracts text from multiple file formats"""
    
    def __init__(self):
        self.supported_formats = {
            'image': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'],
            'pdf': ['.pdf'],
            'word': ['.docx', '.doc'],
            'excel': ['.xlsx', '.xls'],
            'powerpoint': ['.pptx', '.ppt']
        }
    
    def extract_from_image(self, file_path: str) -> str:
        """
        Extract text from image using OCR
        
        Args:
            file_path: Path to image file
            
        Returns:
            Extracted text
        """
        try:
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)
            return text.strip()
        except Exception as e:
            return f"Error extracting text from image: {str(e)}"
    
    def extract_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text
        """
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            return f"Error extracting text from PDF: {str(e)}"
    
    def extract_from_word(self, file_path: str) -> str:
        """
        Extract text from Word document
        
        Args:
            file_path: Path to Word file
            
        Returns:
            Extracted text
        """
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            return f"Error extracting text from Word: {str(e)}"
    
    def extract_from_excel(self, file_path: str) -> str:
        """
        Extract text from Excel spreadsheet
        
        Args:
            file_path: Path to Excel file
            
        Returns:
            Extracted text
        """
        try:
            workbook = openpyxl.load_workbook(file_path, data_only=True)
            text = ""
            
            for sheet_name in workbook.sheetnames:
                sheet = workbook[sheet_name]
                text += f"\n=== Sheet: {sheet_name} ===\n"
                
                for row in sheet.iter_rows(values_only=True):
                    row_text = " | ".join([str(cell) if cell is not None else "" for cell in row])
                    if row_text.strip():
                        text += row_text + "\n"
            
            return text.strip()
        except Exception as e:
            return f"Error extracting text from Excel: {str(e)}"
    
    def extract_from_powerpoint(self, file_path: str) -> str:
        """
        Extract text from PowerPoint presentation
        
        Args:
            file_path: Path to PowerPoint file
            
        Returns:
            Extracted text
        """
        try:
            prs = Presentation(file_path)
            text = ""
            
            for slide_num, slide in enumerate(prs.slides, 1):
                text += f"\n=== Slide {slide_num} ===\n"
                
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        text += shape.text + "\n"
            
            return text.strip()
        except Exception as e:
            return f"Error extracting text from PowerPoint: {str(e)}"
    
    def extract_text(self, file_path: str) -> Dict[str, any]:
        """
        Extract text from any supported file format
        
        Args:
            file_path: Path to file
            
        Returns:
            Dictionary with extracted text and metadata
        """
        _, ext = os.path.splitext(file_path.lower())
        
        result = {
            'file_path': file_path,
            'file_type': ext,
            'text': '',
            'success': False
        }
        
        try:
            if ext in self.supported_formats['image']:
                result['text'] = self.extract_from_image(file_path)
                result['success'] = True
            elif ext in self.supported_formats['pdf']:
                result['text'] = self.extract_from_pdf(file_path)
                result['success'] = True
            elif ext in self.supported_formats['word']:
                result['text'] = self.extract_from_word(file_path)
                result['success'] = True
            elif ext in self.supported_formats['excel']:
                result['text'] = self.extract_from_excel(file_path)
                result['success'] = True
            elif ext in self.supported_formats['powerpoint']:
                result['text'] = self.extract_from_powerpoint(file_path)
                result['success'] = True
            else:
                result['text'] = f"Unsupported file format: {ext}"
                result['success'] = False
        except Exception as e:
            result['text'] = f"Error processing file: {str(e)}"
            result['success'] = False
        
        return result
