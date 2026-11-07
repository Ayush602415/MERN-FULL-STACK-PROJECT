import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
    addToWishlist as addToWishlistRequest,
    getWishlist as getWishlistRequest,
    removeFromWishlist as removeFromWishlistRequest
} from "../../services/wishlist.api"

const getWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
    try {
        return (await getWishlistRequest()).wishlist || { products: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch wishlist")
    }
})

const addWishlist = createAsyncThunk("wishlist/addWishlist", async (productId, { rejectWithValue }) => {
    try {
        await addToWishlistRequest(productId)
        return (await getWishlistRequest()).wishlist || { products: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to add to wishlist")
    }
})

const removeWishlist = createAsyncThunk("wishlist/removeWishlist", async (productId, { rejectWithValue }) => {
    try {
        await removeFromWishlistRequest(productId)
        return (await getWishlistRequest()).wishlist || { products: [] }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to remove from wishlist")
    }
})

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: { products: [] },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.wishlist = action.payload
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.wishlist = action.payload
            })
            .addCase(addWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(removeWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(removeWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.wishlist = action.payload
            })
            .addCase(removeWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export { getWishlist, addWishlist, removeWishlist }
export default wishlistSlice.reducer
