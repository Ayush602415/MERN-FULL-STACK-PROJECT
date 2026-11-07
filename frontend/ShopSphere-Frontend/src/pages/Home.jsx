
import React from "react";
import { Link } from "react-router";
import {
    ArrowRight,
    Truck,
    ShieldCheck,
    Headphones,
    Smartphone,
    Shirt,
    Watch,
    Laptop
} from "lucide-react";

const Home = () => {

    const categories = [
        { name: "Electronics", icon: Smartphone },
        { name: "Fashion", icon: Shirt },
        { name: "Accessories", icon: Watch },
        { name: "Computers", icon: Laptop }
    ];

    const features = [
        {
            icon: Truck,
            title: "Free Shipping",
            description: "On selected orders"
        },
        {
            icon: ShieldCheck,
            title: "Secure Payments",
            description: "Safe and secure checkout"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Here whenever you need us"
        }
    ];

    return (
        <div className="min-h-screen bg-[#101010] text-white">

            {/* Hero Section */}
            <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">

                <div>
                    <span className="rounded-full border border-white/10 bg-[#202020] px-4 py-2 text-xs text-gray-300">
                        YOUR ONE-STOP SHOPPING DESTINATION
                    </span>

                    <h1 className="mt-7 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        Everything You Need,
                        <span className="block text-gray-400">
                            All In One Place.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
                        Discover amazing products, explore new collections
                        and enjoy a seamless shopping experience with ShopSphere.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/products"
                            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-300"
                        >
                            Shop Now <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/products"
                            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                        >
                            Explore Products
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 rounded-3xl bg-white/5 blur-3xl" />

                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
                        alt="Shopping collection"
                        className="relative h-80 w-full rounded-3xl object-cover sm:h-[420px]"
                    />

                    <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
                        <p className="text-xs text-gray-400">
                            Discover More
                        </p>
                        <p className="mt-1 font-semibold">
                            Your Style. Your Choice.
                        </p>
                    </div>
                </div>

            </section>

            {/* Categories */}
            <section className="border-y border-white/10 bg-[#151515] px-5 py-16">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-9 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-gray-500">EXPLORE</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                Shop By Category
                            </h2>
                        </div>

                        <Link to="/products" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {categories.map(category => {
                            const Icon = category.icon;

                            return (
                                <Link
                                    to="/products"
                                    key={category.name}
                                    className="group rounded-2xl border border-white/10 bg-[#1c1c1c] p-7 transition hover:-translate-y-1 hover:border-white/30"
                                >
                                    <Icon size={30} className="text-gray-400 transition group-hover:text-white" />
                                    <h3 className="mt-5 font-semibold">
                                        {category.name}
                                    </h3>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Explore Collection
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Promotional Section */}
            <section className="mx-auto max-w-7xl px-5 py-16">
                <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#252525] to-[#141414] p-8 md:flex-row md:items-center md:p-14">

                    <div>
                        <p className="text-sm text-gray-400">
                            THE SHOPSPHERE COLLECTION
                        </p>
                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            Find Something You'll Love.
                        </h2>
                        <p className="mt-4 max-w-lg text-gray-400">
                            Browse our latest collections and discover
                            products for your everyday needs.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-300"
                    >
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-white/10 bg-[#151515] px-5 py-16">
                <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 md:grid-cols-3">

                    {features.map(feature => {
                        const Icon = feature.icon;

                        return (
                            <div key={feature.title} className="flex items-center gap-4">
                                <div className="rounded-xl bg-[#252525] p-4">
                                    <Icon size={25} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="px-5 py-8 text-center text-sm text-gray-500">
                © 2026 ShopSphere. All rights reserved.
            </footer>

        </div>
    );
};

export default Home;
