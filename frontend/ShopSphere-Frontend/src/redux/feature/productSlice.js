import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllProduct } from "../../services/product.api";

const fetchProducts = createAsyncThunk("products/fetchProducts",
    async(_ , {rejectWithValue})=>{
        try {
            const data = await getAllProduct()
            return data.products
        } catch (error) {
            return rejectWithValue(error.response?.data?.message) || "Failed to Fetch Products"
        }
    }
)

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.loading = false
            state.products = action.payload
        })
        builder.addCase(fetchProducts.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload
        })
    }
})

export default productSlice.reducer 