import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router";
import { allUsers } from "../services/authServices";
import { getAllProduct } from "../services/product.api";
import { updateStatus } from "../redux/feature/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../services/order.api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState(0)
  const [orders, setOrders] = useState([])
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const dispatch = useDispatch()
  const error = useSelector((state) => state.order.error)
  const isAdmin = useSelector((state) => state.auth.user?.role === "admin")
      useEffect(() => {
           const fetchUsers = async () => {
               try {
                   const response = await allUsers();
                   setUsers(response.data.users);
               } catch (error) {
                   console.log(error);
               }
           };

           const fetchProducts = async()=>{
                 try {
                   const response = await getAllProduct();
                   setProducts(response.totalProducts);
               } catch (error) {
                   console.log(error);
               }
           }

           const fetchOrders  = async()=>{
            try {
              const response = await getAllOrders()
              setOrders(response.orders)
            } catch (error) {
              console.log(error)
            }
          }
   
           fetchUsers();
           fetchProducts()
           fetchOrders()
       }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const updatedOrder = await dispatch(updateStatus({ orderId, orderStatus })).unwrap()
      setOrders((currentOrders) =>
        currentOrders.map((order) => order._id === orderId ? updatedOrder : order)
      )
    } catch (updateError) {
      console.error("Failed to update order status:", updateError)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const revenue = orders.reduce((total, order) => {
    const paidOnlineOrder = order.paymentStatus === "PAID" && order.orderStatus !== "CANCELLED"
    const deliveredCashOrder = order.paymentMethod === "COD" && order.orderStatus === "DELIVERED"
    return total + (paidOnlineOrder || deliveredCashOrder ? order.totalAmount : 0)
  }, 0)

  const stats = [
    { title: "Total Products", value: products, icon: Package },
    { title: "Total Orders", value: orders.length, icon: ShoppingCart },
    { title: "Total Users", value: users.length, icon: Users },
    { title: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-5 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Manage your ShopSphere store.
            </p>
          </div>

          <Link
            to="/admin/products/create"
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg transition"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-[#181818] border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">{item.title}</p>
                  <Icon className="text-purple-400" size={22} />
                </div>

                <h2 className="text-3xl font-bold mt-5">
                  {item.value}
                </h2>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

            <div className="space-y-3">
              {[
                ["Manage Products", "/admin/products"],
                ["Manage Users", "/admin/users"],
              ].map(([title, path]) => (
                <Link
                  key={title}
                  to={path}
                  className="flex justify-between items-center p-4 bg-[#222] rounded-xl hover:bg-[#292929] transition"
                >
                  <span>{title}</span>
                  <ArrowUpRight size={18} className="text-purple-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">Recent Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart size={35} className="mx-auto mb-3" />
                <p>No orders available yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#222] p-4">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6)}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        ₹{order.totalAmount} · {order.paymentStatus}
                      </p>
                    </div>
                    {isAdmin && (
                      <select
                        aria-label={`Status for order ${order._id}`}
                        value={order.orderStatus}
                        disabled={updatingOrderId === order._id}
                        onChange={(event) => handleStatusChange(order._id, event.target.value)}
                        className="rounded-lg border border-white/10 bg-[#181818] px-3 py-2 text-sm disabled:opacity-50"
                      >
                        {["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((orderStatus) => (
                          <option key={orderStatus} value={orderStatus}>{orderStatus}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;