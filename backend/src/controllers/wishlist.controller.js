const Wishlist = require("../models/wishlist.model")

const addToWishlistController = async(req,res)=>{
    try {
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            })
        }

        let wishlist = await Wishlist.findOne({user: req.userId})
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.userId, products: [] })
        }

        if (!wishlist.products.some((id) => id.toString() === productId)) {
            wishlist.products.push(productId);
        }

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Added to Wishlist",
            wishlist
        });

    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

const getWishlistController = async(req,res)=>{
    try {

        const wishlist = await Wishlist.findOne({user:req.userId})
                                .populate("products")

        return res.status(200).json({
            message: "Wishlist items are received",
            wishlist: wishlist || { products: [] }
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const removeWishlistController = async(req,res)=>{
    try {

        const {productId} = req.params

        const wishlist = await Wishlist.findOne({user: req.userId})

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" })
        }

        wishlist.products = wishlist.products.filter((id) => id.toString() !== productId)

        await wishlist.save()

        res.status(200).json({
            success: true,
            message: "Product removed from Wishlist",
            wishlist
        });
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {addToWishlistController,getWishlistController,removeWishlistController}