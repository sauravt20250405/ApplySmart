import { AppProvider, useApp } from '@/context/AppContext';
import { LandingPage } from '@/app/components/landing/LandingPage';
import { OTPAuth } from '@/app/components/auth/OTPAuth';
import { Dashboard } from '@/app/components/dashboard/Dashboard';
import { ExamStart } from '@/app/components/exam/ExamStart';
import { UploadPage } from '@/app/components/exam/UploadPage';
import { ComplianceReport } from '@/app/components/compliance/ComplianceReport';
import { AnalyticsDashboard } from '@/app/components/analytics/AnalyticsDashboard';
import { DocumentVault } from '@/app/components/vault/DocumentVault';
import { Navigation } from '@/app/components/layout/Navigation';
import { DemoMode } from '@/app/components/demo/DemoMode';

function AppContent() {
  const { currentPage, isAuthenticated } = useApp();

  // Check for token in storage (to keep you logged in on refresh)
  const hasToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isUserLoggedIn = isAuthenticated || !!hasToken;

  // --- 1. ALWAYS show Landing Page first ---
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  // --- 2. Handle Demo Mode ---
  if (currentPage === 'demo') {
    return <DemoMode />;
  }

  // --- 3. Handle Auth Page (Login Screen) ---
  if (currentPage === 'auth') {
    // ⚡ CHANGED: We removed the auto-redirect.
    // This ensures you ALWAYS see the screen to enter your email and OTP.
    return <OTPAuth />;
  }

  // --- 4. Protected Dashboard Pages ---
  // Only show these if the user is logged in
  if (isUserLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pb-20 md:pb-0">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'exam-start' && <ExamStart />}
          {currentPage === 'upload' && <UploadPage />}
          {currentPage === 'compliance' && <ComplianceReport />}
          {currentPage === 'analytics' && <AnalyticsDashboard />}
          {currentPage === 'vault' && <DocumentVault />}
        </div>
      </div>
    );
  }

  // --- 5. Fallback ---
  // If user tries to access a protected page without a token, send them to Landing
  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}