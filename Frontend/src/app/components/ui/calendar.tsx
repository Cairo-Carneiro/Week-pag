/**
 * Calendar — Componente customizado sem dependência de biblioteca
 * 100% controlável, em português, sem react-day-picker
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mês/ano que está sendo exibido (começa no mês atual ou da data selecionada)
  const [viewDate, setViewDate] = useState(() => {
    const base = selected || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Primeiro dia da semana do mês (0=Dom, 1=Seg...)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Total de dias no mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);
    if (disabled && disabled(clicked)) return;
    // Clicou no mesmo dia já selecionado → desseleciona
    if (selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day) {
      onSelect(undefined);
    } else {
      onSelect(clicked);
    }
  };

  // Monta o array de células: null para espaços vazios antes do 1º dia, number para os dias
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="p-3 w-72 bg-white rounded-lg">
      {/* Cabeçalho: setas + nome do mês */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm font-semibold text-gray-900">
          {MESES[month]} {year}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Nomes dos dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const date = new Date(year, month, day);
          const isDisabled = disabled ? disabled(date) : false;
          const isSelected =
            selected &&
            selected.getFullYear() === year &&
            selected.getMonth() === month &&
            selected.getDate() === day;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              className={[
                'h-8 w-full rounded-md text-sm transition-colors',
                isSelected
                  ? 'bg-emerald-600 text-white font-semibold'
                  : isToday
                  ? 'bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-300'
                  : isDisabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-800 hover:bg-gray-100',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
