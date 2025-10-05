"""
Security Content Analyzer
Analyzes security-related content like IAM policies, firewall rules, IDS/IPS logs
"""
import re
from typing import Dict, List


class SecurityAnalyzer:
    """Analyzes security-related content and extracts meaningful insights"""
    
    def __init__(self):
        self.patterns = {
            'iam_policy': {
                'effect': r'(?i)"Effect"\s*:\s*"(Allow|Deny)"',
                'action': r'(?i)"Action"\s*:\s*"([^"]+)"',
                'resource': r'(?i)"Resource"\s*:\s*"([^"]+)"',
                'principal': r'(?i)"Principal"\s*:\s*"([^"]+)"'
            },
            'firewall_rule': {
                'rule_number': r'(?i)rule\s+#?(\d+)',
                'action': r'(?i)(allow|deny|drop|reject|accept)',
                'protocol': r'(?i)(tcp|udp|icmp|ip|any)',
                'port': r'(?i)port[s]?\s+(\d+(?:-\d+)?)',
                'source_ip': r'(?i)(?:source|src|from)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:/\d{1,2})?)',
                'dest_ip': r'(?i)(?:destination|dest|dst|to)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:/\d{1,2})?)'
            },
            'ids_ips_log': {
                'timestamp': r'\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}',
                'severity': r'(?i)(critical|high|medium|low|info)',
                'alert_type': r'(?i)(alert|drop|pass|log)',
                'signature': r'(?i)signature[:\s]+([^\n]+)',
                'source_ip': r'(?i)(?:src|source)[:\s]+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})',
                'dest_ip': r'(?i)(?:dst|dest|destination)[:\s]+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
            }
        }
    
    def analyze_iam_policy(self, text: str) -> Dict[str, any]:
        """
        Analyze IAM policy statements
        
        Args:
            text: Text containing IAM policies
            
        Returns:
            Analysis results
        """
        results = {
            'found': False,
            'policies': [],
            'summary': {}
        }
        
        # Check if text contains IAM policy indicators
        iam_indicators = ['Effect', 'Action', 'Resource', 'Statement', 'Principal']
        if not any(indicator in text for indicator in iam_indicators):
            return results
        
        results['found'] = True
        
        # Extract policy components
        for component, pattern in self.patterns['iam_policy'].items():
            matches = re.findall(pattern, text)
            if matches:
                results['policies'].append({
                    'component': component,
                    'values': matches
                })
        
        # Generate summary
        results['summary'] = {
            'total_components_found': len(results['policies']),
            'has_allow_effect': any('Allow' in str(p) for p in results['policies']),
            'has_deny_effect': any('Deny' in str(p) for p in results['policies'])
        }
        
        return results
    
    def analyze_firewall_rules(self, text: str) -> Dict[str, any]:
        """
        Analyze firewall rules
        
        Args:
            text: Text containing firewall rules
            
        Returns:
            Analysis results
        """
        results = {
            'found': False,
            'rules': [],
            'summary': {}
        }
        
        # Check for firewall rule indicators
        firewall_indicators = ['rule', 'firewall', 'allow', 'deny', 'port', 'protocol']
        if not any(indicator.lower() in text.lower() for indicator in firewall_indicators):
            return results
        
        results['found'] = True
        
        # Split text into potential rule lines
        lines = text.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            rule_data = {'line_number': line_num, 'content': line.strip()}
            
            # Extract rule components
            for component, pattern in self.patterns['firewall_rule'].items():
                match = re.search(pattern, line)
                if match:
                    rule_data[component] = match.group(1) if match.lastindex else match.group(0)
            
            # Only add if at least one component was found
            if len(rule_data) > 2:  # More than just line_number and content
                results['rules'].append(rule_data)
        
        # Generate summary
        if results['rules']:
            results['summary'] = {
                'total_rules': len(results['rules']),
                'allow_rules': sum(1 for r in results['rules'] if r.get('action', '').lower() in ['allow', 'accept']),
                'deny_rules': sum(1 for r in results['rules'] if r.get('action', '').lower() in ['deny', 'drop', 'reject']),
                'protocols_used': list(set(r.get('protocol', '').lower() for r in results['rules'] if r.get('protocol')))
            }
        
        return results
    
    def analyze_ids_ips_logs(self, text: str) -> Dict[str, any]:
        """
        Analyze IDS/IPS log entries
        
        Args:
            text: Text containing IDS/IPS logs
            
        Returns:
            Analysis results
        """
        results = {
            'found': False,
            'alerts': [],
            'summary': {}
        }
        
        # Check for IDS/IPS indicators
        ids_indicators = ['alert', 'signature', 'snort', 'suricata', 'intrusion']
        if not any(indicator.lower() in text.lower() for indicator in ids_indicators):
            return results
        
        results['found'] = True
        
        # Split into lines and analyze
        lines = text.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            alert_data = {'line_number': line_num, 'content': line.strip()}
            
            # Extract log components
            for component, pattern in self.patterns['ids_ips_log'].items():
                match = re.search(pattern, line)
                if match:
                    alert_data[component] = match.group(1) if match.lastindex else match.group(0)
            
            # Only add if relevant components found
            if len(alert_data) > 2:
                results['alerts'].append(alert_data)
        
        # Generate summary
        if results['alerts']:
            severities = [a.get('severity', '').lower() for a in results['alerts'] if a.get('severity')]
            results['summary'] = {
                'total_alerts': len(results['alerts']),
                'severity_breakdown': {
                    'critical': severities.count('critical'),
                    'high': severities.count('high'),
                    'medium': severities.count('medium'),
                    'low': severities.count('low')
                },
                'unique_sources': len(set(a.get('source_ip') for a in results['alerts'] if a.get('source_ip'))),
                'unique_destinations': len(set(a.get('dest_ip') for a in results['alerts'] if a.get('dest_ip')))
            }
        
        return results
    
    def analyze(self, text: str) -> Dict[str, any]:
        """
        Comprehensive security analysis
        
        Args:
            text: Text to analyze
            
        Returns:
            Complete analysis results
        """
        return {
            'iam_policies': self.analyze_iam_policy(text),
            'firewall_rules': self.analyze_firewall_rules(text),
            'ids_ips_logs': self.analyze_ids_ips_logs(text),
            'text_length': len(text),
            'line_count': len(text.split('\n'))
        }
