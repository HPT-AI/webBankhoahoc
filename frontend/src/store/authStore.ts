import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData: User) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
