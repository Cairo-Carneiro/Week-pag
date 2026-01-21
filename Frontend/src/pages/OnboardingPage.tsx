import { useNavigate } from 'react-router-dom';
import { MapPin, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { EventoOnboarding } from '@/types/types';


function OnboardingPage() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'hoje' | 'semana'>('hoje');

  // Mock data - será substituído pela integração do backend
  const eventos: EventoOnboarding[] = [
    {
      id: '1',
      horario: '09:00 – 10:30',
      local: 'Sala Azul – Prédio A',
      tipo: 'Novos Colaboradores',
      participante: 'Maria Silva'
    },
    {
      id: '2',
      horario: '11:00 – 12:00',
      local: 'Auditório Central',
      tipo: 'Estagiários',
      participante: 'João Pereira'
    }
  ];

  const handleEventoClick = (eventoId: string) => {
    // Aqui você pode passar o ID do evento selecionado via state ou context
    // Por enquanto, apenas redireciona para o dashboard
    navigate('/dashboard', { state: { eventoId } });
  };


  // Formatar data atual
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

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
      <div className="w-full max-w-2xl h-[90vh] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agenda de Onboarding
            </h1>
            <p className="text-lg text-gray-700 mb-1">
              Olá! Aqui está sua agenda
            </p>
            <p className="text-sm font-medium text-gray-800">
              Perfil: Facilitador
            </p>
          </div>

          {/* Data e Navegação */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hoje – {dataFormatada}
            </h2>
            
            <div className="flex gap-3 mb-6">
              <button
                className="px-6 py-2.5 bg-white border-2 border-emerald-300 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Ver minha agenda
              </button>
              <div className="flex border-2 border-emerald-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setSelectedView('hoje')}
                  className={`px-5 py-2.5 font-medium transition-colors ${
                    selectedView === 'hoje'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  Hoje
                </button>
                <div className="w-px bg-emerald-300" />
                <button
                  onClick={() => setSelectedView('semana')}
                  className={`px-5 py-2.5 font-medium transition-colors ${
                    selectedView === 'semana'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  Seman
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Eventos */}
          <div className="space-y-4 mb-6">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                onClick={() => handleEventoClick(evento.id)}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all"
              >
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {evento.horario}
                  </h3>
                  <p className="text-base text-gray-700 font-medium mb-1">
                    {evento.local}
                  </p>
                  <p className="text-base text-gray-700 mb-1">
                    {evento.tipo}
                  </p>
                  <p className="text-base text-gray-900 font-semibold">
                    {evento.participante}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Abrir mapa para:', evento.local);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <MapPin size={18} />
                  <span className="text-sm font-medium">Abrir no mapa</span>
                </button>
              </div>
            ))}
          </div>

          {/* Dica de Performance */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
            <div className="flex gap-3">
              <Lightbulb size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  Dica de performance
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Comece a palestra com uma pergunta para gerar engajamento
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
