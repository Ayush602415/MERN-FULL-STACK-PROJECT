import {
    Package, ArrowRight, CalendarDays, MapPin,
    Truck, CheckCircle2, Clock3, XCircle,
    CreditCard, ShoppingBag
} from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getOrder, removeOrder, updateOrderFromSocket } from "../redux/feature/orderSlice";
import { socket } from "../socket/socket";

const MyOrders = () => {
    const dispatch = useDispatch();

    const {
        Order: orders,
        loading,
        error,
        cancelingOrderId
    } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getOrder());
    }, [dispatch]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await dispatch(removeOrder(orderId)).unwrap();
            toast.success("Order cancelled successfully");
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to cancel order");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            PROCESSING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
            SHIPPED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            DELIVERED: "text-green-400 bg-green-400/10 border-green-400/20",
            CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20"
        };

        return colors[status] || "text-gray-400 bg-white/5 border-white/10";
    };

    const getProgress = (status) => {
        const steps = ["PROCESSING", "SHIPPED", "DELIVERED"];
        return steps.indexOf(status);
    };

    useEffect(()=>{
        const handleOrderUpdate = (data)=>{
            dispatch(updateOrderFromSocket(data.order))
            toast.info(data.message)
        }
        socket.on("orderStatusUpdated",handleOrderUpdate)

        return ()=>{
            socket.off("orderStatusUpdated",handleOrderUpdate)
        }
    },[dispatch])

    return (
        <div className="min-h-screen bg-[#101010] px-5 py-12 text-white md:px-10">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <p className="text-sm font-medium text-purple-400">YOUR ACCOUNT</p>
                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                            My Orders
                        </h1>
                        <p className="mt-2 text-gray-400">
                            Track your purchases and manage your orders.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                        Continue Shopping <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Loading */}
                {loading && orders.length === 0 ? (
                    <p className="py-24 text-center text-gray-400">
                        Loading your orders...
                    </p>
                ) : error && orders.length === 0 ? (
                    <p role="alert" className="py-24 text-center text-red-400">
                        {error}
                    </p>
                ) : orders.length === 0 ? (
                    <div className="mt-16 rounded-3xl border border-white/10 bg-[#191919] py-20 text-center">
                        <ShoppingBag size={55} className="mx-auto text-gray-600" />
                        <h2 className="mt-5 text-xl font-semibold">No orders yet</h2>
                        <p className="mt-2 text-gray-500">
                            Your purchases will appear here.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black"
                        >
                            Explore Products <ArrowRight size={17} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 space-y-7">
                        {error && (
                            <p role="alert" className="text-red-400">{error}</p>
                        )}

                        {orders.map((order) => {
                            const progress = getProgress(order.orderStatus);

                            return (
                                <div
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#191919]"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 p-6">
                                        <div>
                                            <p className="text-xs text-gray-500">ORDER ID</p>
                                            <h3 className="mt-1 break-all text-sm font-semibold">
                                                #{order._id}
                                            </h3>
                                            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                <CalendarDays size={14} />
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>

                                        <span className={`rounded-full border px-4 py-2 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr]">

                                        {/* Products */}
                                        <div>
                                            <h3 className="mb-5 font-semibold">
                                                Order Items
                                            </h3>

                                            <div className="space-y-5">
                                                {order.items?.map((item, index) => (
                                                    <div
                                                        key={item.product || index}
                                                        className="flex gap-4"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-20 w-20 rounded-xl bg-[#252525] object-cover"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-medium">
                                                                {item.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                            <p className="mt-2 font-semibold">
                                                                ₹{item.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Timeline */}
                                            <div className="mt-9 border-t border-white/10 pt-6">
                                                <h3 className="mb-7 font-semibold">
                                                    Order Tracking
                                                </h3>

                                                {order.orderStatus === "CANCELLED" ? (
                                                    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                                                        <XCircle className="text-red-400" />
                                                        <div>
                                                            <p className="font-medium text-red-400">
                                                                Order Cancelled
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                This order has been cancelled.
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative flex justify-between">
                                                        <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-white/10" />
                                                        <div
                                                            className="absolute left-[10%] top-4 h-0.5 bg-purple-500 transition-all"
                                                            style={{
                                                                width: `${progress * 40}%`
                                                            }}
                                                        />

                                                        {[
                                                            { label: "Processing", icon: Clock3 },
                                                            { label: "Shipped", icon: Truck },
                                                            { label: "Delivered", icon: CheckCircle2 }
                                                        ].map((step, index) => {
                                                            const Icon = step.icon;
                                                            const completed = index <= progress;

                                                            return (
                                                                <div
                                                                    key={step.label}
                                                                    className="relative z-10 flex w-1/3 flex-col items-center gap-3"
                                                                >
                                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${completed ? "border-purple-500 bg-purple-500 text-white" : "border-white/10 bg-[#252525] text-gray-500"}`}>
                                                                        <Icon size={17} />
                                                                    </div>
                                                                    <span className={`text-center text-xs ${completed ? "text-white" : "text-gray-500"}`}>
                                                                        {step.label}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="space-y-5">

                                            {/* Payment */}
                                            <div className="rounded-xl border border-white/10 bg-[#202020] p-5">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={17} className="text-purple-400" />
                                                    <h3 className="font-semibold">Payment Details</h3>
                                                </div>

                                                <div className="mt-5 flex justify-between text-sm">
                                                    <span className="text-gray-500">Method</span>
                                                    <span>{order.paymentMethod}</span>
                                                </div>

                                                <div className="mt-3 flex justify-between text-sm">
                                                    <span className="text-gray-500">Payment Status</span>
                                                    <span className={order.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>

                                                <div className="mt-5 flex justify-between border-t border-white/10 pt-4">
                                                    <span className="font-semibold">Total Amount</span>
                                                    <span className="text-lg font-bold">
                                                        ₹{order.totalAmount}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="rounded-xl border border-white/10 bg-[#202020] p-5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={17} className="text-purple-400" />
                                                    <h3 className="font-semibold">Delivery Address</h3>
                                                </div>

                                                <div className="mt-4 space-y-1 text-sm text-gray-400">
                                                    <p className="font-medium text-white">
                                                        {order.shippingAddress?.fullName}
                                                    </p>
                                                    <p>{order.shippingAddress?.address}</p>
                                                    <p>
                                                        {order.shippingAddress?.city},{" "}
                                                        {order.shippingAddress?.state}
                                                    </p>
                                                    <p>{order.shippingAddress?.pincode}</p>
                                                    <p>{order.shippingAddress?.phone}</p>
                                                </div>
                                            </div>

                                            {/* Cancel */}
                                            {order.orderStatus === "PROCESSING" &&
                                                order.paymentStatus !== "PAID" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        disabled={cancelingOrderId === order._id}
                                                        className="w-full rounded-xl border border-red-500/30 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                                    >
                                                        {cancelingOrderId === order._id
                                                            ? "Cancelling..."
                                                            : "Cancel Order"}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
