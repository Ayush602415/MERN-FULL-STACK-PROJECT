import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
    addToCart as addToCartRequest,
    getCart as getCartRequest,
    removeCart as removeCartRequest,
    updateCart as updateCartRequest
} from "../../services/cart.api"

const getCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        return (await getCartRequest()).cart || { items: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch cart")
    }
})

const addCart = createAsyncThunk("cart/addCartItem", async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
        await addToCartRequest(productId, quantity)
        return (await getCartRequest()).cart || { items: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to add item")
    }
})

const removeCart = createAsyncThunk("cart/removeCartItem", async (productId, { rejectWithValue }) => {
    try {
        await removeCartRequest(productId)
        return (await getCartRequest()).cart || { items: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to remove item")
    }
})

const updateCart = createAsyncThunk("cart/updateCart", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        await updateCartRequest(productId, quantity)
        return (await getCartRequest()).cart || { items: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to update cart")
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: { items: [] },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(addCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(removeCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(removeCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(removeCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export { getCart, addCart, removeCart, updateCart }
export default cartSlice.reducer
