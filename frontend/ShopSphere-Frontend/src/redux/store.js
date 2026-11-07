import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/feature/authSlice"
import productReducer from "../redux/feature/productSlice"
import cartReducer from "../redux/feature/cartSlice"
import wishlistReducer from "../redux/feature/wishListSlice"
import orderReducer from "../redux/feature/orderSlice"
import notificationReducer from "../redux/feature/notificationSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        order: orderReducer,
        notifications: notificationReducer
    }
})
