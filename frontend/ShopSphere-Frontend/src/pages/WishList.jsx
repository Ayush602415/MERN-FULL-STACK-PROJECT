
import { useEffect } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWishlist, removeWishlist } from "../redux/feature/wishListSlice";

const Wishlist = () => {
    const dispatch = useDispatch()
    const { wishlist, loading } = useSelector(state => state.wishlist)

    const items = wishlist.products || []

    useEffect(() => {
        dispatch(getWishlist())
    },[dispatch])

    const removeItem = async (productId) => {
        try {
            await dispatch(removeWishlist(productId)).unwrap()
            toast.success("Removed from wishlist")
        } catch (error) {
            toast.error("Failed to remove item")
        }
    };

    return (
        <div className="min-h-screen bg-[#101010] px-5 py-12 text-white md:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center gap-3">
                    <Heart size={28} />
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                </div>

                <p className="mt-3 text-gray-400">Your favourite products in one place.</p>

                {loading ? (
                    <p className="py-20 text-center text-gray-400">Loading wishlist...</p>):
                items.length === 0 ? (
                    <div className="py-24 text-center">
                        <Heart size={55} className="mx-auto text-gray-600" />
                        <h2 className="mt-5 text-xl font-semibold">Your wishlist is empty</h2>
                        <p className="mt-2 text-gray-500">Save products you love here.</p>
                        <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black">
                            <ShoppingBag size={18} /> Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map(item => (
                            <div key={item._id} className="rounded-2xl border border-white/10 bg-[#191919] p-4">
                                <img src={item.image?.[0]} alt={item.name} className="h-48 w-full rounded-xl object-cover" />
                                <h3 className="mt-4 font-semibold">{item.name}</h3>
                                <p className="mt-2 text-lg font-bold">₹{item.price}</p>
                                <div className="mt-4 flex justify-between">
                                    <Link to={`/products/${item._id}`} className="text-sm text-gray-300">View Product</Link>
                                    <button type="button" onClick={() => removeItem(item._id)} className="text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
