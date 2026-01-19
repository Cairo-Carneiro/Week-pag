/**
 * Palestra Form Modal Component
 * Modal with form for creating/editing palestras
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Palestra, PalestraFormData, StatusType } from '@/types/types';
import { usePalestraStore } from '@/stores';
import { showSuccess, showError } from '@/utils/toast';
import { LoadingSpinner } from './LoadingSpinner';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
      reset(
        palestra || {
          titulo: '',
          dia: '',
          data: '',
          horario: '',
          local: '',
          publico: '',
          status: 'pendente',
          observacao: '',
        }
      );
    }
  }, [open, palestra, reset]);

  const onSubmit = async (data: PalestraFormData) => {
    try {
      if (isEditMode) {
        const result = await updatePalestra(palestra.id, data);
        if (result) {
          showSuccess('Palestra atualizada!', 'As alterações foram salvas com sucesso.');
          onOpenChange(false);
        } else {
          showError('Erro ao atualizar', 'Não foi possível atualizar a palestra.');
        }
      } else {
        const result = await createPalestra(data);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ex: Cultura e Valores da Empresa"
              {...register('titulo', { required: 'Título é obrigatório' })}
            />
            {errors.titulo && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.titulo.message}
              </span>
            )}
          </div>

          {/* Dia e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Dia da Semana *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex: Segunda-feira"
                {...register('dia', { required: 'Dia é obrigatório' })}
              />
              {errors.dia && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.dia.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Data *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="DD/MM"
                {...register('data', { required: 'Data é obrigatória' })}
              />
              {errors.data && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.data.message}
                </span>
              )}
            </div>
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Horário *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ex: 09:00 - 11:00"
              {...register('horario', { required: 'Horário é obrigatório' })}
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ex: Novos colaboradores"
              {...register('publico', { required: 'Público é obrigatório' })}
            />
            {errors.publico && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.publico.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Status *
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              {...register('status', { required: 'Status é obrigatório' })}
            >
              <option value="confirmado">Confirmado</option>
              <option value="atenção">Atenção</option>
              <option value="pendente">Pendente</option>
            </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[80px]"
              placeholder="Observações adicionais (opcional)"
              {...register('observacao')}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
