import api from "./api"

export const createOrder = async (orderData) => {
    const { data } = await api.post("/orders/create", orderData)
    return data
}

export const getMyOrders = async () => {
    const { data } = await api.get("/orders/my-orders")
    return data
}

export const getAllOrders = async () => {
    const { data } = await api.get("/orders/admin/all")
    return data
}

export const getMySingleOrder = async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`)
    return data
}

export const cancelOrder = async (orderId) => {
    const { data } = await api.patch(`/orders/${orderId}/cancel`)
    return data
}

export const updateStatus = async(orderId, orderStatus)=>{
    const {data} = await api.patch(`/orders/status/${orderId}`, { orderStatus })
    return data
}   