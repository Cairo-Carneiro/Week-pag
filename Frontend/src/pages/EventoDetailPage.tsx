import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, BookOpen, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { usePalestraStore } from '@/stores/usePalestraStore';

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

function EventoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { selectedPalestra: palestra, loading, error, fetchPalestraById, updatePalestra } = usePalestraStore();

  useEffect(() => {
    if (id) {
      fetchPalestraById(id);
    }
  }, [id, fetchPalestraById]);

  const handleConfirmarPresenca = async () => {
    if (id && palestra) {
      // Recalcular carga horária com base no horário de início e término
      let cargaHorariaCalculada: number | undefined = undefined;
      
      if (palestra.horario && palestra.horario.includes(' - ')) {
        const [startTime, endTime] = palestra.horario.split(' - ').map(s => s.trim());
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        cargaHorariaCalculada = parseFloat((totalMinutes / 60).toFixed(2));
      }

      await updatePalestra(id, { 
        presencaConfirmada: true,
        status: 'confirmado',
        ...(cargaHorariaCalculada !== undefined && { cargaHoraria: cargaHorariaCalculada })
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Carregando detalhes...
        </p>
      </div>
    );
  }

  if (error || !palestra) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500 mb-4">
            {error || 'Palestra não encontrada'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:underline"
          >
            Voltar para Agenda
          </button>
        </div>
      </div>
    );
  }

  const isPresencaConfirmada = palestra.presencaConfirmada || palestra.status === 'confirmado';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
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

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-emerald-100 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar para Agenda</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {palestra.titulo}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-emerald-50">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{palestra.horario}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{palestra.local}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Informações Principais */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users size={18} />
                <span className="font-semibold">Facilitador</span>
              </div>
              <p className="text-gray-900 font-medium">{palestra.facilitador || 'Não definido'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users size={18} />
                <span className="font-semibold">Público-Alvo</span>
              </div>
              <p className="text-gray-900 font-medium">{palestra.publico}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock size={18} />
                <span className="font-semibold">Carga Horária</span>
              </div>
              <p className="text-gray-900 font-medium">{formatDuration(toMinutes(palestra.cargaHoraria || 0))}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <BookOpen size={18} />
                <span className="font-semibold">Data</span>
              </div>
              <p className="text-gray-900 font-medium">{palestra.data}</p>
            </div>
          </div>

          {/* Descrição */}
          {palestra.descricao && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">{palestra.descricao}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <button
              onClick={handleConfirmarPresenca}
              disabled={isPresencaConfirmada}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isPresencaConfirmada
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
              }`}
            >
              <CheckCircle size={20} />
              <span>{isPresencaConfirmada ? 'Presença Confirmada' : 'Confirmar Presença'}</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-emerald-300 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Voltar para Agenda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetailPage;
