const cookieParser = require("cookie-parser")
const express = require("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const config = require("./config/config")
const router = require("./routes/auth.routes")
const passport = require("passport")
const productroutes = require("./routes/product.routes")
const cartRoutes = require("./routes/cart.routes")
const wishlistRouter = require("./routes/wishlist.routes")
const orderRoutes = require("./routes/order.routes")
const paymentRoutes = require("./routes/payment.routes")
const app = express()

app.use(helmet())
app.use(cors({
    origin: config.FRONTEND_ORIGINS,
    credentials: true
}))

app.use(cookieParser())

app.use(morgan("dev"))

app.use(passport.initialize())

app.use(express.json())

app.use("/api/auth",router)
app.use("/api/products",productroutes)
app.use("/api/cart",cartRoutes)
app.use("/api/wishlist",wishlistRouter)
app.use("/api/orders",orderRoutes)
app.use("/api/payments",paymentRoutes)
module.exports = app