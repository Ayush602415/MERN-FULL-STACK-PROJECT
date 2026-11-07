import {io} from "socket.io-client"
import { getAccessToken } from "../services/api"

export const socket = io(import.meta.env.VITE_SOCKET_URL,{
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