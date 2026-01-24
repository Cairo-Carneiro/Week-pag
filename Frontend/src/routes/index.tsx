import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "../pages/OnboardingPage";
import EventoDetailPage from "../pages/EventoDetailPage";
import AdminPage from "../pages/AdminPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <OnboardingPage />,
    },
    {
        path: "/evento/:id",
        element: <EventoDetailPage />,
    },
    {
        path: "/admin",
        element: <AdminPage />,
    },
]);

export default router;
