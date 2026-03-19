import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, BookOpen, Settings } from 'lucide-react';
import { EventoAgenda } from '@/types/types';
import { mockEventosAgenda } from '@/data/mockEventosAgenda';

function OnboardingPage() {
  const navigate = useNavigate();

  // Mock data - será substituído pela integração do backend
  // Filtrando eventos do dia 23/01/2026 (data mockada)
  const eventos: EventoAgenda[] = mockEventosAgenda.filter(e => e.data === '23/01/2026');

  const handleEventoClick = (eventoId: string) => {
    navigate(`/evento/${eventoId}`);
  };

  const handleAdminClick = () => {
    navigate('/login');
  };

  // Formatar data atual
  const dataFormatada = '23/01/2026'; // Mock - será dinâmico com backend

  return (
    <div 
      className="h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(-45deg, #d1fae5, #a7f3d0, #6ee7b7, #34d399)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Container com Scroll */}
      <div className="w-full max-w-4xl h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Agenda de Onboarding
                </h1>
                <p className="text-lg text-gray-700 mb-1">
                  Olá! Aqui está sua agenda de hoje
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Perfil: Facilitador
                </p>
              </div>
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="Painel Administrativo"
              >
                <Settings size={18} />
                <span className="text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>

          {/* Data */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hoje – {dataFormatada}
            </h2>
            <p className="text-gray-600">
              {eventos.length} {eventos.length === 1 ? 'evento agendado' : 'eventos agendados'}
            </p>
          </div>

          {/* Timeline de Eventos */}
          <div className="space-y-4 mb-6">
            {eventos.map((evento, index) => (
              <div
                key={evento.id}
                onClick={() => handleEventoClick(evento.id)}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all relative"
              >
                {/* Timeline indicator */}
                {index < eventos.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-emerald-200" />
                )}
                
                <div className="flex gap-4">
                  {/* Time Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-center min-w-[100px]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock size={14} />
                        <span className="text-xs font-medium">Horário</span>
                      </div>
                      <div className="text-sm font-bold">{evento.horario}</div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {evento.assunto}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        <span className="text-sm">{evento.facilitador}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span className="text-sm">{evento.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        <span className="text-sm">{evento.publicoAlvo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen size={16} />
                        <span className="text-sm">{evento.cargaHoraria}h</span>
                      </div>
                    </div>

                    {evento.descricao && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {evento.descricao}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dica de Performance */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
            <div className="flex gap-3">
              <BookOpen size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  Dica de performance
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Comece a palestra com uma pergunta para gerar engajamento e interação com os participantes
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
