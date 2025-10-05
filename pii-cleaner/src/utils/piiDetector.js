// PII Detection and Masking Utilities

/**
 * Detects and masks various types of PII in text
 */
export class PIIDetector {
  constructor() {
    // Regular expressions for different PII types
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      // Common name patterns (simplified)
      name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
      // AWS Access Key patterns
      awsAccessKey: /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g,
      // AWS Secret Key pattern
      awsSecretKey: /\b[A-Za-z0-9/+=]{40}\b/g,
    };
  }

  /**
   * Detects all PII in the given text
   * @param {string} text - Text to analyze
   * @returns {Object} - Detected PII grouped by type
   */
  detectPII(text) {
    const detected = {};
    
    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detected[type] = [...new Set(matches)]; // Remove duplicates
      }
    }
    
    return detected;
  }

  /**
   * Masks PII in the given text
   * @param {string} text - Text to mask
   * @param {Array} typesToMask - Types of PII to mask (default: all)
   * @returns {string} - Masked text
   */
  maskPII(text, typesToMask = null) {
    let maskedText = text;
    const types = typesToMask || Object.keys(this.patterns);
    
    types.forEach(type => {
      if (this.patterns[type]) {
        maskedText = maskedText.replace(this.patterns[type], (match) => {
          return this.getMaskForType(type, match);
        });
      }
    });
    
    return maskedText;
  }

  /**
   * Gets appropriate mask for PII type
   * @param {string} type - Type of PII
   * @returns {string} - Masked text
   */
  getMaskForType(type) {
    const masks = {
      email: '[EMAIL REDACTED]',
      phone: '[PHONE REDACTED]',
      ssn: '[SSN REDACTED]',
      creditCard: '[CARD REDACTED]',
      name: '[NAME REDACTED]',
      ipAddress: '[IP REDACTED]',
      url: '[URL REDACTED]',
      awsAccessKey: '[AWS_KEY REDACTED]',
      awsSecretKey: '[AWS_SECRET REDACTED]',
    };
    
    return masks[type] || '[REDACTED]';
  }

  /**
   * Generates a report of detected PII
   * @param {Object} detected - Detected PII
   * @returns {string} - Formatted report
   */
  generateReport(detected) {
    let report = 'PII Detection Report:\n\n';
    
    if (Object.keys(detected).length === 0) {
      report += 'No PII detected.\n';
      return report;
    }
    
    for (const [type, items] of Object.entries(detected)) {
      report += `${type.toUpperCase()}:\n`;
      items.forEach(item => {
        report += `  - ${item}\n`;
      });
      report += '\n';
    }
    
    return report;
  }
}
