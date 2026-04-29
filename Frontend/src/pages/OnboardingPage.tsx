import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, MapPin, Users, BookOpen, Settings, CalendarIcon, ArrowLeft } from "lucide-react";
import { usePalestraStore } from "@/stores/usePalestraStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { StatusBadge } from "@/app/components/StatusBadge";

function toMinutes(duration: { hour: number; minute: number } | number): number {
  if (typeof duration === 'number') return duration * 60;
  if (!duration) return 0;
  return (duration.hour * 60) + duration.minute;
}

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  if (h === 0 && m === 0) return '0h';
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetDateKey = searchParams.get("date");
  const {isAuthenticated} = useAuthStore();

  const { palestras, loading, error, fetchPalestras } = usePalestraStore();

  useEffect(() => {
    fetchPalestras();
  }, [fetchPalestras]);

  const filteredPalestras = useMemo(() => {
    if (!targetDateKey) return palestras;
    return palestras.filter((palestra) => {
      if (!palestra.data) return false;
      const parts = palestra.data.split('/');
      if (parts.length !== 2) return false;
      const [day, month] = parts.map(Number);
      const year = new Date().getFullYear();
      const palestraDate = new Date(year, month - 1, day);
      return palestraDate.toDateString() === targetDateKey;
    });
  }, [palestras, targetDateKey]);

  const handlePalestraClick = (palestraId: string) => {
    navigate(`/evento/${palestraId}`);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50">
        <p className="text-x1 font-bold text-gray-500 animate-pulse">
          Carregando agenda...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50">
        <p className="text-x1 font-bold text-red-500">{error}</p>
      </div>
    );
  }
  return (
    <div
      className="min-h-svh flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(-45deg, #d1fae5, #a7f3d0, #6ee7b7, #34d399)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
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
      <div className="w-full max-w-4xl h-[90svh] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div className="flex-1">
                {targetDateKey && (
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors font-medium"
                  >
                    <ArrowLeft size={20} />
                    Voltar para o calendário
                  </button>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Consulte sua agenda
                </h1>
                <p className="text-base md:text-lg text-gray-700 mb-1">
                  {targetDateKey 
                    ? `Sua agenda para o dia ${new Date(targetDateKey).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}` 
                    : 'Olá! Aqui está sua agenda de hoje'}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  Perfil: Facilitador
                </p>
              </div>
              <button
                onClick={handleAdminClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors w-full md:w-auto"
                title="Painel Administrativo"
              >
                <Settings size={18} />
                <span className="text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>

          {/* Contagem */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Palestras Agendadas
            </h2>
            <p className="text-gray-600">
              {filteredPalestras.length}{" "}
              {filteredPalestras.length === 1 ? "palestra agendada" : "palestras agendadas"}
              {" • "}
              Duração total: {formatDuration(filteredPalestras.reduce((acc, p) => acc + toMinutes(p.cargaHoraria || 0), 0))}
            </p>
          </div>

          {/* Timeline de Eventos */}
          <div className="space-y-4 mb-6">
            {filteredPalestras.length === 0 ? (
              <div className="text-center py-12 bg-white/50 rounded-xl border border-gray-100">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma palestra</h3>
                <p className="mt-1 text-gray-500">Não há palestras agendadas para esta data.</p>
              </div>
            ) : filteredPalestras.map((palestra, index) => (
                <div
                key={palestra.id}
                onClick={() => handlePalestraClick(palestra.id)}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all relative"
              >
                {/* Timeline indicator */}
                {index < filteredPalestras.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-emerald-200" />
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Time Badges */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {/* Card Data */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl w-[130px] shadow-sm">
                      <div className="flex items-center gap-1.5 opacity-80 mb-1">
                        <CalendarIcon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Data</span>
                      </div>
                      <div className="text-lg font-bold leading-none">{palestra.data}</div>
                    </div>
                    
                    {/* Card Horário */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl w-[130px] shadow-sm">
                      <div className="flex items-center gap-1.5 opacity-80 mb-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Horário</span>
                      </div>
                      <div className="text-sm font-bold leading-none">{palestra.horario}</div>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {palestra.titulo}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        <span className="text-sm">{palestra.facilitador || 'Não definido'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span className="text-sm">{palestra.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        <span className="text-sm">{palestra.publico}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon size={16} />
                        <span className="text-sm">{palestra.data}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen size={16} />
                        <span className="text-sm">{formatDuration(toMinutes(palestra.cargaHoraria || 0))}</span>
                      </div>
                    </div>

                    {palestra.descricao && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {palestra.descricao}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <StatusBadge status={palestra.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dica de Performance */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
            <div className="flex gap-3">
              <BookOpen
                size={24}
                className="text-emerald-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  Dica de performance
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Comece a palestra com uma pergunta para gerar engajamento e
                  interação com os participantes
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
