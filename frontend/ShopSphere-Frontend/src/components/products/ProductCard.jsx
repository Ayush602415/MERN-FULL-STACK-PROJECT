
import React from "react";
import { useState } from "react";
import { Heart, Star, ShoppingCart, Eye, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteProduct } from "../../services/product.api";
import { addCart } from "../../redux/feature/cartSlice";
import { addWishlist } from "../../redux/feature/wishListSlice";

const ProductCard = ({ product, onDelete }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAdmin = useSelector((state) => state.auth.user?.role === "admin");
    const productImages = product.images || product.image || [];
    const productImage = typeof productImages[0] === "string"
        ? productImages[0]
        : productImages[0]?.url;
    const stock = product.stock ?? product.stocks ?? 0;
    const productSeed = String(product._id || product.name).split("").reduce((seed, char) => seed + char.charCodeAt(0), 0);
    const rating = product.ratings || Number((3.5 + (productSeed % 15) / 10).toFixed(1));
    const reviewCount = product.numberOfReviews || product.numReviews || 20 + (productSeed % 480);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${product.name}"?`)) return;

        setDeleting(true);
        setError("");
        try {
            await deleteProduct(product._id);
            onDelete?.(product._id);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            await dispatch(addCart({ productId: product._id, quantity: 1 })).unwrap();
            toast.success("Added to cart");
            navigate("/cart")

        } catch {
            toast.error("Failed to add item to cart");
        }
    }

    const handleAddToWishlist = async()=>{
        try {

            await dispatch(addWishlist(product._id)).unwrap()
            toast.success("Added To Wishlist")
            navigate("/wishlist")
            
        } catch {
            toast.error("Failed to add item to wishlist");
        }
    }

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1d1b22] to-[#141414] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10">

            {/* Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#292530] to-[#19181d]">
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Image unavailable
                    </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <span className="absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {product.category}
                </span>

                <Link
                    to={`/products/${product._id}`}
                    aria-label={`View product details for ${product.name}`}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 opacity-100 transition-opacity duration-300 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
                >
                    <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-white/20">
                        <Eye size={17} />
                        View Product Details
                    </span>
                </Link>

                <button
                    onClick={handleAddToWishlist}
                    type="button"
                    className="absolute right-3 top-3 z-20 rounded-full border border-white/15 bg-black/55 p-2.5 text-white backdrop-blur-md transition hover:border-red-400/50 hover:bg-red-500"
                    aria-label="Add to wishlist"
                >
                    <Heart size={18} />
                </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                    {product.brand}
                </p>

                <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-white">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: 5 }, (_, index) => (
                            <Star key={index} size={15} fill={index < Math.round(rating) ? "currentColor" : "none"} />
                        ))}
                        <span className="text-sm font-medium">
                            {rating}
                        </span>
                    </div>

                    <span className="text-xs text-gray-500">
                        ({reviewCount} reviews)
                    </span>
                </div>

                {/* Price */}
                <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                    <span className="text-2xl font-bold tracking-tight text-white">
                        ₹{product.price?.toLocaleString("en-IN")}
                    </span>

                    <span className={`text-xs font-medium ${
                        stock > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                        {stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-5">
                    <button
                        onClick={handleAddToCart}
                        type="button"
                        disabled={stock <= 0}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
                {isAdmin && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="flex items-center justify-center gap-2 rounded-lg border border-purple-400/40 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/10"
                        >
                            <Pencil size={16} />
                            Update
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-400/30 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
                {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
            </div>
        </div>
    );
};

export default ProductCard;
