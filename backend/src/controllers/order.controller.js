const Order = require("../models/orders.model")
const Product = require("../models/product.model");
const userModel = require("../models/user.model");
const sentOrderConfirmation = require("../service/email.service");


const createOrderController = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Fetch products from database
        const productIds = items.map(item => item.product);

        const products = await Product.find({
            _id: { $in: productIds }
        });

        const user = await userModel.findById(req.userId)

        if (products.length !== new Set(productIds.map(String)).size) {
            return res.status(404).json({
                success: false,
                message: "Some products were not found"
            });
        }

        // Create order items using actual database prices
        const orderItems = items.map(item => {
            const product = products.find(
                p => p._id.toString() === String(item.product)
            );

            return {
                product: product._id,
                name: product.name,
                image: product.image[0],
                price: product.price,
                quantity: item.quantity
            };
        });

        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: req.userId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod
        });

        if (paymentMethod === "COD") {
            sentOrderConfirmation(user, order).catch((error) => {
                console.error("Failed to send order confirmation email:", error.message)
            })
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrdersController = async(req,res)=>{
    try {

        const orders = await Order.find({user: req.userId})

       return res.status(200).json({
            message: "Order Created Successfully",
            orders
        })
        
    } catch (error){
         res.status(500).json({ success: false, message: error.message });
    }
}

const getAllOrdersController = async(req,res)=>{
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        return res.status(200).json({ orders })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getSingleOrderController = async(req,res)=>{
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.userId
        })

         if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
        
    } catch (error) {
             res.status(500).json({ success: false, message: error.message });
    }
}

const cancelOrderController = async(req,res)=>{
    try {

        const order =  await Order.findOne({
            _id: req.params.id,
            user: req.userId
        })

        if(!order){
            return res.status(404).json({
                message: "User not found"
            })
        }

        if(order.orderStatus !== "PROCESSING" || order.orderStatus === "PAID"){
            return res.status(400).json({
                message: "Order cannot ne cancelled"
            })
        }

        order.orderStatus = "CANCELLED"

        await order.save()

        return res.status(200).json({
            message: "Order cancelled successfully"
        })
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const orderStatus = async(req,res)=>{
    try {
        const { orderStatus } = req.body
        const validStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" })
        }

        const io = req.app.get("io")


        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        io.to(`user:${order.user}`).emit(
            "orderStatusUpdated",
            {
            order,
            message: `Your order is now ${order.orderStatus}`

            })

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {createOrderController,getMyOrdersController,getAllOrdersController,getSingleOrderController,cancelOrderController,orderStatus}