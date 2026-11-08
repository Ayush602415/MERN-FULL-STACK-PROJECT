import {io} from "socket.io-client"
import { apiBaseUrl, getAccessToken } from "../services/api"

const apiOrigin = new URL(apiBaseUrl).origin
const socketUrl = import.meta.env.DEV
    ? import.meta.env.VITE_SOCKET_URL || apiOrigin
    : apiOrigin

export const socket = io(socketUrl,{
    autoConnect: false,
    withCredentials: true
})

export const connectToken = ()=>{
    const token = getAccessToken()

    if(!token) return;

    socket.auth = {token}
    socket.connect()
}

export const disconnectToken = ()=>{
    socket.disconnect()
}