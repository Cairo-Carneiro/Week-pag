import { AlertTriangle, CheckSquare } from 'lucide-react';

interface ResponsibilityItemProps {
  texto: string;
  critico?: boolean;
}

export function ResponsibilityItem({ texto, critico }: ResponsibilityItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        critico ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
      }`}
    >
      {critico ? (
        <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckSquare size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
      )}
      <span className={`text-sm ${critico ? 'text-red-900 font-medium' : 'text-gray-700'}`}>
        {texto}
      </span>
    </div>
  );
}
