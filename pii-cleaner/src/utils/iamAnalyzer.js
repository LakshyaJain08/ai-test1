// IAM Policy Analyzer Utilities

/**
 * Analyzes AWS IAM policies and provides insights
 */
export class IAMAnalyzer {
  /**
   * Parse and analyze IAM policy JSON
   * @param {string} policyText - IAM policy as JSON string
   * @returns {Object} - Analysis results
   */
  analyzePolicy(policyText) {
    try {
      const policy = JSON.parse(policyText);
      
      const analysis = {
        valid: true,
        version: policy.Version || 'Not specified',
        statements: [],
        risks: [],
        recommendations: [],
        summary: {}
      };

      // Analyze statements
      if (policy.Statement) {
        const statements = Array.isArray(policy.Statement) ? policy.Statement : [policy.Statement];
        
        statements.forEach((statement, index) => {
          const statementAnalysis = this.analyzeStatement(statement, index);
          analysis.statements.push(statementAnalysis);
          analysis.risks.push(...statementAnalysis.risks);
          analysis.recommendations.push(...statementAnalysis.recommendations);
        });
      }

      // Generate summary
      analysis.summary = {
        totalStatements: analysis.statements.length,
        allowStatements: analysis.statements.filter(s => s.effect === 'Allow').length,
        denyStatements: analysis.statements.filter(s => s.effect === 'Deny').length,
        totalRisks: analysis.risks.length,
        highRisks: analysis.risks.filter(r => r.severity === 'high').length,
        mediumRisks: analysis.risks.filter(r => r.severity === 'medium').length,
        lowRisks: analysis.risks.filter(r => r.severity === 'low').length,
      };

      return analysis;
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid IAM policy JSON: ' + error.message,
        risks: [],
        recommendations: [],
        summary: {}
      };
    }
  }

  /**
   * Analyze individual IAM statement
   * @param {Object} statement - IAM statement
   * @param {number} index - Statement index
   * @returns {Object} - Statement analysis
   */
  analyzeStatement(statement, index) {
    const analysis = {
      index: index,
      sid: statement.Sid || `Statement-${index}`,
      effect: statement.Effect || 'Not specified',
      actions: this.extractActions(statement.Action),
      resources: this.extractResources(statement.Resource),
      principals: statement.Principal || null,
      conditions: statement.Condition || null,
      risks: [],
      recommendations: []
    };

    // Check for wildcard permissions
    if (this.hasWildcardActions(statement.Action)) {
      analysis.risks.push({
        severity: 'high',
        type: 'Overly permissive actions',
        description: `Statement ${index} uses wildcard (*) for actions, granting broad permissions.`,
        statement: index
      });
      analysis.recommendations.push({
        type: 'Restrict actions',
        description: `Replace wildcard actions with specific, required actions only.`,
        statement: index
      });
    }

    // Check for wildcard resources
    if (this.hasWildcardResources(statement.Resource)) {
      analysis.risks.push({
        severity: 'high',
        type: 'Overly permissive resources',
        description: `Statement ${index} uses wildcard (*) for resources, applying to all resources.`,
        statement: index
      });
      analysis.recommendations.push({
        type: 'Restrict resources',
        description: `Specify exact resource ARNs instead of using wildcards.`,
        statement: index
      });
    }

    // Check for dangerous actions
    const dangerousActions = this.checkDangerousActions(statement.Action);
    if (dangerousActions.length > 0) {
      analysis.risks.push({
        severity: 'high',
        type: 'Dangerous permissions',
        description: `Statement ${index} includes dangerous actions: ${dangerousActions.join(', ')}`,
        statement: index
      });
      analysis.recommendations.push({
        type: 'Review permissions',
        description: `Review and restrict dangerous actions. Consider using more granular permissions.`,
        statement: index
      });
    }

    // Check for missing conditions
    if (!statement.Condition && statement.Effect === 'Allow') {
      analysis.risks.push({
        severity: 'medium',
        type: 'Missing conditions',
        description: `Statement ${index} lacks conditions, making it less restrictive.`,
        statement: index
      });
      analysis.recommendations.push({
        type: 'Add conditions',
        description: `Consider adding conditions like IP restrictions, MFA requirements, or time-based constraints.`,
        statement: index
      });
    }

    return analysis;
  }

  /**
   * Extract actions from statement
   */
  extractActions(action) {
    if (!action) return [];
    return Array.isArray(action) ? action : [action];
  }

  /**
   * Extract resources from statement
   */
  extractResources(resource) {
    if (!resource) return [];
    return Array.isArray(resource) ? resource : [resource];
  }

  /**
   * Check if actions include wildcards
   */
  hasWildcardActions(action) {
    const actions = this.extractActions(action);
    return actions.some(a => a === '*' || a.endsWith(':*'));
  }

  /**
   * Check if resources include wildcards
   */
  hasWildcardResources(resource) {
    const resources = this.extractResources(resource);
    return resources.some(r => r === '*');
  }

  /**
   * Check for dangerous actions
   */
  checkDangerousActions(action) {
    const actions = this.extractActions(action);
    const dangerous = [
      'iam:*',
      'iam:CreateUser',
      'iam:CreateAccessKey',
      'iam:AttachUserPolicy',
      'iam:PutUserPolicy',
      's3:*',
      'ec2:*',
      'lambda:*',
      'dynamodb:*',
      '*:*'
    ];

    return actions.filter(a => 
      dangerous.some(d => a === d || a.startsWith(d.replace('*', '')))
    );
  }

  /**
   * Generate formatted report
   */
  generateReport(analysis) {
    let report = '=== IAM Policy Analysis Report ===\n\n';

    if (!analysis.valid) {
      report += `ERROR: ${analysis.error}\n`;
      return report;
    }

    report += `Policy Version: ${analysis.version}\n`;
    report += `Total Statements: ${analysis.summary.totalStatements}\n`;
    report += `Allow Statements: ${analysis.summary.allowStatements}\n`;
    report += `Deny Statements: ${analysis.summary.denyStatements}\n\n`;

    report += `=== Risk Summary ===\n`;
    report += `High Risk Issues: ${analysis.summary.highRisks}\n`;
    report += `Medium Risk Issues: ${analysis.summary.mediumRisks}\n`;
    report += `Low Risk Issues: ${analysis.summary.lowRisks}\n\n`;

    if (analysis.risks.length > 0) {
      report += `=== Identified Risks ===\n`;
      analysis.risks.forEach((risk, idx) => {
        report += `${idx + 1}. [${risk.severity.toUpperCase()}] ${risk.type}\n`;
        report += `   ${risk.description}\n\n`;
      });
    }

    if (analysis.recommendations.length > 0) {
      report += `=== Recommendations ===\n`;
      analysis.recommendations.forEach((rec, idx) => {
        report += `${idx + 1}. ${rec.type}\n`;
        report += `   ${rec.description}\n\n`;
      });
    }

    return report;
  }
}
