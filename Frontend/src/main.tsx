import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./styles/index.css";
import { useAuthStore } from "./stores/useAuthStore";

/**
 * Inicialização da App
 * 
 * Antes de renderizar, chamamos checkAuth() para verificar
 * se existe um token válido no localStorage.
 * 
 * Se existir → o usuário continua logado mesmo depois de reload.
 * Se não existir ou expirado → user fica null (precisa logar de novo).
 */
useAuthStore.getState().checkAuth();

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);