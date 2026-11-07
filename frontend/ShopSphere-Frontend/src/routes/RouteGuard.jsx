import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const RouteGuard = ({ guestOnly = false, children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

    if (!isInitialized) {
        return <div className="min-h-screen bg-[#101010] p-10 text-white">Checking session...</div>;
    }

    if (guestOnly && isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    if (!guestOnly && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children || <Outlet />;
};

export default RouteGuard;