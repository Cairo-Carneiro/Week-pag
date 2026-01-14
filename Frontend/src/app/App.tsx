import { Calendar, TrendingUp, Lightbulb, LogOut } from 'lucide-react';
import { AgendaCard } from '@/app/components/AgendaCard';
import { ResponsibilityItem } from '@/app/components/ResponsibilityItem';
import { StatusBadge } from '@/app/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

function App() {
  // Mock data - semana atual
  const semanaAtual = 'Semana 2 - 13 a 17 de Janeiro 2026';
  const statusGeral: 'confirmado' | 'atenção' | 'pendente' = 'atenção';

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  // Mock data - agenda
  const agenda = [
    {
      id: '1',
      dia: 'Segunda-feira',
      data: '13/01',
      horario: '09:00 - 11:00',
      titulo: 'Cultura e Valores da Empresa',
      local: 'Auditório Principal - 3º andar',
      publico: 'Novos colaboradores (Turma Janeiro)',
      status: 'confirmado' as const,
    },
    {
      id: '2',
      dia: 'Quarta-feira',
      data: '15/01',
      horario: '14:00 - 16:00',
      titulo: 'Processos e Ferramentas Internas',
      local: 'Sala de Treinamento B',
      publico: 'Novos colaboradores + Gestores',
      status: 'atenção' as const,
      observacao: 'Confirmar presença até amanhã (14/01)',
    },
    {
      id: '3',
      dia: 'Sexta-feira',
      data: '17/01',
      horario: '10:00 - 12:00',
      titulo: 'Segurança da Informação',
      local: 'Online - Link será enviado',
      publico: 'Todos os novos colaboradores',
      status: 'pendente' as const,
      observacao: 'Aguardando confirmação do material de apoio',
    },
  ];

  // Mock data - responsabilidades
  const responsabilidades = [
    { texto: 'Confirmar presença na palestra de quarta-feira até 14/01', critico: true },
    { texto: 'Enviar material de apoio atualizado até terça-feira', critico: true },
    { texto: 'Preparar slides para apresentação de segunda-feira', critico: false },
    { texto: 'Revisar lista de participantes com RH', critico: false },
  ];

  // Mock data - orientações
  const orientacoes = [
    {
      icone: Lightbulb,
      titulo: 'Chegue com antecedência',
      texto: 'Recomendamos chegar 15 minutos antes para testar equipamentos',
    },
    {
      icone: Calendar,
      titulo: 'Material de apoio',
      texto: 'Disponibilize os slides no sistema até 1 dia antes da palestra',
    },
    {
      icone: TrendingUp,
      titulo: 'Feedback é essencial',
      texto: 'Ao final, colete feedback dos participantes para melhorias contínuas',
    },
  ];

  // Mock data - avaliação
  const avaliacaoNota = 4.6;
  const avaliacaoTotal = 5;
  const percentualEficacia = (avaliacaoNota / avaliacaoTotal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header com botão de logout */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">Sua agenda da semana</h1>
              <p className="text-blue-100 text-lg mb-4">{semanaAtual}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Status geral:</span>
            <StatusBadge status={statusGeral} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Agenda Semanal - Elemento Principal */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={28} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Suas palestras</h2>
          </div>
          <div className="grid gap-5">
            {agenda.map((item) => (
              <AgendaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Responsabilidades Obrigatórias */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Ações obrigatórias desta semana
            </h2>
            <div className="space-y-3">
              {responsabilidades.map((resp, index) => (
                <ResponsibilityItem key={index} texto={resp.texto} critico={resp.critico} />
              ))}
            </div>
          </section>

          {/* Orientações e Dicas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Orientações e dicas</h2>
            <div className="space-y-4">
              {orientacoes.map((orientacao, index) => {
                const Icon = orientacao.icone;
                return (
                  <div key={index} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <Icon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {orientacao.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">{orientacao.texto}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Avaliação de Eficácia */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Eficácia das suas integrações
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600">{avaliacaoNota}</span>
                <span className="text-lg text-gray-500 mb-1">/ {avaliacaoTotal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${percentualEficacia}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Baseado no feedback dos últimos 3 meses
              </p>
            </div>
            <div className="text-center px-6 py-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {percentualEficacia.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Aprovação</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
