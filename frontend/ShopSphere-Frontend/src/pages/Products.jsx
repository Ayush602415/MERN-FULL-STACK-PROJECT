import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { getAllProduct } from "../services/product.api";

const PAGE_SIZE = 8;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProduct();
                setProducts(data.products || []);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [
        "All",
        ...new Set(products.map(product => product.category).filter(Boolean))
    ];

    const filteredProducts = useMemo(() => {
        let result = [...products];
        const normalizedSearch = search.trim().toLowerCase();

        if (normalizedSearch) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(normalizedSearch)
            );
        }

        if (category !== "All") {
            result = result.filter(product => product.category === category);
        }

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, search, category, sort]);

    const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
    const firstPageNumber = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
    const pageNumbers = Array.from(
        { length: Math.min(pageCount, 5) },
        (_, index) => firstPageNumber + index
    );

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="mx-auto min-h-[70vh] max-w-7xl px-5 py-20 text-white md:px-10">
                <div className="animate-pulse">
                    <div className="h-4 w-28 rounded bg-white/10" />
                    <div className="mt-5 h-10 w-64 rounded bg-white/10" />
                    <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/10" />
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: PAGE_SIZE }, (_, index) => (
                            <div key={index} className="h-96 rounded-2xl border border-white/5 bg-white/[0.03]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto min-h-[70vh] max-w-7xl px-5 py-20 md:px-10">
                <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-300">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen px-5 py-10 text-white md:px-10 md:py-14">
            <div className="mx-auto max-w-7xl">
                <section className="relative mb-9 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/60 via-[#19151f] to-[#171717] px-6 py-8 sm:px-9 sm:py-10">
                    <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">
                        Curated for you
                    </p>
                    <div className="relative mt-3 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Products</h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                                Discover quality picks for every part of your everyday.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-gray-300">
                            <ShoppingBag size={16} className="text-purple-300" />
                            {products.length} items
                        </div>
                    </div>
                </section>

                <section aria-label="Product filters" className="mb-7 rounded-2xl border border-white/10 bg-[#171717]/80 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-purple-400/60 focus-within:ring-2 focus-within:ring-purple-500/10">
                            <Search size={19} className="shrink-0 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={search}
                                onChange={event => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
                            />
                        </label>

                        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 focus-within:border-purple-400/60">
                            <SlidersHorizontal size={17} className="text-gray-400" />
                            <select
                                value={sort}
                                onChange={event => {
                                    setSort(event.target.value);
                                    setCurrentPage(1);
                                }}
                                aria-label="Sort products"
                                className="w-full bg-transparent py-3 text-sm text-gray-200 outline-none"
                            >
                                <option value="default" className="bg-[#191919]">Featured</option>
                                <option value="low" className="bg-[#191919]">Price: Low to High</option>
                                <option value="high" className="bg-[#191919]">Price: High to Low</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map(item => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setCategory(item);
                                    setCurrentPage(1);
                                }}
                                aria-pressed={category === item}
                                className={`rounded-full border px-4 py-2 text-xs font-medium transition sm:text-sm ${
                                    category === item
                                        ? "border-purple-400/40 bg-purple-500/20 text-purple-100"
                                        : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/25 hover:text-white"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">{filteredProducts.length ? startIndex + 1 : 0}–{Math.min(startIndex + PAGE_SIZE, filteredProducts.length)}</span>
                        {" "}of <span className="font-medium text-white">{filteredProducts.length}</span> products
                    </p>
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCurrentPage(1);
                            }}
                            className="text-sm text-purple-300 transition hover:text-purple-200"
                        >
                            Clear search
                        </button>
                    )}
                </div>

                {visibleProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleProducts.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onDelete={(productId) => setProducts((current) => current.filter((item) => item._id !== productId))}
                                />
                            ))}
                        </div>

                        {pageCount > 1 && (
                            <nav aria-label="Product pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Previous page"
                                    disabled={currentPage === 1}
                                    onClick={() => changePage(currentPage - 1)}
                                    className="flex h-10 items-center gap-1 rounded-xl border border-white/10 px-3 text-sm text-gray-300 transition hover:border-purple-400/50 hover:bg-white/5 disabled:opacity-40"
                                >
                                    <ChevronLeft size={17} />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>
                                {pageNumbers.map(page => (
                                    <button
                                        key={page}
                                        type="button"
                                        aria-label={`Page ${page}`}
                                        aria-current={page === currentPage ? "page" : undefined}
                                        onClick={() => changePage(page)}
                                        className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition ${
                                            page === currentPage
                                                ? "border-purple-400/50 bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                                                : "border-white/10 text-gray-400 hover:border-purple-400/50 hover:text-white"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    aria-label="Next page"
                                    disabled={currentPage === pageCount}
                                    onClick={() => changePage(currentPage + 1)}
                                    className="flex h-10 items-center gap-1 rounded-xl border border-white/10 px-3 text-sm text-gray-300 transition hover:border-purple-400/50 hover:bg-white/5 disabled:opacity-40"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight size={17} />
                                </button>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
                        <Search size={30} className="mx-auto text-gray-600" />
                        <h2 className="mt-4 text-xl font-semibold">No products found</h2>
                        <p className="mt-2 text-sm text-gray-500">Try another search or category.</p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                                setCurrentPage(1);
                            }}
                            className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-purple-100"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Products;
