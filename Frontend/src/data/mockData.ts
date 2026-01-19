/**
 * Mock Data for Development
 * Centralized mock data that simulates backend responses
 * This will be replaced by real API calls when backend is ready
 */

import { Palestra, Responsabilidade, Orientacao, Avaliacao } from '../types/types';

// ============================================
// PALESTRAS (LECTURES) - Expanded dataset
// ============================================

export const mockPalestras: Palestra[] = [
  {
    id: '1',
    dia: 'Segunda-feira',
    data: '13/01',
    horario: '09:00 - 11:00',
    titulo: 'Cultura e Valores da Empresa',
    local: 'Auditório Principal - 3º andar',
    publico: 'Novos colaboradores (Turma Janeiro)',
    status: 'confirmado',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '2',
    dia: 'Quarta-feira',
    data: '15/01',
    horario: '14:00 - 16:00',
    titulo: 'Processos e Ferramentas Internas',
    local: 'Sala de Treinamento B',
    publico: 'Novos colaboradores + Gestores',
    status: 'atenção',
    observacao: 'Confirmar presença até amanhã (14/01)',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-12T15:30:00Z',
  },
  {
    id: '3',
    dia: 'Sexta-feira',
    data: '17/01',
    horario: '10:00 - 12:00',
    titulo: 'Segurança da Informação',
    local: 'Online - Link será enviado',
    publico: 'Todos os novos colaboradores',
    status: 'pendente',
    observacao: 'Aguardando confirmação do material de apoio',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: '4',
    dia: 'Segunda-feira',
    data: '20/01',
    horario: '09:00 - 10:30',
    titulo: 'Benefícios e Políticas de RH',
    local: 'Sala de Reuniões A - 2º andar',
    publico: 'Novos colaboradores',
    status: 'confirmado',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: '5',
    dia: 'Terça-feira',
    data: '21/01',
    horario: '14:00 - 15:30',
    titulo: 'Metodologias Ágeis na Prática',
    local: 'Sala de Treinamento C',
    publico: 'Equipes de Desenvolvimento',
    status: 'confirmado',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: '6',
    dia: 'Quarta-feira',
    data: '22/01',
    horario: '10:00 - 11:30',
    titulo: 'Comunicação Eficaz em Equipes',
    local: 'Auditório Principal - 3º andar',
    publico: 'Todos os colaboradores',
    status: 'atenção',
    observacao: 'Aguardando confirmação do palestrante externo',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-13T16:00:00Z',
  },
  {
    id: '7',
    dia: 'Quinta-feira',
    data: '23/01',
    horario: '09:00 - 12:00',
    titulo: 'Workshop: Gestão de Tempo e Produtividade',
    local: 'Sala de Treinamento B',
    publico: 'Gestores e Líderes de Equipe',
    status: 'confirmado',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: '8',
    dia: 'Sexta-feira',
    data: '24/01',
    horario: '15:00 - 17:00',
    titulo: 'Inovação e Transformação Digital',
    local: 'Online - Microsoft Teams',
    publico: 'Todos os colaboradores',
    status: 'pendente',
    observacao: 'Aguardando aprovação do orçamento para palestrante',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T09:00:00Z',
  },
  {
    id: '9',
    dia: 'Segunda-feira',
    data: '27/01',
    horario: '10:00 - 11:00',
    titulo: 'Diversidade e Inclusão no Ambiente de Trabalho',
    local: 'Auditório Principal - 3º andar',
    publico: 'Todos os colaboradores',
    status: 'confirmado',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: '10',
    dia: 'Terça-feira',
    data: '28/01',
    horario: '14:00 - 16:00',
    titulo: 'Saúde Mental e Bem-estar',
    local: 'Sala de Treinamento A',
    publico: 'Todos os colaboradores',
    status: 'confirmado',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: '11',
    dia: 'Quarta-feira',
    data: '29/01',
    horario: '09:00 - 10:30',
    titulo: 'Compliance e Ética Empresarial',
    local: 'Online - Zoom',
    publico: 'Gestores e Diretores',
    status: 'atenção',
    observacao: 'Revisar material de apoio até 27/01',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-14T11:00:00Z',
  },
  {
    id: '12',
    dia: 'Quinta-feira',
    data: '30/01',
    horario: '13:00 - 15:00',
    titulo: 'Feedback e Avaliação de Desempenho',
    local: 'Sala de Reuniões B - 2º andar',
    publico: 'Gestores',
    status: 'pendente',
    observacao: 'Definir formato da dinâmica',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
];

// ============================================
// RESPONSABILIDADES (RESPONSIBILITIES)
// ============================================

export const mockResponsabilidades: Responsabilidade[] = [
  {
    id: 'r1',
    texto: 'Confirmar presença na palestra de quarta-feira até 14/01',
    critico: true,
    completo: false,
    createdAt: '2026-01-13T08:00:00Z',
  },
  {
    id: 'r2',
    texto: 'Enviar material de apoio atualizado até terça-feira',
    critico: true,
    completo: false,
    createdAt: '2026-01-13T08:00:00Z',
  },
  {
    id: 'r3',
    texto: 'Preparar slides para apresentação de segunda-feira',
    critico: false,
    completo: false,
    createdAt: '2026-01-13T08:00:00Z',
  },
  {
    id: 'r4',
    texto: 'Revisar lista de participantes com RH',
    critico: false,
    completo: false,
    createdAt: '2026-01-13T08:00:00Z',
  },
];

// ============================================
// ORIENTAÇÕES (GUIDANCE/TIPS)
// ============================================

export const mockOrientacoes: Orientacao[] = [
  {
    id: 'o1',
    titulo: 'Chegue com antecedência',
    texto: 'Recomendamos chegar 15 minutos antes para testar equipamentos',
    icone: 'Lightbulb',
  },
  {
    id: 'o2',
    titulo: 'Material de apoio',
    texto: 'Disponibilize os slides no sistema até 1 dia antes da palestra',
    icone: 'Calendar',
  },
  {
    id: 'o3',
    titulo: 'Feedback é essencial',
    texto: 'Ao final, colete feedback dos participantes para melhorias contínuas',
    icone: 'TrendingUp',
  },
];

// ============================================
// AVALIAÇÃO (EVALUATION METRICS)
// ============================================

export const mockAvaliacao: Avaliacao = {
  nota: 4.6,
  total: 5,
  periodo: 'últimos 3 meses',
};

// ============================================
// HELPER: Get current week info
// ============================================

export const getCurrentWeekInfo = () => {
  const now = new Date();
  const weekNumber = 2; // Mock - could calculate actual week
  const startDate = '13 de Janeiro 2026';
  const endDate = '17 de Janeiro 2026';
  
  return {
    weekNumber,
    description: `Semana ${weekNumber} - ${startDate} a ${endDate}`,
  };
};
