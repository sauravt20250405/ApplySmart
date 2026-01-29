// ApplySmart Frontend Integration Examples
// File: src/examples/integration-examples.tsx

import React, { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { apiClient, useDocumentUpload } from '@/lib/api-client';
import { ExamApplication, DocumentValidation } from '@/types';

/**
 * Example 1: Authentication Flow
 */
export const AuthenticationExample = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useApp();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await apiClient.login(phone, otp);
      console.log('Login successful:', result.user);
      // Update app context with user data
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
};

/**
 * Example 2: Create Application
 */
export const CreateApplicationExample = () => {
  const [examType, setExamType] = useState('NDA');
  const [year, setYear] = useState(2026);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<ExamApplication[]>([]);

  const handleCreateApplication = async () => {
    try {
      setLoading(true);
      const result = await apiClient.createApplication(examType, year);
      setApplications([...applications, result.application]);
      console.log('Application created:', result.application);
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-container">
      <select value={examType} onChange={(e) => setExamType(e.target.value)}>
        <option value="NDA">NDA</option>
        <option value="JEE">JEE</option>
        <option value="NEET">NEET</option>
      </select>
      
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
      />
      
      <button onClick={handleCreateApplication} disabled={loading}>
        {loading ? 'Creating...' : 'Create Application'}
      </button>

      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <h3>{app.examType} {app.year}</h3>
            <p>Status: {app.status}</p>
            <p>Compliance: {app.complianceScore}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 3: Document Upload with Validation
 */
export const DocumentUploadExample = () => {
  const { currentApplication } = useApp();
  const { upload, uploading, progress, error } = useDocumentUpload();
  const [validation, setValidation] = useState<DocumentValidation | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentApplication) return;

    try {
      // Get rules for current exam
      const rules = currentApplication.ruleSet?.requirements?.[0]?.rules || [];

      // Upload document
      const result = await upload(file, 'photo', currentApplication.id, rules);

      setValidation(result.validation);
      console.log('Validation complete:', result.validation);

      if (result.validation.overallPassed) {
        console.log('✅ Document passed all checks!');
      } else {
        console.log('⚠️ Document needs corrections');
        // Show auto-corrections
        result.validation.autoCorrections.forEach((correction) => {
          console.log(`- ${correction.type}: ${correction.description}`);
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileSelect} accept="image/*" />
      
      {uploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}>
            {Math.round(progress)}%
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {validation && (
        <div className="validation-result">
          <h3>
            {validation.overallPassed ? '✅ Valid Document' : '⚠️ Issues Found'}
          </h3>
          
          <p>Compliance Score: {validation.complianceScore}%</p>
          <p>Confidence: {validation.overallConfidence}%</p>

          <div className="rules-results">
            <h4>Validation Results:</h4>
            {validation.results.map((result) => (
              <div key={result.rule.id} className="rule-result">
                <span className={result.passed ? 'pass' : 'fail'}>
                  {result.passed ? '✓' : '✗'}
                </span>
                <span>{result.rule.name}</span>
                <p className="details">{result.details}</p>
              </div>
            ))}
          </div>

          {validation.autoCorrections.length > 0 && (
            <div className="auto-corrections">
              <h4>Auto-Corrections Applied:</h4>
              {validation.autoCorrections.map((correction) => (
                <div key={correction.id} className="correction">
                  <strong>{correction.type}</strong>
                  <p>{correction.description}</p>
                  <p className="confidence">
                    Confidence: {correction.confidence}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Example 4: Real-time Validation Feedback
 */
export const ValidationFeedbackExample = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [validationResults, setValidationResults] = useState<any[]>([]);

  const handleImageLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);

    setFile(selectedFile);

    // Quick local validation before upload
    const localChecks = await performLocalChecks(selectedFile);
    setValidationResults(localChecks);
  };

  const performLocalChecks = async (file: File) => {
    const results = [];

    // Check file size
    const maxSize = 100 * 1024; // 100KB
    results.push({
      category: 'fileSize',
      passed: file.size <= maxSize,
      message: `File size: ${(file.size / 1024).toFixed(1)}KB (max: 100KB)`,
    });

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    results.push({
      category: 'format',
      passed: allowedTypes.includes(file.type),
      message: `Format: ${file.type}`,
    });

    // Check image dimensions
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = () => {
        results.push({
          category: 'dimension',
          passed: img.width >= 350 && img.width <= 500,
          message: `Dimensions: ${img.width}×${img.height}px (required: 350-500px)`,
        });
        resolve(null);
      };
      img.src = URL.createObjectURL(file);
    });

    return results;
  };

  return (
    <div className="feedback-container">
      <div className="upload-area">
        <input type="file" onChange={handleImageLoad} accept="image/*" />
        {preview && <img src={preview} alt="Preview" className="preview" />}
      </div>

      <div className="validation-feedback">
        {validationResults.map((result, index) => (
          <div key={index} className={`feedback-item ${result.passed ? 'pass' : 'fail'}`}>
            <span className="icon">{result.passed ? '✓' : '✗'}</span>
            <span className="category">{result.category}</span>
            <span className="message">{result.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 5: Analytics Dashboard
 */
export const AnalyticsDashboardExample = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await apiClient.getAnalytics();
        setAnalytics(result.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No analytics available</div>;

  return (
    <div className="analytics-dashboard">
      <div className="stat-card">
        <h3>Total Applications</h3>
        <p className="stat-value">{analytics.totalApplications}</p>
      </div>

      <div className="stat-card">
        <h3>Documents Processed</h3>
        <p className="stat-value">{analytics.documentStats.total}</p>
        <p className="stat-detail">
          Auto-fixed: {analytics.documentStats.autoFixed}
        </p>
      </div>

      <div className="stat-card">
        <h3>Time Saved</h3>
        <p className="stat-value">{analytics.timeSaved} min</p>
      </div>

      <div className="chart-container">
        <h3>Compliance History</h3>
        <div className="chart">
          {analytics.complianceHistory?.map((entry: any, index: number) => (
            <div key={index} className="chart-bar">
              <div
                className="bar"
                style={{ height: `${entry.score}%` }}
                title={`${entry.date}: ${entry.score}%`}
              ></div>
              <span className="label">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Example 6: Error Handling
 */
export const ErrorHandlingExample = () => {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const handleAPICall = async () => {
    try {
      setError(null);
      // Simulated API call that might fail
      await apiClient.getApplications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('API Error:', err);
    }
  };

  const handleRetry = async () => {
    try {
      setRetrying(true);
      setError(null);
      await handleAPICall();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="error-handling-container">
      <button onClick={handleAPICall}>Make API Call</button>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={handleRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Example 7: Complete Integration in a Page
 */
export const CompleteIntegrationExample = () => {
  const { currentApplication, user } = useApp();
  const [step, setStep] = useState<'select' | 'upload' | 'review'>('select');

  if (!user) {
    return <AuthenticationExample />;
  }

  if (!currentApplication) {
    return <CreateApplicationExample />;
  }

  return (
    <div className="integration-page">
      <header>
        <h1>ApplySmart</h1>
        <p>Welcome, {user.name}!</p>
      </header>

      <main>
        <section className="progress">
          <div className={`step ${step === 'select' ? 'active' : ''}`}>
            1. Select Application
          </div>
          <div className={`step ${step === 'upload' ? 'active' : ''}`}>
            2. Upload Documents
          </div>
          <div className={`step ${step === 'review' ? 'active' : ''}`}>
            3. Review
          </div>
        </section>

        {step === 'select' && (
          <section>
            <CreateApplicationExample />
            <button onClick={() => setStep('upload')}>Continue</button>
          </section>
        )}

        {step === 'upload' && (
          <section>
            <DocumentUploadExample />
            <button onClick={() => setStep('review')}>Continue</button>
          </section>
        )}

        {step === 'review' && (
          <section>
            <AnalyticsDashboardExample />
            <button onClick={() => setStep('upload')}>Upload More</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default CompleteIntegrationExample;