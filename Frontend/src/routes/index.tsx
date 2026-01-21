import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "../pages/OnboardingPage";
import App from "../app/App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <OnboardingPage />,
    },
    {
        path: "/dashboard",
        element: <App />,
    },
    
]);

export default router;
