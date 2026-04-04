import { useState, useEffect } from 'react';
import { UserRole } from '../constants/Roles';

// Mock auth hook - replace with real logic using Firebase/Auth0/etc.
export type AuthState = {
  isLoggedIn: boolean;
  role: UserRole | null;
  user: any;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    user: null,
  });

  const loginAs = (role: UserRole) => {
    setAuthState({
      isLoggedIn: true,
      role: role,
      user: { name: `Test ${role}`, email: 'test@example.com' },
    });
  };

  const logout = () => {
    setAuthState({ isLoggedIn: false, role: null, user: null });
  };

  return { ...authState, loginAs, logout };
};





