
const { body } = require("express-validator");

const createOrderValidator = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one product"),

    body("items.*.product")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("shippingAddress.fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

    body("shippingAddress.email")
        .isEmail()
        .withMessage("A valid email address is required"),

    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("shippingAddress.address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),

    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("shippingAddress.state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("shippingAddress.pincode")
        .trim()
        .notEmpty()
        .withMessage("Pincode is required"),

    body("paymentMethod")
        .isIn(["COD", "RAZORPAY"])
        .withMessage("Invalid payment method")
];

module.exports = {
    createOrderValidator
};
