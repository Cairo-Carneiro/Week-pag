import { apiPost, apiGet } from "./api";

interface LoginResponse {
    token: string;
    user: {
        id: string;
        nome: string;
        email: string;
        role: string;
    };
}
interface MeResponse{
    id: string;
    nome: string;
    email: string;
    role: string;
    perfil: string;
    
}

const TOKEN_KEY = 'weekpage_token';

export function getStoredToken(): string | null{
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void{
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void{
    localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<LoginResponse>{
    const response = await apiPost<LoginResponse>('/api/auth/login', { email, password });
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Error ao fazer o login');
    }

    return response.data;

}

export async function getMe(): Promise<MeResponse>{
    const response = await apiGet<MeResponse>('/api/auth/me');

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Sessão expirada');
    }

    return response.data;
}
