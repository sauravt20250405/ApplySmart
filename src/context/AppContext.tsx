import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ExamApplication, StoredDocument, AnalyticsData } from '@/types';
import { apiClient } from '@/lib/api-client';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>; // Fixed: Accepts object
  logout: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Applications
  applications: ExamApplication[];
  currentApplication: ExamApplication | null;
  setCurrentApplication: (app: ExamApplication | null) => void;
  createApplication: (examType: string, year: number) => Promise<ExamApplication>;
  updateApplication: (id: string, updates: Partial<ExamApplication>) => Promise<void>;
  
  // Document Vault
  storedDocuments: StoredDocument[];
  addStoredDocument: (doc: StoredDocument) => void;
  deleteStoredDocument: (id: string) => void;
  
  // Analytics
  analytics: AnalyticsData | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Data State
  const [applications, setApplications] = useState<ExamApplication[]>([]);
  const [currentApplication, setCurrentApplication] = useState<ExamApplication | null>(null);
  const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // --- 1. THEME INITIALIZATION ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  // --- 2. DATA LOADING (The Missing Function) ---
  const loadUserData = async () => {
    try {
      // In a real app, these would be separate API calls
      // For the Hackathon, we can mock them or fetch from a 'profile' endpoint if you built it
      
      // A. Mock Analytics (So Dashboard isn't empty)
      setAnalytics({
        userId: 'current-user',
        totalApplications: 0,
        complianceHistory: [{ date: new Date().toISOString().split('T')[0], score: 0 }],
        timeSaved: 0,
        rejectionRiskTrends: [],
        documentStats: { total: 0, autoFixed: 0, manualFixed: 0 }
      });

      // B. Fetch Real Profile if available
      // const profile = await apiClient.getProfile();
      // setUser(profile);
      
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  };

  // --- 3. AUTO-RESTORE SESSION ---
  // If token exists on refresh, fetch user data
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Assume logged in, try to fetch data
        // For hackathon simplicity, we just set a dummy user so the UI works
        setUser({ 
            id: '1', 
            name: 'Candidate', 
            email: 'user@example.com', 
            phone: '', 
            createdAt: '', 
            preferences: { theme: 'light', notifications: true } 
        });
        loadUserData();
    }
  }, []);

  // --- 4. AUTH ACTIONS ---
  const login = async (credentials: any) => {
    try {
      setLoading(true);
      
      // Call API
      const response = await apiClient.login(credentials);
      
      // Update State
      setUser(response.user || { 
          id: '1', 
          name: 'Candidate', 
          email: credentials.email, 
          phone: '', 
          createdAt: '', 
          preferences: { theme: 'light', notifications: true } 
      });
      
      setCurrentPage('dashboard');
      await loadUserData(); // Now this function exists!

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setCurrentPage('landing');
    setCurrentApplication(null);
    localStorage.removeItem('auth_token');
  };

  // --- 5. APPLICATION ACTIONS ---
  const createApplication = async (examType: string, year: number): Promise<ExamApplication> => {
    try {
      setLoading(true);
      const response = await apiClient.createApplication({ examType, year });
      const newApp = response.application || response; // Handle variation in API response
      setApplications(prev => [...prev, newApp]);
      return newApp;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id: string, updates: Partial<ExamApplication>) => {
    // Optimistic Update
    setApplications(prev => prev.map(app => (app.id === id ? { ...app, ...updates } : app)));
    if (currentApplication?.id === id) {
       setCurrentApplication(prev => (prev ? { ...prev, ...updates } : null));
    }
    // API Call
    try {
       // await apiClient.updateApplication(id, updates); 
    } catch (e) { console.error(e); }
  };

  const addStoredDocument = (doc: StoredDocument) => {
    setStoredDocuments(prev => [...prev, doc]);
  };

  const deleteStoredDocument = (id: string) => {
    setStoredDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        applications,
        currentApplication,
        setCurrentApplication,
        createApplication,
        updateApplication,
        storedDocuments,
        addStoredDocument,
        deleteStoredDocument,
        analytics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}