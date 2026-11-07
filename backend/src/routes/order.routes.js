const express = require('express')
const { createOrderValidator } = require('../validators/order.validator')
const {createOrderController , getMyOrdersController ,getAllOrdersController,getSingleOrderController,cancelOrderController, orderStatus} = require("../controllers/order.controller")
const authenticate = require('../middleware/auth.middleware')
const AdminOnly = require('../middleware/admin.product')
const orderRoutes = express.Router()

orderRoutes.post("/create",authenticate,createOrderValidator,createOrderController)
orderRoutes.get("/my-orders",authenticate,getMyOrdersController)
orderRoutes.get("/admin/all",authenticate,AdminOnly,getAllOrdersController)
orderRoutes.get("/:id",authenticate,getSingleOrderController)
orderRoutes.patch("/:id/cancel",authenticate,cancelOrderController)
orderRoutes.patch("/status/:id",authenticate,AdminOnly,orderStatus)

module.exports = orderRoutes