import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../redux/feature/cartSlice";
import { createOrder } from "../redux/feature/orderSlice";
import { toast } from "react-toastify";
import { createPayment, verifyPayment } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state)=>state.order.loading)
  const [submitting, setSubmitting] = useState(false);
  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
        items: cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        })),
        shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
        },
        paymentMethod
    };

    try {
      if (paymentMethod === "RAZORPAY" && !import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay is not configured");
      }

      const order = await dispatch(createOrder(orderData)).unwrap();
      if (paymentMethod === "COD") {
        toast.success("Order created successfully");
        setSubmitting(false)
        navigate("/my-orders");
        return;
      }

      const { paymentOrder } = await createPayment(order._id);
      const checkout = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "ShopSphere",
        description: "Order payment",
        order_id: paymentOrder.id,
        handler: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
          try {
            await verifyPayment({
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              signature: razorpay_signature
            });
            toast.success("Payment successful");
            setSubmitting(false)
            navigate("/my-orders");
          } catch (verificationError) {
            toast.error(verificationError.response?.data?.message || "Payment verification failed");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false)
        }
      });

      checkout.on("payment.failed", ({ error }) => {
        toast.error(error.description || "Payment failed");
        setSubmitting(false);
      });
      checkout.open();
    } catch (error) {
      toast.error(typeof error === "string"
        ? error
        : error.response?.data?.message || error.message || "Failed to create order");
      setSubmitting(false);
    }


  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-400 mb-10">
          Complete your details to place your order.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5"
          >
            <h2 className="text-xl font-semibold">Shipping Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name"],
                ["email", "Email Address"],
                ["phone", "Phone Number"],
                ["address", "Full Address"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "PIN Code"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  type={name === "email" ? "email" : "text"}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  autoComplete={name === "email" ? "email" : undefined}
                  className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
                />
              ))}
            </div>

          <div>
          <h2 className="text-lg font-semibold mb-3">
              Payment Method
          </h2>
          <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 outline-none">
              <option value="COD">Cash on Delivery</option>
              <option value="RAZORPAY">Razorpay</option>
          </select>
      </div>

          <button
            type="submit"
            disabled={loading || submitting || cartItems.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition">
            {loading || submitting ? "Processing..." : "Continue to Payment"}
        </button>
          </form>

          <div className="h-fit bg-[#181818] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="flex justify-between text-gray-400 mb-4">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-4">
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString("en-IN")}</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-6 text-sm text-gray-400 flex items-center gap-2">
              <Lock size={16} />
              Secure checkout
            </div>

            <Link
              to="/cart"
              className="mt-6 flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <ShoppingBag size={17} />
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;