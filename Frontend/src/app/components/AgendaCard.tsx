import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

type StatusType = 'confirmado' | 'atenção' | 'pendente';

interface AgendaItem {
  id: string;
  dia: string;
  data: string;
  horario: string;
  titulo: string;
  local: string;
  publico: string;
  status: StatusType;
  observacao?: string;
}

interface AgendaCardProps {
  item: AgendaItem;
}

export function AgendaCard({ item }: AgendaCardProps) {
  const statusBorderColors = {
    confirmado: 'border-l-green-500',
    atenção: 'border-l-amber-500',
    pendente: 'border-l-red-500',
  };

  return (
    <div
      className={`bg-white border border-gray-200 ${statusBorderColors[item.status]} border-l-4 rounded-lg p-5 hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Calendar size={14} />
            <span className="font-medium">{item.dia}</span>
            <span>•</span>
            <span>{item.data}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{item.titulo}</h3>
        </div>
        <StatusBadge status={item.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{item.horario}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{item.local}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span>{item.publico}</span>
        </div>
      </div>

      {item.observacao && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-amber-700 bg-amber-50 rounded px-3 py-2">
            {item.observacao}
          </p>
        </div>
      )}
    </div>
  );
}
