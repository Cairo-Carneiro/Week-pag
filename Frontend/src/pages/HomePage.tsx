import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { usePalestraStore } from "@/stores/usePalestraStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { WeeklyCalendar } from "@/app/components/WeeklyCalendar";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { palestras, loading, error, fetchPalestras } = usePalestraStore();

  useEffect(() => {
    fetchPalestras();
  }, [fetchPalestras]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const handleDayClick = (dateString: string) => {
    // Navigate to Onboarding filtered by date
    navigate(`/agenda?date=${encodeURIComponent(dateString)}`);
  };

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Carregando calendário...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-svh flex items-center justify-center p-4 md:p-8"
      style={{
        background: "linear-gradient(-45deg, #d1fae5, #a7f3d0, #6ee7b7, #34d399)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90svh]">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Calendário Onboarding
                </h1>
                <p className="text-base md:text-lg text-gray-700 mb-1">
                  Selecione um dia para ver as palestras agendadas
                </p>
              </div>
              <button
                onClick={handleAdminClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors w-full md:w-auto"
                title="Painel Administrativo"
              >
                <Settings size={18} />
                <span className="text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <WeeklyCalendar 
              palestras={palestras} 
              onDayClick={handleDayClick} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
