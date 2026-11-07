const userModel = require("../models/user.model")
const AdminOnly = async(req,res,next) => {

    const user = await userModel.findById(req.userId)
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }

    if(user.role !== "admin"){
        return res.status(403).json({
            message: "Access Denied"
        })
    }
    next()
}

module.exports = AdminOnly