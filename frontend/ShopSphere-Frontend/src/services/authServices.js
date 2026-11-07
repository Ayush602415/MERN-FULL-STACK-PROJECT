import { connectToken, disconnectToken } from "../socket/socket"
import api, { setAccessToken } from "./api"

export const register = async(userData)=>{
    const response = await api.post("/auth/register",userData)
    setAccessToken(response.data.accessToken)
    connectToken()
    return response.data
}

export const login = async(userData)=>{
    const response = await api.post("/auth/login",userData)
    setAccessToken(response.data.accessToken)
    connectToken()
    return response.data
}

export const me = async()=>{
    const response = await api.get("/auth/me")
    return response.data
}

export const refresh = async()=>{
    const response = await api.post("/auth/refresh")
    setAccessToken(response.data.accessToken)
    connectToken()
    return response.data
}

export const logout = async()=>{
    try {
        const response = await api.post("/auth/logout")
        disconnectToken()
        return response.data
    } finally {
        setAccessToken(null)
    }
}

export const allUsers = async()=>{
        const response = await api.get("/auth/allUsers")
        return response.data
}