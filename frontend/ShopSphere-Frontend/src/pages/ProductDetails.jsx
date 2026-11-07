
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ShoppingCart, Heart, Star, ArrowLeft } from "lucide-react";
import { getProductById } from "../services/product.api";


const ProductDetails = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(productId);
                setProduct(product);
            } catch (error) {
                setError(error.response?.data?.message || "Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <div className="min-h-screen bg-[#101010] p-10 text-white">Loading...</div>;
    if (error || !product) return <div className="min-h-screen bg-[#101010] p-10 text-red-400">{error || "Product not found"}</div>;

    const image = product.images ?? product.image;
    const productImage = Array.isArray(image) ? image[0] : image;
    const productImageUrl = typeof productImage === "string" ? productImage : productImage?.url;
    const stock = product.stock ?? product.stocks ?? 0;
    const reviewCount = product.numReviews ?? product.numberOfReviews ?? 0;

    return (
        <div className="min-h-screen bg-[#101010] px-5 py-12 text-white md:px-10">
            <div className="mx-auto max-w-7xl">
                <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={18} /> Back to Products
                </Link>

                <div className="grid gap-12 md:grid-cols-2">
                    <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#191919]">
                        {productImageUrl ? (
                            <img
                                src={productImageUrl}
                                alt={product.name}
                                className="h-full max-h-137.5 w-full object-contain"
                            />
                        ) : (
                            <p className="text-gray-500">Image unavailable</p>
                        )}
                    </div>

                    <div className="py-4">
                        <p className="text-sm text-gray-500">{product.brand} / {product.category}</p>

                        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{product.name}</h1>

                        <div className="mt-5 flex items-center gap-2 text-yellow-400">
                            <Star size={18} fill="currentColor" />
                            <span>{product.ratings}</span>
                            <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                        </div>

                        <h2 className="mt-7 text-3xl font-bold">₹{product.price}</h2>

                        <p className="mt-6 leading-7 text-gray-400">{product.description}</p>

                        <p className="mt-5 text-sm text-gray-400">
                            Stock: {stock > 0 ? `${stock} available` : "Out of stock"}
                        </p>

                        <div className="mt-8 flex items-center gap-5">
                            <div className="flex items-center gap-5 rounded-xl border border-white/10 px-4 py-3">
                                <button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)}>-</button>
                                <span>{quantity}</span>
                                <button disabled={quantity >= stock} onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>

                            <button
                                disabled={stock <= 0}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ShoppingCart size={18} /> Add to Cart
                            </button>

                            <button className="rounded-xl border border-white/10 p-3 hover:bg-white/10">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>

                    <section className="mt-12">
                        <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
                        {product.reviews?.length ? product.reviews.map((review, index) => (
                            <article key={index} className="mb-3 rounded-xl border border-white/10 bg-[#191919] p-5">
                                <p className="font-semibold">{review.name} · {review.rating}/5</p>
                                <p className="mt-2 text-gray-400">{review.comment}</p>
                            </article>
                        )) : <p className="text-gray-400">No reviews yet.</p>}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
