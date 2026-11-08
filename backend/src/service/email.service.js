const config = require("../config/config");
const transporter = require("../config/mailer");


const sentOrderConfirmation = async(user,order)=>{
    if (!config.EMAIL_USER || !config.EMAIL_PASS) {
        throw new Error("Email SMTP credentials are not configured");
    }

    const recipient = order.shippingAddress?.email || user?.email;
    if (!recipient) {
        throw new Error("Order confirmation recipient email is missing");
    }

    const info = await transporter.sendMail({
        from: config.EMAIL_USER,
        to: recipient,
        subject: "Order Placed Successfully - ShopSphere",
        html: `
            <h2>Order Placed Successfully!</h2>
            <p>Hello ${order.shippingAddress?.fullName || user?.name || "Customer"},</p>
            <p>Your demo order has been placed successfully.</p>
            <h3>Order Details</h3>
            <p>Order ID: ${order._id}</p>
            <p>Total Amount: ₹${order.totalAmount}</p>
            <p>Thank you for shopping with ShopSphere!</p>
        `
    });

    if (!info.accepted?.length) {
        throw new Error("SMTP server did not accept the order confirmation email");
    }

    console.info("Order confirmation email accepted by SMTP", {
        orderId: String(order._id),
        messageId: info.messageId
    });

    return info;
}

module.exports= sentOrderConfirmation