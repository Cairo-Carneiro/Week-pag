/**
 * Palestra Service — Integração com API Real
 *
 * ANTES: usava localStorage + dados mock
 * AGORA: faz chamadas HTTP reais para o backend Express
 *
 * CONCEITO IMPORTANTE:
 * Este arquivo só sabe fazer chamadas HTTP e retornar dados.
 * Ele NÃO guarda estado (quem faz isso é a Store do Zustand).
 * Os componentes React NUNCA importam este arquivo diretamente —
 * eles sempre passam pela Store.
 */

import { Palestra, PalestraFormData, PalestraFilters } from '../types/types';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

// ============================================
// TIPOS LOCAIS
// ============================================

/**
 * O backend usa "atencao" (sem acento) — limitação do enum do Prisma.
 * O frontend usa "atenção" (com acento) — definido em types.ts.
 * Esse tipo representa o que vem do banco de dados.
 */
type PalestraBackend = Omit<Palestra, 'status'> & {
  status: 'confirmado' | 'atencao' | 'pendente';
};

// ============================================
// HELPERS DE CONVERSÃO
// ============================================

/**
 * Converte o status do formato do backend para o formato do frontend.
 * "atencao" → "atenção"
 */
const toFrontend = (p: PalestraBackend): Palestra => ({
  ...p,
  status: p.status === 'atencao' ? 'atenção' : p.status,
});

/**
 * Converte o status do frontend para o formato do backend antes de enviar.
 * "atenção" → "atencao"
 */
const toBackend = (status: Palestra['status']): PalestraBackend['status'] => {
  return status === 'atenção' ? 'atencao' : status;
};

// ============================================
// MÉTODOS DO SERVICE
// ============================================

/**
 * Busca todas as palestras do banco de dados.
 * Endpoint: GET /api/palestras
 */
export const getAll = async (): Promise<Palestra[]> => {
  const response = await apiGet<PalestraBackend[]>('/api/palestras');
  return (response.data || []).map(toFrontend);
};

/**
 * Busca uma palestra específica pelo ID.
 * Endpoint: GET /api/palestras/:id
 */
export const getById = async (id: string): Promise<Palestra | null> => {
  try {
    const response = await apiGet<PalestraBackend>(`/api/palestras/${id}`);
    return response.data ? toFrontend(response.data) : null;
  } catch {
    return null;
  }
};

/**
 * Cria uma nova palestra no banco de dados.
 * Endpoint: POST /api/palestras
 */
export const create = async (data: PalestraFormData): Promise<Palestra> => {
  const payload = { ...data, status: toBackend(data.status) };
  const response = await apiPost<PalestraBackend>('/api/palestras', payload);

  if (!response.data) {
    throw new Error('Erro ao criar palestra: resposta inválida do servidor');
  }

  return toFrontend(response.data);
};

/**
 * Atualiza uma palestra existente.
 * Endpoint: PUT /api/palestras/:id
 */
export const update = async (
  id: string,
  data: Partial<PalestraFormData>
): Promise<Palestra | null> => {
  try {
    const payload = data.status
      ? { ...data, status: toBackend(data.status) }
      : data;
    const response = await apiPut<PalestraBackend>(`/api/palestras/${id}`, payload);
    return response.data ? toFrontend(response.data) : null;
  } catch {
    return null;
  }
};

/**
 * Deleta uma palestra pelo ID.
 * Endpoint: DELETE /api/palestras/:id
 */
export const deletePalestra = async (id: string): Promise<boolean> => {
  try {
    await apiDelete(`/api/palestras/${id}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Filtra palestras por status, busca ou data.
 * Endpoint: GET /api/palestras/filter?status=&searchQuery=
 */
export const filterPalestras = async (filters: PalestraFilters): Promise<Palestra[]> => {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'todos') {
    params.set('status', toBackend(filters.status as Palestra['status']));
  }
  if (filters.searchQuery) {
    params.set('searchQuery', filters.searchQuery);
  }
  if (filters.dataInicio) {
    params.set('dataInicio', filters.dataInicio);
  }
  if (filters.dataFim) {
    params.set('dataFim', filters.dataFim);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await apiGet<PalestraBackend[]>(`/api/palestras/filter${query}`);
  return (response.data || []).map(toFrontend);
};

/**
 * Busca palestras pelo título (ou local/público).
 * Endpoint: GET /api/palestras/search?query=
 */
export const searchByTitle = async (query: string): Promise<Palestra[]> => {
  if (!query.trim()) return getAll();
  const response = await apiGet<PalestraBackend[]>(
    `/api/palestras/search?query=${encodeURIComponent(query)}`
  );
  return (response.data || []).map(toFrontend);
};

/**
 * Busca palestras por status específico.
 * Endpoint: GET /api/palestras/status/:status
 */
export const getByStatus = async (status: Palestra['status']): Promise<Palestra[]> => {
  const backendStatus = toBackend(status);
  const response = await apiGet<PalestraBackend[]>(
    `/api/palestras/status/${backendStatus}`
  );
  return (response.data || []).map(toFrontend);
};

// Export padrão (compatível com o uso atual)
export default {
  getAll,
  getById,
  create,
  update,
  delete: deletePalestra,
  filter: filterPalestras,
  searchByTitle,
  getByStatus,
};
