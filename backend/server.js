const { Server } = require("socket.io");
const app = require("./src/app");
const config = require("./src/config/config");
const ConnectDb = require("./src/config/db");
const http = require("http");
const { verifyAccessToken } = require("./src/utils/token.utils");

ConnectDb()

const httpServer = http.createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin: config.FRONTEND_URI,
        credentials: true
    }
})

app.set("io",io)

io.use((socket , next)=>{
    try {
        const token = socket.handshake.auth?.token
        if(!token){
            return next(new Error("Authentication required"));
        }
        const decoded = verifyAccessToken(token)
        if(!decoded?.userId){
               return next(new Error("Invalid access token"));
        }
        socket.userId = decoded.userId
        next()

    } catch (error) {
        next(new Error("Invalid access token"));
    }
})

io.on("connection",(socket)=>{
    console.log("User Connected",socket.id)

    socket.join(`user:${socket.userId}`)

    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
    })
})

httpServer.listen(config.PORT, ()=>{
    console.log("Server Running on Port")
})