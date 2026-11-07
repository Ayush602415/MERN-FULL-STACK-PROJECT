const express = require("express")
const authenticate = require("../middleware/auth.middleware")
const { createPaymentController, verifyController } = require("../controllers/payment.controller")


const paymentRoutes = express.Router()

paymentRoutes.post("/create/:orderId",authenticate,createPaymentController)
paymentRoutes.post("/verify",authenticate,verifyController)


module.exports = paymentRoutes