const express  = require("express")
const authenticate = require("../middleware/auth.middleware")
const { addToCartValidator, checkValidation, updateCartValidator } = require("../validators/cart.validators")
const { addToCartController, updateCartController, getCartController, removeCartController } = require("../controllers/cart.controller")


const cartRoutes = express.Router()

cartRoutes.post("/addToCart",authenticate,addToCartValidator,checkValidation,addToCartController)
cartRoutes.patch("/updateCart",authenticate,updateCartValidator,checkValidation,updateCartController)
cartRoutes.get("/",authenticate,getCartController)
cartRoutes.delete("/removeCart/:productId",authenticate,removeCartController)

module.exports = cartRoutes