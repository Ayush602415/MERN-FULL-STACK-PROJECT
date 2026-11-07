const Cart = require("../models/cart.model")

const addToCartController = async(req,res)=>{
    try {
        const {productId , quantity} = req.body

        if(!productId  || quantity<1){
            return res.status(400).json({
                message: "Invalid product or quantity"
            })
        }

        let cart = await Cart.findOne({user: req.userId})

        if(!cart){
            cart = new Cart({user: req.userId , items: []})
        }

        const existingItem = cart.items.find(
            (item)=> item.product.toString() === productId
        )
        if(existingItem){
            existingItem.quantity += quantity
        }
        else{
            cart.items.push({product: productId , quantity})
        }
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Added to cart",
            cart
        });

    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

const getCartController = async(req,res)=>{
    try {

        const cart = await Cart.findOne({user:req.userId})
                                .populate("items.product")

        return res.status(200).json({
            message: "Cart items are received",
            cart
        })
        
    } catch (error) {
        res.status(500).json({message: error.messsage})
    }
}

const updateCartController = async(req,res)=>{
    try {

        const {productId , quantity} = req.body
        
        const cart = await Cart.findOne({user: req.userId})

        const item = cart.items.find((item)=>item.product.toString()===productId)

        item.quantity = quantity

        await cart.save()

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart
        });

    } catch (error) {
        res.status(500).json({message: error.messsage})
    }
}

const removeCartController = async(req,res)=>{
    try {

        const {productId} = req.params

        const cart = await Cart.findOne({user: req.userId})

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId)

        await cart.save()

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {addToCartController , getCartController , updateCartController ,removeCartController}