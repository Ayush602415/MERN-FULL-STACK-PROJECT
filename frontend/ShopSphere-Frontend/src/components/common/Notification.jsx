import { useDispatch, useSelector } from "react-redux";
import { Bell, CheckCheck, X } from "lucide-react";
import {
    clearNotifications,
    dismissNotification,
    markNotificationAsRead
} from "../../redux/feature/notificationSlice";

const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-800 bg-gray-900 text-white">
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
                <div className="flex items-center gap-2">
                    <Bell size={20} />
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {notifications.length > 0 && (
                    <button
                        type="button"
                        onClick={() => dispatch(clearNotifications())}
                        className="text-sm text-gray-400 hover:text-red-400"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                    <p className="mt-1 text-xs">Your order updates will appear here.</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-800">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`flex items-start gap-3 p-4 ${
                                notification.read ? "bg-gray-900" : "bg-gray-800/60"
                            }`}
                        >
                            <span className="mt-1 rounded-full bg-blue-500/15 p-2 text-blue-400">
                                <Bell size={16} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">
                                    {notification.message || "Your order status was updated."}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {notification.orderId && `Order #${notification.orderId.slice(-6)}`}
                                    {notification.status && ` · ${notification.status}`}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">{notification.createdAt}</p>
                            </div>
                            {!notification.read && (
                                <button
                                    type="button"
                                    onClick={() => dispatch(markNotificationAsRead(notification.id))}
                                    aria-label="Mark notification as read"
                                    title="Mark as read"
                                    className="rounded p-1 text-gray-400 hover:text-blue-400"
                                >
                                    <CheckCheck size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => dispatch(dismissNotification(notification.id))}
                                aria-label="Dismiss notification"
                                title="Dismiss"
                                className="rounded p-1 text-gray-400 hover:text-red-400"
                            >
                                <X size={18} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
