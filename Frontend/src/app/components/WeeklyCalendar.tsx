/**
 * Weekly Calendar Component
 * Displays palestras in a weekly calendar grid format
 */

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Palestra } from '@/types/types';
import { StatusBadge } from './StatusBadge';

interface WeeklyCalendarProps {
  palestras: Palestra[];
  onPalestraClick?: (palestra: Palestra) => void;
}

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

export function WeeklyCalendar({ palestras, onPalestraClick }: WeeklyCalendarProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Get current week days
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (currentWeekOffset * 7));
    
    const days: WeekDay[] = [];
    const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const todayStr = new Date().toDateString();
      const dateStr = date.toDateString();
      
      days.push({
        date,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        isToday: todayStr === dateStr,
      });
    }
    
    return days;
  }, [currentWeekOffset]);

  // Group palestras by day
  const palestrasByDay = useMemo(() => {
    const grouped: { [key: string]: Palestra[] } = {};
    
    weekDays.forEach((day) => {
      const dateKey = day.date.toDateString();
      grouped[dateKey] = [];
    });
    
    palestras.forEach((palestra) => {
      // Parse the date from palestra (format: "DD/MM")
      const [day, month] = palestra.data.split('/').map(Number);
      const year = new Date().getFullYear();
      const palestraDate = new Date(year, month - 1, day);
      const dateKey = palestraDate.toDateString();
      
      if (grouped[dateKey]) {
        grouped[dateKey].push(palestra);
      }
    });
    
    return grouped;
  }, [palestras, weekDays]);

  // Get week range string
  const weekRangeString = useMemo(() => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[4];
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    };
    
    return `${formatDate(firstDay.date)} - ${formatDate(lastDay.date)}`;
  }, [weekDays]);

  const handlePreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
  };

  const handleToday = () => {
    setCurrentWeekOffset(0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold">Calendário Semanal</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-emerald-100">{weekRangeString}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Hoje
            </button>
            
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Próxima semana"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-5 divide-x divide-gray-200">
        {weekDays.map((day) => {
          const dateKey = day.date.toDateString();
          const dayPalestras = palestrasByDay[dateKey] || [];
          
          return (
            <div key={dateKey} className="min-h-[400px]">
              {/* Day Header */}
              <div
                className={`p-3 border-b border-gray-200 ${
                  day.isToday ? 'bg-emerald-50' : 'bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 uppercase">
                    {day.dayName}
                  </div>
                  <div
                    className={`mt-1 text-lg font-bold ${
                      day.isToday
                        ? 'text-emerald-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {day.dayNumber}
                  </div>
                </div>
              </div>

              {/* Palestras for this day */}
              <div className="p-2 space-y-2">
                {dayPalestras.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Sem palestras
                  </div>
                ) : (
                  dayPalestras.map((palestra) => (
                    <button
                      key={palestra.id}
                      onClick={() => onPalestraClick?.(palestra)}
                      className="w-full text-left p-3 rounded-lg border-l-4 hover:shadow-md transition-all bg-white border border-gray-200"
                      style={{
                        borderLeftColor:
                          palestra.status === 'confirmado'
                            ? '#10b981'
                            : palestra.status === 'atenção'
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="text-xs font-medium text-gray-600">
                          {palestra.horario}
                        </div>
                        <StatusBadge status={palestra.status} size="sm" />
                      </div>
                      
                      <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {palestra.titulo}
                      </div>
                      
                      <div className="text-xs text-gray-600 line-clamp-1">
                        📍 {palestra.local}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-gray-600">Atenção</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Pendente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
