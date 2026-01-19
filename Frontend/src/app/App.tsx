/**
 * Main App Component - Refactored with Zustand Stores
 * Fully functional dashboard with CRUD operations
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Lightbulb, LogOut, Plus } from 'lucide-react';
import { Toaster } from 'sonner';

// Stores
import { usePalestraStore, useResponsibilityStore } from '@/stores';

// Components
import { AgendaCard } from '@/app/components/AgendaCard';
import { ResponsibilityItem } from '@/app/components/ResponsibilityItem';
import { StatusBadge } from '@/app/components/StatusBadge';
import { PalestraFormModal } from '@/app/components/PalestraFormModal';
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog';
import { ResponsibilityForm } from '@/app/components/ResponsibilityForm';
import { FilterBar } from '@/app/components/FilterBar';
import { ViewModeToggle } from '@/app/components/ViewModeToggle';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { EmptyState } from '@/app/components/EmptyState';
import { WeeklyCalendar } from '@/app/components/WeeklyCalendar';

// Utils
import { showSuccess, showError } from '@/utils/toast';
import { Palestra } from '@/types/types';

function App() {
  const navigate = useNavigate();

  // Palestra Store
  const {
    palestras,
    loading: palestrasLoading,
    viewMode,
    fetchPalestras,
    deletePalestra,
    selectPalestra,
    selectedPalestra,
  } = usePalestraStore();

  // Responsibility Store
  const {
    responsabilidades,
    loading: responsabilidadesLoading,
    fetchResponsabilidades,
    toggleComplete,
    deleteResponsabilidade,
  } = useResponsibilityStore();

  // Modal states
  const [isPalestraModalOpen, setIsPalestraModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [palestraToDelete, setPalestraToDelete] = useState<Palestra | null>(null);

  // Load data on mount
  useEffect(() => {
    fetchPalestras();
    fetchResponsabilidades();
  }, [fetchPalestras, fetchResponsabilidades]);

  // Handlers
  const handleLogout = () => {
    navigate('/');
  };

  const handleCreatePalestra = () => {
    selectPalestra(null);
    setIsPalestraModalOpen(true);
  };

  const handleEditPalestra = (palestra: Palestra) => {
    selectPalestra(palestra);
    setIsPalestraModalOpen(true);
  };

  const handleDeletePalestra = (palestra: Palestra) => {
    setPalestraToDelete(palestra);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePalestra = async () => {
    if (palestraToDelete) {
      const success = await deletePalestra(palestraToDelete.id);
      if (success) {
        showSuccess('Palestra deletada!', 'A palestra foi removida da agenda.');
      } else {
        showError('Erro ao deletar', 'Não foi possível deletar a palestra.');
      }
      setIsDeleteDialogOpen(false);
      setPalestraToDelete(null);
    }
  };

  const handleToggleResponsibility = async (id: string) => {
    await toggleComplete(id);
  };

  const handleDeleteResponsibility = async (id: string) => {
    const success = await deleteResponsabilidade(id);
    if (success) {
      showSuccess('Responsabilidade removida!');
    } else {
      showError('Erro ao remover responsabilidade');
    }
  };

  // Calculate overall status
  const getOverallStatus = (): 'confirmado' | 'atenção' | 'pendente' => {
    const pendenteCount = palestras.filter((p) => p.status === 'pendente').length;
    const atençãoCount = palestras.filter((p) => p.status === 'atenção').length;
    
    if (pendenteCount > 0) return 'pendente';
    if (atençãoCount > 0) return 'atenção';
    return 'confirmado';
  };

  // Mock data - orientações
  const orientacoes = [
    {
      icone: Lightbulb,
      titulo: 'Chegue com antecedência',
      texto: 'Recomendamos chegar 15 minutos antes para testar equipamentos',
    },
    {
      icone: Calendar,
      titulo: 'Material de apoio',
      texto: 'Disponibilize os slides no sistema até 1 dia antes da palestra',
    },
    {
      icone: TrendingUp,
      titulo: 'Feedback é essencial',
      texto: 'Ao final, colete feedback dos participantes para melhorias contínuas',
    },
  ];

  // Mock data - avaliação
  const avaliacaoNota = 4.6;
  const avaliacaoTotal = 5;
  const percentualEficacia = (avaliacaoNota / avaliacaoTotal) * 100;

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">Sua agenda da semana</h1>
                <p className="text-blue-100 text-lg mb-4">
                  Semana 2 - 13 a 17 de Janeiro 2026
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Sair</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Status geral:</span>
              <StatusBadge status={getOverallStatus()} />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Palestras Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar size={28} className="text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Suas palestras</h2>
              </div>
              <div className="flex items-center gap-3">
                <ViewModeToggle />
                <button
                  onClick={handleCreatePalestra}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Nova Palestra
                </button>
              </div>
            </div>

            {/* Filter Bar - Only show in list view */}
            {viewMode === 'list' && (
              <div className="mb-6">
                <FilterBar />
              </div>
            )}

            {/* Palestras Display - Conditional based on view mode */}
            {palestrasLoading ? (
              <div className="py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : palestras.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Nenhuma palestra encontrada"
                description="Adicione uma nova palestra para começar a organizar sua agenda."
                action={{
                  label: 'Criar Primeira Palestra',
                  onClick: handleCreatePalestra,
                }}
              />
            ) : viewMode === 'calendar-week' ? (
              <WeeklyCalendar
                palestras={palestras}
                onPalestraClick={handleEditPalestra}
              />
            ) : (
              <div className="grid gap-5">
                {palestras.map((item) => (
                  <AgendaCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditPalestra}
                    onDelete={handleDeletePalestra}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Responsabilidades */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Ações obrigatórias desta semana
              </h2>

              <div className="space-y-3 mb-4">
                {responsabilidadesLoading ? (
                  <LoadingSpinner />
                ) : (
                  responsabilidades.map((resp) => (
                    <ResponsibilityItem
                      key={resp.id}
                      id={resp.id}
                      texto={resp.texto}
                      critico={resp.critico}
                      completo={resp.completo}
                      onToggle={handleToggleResponsibility}
                      onDelete={handleDeleteResponsibility}
                    />
                  ))
                )}
              </div>

              <ResponsibilityForm />
            </section>

            {/* Orientações e Dicas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Orientações e dicas
              </h2>
              <div className="space-y-4">
                {orientacoes.map((orientacao, index) => {
                  const Icon = orientacao.icone;
                  return (
                    <div
                      key={index}
                      className="flex gap-3 p-4 bg-white border border-gray-200 rounded-lg"
                    >
                      <Icon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {orientacao.titulo}
                        </h3>
                        <p className="text-sm text-gray-600">{orientacao.texto}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Avaliação de Eficácia */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Eficácia das suas integrações
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600">{avaliacaoNota}</span>
                  <span className="text-lg text-gray-500 mb-1">/ {avaliacaoTotal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${percentualEficacia}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Baseado no feedback dos últimos 3 meses
                </p>
              </div>
              <div className="text-center px-6 py-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {percentualEficacia.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Aprovação</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <PalestraFormModal
        open={isPalestraModalOpen}
        onOpenChange={setIsPalestraModalOpen}
        palestra={selectedPalestra}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeletePalestra}
        title="Deletar Palestra?"
        description={`Tem certeza que deseja deletar "${palestraToDelete?.titulo}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}

export default App;
