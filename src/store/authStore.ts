import { create } from 'zustand';

interface AuthState {
  role: string | null;
  allowedPages: string[];
  setAuthData: (role: string | null, allowedPages?: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  allowedPages: [],
  setAuthData: (role, allowedPages = []) => set({ role, allowedPages }),
}));
