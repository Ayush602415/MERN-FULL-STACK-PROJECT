const redis = require("../config/redis");
const productModel = require("../models/product.model")

const getAllProducts = async (req, res) => {
    try {

        const cachedProducs = await redis.get("products:all")

        if(cachedProducs){
            return res.status(200).json(JSON.parse(cachedProducs))
        }
        const products = await productModel.find({
            isActive: true
        });

        const response = {
            success: true,
            message: "Products fetched successfully",
            totalProducts: products.length,
            products
        }

        await redis.set("products:all",JSON.stringify(response),"EX",300)

        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

const getProductById = async(req,res)=>{
    const {productId} = req.params
    const cachedProduct = await redis.get(`product:${productId}`)

        if(cachedProduct){
            return res.status(200).json(JSON.parse(cachedProduct))
        }

    const product = await productModel.findOne({_id: productId, isActive: true})
    if(!product){
        return res.status(404).json({
            message: "Product not found"
        })
    }
    const response = {
        message: "Product fetched successfully",
        data:{
            product
        }
    }
    await redis.set(`product:${productId}`,JSON.stringify(response),"EX",300)
    return res.status(200).json(response)
}

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            images,
            category,
            brand,
            stock
        } = req.body;

        const product = await productModel.create({
            name,
            description,
            price,
            image: images,
            category,
            brand,
            stocks: stock
        });

        await redis.del("products:all")

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async(req,res)=>{
    const {productId} = req.params
    const { images, stock, ...productData } = req.body
    const updateProduct = await productModel.findByIdAndUpdate(productId, {
        ...productData,
        ...(images && { image: images }),
        ...(stock !== undefined && { stocks: stock })
    }, {new: true,runValidators: true})
    if(!updateProduct){
        return res.status(404).json({
            message: "Product for updation not found"
        })
    }
    await redis.del("products:all")
    await redis.del(`product:${productId}`)
    return res.status(200).json({
        message: "Product updated successfully",
        data:{
            product: updateProduct
        }
    })
}

const deleteProduct = async(req,res)=>{
    const {productId} = req.params
    const deleteProduct = await productModel.findByIdAndUpdate(productId,{isActive: false},{new: true})
    if(!deleteProduct){
        return res.status(404).json({ 
              message: "Product for deletion not found"
        })
    }
    await redis.del("products:all")
    await redis.del(`product:${productId}`)
    return res.status(200).json({
        message: "Product deleted successfully",
        data:{
            product: deleteProduct
        }
    })
}

module.exports = {getAllProducts , getProductById , createProduct , updateProduct , deleteProduct}