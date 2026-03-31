import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "../pages/OnboardingPage";
import EventoDetailPage from "../pages/EventoDetailPage";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";

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
        element: <PrivateRoute><AdminPage /></PrivateRoute>,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
]);

export default router;
