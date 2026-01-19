/**
 * Responsibility Form Component
 * Inline form for adding new responsibilities
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { ResponsibilidadeFormData } from '@/types/types';
import { useResponsibilityStore } from '@/stores';
import { showSuccess, showError } from '@/utils/toast';

export function ResponsibilityForm() {
  const { createResponsabilidade } = useResponsibilityStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResponsibilidadeFormData>({
    defaultValues: {
      texto: '',
      critico: false,
    },
  });

  const onSubmit = async (data: ResponsibilidadeFormData) => {
    const result = await createResponsabilidade(data);
    if (result) {
      showSuccess('Responsabilidade adicionada!');
      reset();
      setIsExpanded(false);
    } else {
      showError('Erro ao adicionar responsabilidade');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 hover:text-blue-600"
      >
        <Plus size={20} />
        <span className="font-medium">Adicionar Responsabilidade</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
    >
      <div>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Descreva a responsabilidade..."
          autoFocus
          {...register('texto', { required: 'Texto é obrigatório' })}
        />
        {errors.texto && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.texto.message}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="critico"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
          {...register('critico')}
        />
        <label htmlFor="critico" className="text-sm text-gray-700">
          Marcar como crítico
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setIsExpanded(false);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
