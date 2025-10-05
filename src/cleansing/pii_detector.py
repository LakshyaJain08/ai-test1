"""
PII Detection and Masking Module
Detects and masks personally identifiable information from text
"""
import re
from typing import List, Dict, Tuple


class PIIDetector:
    """Detects and masks various types of PII in text"""
    
    def __init__(self):
        # Regex patterns for different PII types
        self.patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phone': r'\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            'ip_address': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
            'date': r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b',
            'address': r'\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b',
        }
        
        # Common names patterns (simplified)
        self.name_patterns = [
            r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b',  # First Last
            r'\b(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+\b',  # Title Name
        ]
    
    def detect_pii(self, text: str) -> List[Dict[str, any]]:
        """
        Detect PII in text and return findings
        
        Args:
            text: Input text to analyze
            
        Returns:
            List of dictionaries containing PII type, value, and position
        """
        findings = []
        
        for pii_type, pattern in self.patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                findings.append({
                    'type': pii_type,
                    'value': match.group(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        return findings
    
    def mask_pii(self, text: str, mask_char: str = '*') -> Tuple[str, List[Dict]]:
        """
        Mask PII in text
        
        Args:
            text: Input text to mask
            mask_char: Character to use for masking
            
        Returns:
            Tuple of (masked text, list of masked items)
        """
        findings = self.detect_pii(text)
        masked_text = text
        masked_items = []
        
        # Sort findings by position (reverse order to maintain positions)
        findings.sort(key=lambda x: x['start'], reverse=True)
        
        for finding in findings:
            original_value = finding['value']
            
            # Different masking strategies for different types
            if finding['type'] == 'email':
                # Mask everything except domain
                parts = original_value.split('@')
                if len(parts) == 2:
                    masked_value = f"{mask_char * 5}@{parts[1]}"
                else:
                    masked_value = mask_char * len(original_value)
            elif finding['type'] in ['ssn', 'credit_card']:
                # Show only last 4 digits
                masked_value = mask_char * (len(original_value) - 4) + original_value[-4:]
            elif finding['type'] == 'phone':
                # Mask all but last 4 digits
                digits_only = re.sub(r'\D', '', original_value)
                if len(digits_only) >= 4:
                    masked_value = mask_char * (len(original_value) - 4) + original_value[-4:]
                else:
                    masked_value = mask_char * len(original_value)
            else:
                # Full mask for other types
                masked_value = mask_char * len(original_value)
            
            # Replace in text
            masked_text = masked_text[:finding['start']] + masked_value + masked_text[finding['end']:]
            
            masked_items.append({
                'type': finding['type'],
                'original': original_value,
                'masked': masked_value
            })
        
        return masked_text, masked_items
    
    def mask_client_info(self, text: str, client_name: str = None) -> str:
        """
        Mask client-specific information
        
        Args:
            text: Input text
            client_name: Client name to mask (if known)
            
        Returns:
            Text with client info masked
        """
        masked_text = text
        
        # If client name is provided, mask it
        if client_name:
            masked_text = re.sub(
                re.escape(client_name),
                '[CLIENT_NAME]',
                masked_text,
                flags=re.IGNORECASE
            )
        
        # Mask common client-related terms
        client_terms = ['Company', 'Corporation', 'Corp', 'Inc', 'LLC', 'Ltd']
        for term in client_terms:
            pattern = r'\b[A-Z][A-Za-z0-9]+\s+' + term + r'\b'
            masked_text = re.sub(pattern, '[ORGANIZATION]', masked_text)
        
        return masked_text
