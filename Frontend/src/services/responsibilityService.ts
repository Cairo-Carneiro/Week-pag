/**
 * Responsibility Service — Integração com API Real
 *
 * ANTES: usava localStorage + dados mock
 * AGORA: faz chamadas HTTP reais para o backend Express
 *
 * Endpoints utilizados:
 *   GET    /api/responsabilidades
 *   GET    /api/responsabilidades/:id
 *   POST   /api/responsabilidades
 *   PUT    /api/responsabilidades/:id   (atualizar / toggle)
 *   DELETE /api/responsabilidades/:id
 */

import { Responsabilidade, ResponsibilidadeFormData } from '../types/types';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';

// ============================================
// MÉTODOS DO SERVICE
// ============================================

/**
 * Busca todas as responsabilidades do banco de dados.
 * Endpoint: GET /api/responsabilidades
 */
export const getAll = async (): Promise<Responsabilidade[]> => {
  const response = await apiGet<Responsabilidade[]>('/api/responsabilidades');
  return response.data || [];
};

/**
 * Busca uma responsabilidade específica pelo ID.
 * Endpoint: GET /api/responsabilidades/:id
 */
export const getById = async (id: string): Promise<Responsabilidade | null> => {
  try {
    const response = await apiGet<Responsabilidade>(`/api/responsabilidades/${id}`);
    return response.data || null;
  } catch {
    return null;
  }
};

/**
 * Cria uma nova responsabilidade.
 * O campo "completo" sempre começa como false — o backend já define o default.
 * Endpoint: POST /api/responsabilidades
 */
export const create = async (data: ResponsibilidadeFormData): Promise<Responsabilidade> => {
  const response = await apiPost<Responsabilidade>('/api/responsabilidades', data);

  if (!response.data) {
    throw new Error('Erro ao criar responsabilidade: resposta inválida do servidor');
  }

  return response.data;
};

/**
 * Alterna o campo "completo" de uma responsabilidade (true → false → true).
 *
 * COMO FUNCIONA:
 * O backend tem um endpoint dedicado só para isso: PATCH /:id/toggle
 * Ele busca o valor atual e inverte automaticamente — mais eficiente!
 *
 * Endpoint: PATCH /api/responsabilidades/:id/toggle
 */
export const toggleComplete = async (id: string): Promise<Responsabilidade | null> => {
  try {
    // O backend cuida de tudo — apenas mandamos a requisição PATCH
    const response = await apiPatch<Responsabilidade>(`/api/responsabilidades/${id}/toggle`);
    return response.data || null;
  } catch {
    return null;
  }
};

/**
 * Atualiza qualquer campo de uma responsabilidade.
 * Endpoint: PUT /api/responsabilidades/:id
 */
export const update = async (
  id: string,
  data: Partial<Omit<Responsabilidade, 'id' | 'createdAt'>>
): Promise<Responsabilidade | null> => {
  try {
    const response = await apiPut<Responsabilidade>(`/api/responsabilidades/${id}`, data);
    return response.data || null;
  } catch {
    return null;
  }
};

/**
 * Deleta uma responsabilidade pelo ID.
 * Endpoint: DELETE /api/responsabilidades/:id
 */
export const deleteResponsabilidade = async (id: string): Promise<boolean> => {
  try {
    await apiDelete(`/api/responsabilidades/${id}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Busca apenas as responsabilidades não concluídas.
 * Endpoint: GET /api/responsabilidades?completo=false
 */
export const getIncomplete = async (): Promise<Responsabilidade[]> => {
  const response = await apiGet<Responsabilidade[]>('/api/responsabilidades?completo=false');
  return response.data || [];
};

/**
 * Busca apenas as responsabilidades críticas e não concluídas.
 * Endpoint: GET /api/responsabilidades?critico=true
 */
export const getCritical = async (): Promise<Responsabilidade[]> => {
  const response = await apiGet<Responsabilidade[]>(
    '/api/responsabilidades?critico=true&completo=false'
  );
  return response.data || [];
};

// Export padrão (compatível com o uso atual)
export default {
  getAll,
  getById,
  create,
  toggleComplete,
  update,
  delete: deleteResponsabilidade,
  getIncomplete,
  getCritical,
};
