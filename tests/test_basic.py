"""
Basic tests for the file cleansing and analysis system
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.cleansing.pii_detector import PIIDetector
from src.analysis.security_analyzer import SecurityAnalyzer


def test_pii_detection():
    """Test PII detection functionality"""
    print("Testing PII Detection...")
    
    detector = PIIDetector()
    
    # Test text with various PII
    test_text = """
    Contact: John Doe at john.doe@example.com or call (555) 123-4567
    SSN: 123-45-6789
    Credit Card: 4532-1234-5678-9010
    Address: 123 Main Street, New York
    IP: 192.168.1.1
    """
    
    # Detect PII
    findings = detector.detect_pii(test_text)
    print(f"✓ Found {len(findings)} PII items")
    
    for finding in findings:
        print(f"  - {finding['type']}: {finding['value']}")
    
    # Mask PII
    masked_text, masked_items = detector.mask_pii(test_text)
    print(f"✓ Masked {len(masked_items)} items")
    print(f"✓ Masked text preview: {masked_text[:100]}...")
    
    assert len(findings) > 0, "Should detect PII"
    assert len(masked_items) > 0, "Should mask PII"
    print("✓ PII Detection tests passed!\n")


def test_security_analysis():
    """Test security content analysis"""
    print("Testing Security Analysis...")
    
    analyzer = SecurityAnalyzer()
    
    # Test IAM policy
    iam_text = '''
    {
        "Effect": "Allow",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::mybucket/*"
    }
    '''
    
    iam_results = analyzer.analyze_iam_policy(iam_text)
    print(f"✓ IAM Policy found: {iam_results['found']}")
    
    # Test firewall rules
    fw_text = """
    Rule 1: allow tcp port 443 from 10.0.0.0/8 to 192.168.1.100
    Rule 2: deny tcp port 22 from any to 192.168.1.0/24
    """
    
    fw_results = analyzer.analyze_firewall_rules(fw_text)
    print(f"✓ Firewall rules found: {fw_results['found']}")
    if fw_results['rules']:
        print(f"  - Total rules: {len(fw_results['rules'])}")
    
    # Test IDS/IPS logs
    ids_text = """
    2024-01-01 12:00:00 [ALERT] Critical: Signature: SQL Injection Attempt
    Src: 10.0.0.50 Dst: 192.168.1.100
    """
    
    ids_results = analyzer.analyze_ids_ips_logs(ids_text)
    print(f"✓ IDS/IPS logs found: {ids_results['found']}")
    
    print("✓ Security Analysis tests passed!\n")


def test_client_masking():
    """Test client information masking"""
    print("Testing Client Information Masking...")
    
    detector = PIIDetector()
    
    test_text = "This document is for Acme Corporation and was prepared by Acme Corp."
    masked_text = detector.mask_client_info(test_text, "Acme")
    
    print(f"✓ Original: {test_text}")
    print(f"✓ Masked: {masked_text}")
    
    assert "Acme" not in masked_text or masked_text.count("[CLIENT_NAME]") > 0, "Should mask client name"
    print("✓ Client masking tests passed!\n")


if __name__ == "__main__":
    print("=" * 60)
    print("Running Basic Tests")
    print("=" * 60 + "\n")
    
    try:
        test_pii_detection()
        test_security_analysis()
        test_client_masking()
        
        print("=" * 60)
        print("✓ All tests passed successfully!")
        print("=" * 60)
    except Exception as e:
        print(f"\n✗ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
