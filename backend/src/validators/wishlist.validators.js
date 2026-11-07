const { body, validationResult } = require("express-validator");

const addToWishlistValidator = [
    body("productId").notEmpty().withMessage("Product ID is required")
];

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

module.exports = {
    addToWishlistValidator,
    checkValidation
};