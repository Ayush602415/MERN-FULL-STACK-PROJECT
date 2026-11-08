import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    ShoppingBag,
    Heart,
    ShoppingCart,
    Menu,
    X,
    User,
    Bell
} from "lucide-react";
import { logout as logoutRequest } from "../services/authServices";
import { logout as clearAuth } from "../redux/feature/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const handleLogout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to contact the server. You have been signed out on this device.");
        } finally {
            dispatch(clearAuth());
            setIsOpen(false);
            navigate("/login", { replace: true });
        }
    };

    const navLinks = [
        { name: "Home", path: "/home" },
        { name: "Products", path: "/products" },
        { name: "My Orders", path: "/my-orders" },
        ...(isAuthenticated ? [{ name: "Profile", path: "/profile" }] : []),
        ...(user?.role === "admin"
            ? [{ name: "Dashboard", path: "/admin/dashboard" }]
            : []),
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101010]/85 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5">
                <Link to="/home" className="flex shrink-0 items-center gap-2.5">
                    <div className="rounded-xl bg-gradient-to-br from-purple-400 to-fuchsia-600 p-2 text-white shadow-lg shadow-purple-500/20">
                        <ShoppingBag size={22} />
                    </div>
                    <span className="text-lg font-bold tracking-tight sm:text-xl">
                        Shop<span className="text-purple-300">Sphere</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1 md:flex">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:text-white"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        aria-label="Wishlist"
                        to="/wishlist"
                        className="rounded-full p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <Heart size={21} />
                    </Link>
                    <Link
                        aria-label="Cart"
                        to="/cart"
                        className="rounded-full p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <ShoppingCart size={21} />
                    </Link>
                    <Link
                        aria-label="Notification"
                        to="/notifications"
                        className="rounded-full p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <Bell size={21} />
                    </Link>
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-purple-100"
                        >
                            <User size={17} />
                            Log Out
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-purple-100"
                        >
                            <User size={17} />
                            Sign In
                        </Link>
                    )}
                </div>

                <button
                    type="button"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-xl border border-white/10 p-2.5 text-white transition hover:bg-white/10 md:hidden"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-white/10 bg-[#141414] px-5 py-4 shadow-xl md:hidden">
                    <div className="flex flex-col gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="mt-2 flex items-center gap-3 border-t border-white/10 pt-4">
                            <Link
                                aria-label="Wishlist"
                                to="/wishlist"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl p-3 text-gray-300 transition hover:bg-white/10"
                            >
                                <Heart size={21} />
                            </Link>
                            <Link
                                aria-label="Cart"
                                to="/cart"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl p-3 text-gray-300 transition hover:bg-white/10"
                            >
                                <ShoppingCart size={21} />
                            </Link>
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="ml-auto rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
                                >
                                    Log Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="ml-auto rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
