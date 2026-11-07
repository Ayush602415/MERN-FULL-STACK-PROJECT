import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
    createOrder as createOrderRequest,
    getMyOrders as getMyOrdersRequest,
    getMySingleOrder as getMySingleOrderRequest,
    cancelOrder as cancelOrderRequest,
    updateStatus as updateOrderRequest
} from "../../services/order.api"

const getOrder = createAsyncThunk("Order/fetchMyOrders", async (_, { rejectWithValue }) => {
    try {
        return (await getMyOrdersRequest()).orders
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch orders")
    }
})

const createOrder = createAsyncThunk("Order/createOrder", async (orderData, { rejectWithValue }) => {
    try {
        return (await createOrderRequest(orderData)).order
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to create order")
    }
})

const removeOrder = createAsyncThunk("Order/cancelOrder", async (orderId, { rejectWithValue }) => {
    if (!orderId) {
        return rejectWithValue("Order ID is required to cancel an order")
    }

    try {
        await cancelOrderRequest(orderId)
        return orderId
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to cancel order")
    }
})

const getMySingleOrder = createAsyncThunk("Order/fetchSingleOrder", async (orderId, { rejectWithValue }) => {
    try {
        return (await getMySingleOrderRequest(orderId)).order
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch order")
    }
})

const updateStatus = createAsyncThunk("Order/updateStatus", async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
        return (await updateOrderRequest(orderId, orderStatus)).order
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to update order  status")
    }
})



const OrderSlice = createSlice({
    name: "Order",
    initialState: {
        Order: [],
        singleOrder: null,
        loading: false,
        cancelingOrderId: null,
        error: null
    },
    reducers: {
        updateOrderFromSocket: (state,action)=>{
            state.Order = state.Order.map((order) =>
            order._id === action.payload._id ? action.payload : order)
        if(state.singleOrder?._id === action.payload._id){
                state.singleOrder = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.loading = false
                state.Order = action.payload
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.Order.unshift(action.payload)
                state.singleOrder = action.payload
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(removeOrder.pending, (state, action) => {
                state.cancelingOrderId = action.meta.arg
                state.error = null
            })
            .addCase(removeOrder.fulfilled, (state, action) => {
                state.cancelingOrderId = null
                const cancelledOrder = (order) => order._id === action.payload
                    ? { ...order, orderStatus: "CANCELLED" }
                    : order

                state.Order = state.Order.map(cancelledOrder)
                if (state.singleOrder?._id === action.payload) {
                    state.singleOrder.orderStatus = "CANCELLED"
                }
            })
            .addCase(removeOrder.rejected, (state, action) => {
                state.cancelingOrderId = null
                state.error = action.payload
            })
            .addCase(getMySingleOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getMySingleOrder.fulfilled, (state, action) => {
                state.loading = false
                state.singleOrder = action.payload
            })
            .addCase(getMySingleOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.loading = false
                state.singleOrder = action.payload
                state.Order = state.Order.map((order) =>
                    order._id === action.payload._id ? action.payload : order
                )
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export { getOrder, createOrder, removeOrder , getMySingleOrder, updateStatus}

export const {updateOrderFromSocket} = OrderSlice.actions
export default OrderSlice.reducer
