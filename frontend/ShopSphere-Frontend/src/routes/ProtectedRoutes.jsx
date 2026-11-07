import RouteGuard from "./RouteGuard";
import MainLayout from "../layouts/MainLayout";

const ProtectedRoutes = () => (
    <RouteGuard>
        <MainLayout />
    </RouteGuard>
);

export default ProtectedRoutes;