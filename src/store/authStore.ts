
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  idNumber: string;
  cellphone: string;
  dateOfBirth: string;
  gender: string;
  race: string;
  language: string;
  nationality: string;
  employmentStatus: string;
  occupation: string;
  disability: string;
  address: string;
  membershipType: string;
  membershipNumber: string;
  photoUrl?: string;
  province?: string;
  ward?: string;
  votingStation?: string;
  joinDate: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => {
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
