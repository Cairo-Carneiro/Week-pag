/**
 * Palestra Form Modal Component
 * Modal with form for creating/editing palestras
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Calendar } from '@/app/components/ui/calendar';
import { Palestra, PalestraFormData } from '@/types/types';
import { usePalestraStore } from '@/stores';
import { showSuccess, showError } from '@/utils/toast';
import { LoadingSpinner } from './LoadingSpinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface PalestraFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palestra?: Palestra | null; // If provided, edit mode; otherwise, create mode
}

export function PalestraFormModal({
  open,
  onOpenChange,
  palestra,
}: PalestraFormModalProps) {
  const { createPalestra, updatePalestra, loading } = usePalestraStore();
  const isEditMode = !!palestra;

  // Custom states for Date and Time
  const [diaSemana, setDiaSemana] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PalestraFormData>({
    defaultValues: palestra || {
      titulo: '',
      dia: '',
      data: '',
      horario: '',
      local: '',
      publico: '',
      status: 'pendente',
      observacao: '',
    },
  });

  // Reset form when palestra changes or modal opens
  useEffect(() => {
    if (open) {
      if (palestra) {
        reset(palestra);
        
        // Parse date
        if (palestra.data) {
          const [day, month] = palestra.data.split('/');
          if (day && month) {
            const year = new Date().getFullYear();
            setDate(new Date(year, parseInt(month, 10) - 1, parseInt(day, 10)));
          } else {
            setDate(undefined);
          }
        } else {
          setDate(undefined);
        }

        // Parse time
        if (palestra.horario) {
          const parts = palestra.horario.split(' - ');
          if (parts.length === 2) {
            setStartTime(parts[0].trim());
            setEndTime(parts[1].trim());
          } else {
            setStartTime(palestra.horario);
            setEndTime('');
          }
        } else {
          setStartTime('');
          setEndTime('');
        }

      } else {
        reset({
          titulo: '',
          dia: '',
          data: '',
          horario: '',
          local: '',
          publico: '',
          status: 'pendente',
          observacao: '',
        });
        setDate(undefined);
        setStartTime('');
        setEndTime('');
      }
    }
  }, [open, palestra, reset]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setCalendarOpen(false);
    if (newDate) {
      const dataFormatada = format(newDate, 'dd/MM', { locale: ptBR });
      let diaSemana = format(newDate, 'EEEE', { locale: ptBR });
      diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      setValue('data', dataFormatada, { shouldValidate: true });
      setValue('dia', diaSemana, { shouldValidate: true });
      setDiaSemana(diaSemana);
    } else {
      setValue('data', '', { shouldValidate: true });
      setValue('dia', '', { shouldValidate: true });
      setDiaSemana('');
    }
  };

  useEffect(() => {
    if (startTime && endTime) {
      setValue('horario', `${startTime} - ${endTime}`, { shouldValidate: true });
    } else if (startTime) {
      setValue('horario', startTime, { shouldValidate: true });
    } else {
      setValue('horario', '', { shouldValidate: true });
    }
  }, [startTime, endTime, setValue]);

  const calculateDuration = () => {
    if (!startTime || !endTime) return '';
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Just in case it wraps past midnight
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours === 0 && mins === 0) return '';
    return `${hours > 0 ? `${hours}h` : ''}${mins > 0 ? `${mins}min` : ''}`;
  };

  // Ajusta hora ou minuto do despertador (com wrapping)
  const adjustTime = (time: string, field: 'h' | 'm', delta: number, setter: (v: string) => void) => {
    let h = time ? parseInt(time.split(':')[0], 10) : 6;
    let m = time ? parseInt(time.split(':')[1], 10) : 0;
    if (field === 'h') {
      h = (h + delta + 24) % 24;
    } else {
      // minutos em passos de 5 (0 → 5 → 10 → ... → 55 → 0)
      const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      const idx = steps.indexOf(m);
      const nextIdx = idx === -1 ? 0 : (idx + (delta > 0 ? 1 : -1) + 12) % 12;
      m = steps[nextIdx];
    }
    setter(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const onSubmit = async (data: PalestraFormData) => {
    try {
      // Limpa valores vazios e calcula cargaHoraria automaticamente
      const payload = { ...data };
      
      if (startTime && endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        payload.cargaHoraria = parseFloat((totalMinutes / 60).toFixed(2));
      } else {
        payload.cargaHoraria = undefined;
      }
      
      if (isEditMode) {
        const result = await updatePalestra(palestra.id, payload);
        if (result) {
          showSuccess('Palestra atualizada!', 'As alterações foram salvas com sucesso.');
          onOpenChange(false);
        } else {
          showError('Erro ao atualizar', 'Não foi possível atualizar a palestra.');
        }
      } else {
        const result = await createPalestra(payload);
        if (result) {
          showSuccess('Palestra criada!', 'A nova palestra foi adicionada à agenda.');
          onOpenChange(false);
        } else {
          showError('Erro ao criar', 'Não foi possível criar a palestra.');
        }
      }
    } catch (error) {
      showError('Erro', 'Ocorreu um erro inesperado.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Palestra' : 'Nova Palestra'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Atualize as informações da palestra abaixo.'
              : 'Preencha os dados para adicionar uma nova palestra à agenda.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Título da Palestra *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Ex: Cultura e Valores da Empresa"
              {...register('titulo', { required: 'Título é obrigatório' })}
            />
            {errors.titulo && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.titulo.message}
              </span>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Data *
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 flex items-center justify-between text-left ${!date ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : <span>Selecione a data</span>}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
            {diaSemana && (
              <span className="text-sm text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                📅 {diaSemana}
              </span>
            )}
            <input type="hidden" {...register('data', { required: 'Data é obrigatória' })} />
            <input type="hidden" {...register('dia', { required: 'Dia é obrigatório' })} />
            {(errors.data || errors.dia) && (
              <span className="text-red-500 text-sm mt-1 block">
                Data é obrigatória
              </span>
            )}
          </div>

          {/* Horário — estilo despertador */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Horário *
            </label>
            <div className="grid grid-cols-2 gap-4">

              {/* Início */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-from-emerald-500 to-emerald-600 font-medium">Início</span>
                <div className="flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl px-5 py-3 select-none">
                  {/* Hora */}
                  <div className="flex flex-col items-center">
                    <button type="button" onClick={() => adjustTime(startTime, 'h', 1, setStartTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronUp size={18} /></button>
                    <span className="text-4xl font-bold text-white w-14 text-center tabular-nums leading-none py-1">
                      {startTime ? startTime.split(':')[0] : '--'}
                    </span>
                    <button type="button" onClick={() => adjustTime(startTime, 'h', -1, setStartTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronDown size={18} /></button>
                  </div>
                  <span className="text-3xl font-bold text-gray-500">:</span>
                  {/* Minuto */}
                  <div className="flex flex-col items-center">
                    <button type="button" onClick={() => adjustTime(startTime, 'm', 1, setStartTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronUp size={18} /></button>
                    <span className="text-4xl font-bold text-white w-14 text-center tabular-nums leading-none py-1">
                      {startTime ? startTime.split(':')[1] : '00'}
                    </span>
                    <button type="button" onClick={() => adjustTime(startTime, 'm', -1, setStartTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronDown size={18} /></button>
                  </div>
                </div>
              </div>

              {/* Fim */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">Fim</span>
                <div className="flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl px-5 py-3 select-none">
                  {/* Hora */}
                  <div className="flex flex-col items-center">
                    <button type="button" onClick={() => adjustTime(endTime, 'h', 1, setEndTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronUp size={18} /></button>
                    <span className="text-4xl font-bold text-white w-14 text-center tabular-nums leading-none py-1">
                      {endTime ? endTime.split(':')[0] : '--'}
                    </span>
                    <button type="button" onClick={() => adjustTime(endTime, 'h', -1, setEndTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronDown size={18} /></button>
                  </div>
                  <span className="text-3xl font-bold text-gray-500">:</span>
                  {/* Minuto */}
                  <div className="flex flex-col items-center">
                    <button type="button" onClick={() => adjustTime(endTime, 'm', 1, setEndTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronUp size={18} /></button>
                    <span className="text-4xl font-bold text-white w-14 text-center tabular-nums leading-none py-1">
                      {endTime ? endTime.split(':')[1] : '00'}
                    </span>
                    <button type="button" onClick={() => adjustTime(endTime, 'm', -1, setEndTime)} className="text-gray-500 hover:text-emerald-400 transition-colors p-1"><ChevronDown size={18} /></button>
                  </div>
                </div>
              </div>

            </div>
            <input type="hidden" {...register('horario', { required: 'Horário é obrigatório' })} />
            {(startTime && endTime) && (
              <span className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                <Clock size={12} /> Duração: {calculateDuration()}
              </span>
            )}
            {errors.horario && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.horario.message}
              </span>
            )}
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Local *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Ex: Auditório Principal - 3º andar"
              {...register('local', { required: 'Local é obrigatório' })}
            />
            {errors.local && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.local.message}
              </span>
            )}
          </div>

          {/* Público */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Público-Alvo *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Ex: Novos colaboradores"
              {...register('publico', { required: 'Público é obrigatório' })}
            />
            {errors.publico && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.publico.message}
              </span>
            )}
          </div>

          {/* Facilitador */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Facilitador
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Ex: João Silva"
              {...register('facilitador')}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Status *
            </label>
            <input type="hidden" {...register('status', { required: 'Status é obrigatório' })} />
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'confirmado', label: '✅ Confirmado' },
                { value: 'atenção',    label: '⚠️ Atenção'    },
                { value: 'pendente',   label: '🕐 Pendente'   },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('status', value, { shouldValidate: true })}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    watch('status') === value
                      ? value === 'confirmado'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : value === 'atenção'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-400 bg-gray-100 text-gray-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.status && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.status.message}
              </span>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Observações
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 min-h-[80px]"
              placeholder="Observações adicionais (opcional)"
              {...register('observacao')}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 font-medium shadow-sm transition-all"
              disabled={loading}
            >
              {loading && <LoadingSpinner size="sm" />}
              {isEditMode ? 'Salvar Alterações' : 'Criar Palestra'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
