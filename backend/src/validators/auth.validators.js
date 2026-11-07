const { body, validationResult } = require("express-validator");

const registerValidator = [
    body("name")
        .exists().withMessage("Name is Required").bail()
        .trim(),
    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail(),
    
    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

    async(req,res,next)=>{
        const errors  =   validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid Register Credentials",
                errors: errors.array()
            })
        }
        next()
    }
  
]

const loginValidator = [
     body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail(),
    
    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

    async(req,res,next)=>{
        const errors  =   validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid Login Credentials",
                errors: errors.array()
            })
        }
        next()
    }
]

module.exports = {
    registerValidator,
    loginValidator
}