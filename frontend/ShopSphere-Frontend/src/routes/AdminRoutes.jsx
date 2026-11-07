import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";

const AdminRoutes = () => {
    const { user, isAuthenticated, isInitialized } = useSelector(state => state.auth);

    if (!isInitialized) {
        return <div className="min-h-screen bg-[#101010] p-10 text-white">Checking session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <MainLayout />;
};

export default AdminRoutes;
