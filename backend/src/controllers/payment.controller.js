const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils")
const razorpay = require("../config/razorpay")
const Order = require("../models/orders.model")
const config = require("../config/config")
const sentOrderConfirmation = require("../service/email.service")

const createPaymentController = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findOne({
            _id: orderId,
            user: req.userId
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.paymentStatus !== "PENDING" || order.paymentMethod !== "RAZORPAY" || order.orderStatus !== "PROCESSING") {
            return res.status(400).json({
                message: "Invalid Payment Request"
            })
        }

        const paymentOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR"
        })

        order.razorpayOrderId = paymentOrder.id
        await order.save()

        return res.status(200).json({
            message: "Payment created successfully",
            paymentOrder
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const verifyController = async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body
        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                success: false,
                message: "Order ID, payment ID, and signature are required"
            })
        }

        const order = await Order.findOne({
            razorpayOrderId: orderId,
            user: req.userId
        }).populate("user", "name email")

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.paymentMethod !== "RAZORPAY" || order.paymentStatus !== "PENDING") {
            return res.status(400).json({
                message: "Invalid Payment Request"
            })
        }

        const isValid = validatePaymentVerification(
            {
                order_id: orderId,
                payment_id: paymentId
            },
            signature,
            config.RAZORPAY_KEY_SECRET
        )

        if (!isValid) {
            return res.status(400).json({
                message: "Payment is not valid"
            })
        }

        order.paymentStatus = "PAID"
        order.paymentId = paymentId
        order.paidAt = new Date()
        await order.save()

        try {
            await sentOrderConfirmation(order.user, order);
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { createPaymentController, verifyController }