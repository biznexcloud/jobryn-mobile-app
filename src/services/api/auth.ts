import apiClient from '../../../axios';
import { RegisterData, AuthResponse } from '../../types';

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/account/login/', { email, password });
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/account/register/', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/account/profile/');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await apiClient.put('/account/profile/', profileData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/account/forgot-password/', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await apiClient.post('/account/verify-otp/', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, new_password: string) => {
    const response = await apiClient.post('/account/reset-password/', { email, otp, new_password });
    return response.data;
  },
  
  resendOtp: async (email: string) => {
    const response = await apiClient.post('/account/resend-otp/', { email });
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await apiClient.delete('/account/profile/');
    return response.data;
  },
};





