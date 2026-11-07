import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { useSelector } from "react-redux";
import PublicRoutes from "./PublicRoutes";
import RouteGuard from "./RouteGuard";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import MyOrders from "../pages/MyOrders";
import Wishlist from "../pages/WishList";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import AdminRoutes from "./AdminRoutes";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminProductForm from "../pages/AdminProductForm";
import Users from "../pages/Users";
import Notification from "../components/common/Notification";

const HomeRoute = () => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

    if (!isInitialized) {
        return <div className="min-h-screen bg-[#101010] p-10 text-white">Checking session...</div>;
    }

    const destination = isAuthenticated ? "/home" : "/login";

    return <Navigate to={destination} replace />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicRoutes />,
        children: [
            {
                index: true,
                element: <HomeRoute />
            },
            {
                path: "login",
                element: <RouteGuard guestOnly><Login /></RouteGuard>
            },
            {
                path: "register",
                element: <RouteGuard guestOnly><Register /></RouteGuard>
            }
        ]
    },
    {
        path: "/",
        element: <ProtectedRoutes />,
        children: [
            {
                path: "home",
                element: <Home />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "my-orders",
                element: <MyOrders />
            },
            {
                path: "wishlist",
                element: <Wishlist />
            },
            {
                path: "checkout",
                element: <Checkout />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "products/:productId",
                element: <ProductDetails />
            },
            {
                path: "notifications",
                element: <Notification />
            }
        ]
    },
    {
        path: "/admin",
        element: <AdminRoutes />,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "products",
                element: <AdminProducts />
            },
            {
                path: "products/create",
                element: <AdminProductForm />
            },
            {
                path: "products/:productId/edit",
                element: <AdminProductForm />
            },
            {
                path: "users",
                element: <Users />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
