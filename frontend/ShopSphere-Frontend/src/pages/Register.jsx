import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
    ShoppingBag,
    User,
    Mail,
    Lock,
    Eye,
    ArrowRight,
    ShieldCheck,
    Truck,
    RotateCcw
} from "lucide-react";
import { register as registerUser } from "../services/authServices";
import { setCredentials } from "../redux/feature/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async ({ name, email, password }) => {
        try {
            const response = await registerUser({ name, email, password });
            dispatch(setCredentials({
                user: response.data.user,
                accessToken: response.accessToken
            }));
            toast.success("Account created successfully.");
            navigate("/")
        } catch (error) {
            const responseData = error.response?.data;
            const fieldNames = ["name", "email", "password"];
            let hasFieldErrors = false;

            responseData?.errors?.forEach((validationError) => {
                const fieldName = validationError.path || validationError.param;
                if (fieldNames.includes(fieldName)) {
                    setError(fieldName, {
                        type: "server",
                        message: validationError.msg
                    });
                    hasFieldErrors = true;
                }
            });

            if (!hasFieldErrors) {
                toast.error(responseData?.message || "Unable to create account. Please try again.");
            }
        }
    };

    const password = watch("password");

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
                        Join Our Community
                    </span>

                    <h1 className="text-5xl font-bold leading-tight mt-5">
                        Everything you love, all in one place.
                    </h1>

                    <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                        Create your account and discover a smarter,
                        simpler and more enjoyable shopping experience.
                    </p>

                    <div className="grid grid-cols-3 gap-5 mt-12">

                        <div>
                            <Truck className="text-indigo-400 mb-3" size={25} />
                            <p className="font-semibold text-sm">Fast Delivery</p>
                            <p className="text-gray-400 text-xs mt-1">Quick shipping</p>
                        </div>

                        <div>
                            <ShieldCheck className="text-indigo-400 mb-3" size={25} />
                            <p className="font-semibold text-sm">Secure Shopping</p>
                            <p className="text-gray-400 text-xs mt-1">Protected account</p>
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

                    {/* MOBILE LOGO */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <ShoppingBag className="text-indigo-600" size={28} />

                        <span className="text-2xl font-bold text-gray-900">
                            ShopSphere
                        </span>
                    </div>

                    <div className="mb-7">
                        <p className="text-indigo-600 font-semibold text-sm tracking-wider">
                            CREATE ACCOUNT
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            Get started!
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Create your account to start exploring.
                        </p>
                    </div>

                    {/* GOOGLE SIGN UP - UI ONLY */}
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
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-400">
                                OR REGISTER WITH EMAIL
                            </span>
                        </div>
                    </div>

                    {/* REGISTER FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Name must contain at least 3 characters"
                                        }
                                    })}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition text-gray-900"
                                />
                            </div>

                            {errors.name && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Minimum 8 characters required"
                                        }
                                    })}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition text-gray-900"
                                />

                                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match"
                                    })}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition text-gray-900"
                                />
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* TERMS */}
                        <div className="flex items-start gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                {...register("terms", {
                                    required: "Please accept the terms to continue"
                                })}
                                className="accent-indigo-600 w-4 h-4 mt-0.5 cursor-pointer"
                            />

                            <label htmlFor="terms" className="cursor-pointer text-sm text-gray-600">
                                I agree to the{" "}
                                <a href="#" className="cursor-pointer text-indigo-600 font-medium">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="cursor-pointer text-indigo-600 font-medium">
                                    Privacy Policy
                                </a>.
                            </label>
                        </div>

                        {errors.terms && (
                            <p className="text-red-500 text-xs">
                                {errors.terms.message}
                            </p>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                            <ArrowRight size={19} />
                        </button>

                    </form>

                    {/* LOGIN LINK */}
                    <p className="text-center text-gray-500 text-sm mt-7">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Sign In
                        </a>
                    </p>

                    <p className="text-center text-xs text-gray-400 mt-8">
                        © 2026 ShopSphere. All rights reserved.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Register;
