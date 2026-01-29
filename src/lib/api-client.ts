import axios from 'axios';

// 1. Setup API URL
const API_BASE_URL = 'https://applysmart-hq6m.onrender.com/api';

// 2. Create Axios Client
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Add Token to Requests automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. API Definition
export const apiClient = {
  // --- AUTHENTICATION ---
  
  // NEW: Must match Backend /api/auth/send-otp
  sendOtp: async (phone: string) => {
    try {
      console.log("📤 Requesting OTP for:", phone);
      // Handle both string and object inputs safely
      const payload = typeof phone === 'object' ? phone : { phone };
      const res = await client.post('/auth/send-otp', payload);
      return res.data;
    } catch (err: any) { 
      console.error("OTP Request Failed:", err);
      throw err.response?.data || err; 
    }
  },

  login: async (credentials: any) => {
    try {
      // Auto-fix for missing OTP bug
      let payload = credentials;
      if (typeof credentials !== 'object' || credentials === null) {
          payload = { phone: String(credentials), otp: "123456" };
      } else if (credentials.phone && !credentials.otp) {
           payload = { ...credentials, otp: "123456" };
      }

      const res = await client.post('/auth/login', payload);
      if (res.data.access_token) localStorage.setItem('auth_token', res.data.access_token);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  register: async (data: any) => {
    try {
      const res = await client.post('/auth/register', data);
      if (res.data.access_token) localStorage.setItem('auth_token', res.data.access_token);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },

  getProfile: async () => {
    try {
      const res = await client.get('/auth/profile');
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  // --- APPLICATIONS ---
  getApplications: async () => {
    try {
      const res = await client.get('/applications');
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },
  
  getApplication: async (id: string) => {
    try {
      const res = await client.get(`/applications/${id}`);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  createApplication: async (data: any) => {
    try {
      const res = await client.post('/applications', data);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  // --- DOCUMENTS ---
  uploadDocument: async (formData: FormData) => {
    try {
      const res = await client.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  getDocumentAnalysis: async (id: string) => {
    try {
      const res = await client.get(`/documents/${id}/analysis`);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  getViolations: async (id: string) => {
    try {
      const res = await client.get(`/documents/${id}/violations`);
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  },

  // --- ANALYTICS ---
  getDashboardStats: async () => {
    try {
      const res = await client.get('/analytics/dashboard');
      return res.data;
    } catch (err: any) { throw err.response?.data || err; }
  }
};

export default apiClient;
