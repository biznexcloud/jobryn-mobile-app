import axios from 'axios';
import { useAuthStore } from './src/store/authStore';

const apiClient = axios.create({
  baseURL: 'https://backend.jobryn.com/api/v1',
  timeout: 30000, // Increased for image uploads
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
                      config.url?.includes('/account/verify-otp/') ||
                      config.url?.includes('/account/reset-password/');

    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Fix for Multipart Uploads: 
    // React Native FormData might not always pass 'instanceof FormData' depending on polyfills.
    // We check for the explicit '_parts' property which is unique to RN FormData.
    const isFormData = config.data instanceof FormData || (config.data && typeof config.data === 'object' && config.data._parts);

    if (isFormData) {
       // By deleting this, Axios will automatically set the correct 'multipart/form-data' with boundary
       delete config.headers['Content-Type'];
    }
    
    // Diagnostic logging for auth
    if (config.url?.includes('/account/login/')) {
       console.log('--- [API] ATTEMPTING LOGIN ---');
       const { email, password } = config.data || {};
       const maskedPw = password ? `${password.substring(0, 2)}****${password.slice(-2)}` : 'MISSING';
       console.log(`- Email: ${email}`);
       console.log(`- Password (Masked): ${maskedPw}`);
    } else {
       console.log(`[API REQUEST] => ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for logging and token expiry
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API SUCCESS] <= ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`);
    
    // Log the token/response data specifically for login so you can see it in the terminal
    if (response.config.url?.includes('/login/')) {
       console.log('--- LOGIN RESPONSE DATA (including token) ---');
       console.log(JSON.stringify(response.data, null, 2));
    }
    
    return response;
  },
  (error) => {
    console.log(`[API ERROR] <= ${error.config?.method?.toUpperCase()} ${error.config?.url} [${error.response?.status}]`);
    if (error.response?.data) {
      console.log('Error Details:', JSON.stringify(error.response.data));
    }
    
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
