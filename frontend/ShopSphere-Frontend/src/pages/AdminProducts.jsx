import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Edit, Plus } from "lucide-react";
import { getAllProduct } from "../services/product.api";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProduct();
                setProducts(data.products || []);
            } catch (requestError) {
                setError(requestError.response?.data?.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen px-5 py-10 text-white md:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Products</h1>
                        <p className="mt-2 text-gray-400">Create products or update their details and images.</p>
                    </div>
                    <Link
                        to="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>

                {loading && <p className="text-gray-400">Loading products...</p>}
                {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-300">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-[#181818] p-8 text-center text-gray-400">
                        No products yet. Add your first product to get started.
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        const images = product.images || product.image || [];
                        const stock = product.stock ?? product.stocks ?? 0;
                        return (
                            <article key={product._id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">
                                {images[0] ? (
                                    <img src={images[0]} alt={product.name} className="h-52 w-full object-cover" />
                                ) : (
                                    <div className="flex h-52 items-center justify-center bg-[#222] text-gray-500">No image</div>
                                )}
                                <div className="p-5">
                                    <p className="text-xs uppercase tracking-wider text-purple-300">{product.category}</p>
                                    <h2 className="mt-2 truncate text-lg font-semibold">{product.name}</h2>
                                    <p className="mt-2 text-sm text-gray-400">
                                        ₹{Number(product.price || 0).toLocaleString("en-IN")} · Stock: {stock}
                                    </p>
                                    <Link
                                        to={`/admin/products/${product._id}/edit`}
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium transition hover:border-purple-400 hover:bg-purple-500/10"
                                    >
                                        <Edit size={16} />
                                        Edit product
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default AdminProducts;
