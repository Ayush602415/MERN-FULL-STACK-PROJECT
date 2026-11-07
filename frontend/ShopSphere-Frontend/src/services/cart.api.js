import api from "./api"

export const addToCart = async(productId,quantity=1)=>{
    const {data} = await api.post("/cart/addToCart",{productId , quantity})
    return data
}

export const updateCart = async(productId,quantity)=>{
    const {data} = await api.patch("/cart/updateCart",{productId , quantity})
    return data
}

export const removeCart = async(productId)=>{
    const {data} = await api.delete(`/cart/removeCart/${productId}`)
    return data
}

export const getCart = async()=>{
    const {data} = await api.get("/cart")
    return data
}