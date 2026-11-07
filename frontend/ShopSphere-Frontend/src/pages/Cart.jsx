
import { useEffect } from "react";
import { Link } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeCart, updateCart } from "../redux/feature/cartSlice";

const Cart = () => {
    const { cart, loading, error } = useSelector(state => state.cart)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getCart())
    },[dispatch])

    const cartItems = cart?.items || []

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        dispatch(updateCart({ productId, quantity }))
    };

    const removeItem = (productId) => {
        dispatch(removeCart(productId))
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );


      if (loading && cartItems.length === 0) {
        return <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
            Loading cart...
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#101010] px-5 py-12 text-white md:px-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="mt-2 text-gray-400">Review your selected products.</p>
                {error && <p role="alert" className="mt-4 text-red-400">{error}</p>}

                {cartItems.length === 0 ? (
                    <div className="py-24 text-center">
                        <ShoppingBag size={55} className="mx-auto text-gray-600" />
                        <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
                        <p className="mt-2 text-gray-500">Add some products to get started.</p>
                        <Link to="/products" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {cartItems.map(item => (
                                <div key={item.product._id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-white/10 bg-[#191919] p-5">
                                    <img src={item.product.image?.[0]} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover" />

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <p className="mt-2 text-gray-400">₹{item.product.price}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={17} /></button>
                                        <span>{item.quantity}</span>
                                        <button type="button" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}><Plus size={17} /></button>
                                    </div>

                                    <button type="button" onClick={() => removeItem(item.product._id)} className="text-red-400">
                                        <Trash2 size={19} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="h-fit rounded-2xl border border-white/10 bg-[#191919] p-6">
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                            <div className="mt-6 flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="mt-4 flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="my-6 border-t border-white/10" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Link to="/checkout" className="mt-7 block rounded-xl bg-white py-3 text-center font-semibold text-black hover:bg-gray-300">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
