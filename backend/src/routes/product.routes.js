const express = require("express");
const { getAllProducts, getProductById } = require("../controllers/products.controller");
const { createProduct , updateProduct, deleteProduct } = require("../controllers/products.controller");
const authenticate = require("../middleware/auth.middleware");
const AdminOnly = require("../middleware/admin.product");
const { createProductValidator, updateProductValidator } = require("../validators/product.validators");
const upload = require("../config/multer");
const uploadImage = require("../controllers/imageUpload.controller");
const productroutes = express.Router();

productroutes.get("/",getAllProducts)
productroutes.get("/:productId",getProductById)
productroutes.post("/create/product",authenticate,AdminOnly,createProductValidator,createProduct)
productroutes.patch("/update/product/:productId",authenticate,AdminOnly,updateProductValidator,updateProduct)
productroutes.delete("/delete/product/:productId",authenticate,AdminOnly,deleteProduct)
productroutes.post("/upload",upload.array("images",5),uploadImage)

module.exports = productroutes