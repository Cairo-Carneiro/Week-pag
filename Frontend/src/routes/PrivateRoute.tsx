/**
 * PrivateRoute
 * 
 * Componente que protege rotas. Se o usuário não está logado,
 * redireciona para /login. Se está carregando (verificando token),
 * mostra um loading.
 * 
 * Uso:
 *   <PrivateRoute><AdminPage /></PrivateRoute>
 * 
 * Fluxo:
 *   Usuário acessa /admin
 *     → PrivateRoute verifica: isAuthenticated?
 *       SIM → renderiza <AdminPage />
 *       NÃO → redireciona para /login
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuthStore();

  // Enquanto verifica o token, mostra loading
  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Verificando autenticação...
        </p>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
}
