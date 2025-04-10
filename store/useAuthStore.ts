import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        // In a real app, you would validate credentials with an API
        // For this example, we'll just set isAuthenticated to true
        set({ isAuthenticated: true, user: { email } });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage', // unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
