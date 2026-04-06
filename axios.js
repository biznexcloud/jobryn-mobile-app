import axios from 'axios';
import { useAuthStore } from './src/store/authStore';

const apiClient = axios.create({
  baseURL: 'https://backend.jobryn.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const isAuthPath = config.url?.includes('/account/login/') || 
                      config.url?.includes('/account/register/') ||
                      config.url?.includes('/account/forgot-password/') ||
                      config.url?.includes('/account/verify-otp/') ||
                      config.url?.includes('/account/reset-password/');

    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = useAuthStore.getState().token;
    if (error.response && error.response.status === 401) {
      console.log('--- AXIOS: 401 DETECTED ---', error.config.url, 'Token:', token);
      const isDemoToken = token === 'demo-token' || token?.startsWith('demo_');
      if (!isDemoToken) {
        console.log('--- AXIOS: TRIGGERING AUTO-LOGOUT ---');
        useAuthStore.getState().logout();
      } else {
        console.log('--- AXIOS: PREVENTED LOGOUT (DEMO MODE) ---');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
