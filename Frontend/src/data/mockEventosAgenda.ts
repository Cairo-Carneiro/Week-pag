/**
 * Mock Data for Eventos de Agenda
 * Baseado na estrutura do Excel fornecido
 * Representa a agenda diária de onboarding
 */

import { EventoAgenda } from '../types/types';

export const mockEventosAgenda: EventoAgenda[] = [
  {
    id: '1',
    data: '23/01/2026',
    horario: '09:00 - 10:00',
    assunto: 'Boas-vindas e Cultura Organizacional',
    facilitador: 'Maria Silva',
    local: 'Auditório Principal - Prédio A',
    publicoAlvo: 'Novos Colaboradores',
    cargaHoraria: 1,
    descricao: 'Sessão de boas-vindas aos novos colaboradores, apresentando a cultura, valores e missão da empresa.',
    status: 'agendado',
    presencaConfirmada: false,
  },
  {
    id: '2',
    data: '23/01/2026',
    horario: '10:00 - 11:00',
    assunto: 'Práticas Internas e Processos',
    facilitador: 'João Santos',
    local: 'Sala de Treinamento B',
    publicoAlvo: 'Novos Colaboradores',
    cargaHoraria: 1,
    descricao: 'Apresentação dos principais processos internos, ferramentas e sistemas utilizados na empresa.',
    materialApoio: [
      'Manual de Processos.pdf',
      'Guia de Sistemas.pdf'
    ],
    status: 'agendado',
    presencaConfirmada: false,
  },
  {
    id: '3',
    data: '23/01/2026',
    horario: '11:00 - 12:00',
    assunto: 'Segurança e Saúde no Trabalho (SST)',
    facilitador: 'Ana Costa',
    local: 'Sala de Treinamento A',
    publicoAlvo: 'Todos os Colaboradores',
    cargaHoraria: 1,
    descricao: 'Treinamento obrigatório sobre normas de segurança, prevenção de acidentes e saúde ocupacional.',
    status: 'agendado',
    presencaConfirmada: false,
  },
  {
    id: '4',
    data: '23/01/2026',
    horario: '12:00 - 13:00',
    assunto: 'Intervalo - Almoço',
    facilitador: '-',
    local: 'Refeitório',
    publicoAlvo: 'Todos',
    cargaHoraria: 1,
    descricao: 'Intervalo para almoço e descanso.',
    status: 'agendado',
    presencaConfirmada: false,
  },
  {
    id: '5',
    data: '23/01/2026',
    horario: '14:00 - 15:30',
    assunto: 'Benefícios e Políticas de RH',
    facilitador: 'Carlos Mendes',
    local: 'Auditório Principal - Prédio A',
    publicoAlvo: 'Novos Colaboradores',
    cargaHoraria: 1.5,
    descricao: 'Apresentação completa dos benefícios oferecidos, políticas de RH e esclarecimento de dúvidas.',
    materialApoio: [
      'Guia de Benefícios 2026.pdf',
      'Políticas de RH.pdf'
    ],
    status: 'agendado',
    presencaConfirmada: false,
  },
  {
    id: '6',
    data: '23/01/2026',
    horario: '15:30 - 17:00',
    assunto: 'Integração com Equipes',
    facilitador: 'Diversos Gestores',
    local: 'Salas de Reunião',
    publicoAlvo: 'Novos Colaboradores',
    cargaHoraria: 1.5,
    descricao: 'Momento de integração com as equipes, conhecer colegas e gestores diretos.',
    status: 'agendado',
    presencaConfirmada: false,
  },
];

/**
 * Helper: Get eventos by date
 */
export const getEventosByDate = (date: string): EventoAgenda[] => {
  return mockEventosAgenda.filter(evento => evento.data === date);
};

/**
 * Helper: Get evento by ID
 */
export const getEventoById = (id: string): EventoAgenda | undefined => {
  return mockEventosAgenda.find(evento => evento.id === id);
};

/**
 * Helper: Get eventos for today
 */
export const getEventosToday = (): EventoAgenda[] => {
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  return getEventosByDate(dateStr);
};
