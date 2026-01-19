import { AlertTriangle, CheckSquare, Trash2, Square } from 'lucide-react';

interface ResponsibilityItemProps {
  id: string;
  texto: string;
  critico?: boolean;
  completo?: boolean;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ResponsibilityItem({
  id,
  texto,
  critico,
  completo,
  onToggle,
  onDelete,
}: ResponsibilityItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        critico && !completo ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
      } ${completo ? 'opacity-60' : ''}`}
    >
      {/* Checkbox/Icon */}
      <button
        onClick={() => onToggle?.(id)}
        className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
        disabled={!onToggle}
      >
        {completo ? (
          <CheckSquare size={20} className="text-green-600" />
        ) : critico ? (
          <AlertTriangle size={20} className="text-red-600" />
        ) : (
          <Square size={20} className="text-gray-400" />
        )}
      </button>

      {/* Text */}
      <span
        className={`flex-1 text-sm ${
          completo
            ? 'line-through text-gray-500'
            : critico
            ? 'text-red-900 font-medium'
            : 'text-gray-700'
        }`}
      >
        {texto}
      </span>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors text-gray-400 hover:text-red-600"
          title="Deletar"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
