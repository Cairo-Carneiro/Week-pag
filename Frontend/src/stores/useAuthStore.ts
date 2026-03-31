import { create } from 'zustand';
import * as authService from '../services/authService';

interface AuthUser {
    id: string;
    nome: string;
    email: string;
    role: string;
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    login: async (email: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });

        try {
            const { token, user } = await authService.login(email, password);

            authService.setStoredToken(token);

            set({
                user,
                isAuthenticated: true,
                loading: false,
                error: null,
            });

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao fazer o Login';
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: message,
            });

            return false;
        }
    },
    logout: () => {
        authService.removeStoredToken();
        set({
            user: null,
            isAuthenticated: false,
            error: null,
        });
    },
    checkAuth: async () => {
        const token = authService.getStoredToken();
        if (!token) return;

        set({ loading: true });

        try {
            const user = await authService.getMe();
            set({
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    role: user.role,
                },
                isAuthenticated: true,
                loading: false,
            });
        } catch {
            authService.removeStoredToken();
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: 'Sessão expirada',
            });
        }
    },
    clearError: () => {
        set({ error: null });
    },
}));
