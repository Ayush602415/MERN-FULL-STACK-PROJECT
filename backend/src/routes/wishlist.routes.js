const express = require("express")
const authenticate = require("../middleware/auth.middleware")
const { addToWishlistValidator, checkValidation } = require("../validators/wishlist.validators")
const { addToWishlistController, getWishlistController, removeWishlistController } = require("../controllers/wishlist.controller")

const wishlistRouter = express.Router()

wishlistRouter.post("/addWishlist",authenticate,addToWishlistValidator,checkValidation,addToWishlistController)
wishlistRouter.get("/",authenticate,getWishlistController)
wishlistRouter.delete("/remove/:productId",authenticate,removeWishlistController)

module.exports = wishlistRouter