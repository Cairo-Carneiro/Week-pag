/**
 * api.ts — Cliente HTTP Base
 *
 * Este arquivo é o ponto central de comunicação com o backend.
 * Todos os services importam as funções daqui.
 *
 * POR QUE fazer isso?
 * - A URL do backend fica definida em um só lugar
 * - Se mudar a URL (ex: ir para produção), muda aqui e pronto
 * - Tratamento de erro centralizado (não precisa repetir em todo service)
 */

// URL base do backend. O "import.meta.env" lê variáveis do arquivo .env do Vite
// Se não existir a variável, usa localhost:3001 como padrão
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================
// TIPOS
// ============================================

/**
 * Formato padrão de resposta que o nosso backend sempre retorna:
 * { success: true, data: [...] }  ou  { success: false, error: "mensagem" }
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// ============================================
// FUNÇÕES HTTP
// ============================================

/**
 * GET — buscar dados
 * Uso: apiGet<Palestra[]>('/api/palestras')
 */
export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * POST — criar novo registro
 * Uso: apiPost<Palestra>('/api/palestras', { titulo: '...', ... })
 */
export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

/**
 * PUT — atualizar registro existente
 * Uso: apiPut<Palestra>('/api/palestras/123', { titulo: '...' })
 */
export async function apiPut<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

/**
 * DELETE — apagar registro
 * Uso: apiDelete('/api/palestras/123')
 */
export async function apiDelete(path: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

/**
 * PATCH — atualização parcial (ex: toggle de status)
 * Uso: apiPatch<Responsabilidade>('/api/responsabilidades/123/toggle')
 * Pode receber body ou não (toggle não precisa de body)
 */
export async function apiPatch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

