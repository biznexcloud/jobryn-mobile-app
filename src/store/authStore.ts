import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../constants/Roles';

interface AuthStore {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  user: any;
  token: string | null;
  onboarded: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (role: UserRole, token: string, user?: any, onboarded?: boolean) => void;
  logout: () => void;
  setOnboarded: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userRole: null,
      user: null,
      token: null,
      onboarded: false,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      login: (role: UserRole, token: string, user: any = null, onboarded: boolean = false) =>
        set({ isLoggedIn: true, userRole: role, token, user, onboarded }),
      logout: () => {
        console.log('--- GLOBAL LOGOUT TRIGGERED ---');
        set({ isLoggedIn: false, userRole: null, user: null, token: null });
      },
      setOnboarded: (onboarded: boolean) => set({ onboarded }),
    }),
    {
      name: 'jobryn-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);





