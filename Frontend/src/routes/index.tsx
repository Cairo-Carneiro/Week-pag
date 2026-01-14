import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../login/login";
import App from "../app/App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: <App />,
    },
]);

export default router;
