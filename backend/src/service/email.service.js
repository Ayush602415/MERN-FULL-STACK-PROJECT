const config = require("../config/config");
const transporter = require("../config/mailer");


const sentOrderConfirmation = async(user,order)=>{
    const recipient = order.shippingAddress?.email || user?.email;
    if (!recipient) {
        throw new Error("Order confirmation recipient email is missing");
    }

    await transporter.sendMail({
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
}

module.exports= sentOrderConfirmation