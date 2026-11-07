import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as loginUser, me, refresh } from "../services/authServices";
import { setCredentials } from "../redux/feature/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
    ShoppingBag,
    Mail,
    Lock,
    Eye,
    ArrowRight,
    ShieldCheck,
    Truck,
    RotateCcw
} from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();
    useEffect(() => {
        const googleResult = new URLSearchParams(window.location.search).get("google");
        if (!googleResult) return;

        window.history.replaceState({}, "", window.location.pathname);
        if (googleResult !== "success") {
            toast.error("Google sign-in failed. Please try again.");
            return;
        }

        refresh()
            .then(async ({ accessToken }) => {
                const response = await me();
                dispatch(setCredentials({
                    user: response.data.user,
                    accessToken
                }));
                toast.success("Signed in with Google.");
                navigate("/home", { replace: true });
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Google sign-in failed. Please try again.");
            });
    }, [dispatch, navigate]);

    
    const onSubmit = async ({ email, password }) => {
            try {
                const response = await loginUser({ email, password });
                dispatch(setCredentials({
                    user: response.data.user,
                    accessToken: response.accessToken
                }));
                toast.success("Signed in successfully.");
                navigate("/home", { replace: true });
            } catch (error) {
                const responseData = error.response?.data;
                const fieldNames = ["email", "password"];
                let hasFieldErrors = false;
    
                responseData?.errors?.forEach((validationError) => {
                    const fieldName = validationError.path || validationError.param;
                    if (fieldNames.includes(fieldName)) {
                        setError(fieldName, {
                            type: "server",
                            message: validationError.msg
                        });
                        hasFieldErrors = true;
                        toast.error("Invalid Credentials")
                    }
                });
    
                if (!hasFieldErrors) {
                    toast.error(responseData?.message || "Unable to sign in. Please try again.");
                }
            }
        };


    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col justify-between bg-[#101828] p-12 text-white relative overflow-hidden">

                <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20" />
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-0 right-0" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2.5 rounded-xl">
                        <ShoppingBag size={25} />
                    </div>
                    <span className="text-2xl font-bold">
                        ShopSphere
                    </span>
                </div>

                <div className="relative z-10 max-w-lg">

                    <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">
                        Welcome Back
                    </span>

                    <h1 className="text-5xl font-bold leading-tight mt-5">
                        Shopping made simple. Life made better.
                    </h1>

                    <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                        Discover amazing products, explore new collections
                        and enjoy a seamless shopping experience.
                    </p>

                    <div className="grid grid-cols-3 gap-5 mt-12">

                        <div>
                            <Truck className="text-indigo-400 mb-3" size={25} />
                            <p className="font-semibold text-sm">Fast Delivery</p>
                            <p className="text-gray-400 text-xs mt-1">Quick shipping</p>
                        </div>

                        <div>
                            <ShieldCheck className="text-indigo-400 mb-3" size={25} />
                            <p className="font-semibold text-sm">Secure Payments</p>
                            <p className="text-gray-400 text-xs mt-1">Safe checkout</p>
                        </div>

                        <div>
                            <RotateCcw className="text-indigo-400 mb-3" size={25} />
                            <p className="font-semibold text-sm">Easy Returns</p>
                            <p className="text-gray-400 text-xs mt-1">Simple process</p>
                        </div>

                    </div>
                </div>

                <p className="relative z-10 text-gray-500 text-sm">
                    © 2026 ShopSphere. All rights reserved.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex items-center justify-center px-6 py-12 sm:px-12">

                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
                        <ShoppingBag className="text-indigo-600" size={28} />
                        <span className="text-2xl font-bold text-gray-900">
                            ShopSphere
                        </span>
                    </div>

                    <div className="mb-8">
                        <p className="text-indigo-600 font-semibold text-sm tracking-wider">
                            YOUR ACCOUNT
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            Welcome back!
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Sign in to continue your shopping journey.
                        </p>
                    </div>

                    {/* GOOGLE SIGN IN - UI ONLY */}
                    <button
                        type="button"
                        onClick={() => window.location.assign("/api/auth/google")}
                        className="w-full flex cursor-pointer items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition"
                    >
                        <svg viewBox="0 0 48 48" className="w-5 h-5">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.96 13.72 18.04 9.5 24 9.5Z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.66 5.94c4.47-4.13 7.1-10.2 7.1-17.59Z"/>
                            <path fill="#FBBC05" d="M11.03 28.59A14.4 14.4 0 0 1 10.25 24c0-1.59.27-3.12.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.57 10.78l8.46-6.19Z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.88-5.86l-7.66-5.94c-2.13 1.43-4.85 2.27-8.22 2.27-5.96 0-11.04-4.22-12.97-9.91l-8.46 6.19C6.51 43.62 14.62 48 24 48Z"/>
                        </svg>

                        Continue with Google
                    </button>

                    {/* DIVIDER */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-400">
                                OR CONTINUE WITH EMAIL
                            </span>
                        </div>
                    </div>

                    {/* LOGIN FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={19}
                                />

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Enter a valid email"
                                        }
                                    })}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition text-gray-900"
                                />
                            </div>

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={19}
                                />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Minimum 8 characters required"
                                        }
                                    })}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition text-gray-900"
                                />

                                <Eye
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={19}
                                />
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="accent-indigo-600 w-4 h-4 cursor-pointer"
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-600"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* SUBMIT */}
                        <button
                            onClick={() => navigate("/home")}
                            type="submit"
                            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
                        >
                            Sign In
                            <ArrowRight size={19} />
                        </button>

                    </form>

                    {/* REGISTER LINK */}
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Create Account
                            </a>
                        </p>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-10 leading-relaxed">
                        By continuing, you agree to ShopSphere's
                        Terms of Service and Privacy Policy.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;
