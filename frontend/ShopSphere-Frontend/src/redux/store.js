import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice"
import productReducer from "./feature/productSlice"
import cartReducer from "./feature/cartSlice"
import wishlistReducer from "./feature/wishListSlice"
import orderReducer from "./feature/orderSlice"
import notificationReducer from "./feature/notificationSlice"
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
