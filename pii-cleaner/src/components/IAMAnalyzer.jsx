import { useState } from 'react';
import { IAMAnalyzer as IAMAnalyzerUtil } from '../utils/iamAnalyzer';
import './IAMAnalyzer.css';

function IAMAnalyzer() {
  const [policyText, setPolicyText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showExample, setShowExample] = useState(false);

  const analyzer = new IAMAnalyzerUtil();

  const examplePolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}`;

  const handleAnalyze = () => {
    if (!policyText.trim()) {
      alert('Please enter an IAM policy to analyze.');
      return;
    }

    const result = analyzer.analyzePolicy(policyText);
    setAnalysis(result);
  };

  const handleLoadExample = () => {
    setPolicyText(examplePolicy);
    setShowExample(false);
  };

  const handleClear = () => {
    setPolicyText('');
    setAnalysis(null);
  };

  const getRiskColor = (severity) => {
    switch (severity) {
      case 'high': return '#d9534f';
      case 'medium': return '#f0ad4e';
      case 'low': return '#5bc0de';
      default: return '#666';
    }
  };

  return (
    <div className="iam-analyzer">
      <div className="analyzer-header">
        <h2>IAM Policy Analyzer</h2>
        <p className="analyzer-description">
          Paste your AWS IAM policy JSON to analyze potential security risks and get recommendations.
        </p>
      </div>

      <div className="analyzer-input">
        <div className="input-header">
          <label htmlFor="policy-input">IAM Policy (JSON)</label>
          <div className="input-actions">
            <button onClick={() => setShowExample(!showExample)} className="example-btn">
              {showExample ? 'Hide Example' : 'Show Example'}
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          </div>
        </div>
        
        {showExample && (
          <div className="example-box">
            <p>Example IAM Policy (overly permissive):</p>
            <pre>{examplePolicy}</pre>
            <button onClick={handleLoadExample} className="load-example-btn">
              Load Example
            </button>
          </div>
        )}

        <textarea
          id="policy-input"
          value={policyText}
          onChange={(e) => setPolicyText(e.target.value)}
          placeholder="Paste your IAM policy JSON here..."
          rows={15}
          className="policy-textarea"
        />

        <button onClick={handleAnalyze} className="analyze-btn">
          Analyze Policy
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          {!analysis.valid ? (
            <div className="error-box">
              <h3>❌ Error</h3>
              <p>{analysis.error}</p>
            </div>
          ) : (
            <>
              <div className="summary-box">
                <h3>Policy Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Version:</span>
                    <span className="summary-value">{analysis.version}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Statements:</span>
                    <span className="summary-value">{analysis.summary.totalStatements}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Allow Statements:</span>
                    <span className="summary-value">{analysis.summary.allowStatements}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Deny Statements:</span>
                    <span className="summary-value">{analysis.summary.denyStatements}</span>
                  </div>
                </div>
              </div>

              <div className="risks-box">
                <h3>Risk Assessment</h3>
                <div className="risk-summary">
                  <div className="risk-badge high">
                    {analysis.summary.highRisks} High Risk
                  </div>
                  <div className="risk-badge medium">
                    {analysis.summary.mediumRisks} Medium Risk
                  </div>
                  <div className="risk-badge low">
                    {analysis.summary.lowRisks} Low Risk
                  </div>
                </div>

                {analysis.risks.length > 0 ? (
                  <div className="risks-list">
                    {analysis.risks.map((risk, idx) => (
                      <div key={idx} className="risk-item" style={{ borderLeftColor: getRiskColor(risk.severity) }}>
                        <div className="risk-header">
                          <span className="risk-severity" style={{ backgroundColor: getRiskColor(risk.severity) }}>
                            {risk.severity.toUpperCase()}
                          </span>
                          <span className="risk-type">{risk.type}</span>
                        </div>
                        <p className="risk-description">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-risks">✓ No security risks detected!</p>
                )}
              </div>

              {analysis.recommendations.length > 0 && (
                <div className="recommendations-box">
                  <h3>Recommendations</h3>
                  <div className="recommendations-list">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-item">
                        <h4>{rec.type}</h4>
                        <p>{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default IAMAnalyzer;
